var totalOrderQty = 0;
var totalGRRolls = 0;
var totalGRQty = 0;
var allReceivalInvoiceNo = [];
var tableRowData = [];

const printingData = {
    docType: "Sale G. R.",
    invoiceType: "Bill No.",
    billNo: '',

    dateType: "G.R. Date",
    billDate: '',

    party1Type: "Party Name",
    partyName1: '',
    partyAddress1: '',

    partyType2: "Dyeing Name",
    partyName2: '',
    partyAddress2: '',

    brokerName: '',
    miscType: "Haste",
    miscValue: '',

    folderName: 'Sale-GR',

    companyName: "Khimesara Silk Mills Pvt. Ltd",
    companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

    tableUpperHeading: 'Sale-GR',

    tableHeadings: {
        heading1: "Finish Quality",
        heading2: "Shade/Color",
        heading3: "Condition",
        heading4: "Rolls",
        heading5: "Qty"
    },

    items: [

    ],

    totalRolls: '',
    totalQty: '',
    totalAmount: ''
}

function loadDataInViewFormat(billNumber) {
    fetchAddresses(connection);

    connection.query(
        "SELECT * from grmaster where invoiceNo = '" + billNumber + "';",
        function (error, results) {
            // console.log(results);
            if (error) { alert(error + " : Tab - "); throw error; }
            printingData.billNo = document.getElementById("viewBillNumber").value = results[0].invoiceNo;
            printingData.billNo = printingData.billNo.replace("/", "-");
            // printingData.billDate = document.getElementById("viewDateOfGR").value = results[0].dateOfGR;

            printingData.partyName1 = document.getElementById("viewPartyName").value = results[0].partyName.toUpperCase();
            printingData.partyAddress1 = fetchPartyAddress(results[0].partyName.trim().toUpperCase(), "PARTIES");

            printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName == "Select Broker" ? "" : results[0].brokerName;

            printingData.totalQty = totalOrderQty = document.getElementById("viewTotalNetQty").value = document.getElementById("viewTotalGRQty").value = results[0].totalQty;

            //dont show other addresses
            printingData.partyType2 = "";
            printingData.partyAddress2 = "";
            printingData.miscValue = "";
        }
    );

    connection.query(
        "SELECT * from grrows where  invoiceNo = '" + billNumber + "' order by dateOfGR ;",
        function (error, results) {
            // console.log(results);
            if (error) { alert(error + " : Tab - "); throw error; }
            addDataInViewTable(results, "viewGRDetailsTableBody");
            displayElement("waitingMessage", true);
        }
    );

    if (localStorage.getItem("isAdmin") == 0) displayElement("editButton", false)
    else if (localStorage.getItem("isAdmin") == 1) displayElement("editButton", true)
}

function addDataInViewTable(results, tableName) {
    var tableInstance = document.getElementById(tableName),
        newRow,
        newCell;
    tableInstance.innerHTML = "";
    printingData.items = [];
    for (var i = 0; i < results.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (results[i] instanceof Array) {
        } else {

            newCell = document.createElement("td");
            newCell.textContent = results[i].dateOfGR;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            // newCell.textContent = results[i].billNumber;
            newCell.textContent = results[i].qualityName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].shade;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].color;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].lotNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].condition;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].rollNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].qty;
            newRow.appendChild(newCell);

            // enable this when we want to edit line items
            // newCell = document.createElement("td");
            // newCell.textContent = results[i].qty;
            // newRow.appendChild(newCell);
            var obj = {
                qualityName: results[i].qualityName,
                sc: results[i].shade + " / " + results[i].color,
                condition: results[i].condition,
                lotNo: results[i].lotNo,
                rolls: results[i].rollNo,
                qty: results[i].qty
            };

            printingData.items.push(obj);

            printingData.totalRolls = document.getElementById("viewTotalGRRolls").value = totalGRRolls = parseInt(totalGRRolls) + 1;

        }
    }
    // we are not using this function to find out the total because we have fetched the total from the sale po master table
    //calculateGRTableTotal();
}


function printGRData() {
    createInvoice(printingData);
}
