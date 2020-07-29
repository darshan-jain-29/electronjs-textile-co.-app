var grModalDate = "";
var finishGrSeries = "";
var existingGrSeries = "";
var rollNumber = "";
var invoiceNumber = "";
var partyName = "";
var brokerName = "";
var totalGRRows = 0; // will use it if required in the future
var totalDispatchedQty = 0;
var grTotalQty = 0;
var tableSecondaryData = [];
var queryMasterRequest = 0;
var queryMasterResponse = 0;

function loadGRDetails() {
    // console.log(printingData);
    clearFields();
    invoiceNumber = printingData.billNo;
    partyName = printingData.partyName1;
    brokerName = printingData.brokerName;

    connection.query("SELECT seriesValue from seriesnumber where seriesName in ('finishGrNumber') order by seriesName asc;", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        finishGrSeries = parseInt(results[0].seriesValue);
        // rollNumber = parseInt(results[1].seriesValue);
    });

    connection.query(
        "SELECT * from finishpurchaserows where  billNumber = '" + invoiceNumber + "' and qty-grQty > 0 order by rollNumber;",
        function (error, results) {
            // console.log(results);
            if (error) { alert(error + " : Tab - "); throw error; }
            //addDataInViewTable(results, "viewDispatchDetailsTableBody");
            console.log(results);

            addDataInGRTable(results, "modalGRSelectionTableBody");
        }
    );

    document.getElementById("modalTotalOrderRolls").innerHTML = parseInt(printingData.totalRolls);
}

function clearFields() {
    document.getElementById("modalGRDate").value = "";
    document.getElementById("modalTotalReturnQty").innerHTML = document.getElementById("modalTotalOrderQty").innerHTML = document.getElementById("modalGRSelectionTableBody").innerHTML = "";
    finishGrSeries = invoiceNumber = "";
    tableSecondaryData = [];
    totalDispatchedQty = 0;
}

function addDataInGRTable(results, tableName) {
    var tableInstance = document.getElementById(tableName),
        newRow,
        newCell;
    tableInstance.innerHTML = "";
    totalDispatchedQty = 0;
    for (var i = 0; i < results.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (results[i] instanceof Array) {
        } else {

            newCell = document.createElement("td");
            newCell.textContent = results[i].qualityName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var tempShade = (results[i].shade).trim() == '' ? '-' : results[i].shade;
            var tempColor = (results[i].color).trim() == '' ? '-' : results[i].color;
            newCell.textContent = tempShade + "/" + tempColor;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].conditions;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].lotNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].rollNumber;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.id = "orderQty" + i;
            var tempQ = (parseFloat(results[i].qty) - parseFloat(results[i].grQty)).toFixed(2)
            totalDispatchedQty += parseFloat(tempQ);
            newCell.textContent = tempQ;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var allGoodsCheckBox = document.createElement('input');
            allGoodsCheckBox.type = 'checkbox';
            allGoodsCheckBox.id = 'allGoodsCheckBox' + i;
            allGoodsCheckBox.setAttribute("class", "checkBoxW");
            allGoodsCheckBox.setAttribute("title", "Click here to return full qty");
            allGoodsCheckBox.setAttribute("onclick", "toggleQty(" + i + ")");
            newCell.appendChild(allGoodsCheckBox);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var allGoodsCheckBox = document.createElement('input');
            allGoodsCheckBox.type = 'text';
            allGoodsCheckBox.id = 'grQty' + i;
            allGoodsCheckBox.setAttribute("onchange", "validateReturnQty(" + i + ")");
            newCell.appendChild(allGoodsCheckBox);
            newRow.appendChild(newCell);

            document.getElementById("modalTotalOrderQty").innerHTML = totalDispatchedQty;
        }
    }
}

function toggleQty(id) {
    var orderQty = parseFloat(document.getElementById("orderQty" + id).innerHTML).toFixed(2);
    var returnQty = document.getElementById("allGoodsCheckBox" + id).checked;

    if (returnQty) {
        document.getElementById("grQty" + id).value = orderQty;
    } else document.getElementById("grQty" + id).value = "";

    calculateGRTotal();
}

function validateReturnQty(id) {
    var currentGRQty = parseFloat(document.getElementById("grQty" + id).value);
    var orderQty = document.getElementById("orderQty" + id).innerHTML;

    if (parseFloat(currentGRQty) < 0) {
        document.getElementById("grQty" + id).style.backgroundColor = "#ff6666";
        modalErrorMessage("G R Qty cannot be negative", false);
        return;
    } else {
        document.getElementById("grQty" + id).style.backgroundColor = "white";
        modalErrorMessage("", false);
    }

    if (parseFloat(currentGRQty) > parseFloat(orderQty)) {
        document.getElementById("grQty" + id).style.backgroundColor = "#ff6666";
        document.getElementById("orderQty" + id).style.backgroundColor = "#ff6666";
        modalErrorMessage("G R Qty cannot be greater than Order Qty", false);
        document.getElementById("errorMessage").style.display = "block";
        return;
    } else {
        document.getElementById("grQty" + id).style.backgroundColor = "white";
        document.getElementById("orderQty" + id).style.backgroundColor = "white";
        modalErrorMessage("", false);
    }
    calculateGRTotal();
}

function calculateGRTotal() {
    var table = document.getElementById("modalGRSelectionTable");
    grTotalQty = 0;
    totalGRRows = 0;
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[7].getElementsByTagName("input")[0].value)
            grTotalQty = (parseFloat(grTotalQty) + parseFloat(table.rows[r].cells[7].getElementsByTagName("input")[0].value)).toFixed(2);

        if (parseFloat(table.rows[r].cells[7].getElementsByTagName("input")[0].value) > 0) totalGRRows += 1;
        document.getElementById('modalTotalReturnQty').innerHTML = parseFloat(grTotalQty).toFixed(2);
    }
    calculateQueryMasterRequest();
}

function calculateQueryMasterRequest() {
    queryMasterRequest = 0;
    queryMasterResponse = 0;

    // inserting table data into gr master: add 1 
    queryMasterRequest += 1;

    // console.log(totalGRRows);
    // inserting table data into dispatchrows row wise: add total no of non zero GRs 
    queryMasterRequest += parseInt(totalGRRows);

    //updating dispatch master : add 1
    queryMasterRequest += 1;

    //updating dispatch all together : add 1
    queryMasterRequest += 1;

    //update into stock rows all together : add 1
    queryMasterRequest += 1

    //updating seriesnumber once: add 1
    queryMasterRequest += 1;

    console.log(queryMasterRequest);
}

function saveModalGRData() {
    //validate table/modal
    if (validateGRModalData() == 0) return;

    alert("Saving the G R Qualtities Details... Please wait...");
    document.getElementById("modalSaveGRButton").disabled = true;
    document.getElementById("modalCloseButton").disabled = true;

    // check if master entry exists. If yes updaate or else make new entry
    checkIfGrMasterExists(printingData.billNo, partyName, brokerName);

    //save row entries in GR line items table
    saveModalSecondaryDataInGRRows();

    //add gr qty in the dispatch master table
    updateDispatchMasterTable();

    // add gr qty in dispatch rows table 
    var secondaryTableData = prepareUpdateDispatchRowsQuery();
    // console.log(secondaryTableData);

    //add gr qty in stock table with old lot no and new roll no.
    //updateStockTable(secondaryTableData);

    // add gr qty in stock master
    //keep it pending because I doubt it will be used in practicality

    //update rollNumber and dispatchNumber
    updateSeriesNumber();
}

function validateGRModalData() {
    grModalDate = document.getElementById("modalGRDate").value;
    grTotalQty = document.getElementById("modalTotalReturnQty").innerHTML;

    //date validation
    if (grModalDate.length > 0) {
        var tempArray = grModalDate.split("-");
        grModalDate = tempArray[2] + "-" + tempArray[1] + "-" + tempArray[0];
        document.getElementById("modalGRDate").style.backgroundColor = "white";
        modalErrorMessage("", false);
    } else {
        grModalDate = "";
        document.getElementById("modalGRDate").style.backgroundColor = "#ff6666";
        modalErrorMessage("Date is not selected", false);
        return 0;
    }

    //table validation
    var table = document.getElementById("modalGRSelectionTable");
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tempQtyOrder = table.rows[r].cells[5].innerHTML;
        var tempQtyReturn = table.rows[r].cells[7].getElementsByTagName("input")[0].value.trim();
        var id = r - 1;

        if (parseFloat(tempQtyReturn) < 0) {
            document.getElementById("grQty" + id).style.backgroundColor = "#ff6666";
            modalErrorMessage("G R Qty cannot be negative", false);
            return;
        } else {
            document.getElementById("grQty" + id).style.backgroundColor = "white";
            modalErrorMessage("", false);
        }

        if (parseFloat(tempQtyReturn) > parseFloat(tempQtyOrder)) {
            document.getElementById("grQty" + id).style.backgroundColor = "#ff6666";
            document.getElementById("orderQty" + id).style.backgroundColor = "#ff6666";
            modalErrorMessage("G R Qty cannot be greater than Order Qty", false);
            document.getElementById("errorMessage").style.display = "block";
            return;
        } else {
            document.getElementById("grQty" + id).style.backgroundColor = "white";
            document.getElementById("orderQty" + id).style.backgroundColor = "white";
            modalErrorMessage("", false);
        }
    }

    if (parseFloat(grTotalQty) <= 0) {
        document.getElementById("modalTotalReturnQty").style.backgroundColor = "#ff6666";
        modalErrorMessage("Total G R meters cannot be ZERO", false);
        return 0;
    }
    else {
        document.getElementById("modalTotalReturnQty").style.backgroundColor = "white";
        modalErrorMessage("", false);
    }
}

function modalErrorMessage(message, showDecision) {
    document.getElementById("errorMessage").innerHTML = message;
    document.getElementById("errorMessage").hidden = showDecision;
}

function checkIfGrMasterExists(b, p, br) {
    var myQuery = "SELECT * from finishgrmaster where  invoiceNo = '" + b.trim() + "' and partyName = '" + p.trim() + "' and brokerName = '" + br.trim() + "' ;";
    console.log(myQuery);
    connection.query(
        myQuery,
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            // console.log(results, myQuery);
            if (results.length > 0) {
                console.log("Length greater than zero");
                existingGrSeries = results[0].grSeries;
                updateGrMasterEntry();
            }
            else {
                console.log("Length is less than zero");
                saveModalPrimaryDataInGRMaster();
                return 0;
            }
        }
    );
}

function updateGrMasterEntry() {
    console.log("Update karna padega");
    var myQuery = "UPDATE finishgrmaster set totalQty = totalQty +" + grTotalQty +
        " where invoiceNo = '" + invoiceNumber + "' and grSeries = '" + existingGrSeries + "' ;";
    console.log(myQuery, updateGrMasterEntry);
    connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
        //console.log(myQuery, result);
    });
}

function saveModalPrimaryDataInGRMaster() {
    console.log("New entry karoooooo")
    //save gr master entry
    connection.query(
        "Insert into finishgrmaster VALUES ('" +
        finishGrSeries +
        "','" +
        invoiceNumber +
        "','" +
        0 +
        "','" +
        grTotalQty +
        "','" +
        partyName +
        "','" +
        brokerName +
        "')",
        function (err, result) {
            if (err) { alert(err + " : Tab - "); throw err; }
            queryMasterResponse += 1;
            checkIfWorkingCompleted();
        }
    );
}

function saveModalSecondaryDataInGRRows() {
    var table = document.getElementById("modalGRSelectionTable");

    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (parseFloat(table.rows[r].cells[7].getElementsByTagName("input")[0].value) > 0) {
            var tableGreyQuality = table.rows[r].cells[0].innerHTML;
            var tableSC = table.rows[r].cells[1].innerHTML;
            var tableTempVal = tableSC.split("/");

            var tableShade = tableTempVal[0].trim() == "-" ? "" : tableTempVal[0].trim();
            var tableColor = tableTempVal[1].trim() == "-" ? "" : tableTempVal[1].trim()
            var tableCondition = table.rows[r].cells[2].innerHTML;
            var tableLotNo = table.rows[r].cells[3].innerHTML;
            var tableRollNo = table.rows[r].cells[4].innerHTML;
            var tableGRQty = table.rows[r].cells[7].getElementsByTagName("input")[0].value;

            ///console.log(obj);
            connection.query(
                "Insert into finishgrrows VALUES ('" +
                finishGrSeries +
                "','" +
                invoiceNumber +
                "','" +
                grModalDate +
                "','" +
                tableGreyQuality +
                "','" +
                tableShade +
                "','" +
                tableColor +
                "','" +
                tableCondition +
                "','" +
                tableLotNo +
                "','" +
                tableRollNo +
                "','" +
                tableGRQty +
                "')",
                function (err, result) {
                    if (err) { alert(err + " : Tab - "); throw err; }
                    queryMasterResponse += 1;
                    checkIfWorkingCompleted();
                }
            );
        }
    }
}

function updateDispatchMasterTable() {
    var myQuery = "UPDATE finishpurchasemaster set grQty = grQty +" + grTotalQty +
        " where billNumber = '" + invoiceNumber + "';";
    console.log(myQuery, "updateDispatchMasterTable");
    connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
        //console.log(myQuery, result);
    });
}

function prepareUpdateDispatchRowsQuery() {
    // console.log(rowMaster)
    var caseQueryQty = "(case ";
    var whereQuery = "";
    var caseQueryStockQty = "(case ";
    var whereStockQuery = "";
    var allQuality = "";
    var allShade = "";
    var allColor = "";
    var allCondition = "";
    var allRollNo = "";
    var allLotNo = "";
    tableSecondaryData = [];

    var table = document.getElementById("modalGRSelectionTable");

    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        // if (parseFloat(table.rows[r].cells[7].getElementsByTagName("input")[0].value) > 0) {
        var i = r - 1;
        var qName = table.rows[r].cells[0].innerHTML;
        var sc = table.rows[r].cells[1].innerHTML.split("/");
        var shade = sc[0].trim() == "-" ? "" : sc[0].trim();
        var color = sc[1].trim() == '-' ? '' : sc[1].trim();

        var condition = table.rows[r].cells[2].innerHTML;
        var lotNo = table.rows[r].cells[3].innerHTML;
        var rollNo = table.rows[r].cells[4].innerHTML;
        var qtyGR = table.rows[r].cells[7].getElementsByTagName("input")[0].value;
        var objCondition = condition == "FRESH" ? "false" : "true";

        var obj = {
            qualityName: qName,
            shade: shade,
            color: color,
            isDamage: objCondition,
            lotNo: lotNo,
            rollNo: rollNo,
            qtyGR: qtyGR
        };

        if (parseFloat(qtyGR) > 0) tableSecondaryData.push(obj);

        if (qtyGR == "" || qtyGR == null) qtyGR = 0;

        if (allQuality.indexOf("'" + qName + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allQuality = allQuality + ", '" + qName + "'";
            else allQuality = allQuality + " '" + qName + "'";
        }

        if (allShade.indexOf("'" + shade + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allShade = allShade + ", '" + shade + "'";
            else allShade = allShade + " '" + shade + "'";
        }

        if (allColor.indexOf("'" + color + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allColor = allColor + ", '" + color + "'";
            else allColor = allColor + " '" + color + "'";
        }

        if (allCondition.indexOf("'" + condition + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allCondition = allCondition + ", '" + condition + "'";
            else allCondition = allCondition + " '" + condition + "'";
        }

        if (allLotNo.indexOf("'" + lotNo + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allLotNo = allLotNo + ", '" + lotNo + "'";
            else allLotNo = allLotNo + " '" + lotNo + "'";
        }

        if (allRollNo.indexOf("'" + rollNo + "'") == -1) {
            if (i != table.rows.length - 1 && i > 0)
                allRollNo = allRollNo + ", '" + rollNo + "'";
            else allRollNo = allRollNo + " '" + rollNo + "'";
        }

        // caseQueryQty = caseQueryQty + "when (qualityName = '" + qName +
        //     "' AND shade = '" + shade +
        //     "' AND color = '" + color +
        //     "' AND conditions = '" + condition +

        //     "' AND rollNo = '" + rollNo +
        //     "' ) THEN grQty + " + qtyGR + " ";

        // without conditions
        caseQueryQty = caseQueryQty + "when (qualityName = '" + qName +
            "' AND shade = '" + shade +
            "' AND color = '" + color +
            "' AND lotNo = '" + lotNo +
            "' AND rollNumber = '" + rollNo +
            "' ) THEN grQty + " + qtyGR + " ";
        // }

        //Case query to update stock rows
        caseQueryStockQty = caseQueryStockQty + "when (qualityName = '" + qName +
            "' AND shade = '" + shade +
            "' AND color = '" + color +
            "' AND lotNo = '" + lotNo +
            "' AND rollsSeries = '" + rollNo +
            "' ) THEN qty - " + qtyGR + " ";
        // }
    }
    caseQueryQty = caseQueryQty + " else grQty end)";

    caseQueryStockQty = caseQueryStockQty + " else qty end)";

    // whereQuery = whereQuery + "qualityName in (" + allQuality +
    //     " )  AND shade in (" + allShade +
    //     " )  AND color in (" + allColor +
    //     " )  AND conditions in (" + allCondition +
    //     " )  AND lotNo in (" + allLotNo +
    //     " )  AND rollNo in (" + allRollNo +
    //     ");";

    // without conditions 
    whereQuery = whereQuery + "qualityName in (" + allQuality +
        " )  AND shade in (" + allShade +
        " )  AND color in (" + allColor +
        " )  AND lotNo in (" + allLotNo +
        " )  AND rollNumber in (" + allRollNo +
        ");";

    // stock update qhere query
    whereStockQuery = whereStockQuery + "qualityName in (" + allQuality +
        " )  AND shade in (" + allShade +
        " )  AND color in (" + allColor +
        " )  AND lotNo in (" + allLotNo +
        " )  AND rollsSeries in (" + allRollNo +
        ")";

    performUpdatesOnDispatchRowsTable(caseQueryQty, whereQuery);
    updateStockTable(caseQueryStockQty, whereStockQuery)
    return tableSecondaryData;
}

function performUpdatesOnDispatchRowsTable(caseQueryQty, whereQuery) {
    var myQuery = "UPDATE finishpurchaserows set grQty = " + caseQueryQty +
        " where  " + whereQuery;
    console.log(myQuery, "performUpdatesOnDispatchRowsTable");

    connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        //  console.log(result);
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
    });
}

function updateStockTable(caseQueryQty, whereQuery) {
    var myQuery = "UPDATE stockrows set qty = " + caseQueryQty +
        " where  " + whereQuery;
    console.log(myQuery, "updateStockTable");
    connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
    });
}

function updateSeriesNumber() {
    finishGrSeries = finishGrSeries + 1;
    var caseQuery = "(case ";
    var whereQuery = '';
    caseQuery = caseQuery + "when (seriesName = 'finishGrNumber' ) THEN " + finishGrSeries + " ";
    caseQuery = caseQuery + " else seriesValue end)";
    whereQuery = whereQuery + "seriesName in ('finishGrNumber','rollsSeries'); ";

    var myQuery = "UPDATE seriesnumber set seriesValue = " + caseQuery + " where  " + whereQuery;
    // console.log(myQuery);
    connection.query(myQuery, function (error, results) {
        if (error)
            throw alert(
                error,
                "Please take screenshot of this and contact developer."
            );
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
    });
}

function checkIfWorkingCompleted() {
    if (queryMasterRequest == queryMasterResponse) {
        console.log("Completed");
        alert("GR Successfully Saved...");
        document.getElementById("modalSaveGRButton").disabled = false;
        document.getElementById("modalCloseButton").disabled = false;
        //show data on the view details page
        loadDataInViewFormat(billNumber, nFNumber);
        document.getElementById("closeModalButton").click();
    }
    else {
        // console.log("Pending");
        document.getElementById("modalSaveGRButton").disabled = true;
        document.getElementById("modalCloseButton").disabled = true;
    }
}
