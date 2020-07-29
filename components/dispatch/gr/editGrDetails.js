function productionCompleted() {
    alert("Please enter the quantity of the grey that is left in each lot.", "P-IT");
    document.getElementById("beamCompletedOptions").hidden = false;
    //pending work is disable the completed, delete button for now
    //console.log(rowMaster);
    buttonsDisable(true);
    tableColumnVisible("table-cell");
    addNewDataInViewTable(rowMaster, "viewWarpTableBody");
    addNewDataInViewTable(rowMaster, "viewWeftTableBody");
}

function addNewDataInViewTable(rowMaster, tableName) {
    var tableInstance = document.getElementById(tableName);
    tableInstance.innerHTML = "";
    var head = "";
    var tabName = "";

    if (tableName == "viewWarpTableBody") {
        head = "warp";
        tabName = "warpTable";
    }
    else if (tableName == "viewWeftTableBody") {
        head = "weft";
        tabName = "weftTable";
    }

    for (var i = 0; i < rowMaster.length; i++) {
        if (rowMaster[i] instanceof Array) {
        } else {
            if (rowMaster[i].tab == tabName) {
                var currentIndex = tableInstance.rows.length;
                var currentRow = tableInstance.insertRow(currentIndex);
                var qualityNameTextbox = document.createElement("input");
                qualityNameTextbox.setAttribute("type", "text");
                qualityNameTextbox.setAttribute("id", head + "QualityName" + i);
                qualityNameTextbox.setAttribute("disabled", true);
                qualityNameTextbox.setAttribute("class", "form-control w-100");
                qualityNameTextbox.setAttribute(
                    "value",
                    rowMaster[i].qualityName +
                    " / " +
                    rowMaster[i].denier +
                    " / " +
                    rowMaster[i].shadeNo
                );

                var colorTextbox = document.createElement("input");
                colorTextbox.setAttribute("type", "text");
                colorTextbox.setAttribute("id", head + "Color" + i);
                colorTextbox.setAttribute("disabled", true);
                colorTextbox.setAttribute("class", "form-control");
                colorTextbox.setAttribute("value", rowMaster[i].color);

                var lotNoTextBox = document.createElement("input");
                lotNoTextBox.setAttribute("type", "text");
                lotNoTextBox.setAttribute("id", head + "LotNo" + i);
                lotNoTextBox.setAttribute("disabled", true);
                lotNoTextBox.setAttribute("class", "form-control");
                lotNoTextBox.setAttribute("value", rowMaster[i].lotNo);

                var boxNoTextBox = document.createElement("input");
                boxNoTextBox.setAttribute("type", "text");
                boxNoTextBox.setAttribute("id", head + "BoxNO" + i);
                boxNoTextBox.setAttribute("disabled", true);
                boxNoTextBox.setAttribute("class", "form-control");
                boxNoTextBox.setAttribute("value", rowMaster[i].boxNo);

                var qtySelTextbox = document.createElement("input");
                qtySelTextbox.setAttribute("type", "text");
                qtySelTextbox.setAttribute("id", head + "QtySelected" + i);
                qtySelTextbox.setAttribute("disabled", true);
                qtySelTextbox.setAttribute("class", "form-control");
                qtySelTextbox.setAttribute("value", rowMaster[i].qtySelected);

                var remainingQtyTextbox = document.createElement("input");
                remainingQtyTextbox.setAttribute("type", "number");
                remainingQtyTextbox.setAttribute("id", head + "remainingQty" + i);
                remainingQtyTextbox.setAttribute("class", "form-control");
                remainingQtyTextbox.setAttribute(
                    "onkeyup",
                    "calculateUpdateRemainder(this.id);"
                );

                var currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(qualityNameTextbox);

                currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(colorTextbox);

                currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(lotNoTextBox);

                currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(boxNoTextBox);

                currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(qtySelTextbox);

                currentCell = currentRow.insertCell(-1);
                currentCell.appendChild(remainingQtyTextbox);
            }
        }
    }
}

// Code to show the options after selecting where to send the material - dyeing or finish
function showNextStepOptions(id) {
    var tempD = document.getElementById(id);
    nextStep = tempD.options[tempD.selectedIndex].text;

    if (nextStep == "Dyeing") {
        document.getElementById("dyeingColumn").style.display = "block";
        coconnection.query("SELECT partyName from party where type = 'DYEING' ORDER BY partyName", function (
            error,
            results
        ) {
            if (error) { alert(error + " : Tab - "); throw error; }
            loadDataDropdown("partyName", results);
        });
    } else document.getElementById("dyeingColumn").style.display = "none";
}

// load dyeing names in the dropdown
function loadDataDropdown(selectName, results) {
    var theSelect = document.getElementById(selectName);

    var options = theSelect.getElementsByTagName("option");
    theSelect.innerHTML = "";

    // add first row as dummy in select
    options = document.createElement("option");
    options.value = "";
    options.text = "Dyeing Name";
    options.readonly = true;
    options.selected = true;
    theSelect.add(options);

    for (var i = 0; i < results.length; i++) {
        options = document.createElement("option");
        options.value = options.text = results[i].dyeingName;
        theSelect.add(options);
    }
    return;
}

// on entering the remaining qty, we calculate the amount is less than or equal to the qty selected or no
function calculateUpdateRemainder(id) {
    remainingWarpQty = remainingWeftQty = remainingNetQty = 0;
    var table = document.getElementById("viewWarpTableBody");

    for (var i = 0; i < table.rows.length; i++) {
        //table.rows[i].cells[0].getElementsByTagName("input")[0].value;
        var rQty = table.rows[i].cells[5].getElementsByTagName("input")[0].value;
        if (rQty == "" || rQty == null) rQty = 0;
        var sQty = table.rows[i].cells[4].getElementsByTagName("input")[0].value;

        if (parseFloat(rQty) > parseFloat(sQty) || parseFloat(rQty) < 0) {
            table.rows[i].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return;
        } else {
            table.rows[i].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "white";
            remainingWarpQty = parseFloat(remainingWarpQty) + parseFloat(rQty);
            remainingNetQty = parseFloat(remainingNetQty) + parseFloat(rQty);
        }
    }

    var table = document.getElementById("viewWeftTableBody");
    for (var i = 0; i < table.rows.length; i++) {
        var rQty = table.rows[i].cells[5].getElementsByTagName("input")[0].value;
        if (rQty == "" || rQty == null) rQty = 0;
        var sQty = table.rows[i].cells[4].getElementsByTagName("input")[0].value;

        if (parseFloat(rQty) > parseFloat(sQty) || parseFloat(rQty) < 0) {
            table.rows[i].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return false;
        } else {
            table.rows[i].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "white";
            remainingWeftQty = parseFloat(remainingWeftQty) + parseFloat(rQty);
            remainingNetQty = parseFloat(remainingNetQty) + parseFloat(rQty);
        }
    }
    remainingWarpQty = parseFloat(remainingWarpQty).toFixed(2);
    remainingWeftQty = parseFloat(remainingWeftQty).toFixed(2);
    remainingNetQty = parseFloat(remainingNetQty).toFixed(2);
    document.getElementById("remainingWarpTotalWt").value = remainingWarpQty;
    document.getElementById("remainingWeftTotalWt").value = remainingWeftQty;
    document.getElementById("remainingTotalNetWt").value = remainingNetQty;
    return true;
}

function saveUpdate() {
    if (validateUpdatePage() == 0) return;
    //if (validateSentQty() == 0) return;
    document.getElementById("saveUpdate").disabled = true;

    // add the remainders in remainder table
    //saveDatainRemainderTable();

    rowMaster = [];
    // // add the remainders in remainderrows table
    saveTableDataInDb("viewWarpTableBody");
    saveTableDataInDb("viewWeftTableBody");

    // //add the remainders in the stock of yarn
    //updateYarnStock(rowMaster);

    //updateYarnMasters well
    console.log(rowMaster)
    //reduceYarnFromStockMasterTable(rowMaster);

    var tempN = designName.split("-");
    qualityDb = tempN[0].trim().toUpperCase();
    if (tempN[1]) shadeDb = tempN[1].trim().toUpperCase();
    else shadeDb = "";

    // if (nextStep == "Dyeing") {
    //     // if selected dyeing then add the program into dyeing
    //     saveToDyeingTable();
    // } else if (nextStep == "Finish") {
    //     // if selected dyeing then add the program into  Finish
    //     saveToFinishTable();
    // }

    // update the total count in stock master depending upon sending into dyeing or finish
    // if (nextStep == "Dyeing" || nextStep == "Finish")
    //     fetchAndAddQtyInStockMaster(nextStep);

    // // change pending state to completed state
    updateProgramStatus();
    //reset
    alert("Program Details Updated. Please wait....");
    setTimeout(() => {
        window.location.reload();
        buttonsDisable(false);
    }, 2000);
}

function validateUpdatePage() {
    setUpdateHeader();
    if (nextStep == "Select Option") {
        document.getElementById("selectNextStep").style.backgroundColor = "#ff6666";
        return 0;
    } else
        document.getElementById("selectNextStep").style.backgroundColor = "white";

    if (nextStep == "Dyeing" && selectedDyeing == "Dyeing Name") {
        document.getElementById("dyeingName").style.backgroundColor = "#ff6666";
        return 0;
    } else document.getElementById("dyeingName").style.backgroundColor = "white";

    if (sendingDate === "" || sendingDate === null) {
        document.getElementById("sendingDate").style.backgroundColor = "#ff6666";
        return 0;
    } else document.getElementById("sendingDate").style.backgroundColor = "white";

    if (noOfPcsSent == "" || parseFloat(noOfPcsSent) <= 0) {
        document.getElementById("noOfPcsSent").style.backgroundColor = "#ff6666";
        return 0;
    } else document.getElementById("noOfPcsSent").style.backgroundColor = "white";

    if (finishQtySent == "" || parseFloat(finishQtySent) <= 0) {
        document.getElementById("finishQtySent").style.backgroundColor = "#ff6666";
        return 0;
    } else document.getElementById("finishQtySent").style.backgroundColor = "white";

    return 1;
}

function setUpdateHeader() {
    if (nextStep !== "Select Option" && nextStep !== "Finish") {
        var tempD = document.getElementById("dyeingName");
        selectedDyeing = tempD.options[tempD.selectedIndex].text;
    }
    sendingDate = document.getElementById("sendingDate").value.trim();
    console.log(sendingDate)
    noOfPcsSent = document.getElementById("noOfPcsSent").value;
    finishQtySent = document.getElementById("finishQtySent").value;
}

function validateSentQty() {
    var tempIncomingQty = parseFloat(tapeLength) * parseFloat(noOfTaka);
    tempIncomingQty = parseFloat(tempIncomingQty).toFixed(2);
    var tempOutgoingQty = parseFloat(finishQtySent).toFixed(2);

    if (tempOutgoingQty > tempIncomingQty) {
        document.getElementById("noOfPcsSent").style.backgroundColor = "#ff6666";
        document.getElementById("finishQtySent").style.backgroundColor = "#ff6666";
        alert("Quantity sent is more than the program quantity. Please check quantity sent again.");
        return 0;
    } else {
        document.getElementById("noOfPcsSent").style.backgroundColor = "white";
        document.getElementById("finishQtySent").style.backgroundColor = "white";
        return 1;
    }
}

function saveDatainRemainderTable() {
    connection.query(
        "Insert into remainder VALUES ('" +
        programNo +
        "','" +
        designName +
        "','" +
        totalWarpQty +
        "','" +
        remainingWarpQty +
        "','" +
        totalWeftQty +
        "','" +
        remainingWeftQty +
        "');",
        function (err, result) {
            if (err) { alert(err + " : Tab - "); throw err; }
        }
    );
}

function saveTableDataInDb(tableName) {
    var table = document.getElementById(tableName);

    for (var r = 0, n = table.rows.length; r < n; r++) {
        var tempRow1 = table.rows[r].cells[0].getElementsByTagName("input")[0]
            .value;
        tempRow1 = tempRow1.split(" / ");
        var tableQuality = tempRow1[0];
        var tableDenier = tempRow1[1];
        var tableShade = tempRow1[2];

        var tableColor = table.rows[r].cells[1].getElementsByTagName("input")[0]
            .value;

        var tableLotNo = table.rows[r].cells[2].getElementsByTagName("input")[0]
            .value;
        var tableBoxNo = table.rows[r].cells[3].getElementsByTagName("input")[0]
            .value;
        var tableQtySelected = table.rows[r].cells[4].getElementsByTagName(
            "input"
        )[0].value;
        var tableQtyRemaining = table.rows[r].cells[5].getElementsByTagName(
            "input"
        )[0].value;

        if (tableQtyRemaining == "" || tableQtyRemaining == null)
            tableQtyRemaining = 0;

        var obj = {
            programNo: programNo,
            designName: designName,
            qualityName: tableQuality,
            denier: tableDenier,
            shadeNo: tableShade,
            lotNo: tableLotNo,
            color: tableColor,
            boxNo: tableBoxNo,
            //qtySelected: tableQtySelected,
            remainingQty: tableQtyRemaining
        };
        rowMaster.push(obj);
        // connection.query(
        //     "Insert into remainderrows VALUES ('" +
        //     programNo +
        //     "','" +
        //     designName +
        //     "','" +
        //     tableName +
        //     "','" +
        //     tableQuality +
        //     "','" +
        //     tableDenier +
        //     "','" +
        //     tableShade +
        //     "','" +
        //     tableLotNo +
        //     "','" +
        //     tableColor +
        //     "','" +
        //     tableBoxNo +
        //     "','" +
        //     tableQtySelected +
        //     "','" +
        //     tableQtyRemaining +
        //     "')",
        //     function (err, result) {
        //         if (err) { alert(err + " : Tab - "); throw err; }
        //     }
        // );
    }
}

function updateYarnStock(rowMaster) {
    //console.log(rowMaster, "OLD");
    rowMaster = checkIfObjectAvailable(rowMaster);
    var caseQuery = "(case ";
    var whereQuery = "";
    var allQuality = "";
    var allShade = "";
    var allColor = "";
    var alllotNo = "";
    var allBoxNo = "";

    for (var i = 0; i < rowMaster.length; i++) {
        var qName = rowMaster[i].qualityName;
        var shade = rowMaster[i].shadeNo;
        var col = rowMaster[i].color;
        var lot = rowMaster[i].lotNo;
        var box = rowMaster[i].boxNo;
        var sel = rowMaster[i].remainingQty;

        if (sel == "" || sel == null) sel = 0.0;

        if (allQuality.indexOf("'" + qName + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allQuality = allQuality + ", '" + qName + "'";
            else allQuality = allQuality + " '" + qName + "'";
        }

        if (allShade.indexOf("'" + shade + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allShade = allShade + ", '" + shade + "'";
            else allShade = allShade + " '" + shade + "'";
        }

        if (allColor.indexOf("'" + col + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allColor = allColor + ", '" + col + "'";
            else allColor = allColor + " '" + col + "'";
        }

        if (alllotNo.indexOf("'" + lot + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                alllotNo = alllotNo + ", '" + lot + "'";
            else alllotNo = alllotNo + " '" + lot + "'";
        }

        if (allBoxNo.indexOf("'" + box + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allBoxNo = allBoxNo + ", '" + box + "'";
            else allBoxNo = allBoxNo + " '" + box + "'";
        }

        caseQuery =
            caseQuery +
            "when (qualityName = '" +
            qName +
            "' AND shadeNo = '" +
            shade +
            "' AND color = '" +
            col +
            "' AND lotNo = '" +
            lot +
            "' AND boxNo = '" +
            box +
            "' ) THEN netWt + " +
            sel +
            " ";
    }
    caseQuery = caseQuery + " else netWt end)";

    whereQuery = whereQuery + "qualityName in (" + allQuality + " ) AND ";
    whereQuery = whereQuery + "shadeNo in (" + allShade + " ) AND ";
    whereQuery = whereQuery + "color in (" + allColor + " ) AND ";
    whereQuery = whereQuery + "lotNo in (" + alllotNo + " ) AND ";
    whereQuery = whereQuery + "boxNo in (" + allBoxNo + " ); ";

    updateYarnStockAgainstRemainder(caseQuery, whereQuery);
    //console.log(rowMaster);
    return rowMaster;
}

function checkIfObjectAvailable(rowMaster) {
    var tempR = [];
    tempR.push(rowMaster[0]);
    //var i = 0;
    for (var i = 1; i < rowMaster.length; i++) {
        var j = 0;
        for (j = 0; j < tempR.length; j++) {
            if (
                tempR[j].qualityName == rowMaster[i].qualityName &&
                tempR[j].denier == rowMaster[i].denier &&
                tempR[j].shadeNo == rowMaster[i].shadeNo &&
                tempR[j].lotNo == rowMaster[i].lotNo &&
                tempR[j].color == rowMaster[i].color &&
                tempR[j].boxNo == rowMaster[i].boxNo
            )
                break;
        }
        if (j < tempR.length) {
            tempR[j].remainingQty =
                parseFloat(tempR[j].remainingQty) +
                parseFloat(rowMaster[i].remainingQty);
            tempR[j].remainingQty = parseFloat(tempR[j].remainingQty).toFixed(2);
        } else tempR.push(rowMaster[i]);
    }
    return tempR;
}

function updateYarnStockAgainstRemainder(caseQuery, whereQuery) {
    //console.log(whereQuery);
    var myQuery =
        "UPDATE yarnstock set netWt = " + caseQuery + " where  " + whereQuery;
    connection.query(myQuery, function (error, results) {
        if (error) { alert(error + " : Tab - "); throw error; }
        //console.log(myQuery);
    });
}

function reduceYarnFromStockMasterTable(rowMaster) {
    rowMaster = prepareYarnStockMasterObject(rowMaster);
    //var caseQuery = '';
    var caseQueryNetWt = "(case ";
    var whereQuery = "";
    var allQuality = "";
    var allShade = "";

    for (var i = 0; i < rowMaster.length; i++) {
        //console.log(rowMaster[i], "iiii");
        var qName = rowMaster[i].qualityName;
        var shade = rowMaster[i].shadeNo;
        var sel = rowMaster[i].remainingQty;
        console.log(sel, "Remaining Qty");
        if (sel == "" || sel == null) sel = 0;

        if (allQuality.indexOf("'" + qName + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allQuality = allQuality + ", '" + qName + "'";
            else allQuality = allQuality + " '" + qName + "'";
        }

        if (allShade.indexOf("'" + shade + "'") == -1) {
            if (i != rowMaster.length && i > 0)
                allShade = allShade + ", '" + shade + "'";
            else allShade = allShade + " '" + shade + "'";
        }

        caseQueryNetWt =
            caseQueryNetWt +
            "when (qualityName = '" +
            qName +
            "' AND shadeNo = '" +
            shade +
            "' ) THEN netWt + " +
            sel +
            " ";
    }
    caseQueryNetWt = caseQueryNetWt + " else netWt end)";
    whereQuery = whereQuery + "qualityName in (" + allQuality + " ) AND ";
    whereQuery = whereQuery + "shadeNo in (" + allShade + " ); ";

    performFinalUpdateOfYarnStockMaster(caseQueryNetWt, whereQuery);
    //console.log(rowMaster);
    return rowMaster;
}

function prepareYarnStockMasterObject(rowMaster) {
    var tempR = [];
    var t = {
        qualityName: rowMaster[0].qualityName,
        shadeNo: rowMaster[0].shadeNo,
        remainingQty: rowMaster[0].remainingQty
    };
    tempR.push(t);

    for (var i = 1; i < rowMaster.length; i++) {
        var j = 0;
        for (j = 0; j < tempR.length; j++) {
            if (
                tempR[j].qualityName == rowMaster[i].qualityName &&
                tempR[j].shadeNo == rowMaster[i].shadeNo
            )
                break;
        }
        if (j < tempR.length) {
            tempR[j].remainingQty =
                parseFloat(tempR[j].remainingQty) + parseFloat(rowMaster[i].remainingQty);
            tempR[j].remainingQty = parseFloat(tempR[j].remainingQty).toFixed(2);
        } else {
            var t = {
                qualityName: rowMaster[i].qualityName,
                shadeNo: rowMaster[i].shadeNo,
                remainingQty: rowMaster[i].remainingQty
            };
            tempR.push(t);
        }
    }
    return tempR;
}

function performFinalUpdateOfYarnStockMaster(caseQueryNetWt, whereQuery) {
    // console.log(caseQuery);
    // console.log(whereQuery);
    var myQuery =
        "UPDATE yarnstockmaster set netWt = " + caseQueryNetWt + " where  " + whereQuery;
    //console.log(myQuery);
    connection.query(myQuery, function (error, results) {
        if (error)
            throw alert(
                error,
                "Please take screenshot of this and contact developer."
            );
    });
}

function saveToDyeingTable() {
    connection.query(
        "Insert into senttodyeing VALUES ('" +
        programNo +
        "','" +
        qualityDb +
        "','" +
        shadeDb +
        "','" +
        selectedDyeing +
        "','" +
        sendingDate +
        "','" +
        noOfPcsSent +
        "','" +
        finishQtySent +
        "', '0', 'pending');",
        function (err, result) {
            if (err) { alert(err + " : Tab - "); throw err; }
        }
    );
}

function saveToFinishTable() {
    connection.query(
        "Insert into senttofinish VALUES ('" +
        programNo +
        "','" +
        qualityDb +
        "','" +
        shadeDb +
        "','" +
        "" +
        "','" +
        sendingDate +
        "','" +
        noOfPcsSent +
        "','" +
        finishQtySent +
        "');",
        function (err, result) {
            if (err) { alert(err + " : Tab - "); throw err; }
        }
    );
}

function fetchAndAddQtyInStockMaster(step) {
    var fetch = step == "Dyeing" ? "inDyeing, pcsDyeing" : "qty, pcsFinish";

    connection.query(
        "SELECT inProduction, " +
        fetch +
        " from stockmaster where qualityName = '" +
        qualityDb +
        "' AND shadeNo = '" +
        shadeDb +
        "';",
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            if (results.length > 0) updateStockMasterData(results, step);
            //else saveIntoStockMaster(step);
        }
    );
}

function updateStockMasterData(results, step) {
    var inProd = parseFloat(results[0].inProduction) - parseFloat(finishQtySent);
    var inDye = 0;
    var inFini = 0;
    var pcsD = 0;
    var pcsF = 0;
    inProd = parseFloat(inProd).toFixed(2);
    var setQuery = " inProduction = '" + inProd;
    if (step == "Dyeing") {
        inDye = parseFloat(results[0].inDyeing) + parseFloat(finishQtySent);
        inDye = parseFloat(inDye).toFixed(2);
        pcsD = parseFloat(results[0].pcsDyeing) + parseFloat(noOfPcsSent);
        setQuery =
            setQuery + "', inDyeing = '" + inDye + "', pcsDyeing = '" + pcsD + "'";
    } else if (step == "Finish") {
        inFini = parseFloat(results[0].qty) + parseFloat(finishQtySent);
        inFini = parseFloat(inFini).toFixed(2);
        pcsF = parseFloat(results[0].pcsFinish) + parseFloat(noOfPcsSent);
        setQuery =
            setQuery + "', qty = '" + inFini + "', pcsFinish = '" + pcsF + "'";
    }

    var myQuery =
        "UPDATE stockmaster SET" +
        setQuery +
        " where qualityName = '" +
        qualityDb +
        "' AND shadeNo = '" +
        shadeDb +
        "';";

    console.log(myQuery, step);
    connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
    });
}

function updateProgramStatus() {
    var myQuery =
        "UPDATE newbeam set status = 'completed' where programNo = '" +
        programNo +
        "' and  designName = '" +
        designName +
        "' and  dateOfBeamIssue = '" +
        dateOfBeamIssue +
        "';";
    connection.query(myQuery, function (error, results) {
        if (error) { alert(error + " : Tab - "); throw error; }
        console.log(results);
    });
}