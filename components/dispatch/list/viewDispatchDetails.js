var totalOrderQty = 0;
var totalDispatchedRolls = 0;
var totalDispatchedQty = 0;
var allReceivalInvoiceNo = [];
var tableRowData = [];

const printingData = {
    docType: "Dispatch Challan",

    invoiceType: "Bill No.",
    billNo: '',

    dateType: "Disp. Dt.",
    billDate: '',

    party1Type: "Party Name",
    partyName1: '',
    partyAddress1: '',
    party1Gst: '',
    party1State: '',
    party1Code: '',

    partyType2: "Dyeing Name",
    partyName2: '',
    partyAddress2: '',

    brokerName: '',
    miscType: "Haste",
    miscValue: '',
    lrNo: '',
    transportName: '',

    folderName: 'Dispatch-Challan',

    companyName: "Khimesara Silk Mills Pvt. Ltd",
    companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",
    godownAddress: 'Gala No. 302 303, Kanchan Compound, Phase 2, B Building, 3rd Floor, Near Kanchan Weight Kata, Dapoda, Mankoli Road, Anjurphata, Bhiwandi - 421302.  Tel No. 666 36 999',
    companyGST: "27AABCK2010J1ZY",
    companyPAN: "AABCK2010J",

    tableUpperHeading: 'Dispatch Details',

    tableHeadings: {
        heading1: "Quality",
        heading2: "Shade/Color",
        heading3: "Condition",
        heading4: "Roll No.",
        heading5: "Qty",
        heading6: "Rate",
        heading7: "Value"
    },

    items: [

    ],

    condition: [{
        name: "cond",
        value: "FRESH"
    }, {
        name: "cond",
        value: "DAMAGE"
    }
    ],

    totalRolls: '',
    totalQty: '',
    totalAmount: '',
    cgstRate: '',
    sgstRate: '',
    igstRate: '',
    cgst: '',
    sgst: '',
    igst: '',
    roundOff: '',
    netAmount: ''
}

function loadDataInViewFormat(billNumber, sPNumber) {

    displayElement("waitingMessage", true);

    fetchAddresses(connection);
    document.getElementById("invoiceFilter").innerHTML = "";
    allReceivalInvoiceNo = [];
    tableRowData = [];

    connection.query(
        "SELECT * from salepomaster where sPNumber = '" + sPNumber + "' and salePoNumber = '" + billNumber + "';",
        function (error, results) {
            // console.log(results);
            if (error) { alert(error + " : Tab - "); throw error; }
            document.getElementById("viewBillNumber").value = results[0].salePoNumber;
            document.getElementById("viewDateOfSalePO").value = results[0].dateOfPoIssue;
            printingData.partyName1 = document.getElementById("viewPartyName").value = results[0].partyName.toUpperCase();
            // printingData.partyAddress1 = fetchPartyAddress(results[0].partyName.trim().toUpperCase(), "PARTIES");

            var pGst = fetchPartyGST(results[0].partyName.trim().toUpperCase(), "PARTIES");
            // console.log(pGst, results[0].partyName, "pGst")
            printingData.party1Gst = pGst.gst;
            printingData.party1State = pGst.state;
            printingData.party1Code = pGst.stateCode;
            printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName == "Select Broker" ? "" : results[0].brokerName;

            totalOrderQty = document.getElementById("viewTotalNetQty").value = results[0].totalQty;
            totalDispatchedRolls = document.getElementById("viewTotalRollsDelivered").value = results[0].totalRollsDelivered;
            totalDispatchedQty = document.getElementById("viewTotalQtyDelivered").value = document.getElementById("viewTotalDispatchQty").value = results[0].totalQtyDelivered;
            var status = results[0].status.toUpperCase();
            if (status == "COMPLETED") displayElement("editDispatchButton", false);
            else if (status == "PENDING") {
                if (localStorage.getItem("isAdmin") == 0) displayElement("editDispatchButton", false)
                else if (localStorage.getItem("isAdmin") == 1) displayElement("editDispatchButton", true)
            }
        }

    );
    var invoiceFilter = document.getElementById('invoiceFilter');
    invoiceFilter.innerHTML = "";
    var options = invoiceFilter.getElementsByTagName("option");
    options = document.createElement("option");
    options.value = options.text = 'Select Invoice No.';
    options.selected = true;
    invoiceFilter.add(options);

    connection.query(
        "SELECT * from dispatchmaster where  salePoNumber = '" + billNumber + "';",
        function (error, results) {
            // console.log(results);
            if (error) { alert(error + " : Tab - "); throw error; }
            printingData.transportName = results[0].transportName;
            addDataInViewTable(results, "viewDispatchDetailsTableBody");
            displayElement("waitingMessage", false);
        }
    );

}

function addDataInViewTable(results, tableName) {
    var tableInstance = document.getElementById(tableName),
        newRow,
        newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (results[i] instanceof Array) {
        } else {

            newCell = document.createElement("td");
            // newCell.textContent = results[i].billNumber;
            newCell.textContent = results[i].invoiceNumber;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].dispatchDate;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var dispatchDetailsUL = document.createElement("ul");
            dispatchDetailsUL.setAttribute("id", "dispatchDetailsUl" + i);
            newCell.appendChild(dispatchDetailsUL);
            newRow.appendChild(newCell);
            fetchDispatchDetails(results[i].dispatchDate, results[i].dUNumber, results[i].invoiceNumber, "dispatchDetailsUl" + i);

            newCell = document.createElement("td");
            newCell.textContent = results[i].rollsDelivering;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var tempQ = parseFloat(results[i].qtyDelivering) - parseFloat(results[i].qtyGR);
            newCell.textContent = tempQ.toFixed(2);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].lrNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].transportName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].shippingAddress;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].haste;
            newRow.appendChild(newCell);

            loadInvoiceFilters(results[i].invoiceNumber)
        }
    }
    // we are not using this function to find out the total because we have fetched the total from the sale po master table
    //calculateDispatchTableTotal();
}

function calculateDispatchTableTotal() {
    rollsReceived = 0;
    qtyReceived = 0;
    // damageReceived = 0;
    netQtyReceived = 0;

    var table = document.getElementById("viewReceivingDetailsTable");
    //console.log(table.rows.length);
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[2].innerHTML)
            rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[2].innerHTML)).toFixed(2);

        if (table.rows[r].cells[3].innerHTML)
            qtyReceived = (parseFloat(qtyReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);

        // if (table.rows[r].cells[4].innerHTML)
        //   damageReceived = (parseFloat(damageReceived) + parseFloat(table.rows[r].cells[4].innerHTML)).toFixed(2);

        if (table.rows[r].cells[6].innerHTML)
            netQtyReceived = (parseFloat(netQtyReceived) + parseFloat(table.rows[r].cells[6].innerHTML)).toFixed(2);

        document.getElementById('viewRollsReceived').value = rollsReceived;
        document.getElementById('viewTotalReceivedMtrs').value = qtyReceived;
        // document.getElementById('viewTotalDamageMtrs').value = damageReceived;
        document.getElementById('viewTotalNetMtrs').value = netQtyReceived;
    }
}

function fetchDispatchDetails(dispatchDate, dU, invoice, rowId) {
    connection.query(
        "SELECT qualityName, shade, color, conditions, lotNo, rollNo, qty, rate from dispatchrows where dUNumber = '" + dU + "' AND invoiceNumber = '" + invoice + "';",
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            if (results.length > 0) appendToUl(dispatchDate, results, invoice, rowId);
        }
    );
}

function appendToUl(dispatchDate, data, invoice, id) {
    var rowUL = document.getElementById(id);
    rowUL.innerHTML = '';
    // console.log(data);
    for (var i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        var q = data[i].qualityName == '' ? '-' : data[i].qualityName;
        var s = data[i].shade == '' ? '-' : data[i].shade;
        var c = data[i].color == '' ? '-' : data[i].color;
        var cond = data[i].conditions;
        var lotNo = data[i].lotNo.toUpperCase() == '' ? '' : data[i].lotNo;
        var rollNo = data[i].rollNo.toUpperCase() == '' ? '' : data[i].rollNo;

        var val = q + " / " + s + " / " + c + " / " + cond + " / " + lotNo + " / " + rollNo + " / " + data[i].qty + " / " + data[i].rate;

        var sc = s;
        if (c.trim() != '-') sc = s + " / " + c;

        var obj = {
            invoiceNo: invoice,
            receivingDate: dispatchDate,
            qualityName: data[i].qualityName,
            sc: sc,
            condition: cond,
            lotNo: lotNo,
            rolls: rollNo,
            qty: data[i].qty,
            rate: data[i].rate
        };

        printingData.items.push(obj);
        tableRowData.push(obj);

        li.appendChild(document.createTextNode(val));
        rowUL.appendChild(li);
    }
}

function loadInvoiceFilters(currentDate) {
    // console.log(allReceivalInvoiceNo);
    var i = 0;
    for (i = 0; i < allReceivalInvoiceNo.length; i++) {
        if (allReceivalInvoiceNo[i] == currentDate) break;
    }

    if (i == allReceivalInvoiceNo.length) {
        allReceivalInvoiceNo.push(currentDate);
        var invoiceFilter = document.getElementById('invoiceFilter');
        var options = invoiceFilter.getElementsByTagName("option");
        options = document.createElement("option");
        options.value = options.text = currentDate;
        invoiceFilter.add(options);
    }
}

function filterByInvoiceNo(id) {
    var tempD = document.getElementById(id);
    var dropdownValue = tempD.options[tempD.selectedIndex].text;

    totalDispatchedRolls = 0;
    totalDispatchedQty = 0;

    var table = document.getElementById("viewDispatchDetailsTable");
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tableInvoiceNo = table.rows[r].cells[0].innerHTML;
        var tableDispatchDate = table.rows[r].cells[1].innerHTML;
        // console.log(tableInvoiceNo, dropdownValue);

        if (dropdownValue.trim().toUpperCase() == "SELECT INVOICE NO.") {
            table.rows[r].hidden = false;
            totalDispatchedRolls = (parseFloat(totalDispatchedRolls) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);
            totalDispatchedQty = (parseFloat(totalDispatchedQty) + parseFloat(table.rows[r].cells[4].innerHTML)).toFixed(2);
        }
        else if (tableInvoiceNo.trim() != dropdownValue) table.rows[r].hidden = true;
        else {
            table.rows[r].hidden = false;
            totalDispatchedRolls = (parseFloat(totalDispatchedRolls) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);
            totalDispatchedQty = (parseFloat(totalDispatchedQty) + parseFloat(table.rows[r].cells[4].innerHTML)).toFixed(2);
            var bN = table.rows[r].cells[0].innerHTML;
            printingData.billNo = bN.replace("/", "-");
            printingData.billDate = tableDispatchDate;
            printingData.lrNo = table.rows[r].cells[5].innerHTML;

            printingData.partyType2 = "Shipping Address";
            printingData.partyName2 = table.rows[r].cells[6].innerHTML;
            printingData.partyAddress2 = table.rows[r].cells[7].innerHTML;
            printingData.partyAddress1 = fetchPartyAddress(printingData.partyName1.trim().toUpperCase(), "PARTIES");

            printingData.miscValue = table.rows[r].cells[8].innerHTML;
        }
    }
    printingData.totalRolls = document.getElementById('viewTotalRollsDelivered').value = totalDispatchedRolls;
    printingData.totalQty = document.getElementById('viewTotalQtyDelivered').value = totalDispatchedQty;

    printingData.items = [];
    printingData.totalAmount = 0;
    var tempTotal = 0;
    console.log(printingData)

    for (var j = 0; j < tableRowData.length; j++) {
        if (tableRowData[j].invoiceNo == dropdownValue || dropdownValue.trim().toUpperCase() == "SELECT INVOICE NO.") {
            var tRate = parseFloat(tableRowData[j].rate).toFixed(2)
            var tempR = parseFloat(tableRowData[j].qty) *
                parseFloat(tRate);
            tempTotal = parseFloat(tempTotal) + parseFloat(tempR);
            var obj = {
                qualityName: tableRowData[j].qualityName,
                sc: tableRowData[j].sc,
                condition: tableRowData[j].condition,
                lotNo: tableRowData[j].lotNo,
                rolls: tableRowData[j].rolls,
                qty: tableRowData[j].qty,
                rate: tRate,
                value: parseFloat(tempR).toFixed(2)
            };
            printingData.items.push(obj);
            printingData.totalAmount = parseFloat(tempTotal).toFixed(2);
        }
    }

    // console.log(printingData.party1State, "DDDDDDDD")
    //generate gst details
    if (printingData.party1State.toUpperCase() == "MAHARASHTRA") {
        printingData.cgstRate = printingData.sgstRate = "2.5 %";
        printingData.cgst = printingData.sgst = parseFloat(parseFloat(printingData.totalAmount) * 2.5 / 100).toFixed(2);
        printingData.igstRate = "";
        printingData.igst = "0.00";
    } else {
        printingData.cgstRate = printingData.sgstRate = "";
        printingData.igstRate = "5.00 %";
        printingData.igst = parseFloat(parseFloat(tempTotal) * 5 / 100).toFixed(2);
        printingData.cgst = printingData.sgst = "0.00";
    }

    var tempNetAmount = parseFloat(tempTotal) + parseFloat(tempTotal) * 5.00 / 100;
    var tempRoundOFf = Math.round(tempNetAmount);

    var calc = parseFloat(parseFloat(tempRoundOFf) - parseFloat(tempNetAmount)).toFixed(2);
    printingData.roundOff = calc > 0 ? "+" + calc : calc;
    printingData.netAmount = tempRoundOFf;
}

function printDispatchData() {
    if (document.getElementById('invoiceFilter').selectedIndex <= 0) {
        alert("Select Invoice No. to proceed ahead");
        document.getElementById('invoiceFilter').style.backgroundColor = "#ff6666";
        return;
    } else document.getElementById('invoiceFilter').style.backgroundColor = "white";

    createChallan(printingData);
}

function printInvoice() {
    if (document.getElementById('invoiceFilter').selectedIndex <= 0) {
        alert("Select Invoice No. to proceed ahead");
        document.getElementById('invoiceFilter').style.backgroundColor = "#ff6666";
        return;
    } else document.getElementById('invoiceFilter').style.backgroundColor = "white";

    createInvoice(printingData);
}

//G R code
function raiseGRHelper() {
    if (document.getElementById('invoiceFilter').selectedIndex <= 0) {
        alert("Select Invoice No. to proceed ahead");
        document.getElementById('invoiceFilter').style.backgroundColor = "#ff6666";
        return;
    } else document.getElementById('invoiceFilter').style.backgroundColor = "white";

    //show GR screen
    var tempBtn = document.getElementById("raiseGRModalHelperButton");
    tempBtn.click();
    loadGRDetails();
}

function initiateEdit() {
    if (document.getElementById('invoiceFilter').selectedIndex <= 0) {
        alert("Select Invoice No. to proceed ahead");
        document.getElementById('invoiceFilter').style.backgroundColor = "#ff6666";
        return;
    } else
        document.getElementById('invoiceFilter').style.backgroundColor = "white";

    editDispatchDetails(printingData.billNo);
    generateEditScreen(printingData);
}