var dropdownMaster = [];
var rollsMaster = [];
var tempRollsMaster = [];
var masterRowId = 0;
var totalRolls = 0;
var totalQty = 0;

const editedData = {
    dispatchDate: "",
    lrNo: "",
    transportName: "",
    shipTo: "",
    haste: "",
    rowItems: [

    ],
    totalRolls: "",
    totalQty: ""
};

function generateEditScreen(printingData) {
    var tempHeading = document.getElementById("pageHeading").innerHTML;
    document.getElementById("pageHeading").innerHTML += " - " + printingData.partyName1;
    console.log(printingData);
    dropdownMaster = [];
    rollsMaster = [];

    masterRowId = 0;
    fetchShippingAddresses(printingData.partyName1);
    connection.query("SELECT partyName from partiesmaster where type='transport' ORDER BY partyName", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        loadDataDropdown("editTransportNames", results);
        // console.log(results, "Transport Names")
        setValueOfItem("editTransportNames", printingData.partyName2);
    });
    var t = printingData.billDate.split("-");
    setValueOfItem("editDispatchDate", t[2] + "-" + t[1] + "-" + t[0]);
    setValueOfItem("editLRNo", printingData.lrNo);
    setValueOfItem("editHaste", printingData.miscValue);

    //load order data
    connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        dropdownMaster = results;
    });


    //load order data
    connection.query("SELECT * from stockrows ", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        rollsMaster = results;
        // tempRollsMaster = generateTempRollsMaster(rollsMaster);
        loadDataInEditTable();
    });
}

function fetchShippingAddresses(partyName) {
    connection.query("SELECT address, address2, address3 from partiesmaster where type='parties' and partyName = '" + partyName + "' ORDER BY partyName", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        // console.log(results);
        loadDataDropdown("editShippingAddresses", results);
        setValueOfItem("editShippingAddresses", printingData.partyAddress2);
    });
}

function loadDataDropdown(selectName, results) {
    // console.log(selectName, results)
    var theSelect = document.getElementById(selectName);

    var options = theSelect.getElementsByTagName("option");
    theSelect.innerHTML = "";

    // add first row as dummy in select
    options = document.createElement("option");
    options.value = "";
    if (selectName == "partyNameDropdown") options.text = "Select Party";
    else if (selectName == "dyeingName") options.text = "Select Dyeing";
    else if (selectName == "brokerName") options.text = "Select Broker";
    else if (selectName.includes("editTableQuality") || selectName.includes("editModalQualityName")) options.text = options.value = "QUALITY NAME";
    else if (selectName.includes("editTableShade") || selectName.includes("editModalShade")) options.text = options.value = "SHADE";
    else if (selectName.includes("editTableColor") || selectName.includes("editModalColor")) options.text = options.value = "COLOR";
    else if (selectName.includes("editTableCondition") || selectName.includes("editModalCondition")) options.text = options.value = "CONDITION";
    else if (selectName.includes("editTableRollNo") || selectName.includes("editModalCondition")) options.text = options.value = "ROLL";
    else if (selectName == "editTransportNames") options.text = "Select Transport";
    else if (selectName == "editShippingAddresses") options.text = "Select Ship Add.";

    options.disabled = false;
    options.selected = true;
    theSelect.add(options);

    for (var i = 0; i < results.length; i++) {
        options = document.createElement("option");

        if (selectName == "partyNameDropdown" && results[i].type == "parties") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }
        else if (selectName == "dyeingName" && results[i].type == "dyeing") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }

        else if (selectName == "brokerName" && results[i].type == "broker") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }

        else if ((selectName.includes("editTableQuality") || selectName.includes("editModalQualityName")) && results[i].type == "qualityName") {
            options.value = options.text = results[i].name.toUpperCase();
            theSelect.add(options);
        }

        else if ((selectName.includes("editTableShade") || selectName.includes("editModalShade")) && results[i].type == "shade") {
            options.value = options.text = results[i].name.toUpperCase();
            theSelect.add(options);
        }

        else if ((selectName.includes("editTableColor") || selectName.includes("editModalColor")) && results[i].type == "color") {
            options.value = options.text = results[i].name.toUpperCase();
            theSelect.add(options);
        }

        else if ((selectName.includes("editTableRollNo") || selectName.includes("editModalColor"))) {
            options.value = options.text = results[i].rollsSeries.toUpperCase();
            theSelect.add(options);
        }

        else if ((selectName.includes("editTableCondition") || selectName.includes("editModalCondition"))) {
            options.value = options.text = results[i].value.toUpperCase();
            theSelect.add(options);
            if (i == 0) options.selected = true;
        }

        else if (selectName == "editTransportNames") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }
        else if (selectName == "editShippingAddresses") {

            options.value = options.text = results[i].address.toUpperCase();
            theSelect.add(options);

            options = document.createElement("option");
            options.value = options.text = results[i].address2.toUpperCase();
            theSelect.add(options);

            options = document.createElement("option");
            options.value = options.text = results[i].address3.toUpperCase();
            theSelect.add(options);
        }
    }
    displayElement("waitingMessage", false);
    return;
}

function setValueOfItem(id, value) {
    let element = document.getElementById(id);
    element.value = value;
}

function loadDataInEditTable() {
    var tableInstance = document.getElementById("editDispatchTableBody"),
        newRow,
        newCell;
    tableInstance.innerHTML = "";
    totalRolls = 0;
    totalQty = 0;

    // console.log(printingData.items)
    for (var i = 0; i < printingData.items.length; i++) {
        addTableRow(printingData.items[i])
    }
}

function addTableRow(data) {
    // console.log(data)
    var mytable = document.getElementById("editDispatchTableBody");

    var currentIndex = mytable.rows.length;
    var currentRow = mytable.insertRow(currentIndex);
    currentIndex += 1;
    masterRowId += 1;

    var qualityDropdown = document.createElement("select");
    qualityDropdown.setAttribute("id", "editTableQuality" + masterRowId);
    qualityDropdown.setAttribute(
        "class",
        "form-control inputProgramCardWithColMd"
    );
    qualityDropdown.setAttribute("disabled", "true");

    var shadeDropdown = document.createElement("select");
    shadeDropdown.setAttribute("id", "editTableShade" + masterRowId);
    shadeDropdown.setAttribute(
        "class",
        "form-control inputProgramCardWithColMd"
    );
    shadeDropdown.setAttribute("disabled", "true");

    var colorDropdown = document.createElement("select");
    colorDropdown.setAttribute("id", "editTableColor" + masterRowId);
    colorDropdown.setAttribute(
        "class",
        "form-control inputProgramCardWithColMd"
    );
    colorDropdown.setAttribute("disabled", "true");

    var conditionDropdown = document.createElement("select");
    conditionDropdown.setAttribute("id", "editTableCondition" + masterRowId);
    conditionDropdown.setAttribute(
        "class",
        "form-control inputProgramCardWithColMd"
    );
    conditionDropdown.setAttribute("disabled", "true");

    var rollNoDropdown = document.createElement("select");
    rollNoDropdown.setAttribute("id", "editTableRollNo" + masterRowId);
    rollNoDropdown.setAttribute(
        "class",
        "form-control inputProgramCardWithColMd"
    );
    rollNoDropdown.setAttribute("onchange", "loadNewLotNo(this.id)");

    var lotNoTextbox = document.createElement("input");
    lotNoTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
    lotNoTextbox.setAttribute("id", "editTableLotNo" + masterRowId);
    lotNoTextbox.setAttribute("type", "text");
    if (data.lotNo)
        lotNoTextbox.setAttribute("value", data.lotNo);
    lotNoTextbox.setAttribute("disabled", "true");

    var rowQtyTextbox = document.createElement("input");
    rowQtyTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
    rowQtyTextbox.setAttribute("id", "editTableRowQty" + masterRowId);
    rowQtyTextbox.setAttribute("type", "number");
    if (data.qty) {
        rowQtyTextbox.setAttribute("value", data.qty);
        totalRolls = parseInt(totalRolls) + 1;
        totalQty = parseInt(totalQty) + parseFloat(data.qty);
    }
    rowQtyTextbox.setAttribute("onchange", "calculateEditTableTotal()");
    var rowRateTextbox = document.createElement("input");
    rowRateTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
    rowRateTextbox.setAttribute("id", "editTableRowRate" + masterRowId);
    rowRateTextbox.setAttribute("type", "number");
    if (data.rate)
        rowRateTextbox.setAttribute("value", data.rate);
    //rowRateTextbox.setAttribute("onchange", "calculateEditTableTotal()");
    rowRateTextbox.setAttribute("disabled", "true");

    // var tempR = 0.00;
    // if (data.qty && data.rate)
    //     tempR = parseFloat(parseFloat(data.qty) * parseFloat(data.rate)).toFixed(2);
    // var rowAmtTextbox = document.createElement("input");
    // rowAmtTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
    // rowAmtTextbox.setAttribute("id", "rowAmt" + masterRowId);
    // rowAmtTextbox.setAttribute("type", "number");
    // if (data.qty && data.rate)
    //     tempR = parseFloat(parseFloat(data.qty) * parseFloat(data.rate)).toFixed(2);
    // rowAmtTextbox.setAttribute("value", tempR);
    // rowAmtTextbox.setAttribute("disabled", "true");

    // var addRowBox = document.createElement("input");
    // addRowBox.setAttribute("id", "addButton" + masterRowId);
    // addRowBox.setAttribute("type", "image");
    // addRowBox.setAttribute("title", "Add New Row");
    // addRowBox.setAttribute("src", "../../../assets/img/addld.png");
    // addRowBox.setAttribute("class", "imageButton");
    // addRowBox.setAttribute("onclick", "addTableRow([]);");

    var addDeleteBox = document.createElement("input");
    addDeleteBox.setAttribute("type", "deleteButton" + masterRowId);
    addDeleteBox.setAttribute("type", "image");
    addDeleteBox.setAttribute("title", "Delete Row");
    addDeleteBox.setAttribute("src", "../../../assets/img/deleteld.png");
    addDeleteBox.setAttribute("class", "imageButton");
    addDeleteBox.setAttribute("onclick", "deleteRow(this);");

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(qualityDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(shadeDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(colorDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(conditionDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rollNoDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(lotNoTextbox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rowQtyTextbox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rowRateTextbox);

    // currentCell = currentRow.insertCell(-1);
    // currentCell.appendChild(rowAmtTextbox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("class", "displayGrid")
    // currentCell.appendChild(addRowBox);

    currentCell.appendChild(addDeleteBox);

    //load dropdowns
    loadDataDropdown("editTableQuality" + masterRowId, dropdownMaster);
    loadDataDropdown("editTableShade" + masterRowId, dropdownMaster);
    loadDataDropdown("editTableColor" + masterRowId, dropdownMaster);
    loadDataDropdown("editTableCondition" + masterRowId, printingData.condition);
    if (data.sc) {
        var tSC = data.sc.split("/");
        var tShade = tSC[0].trim() == '-' ? '' : tSC[0].trim();
        var tColor = tSC[1].trim() == '-' ? '' : tSC[1].trim();
        var tCondition = data.condition == "FRESH" ? "false" : "true";
        loadDataDropdown("editTableRollNo" + masterRowId, generateTempRollsMaster(rollsMaster, data.qualityName, tShade, tColor, tCondition, data.rolls));
    } else loadDataDropdown("editTableRollNo" + masterRowId, rollsMaster);

    // console.log(tCondition)

    //set values to dropdowns
    if (data.qualityName) {
        tShade = tShade == "" ? "SHADE" : tShade;
        tColor = tColor == "" ? "COLOR" : tColor;
        setValueOfItem("editTableQuality" + masterRowId, data.qualityName);
        setValueOfItem("editTableShade" + masterRowId, tShade);
        setValueOfItem("editTableColor" + masterRowId, tColor);
        setValueOfItem("editTableRollNo" + masterRowId, data.rolls);
        setValueOfItem("editTableCondition" + masterRowId, data.condition);

        totalQty = parseFloat(totalQty).toFixed(2);
        setValueOfItem("editTotalOrderRolls", totalRolls);
        setValueOfItem("editTotalOrderQty", totalQty);
    }
}

function loadNewLotNo(id) {

    var tempID = id.split("editTableRollNo");

    var tempR = document.getElementById(id);
    var currentRoll = tempR.options[tempR.selectedIndex].text;
    console.log(id, currentRoll)
    for (var i = 0; i < tempRollsMaster.length; i++) {
        if (currentRoll.trim() == tempRollsMaster[i].rollsSeries) {
            console.log(tempRollsMaster[i])
            document.getElementById("editTableLotNo" + tempID[1]).value = tempRollsMaster[i].lotNo;
        }
    }

    var tempT = document.getElementById("editTransportNames");
    editedData.transportName = tempT.options[tempT.selectedIndex].text;

    checkNoRepetitionOfRolls();
}

function checkNoRepetitionOfRolls() {
    var table = document.getElementById("editDispatchTable");
    var selectedRolls = [];
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tempQ = table.rows[r].cells[4].getElementsByTagName("select")[0];
        var tableRoll = tempQ.options[tempQ.selectedIndex].text;

        var j = 0;
        for (j = 0; j < selectedRolls.length; j++) {
            if (selectedRolls[j] == tableRoll)
                break;
        }
        if (j < selectedRolls.length) {
            table.rows[r].cells[4].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
            return 0;
        } else if (j == selectedRolls.length) {
            selectedRolls.push(tableRoll);
            table.rows[r].cells[4].getElementsByTagName("select")[0].style.backgroundColor = "white";
        }
    }
    return 1;
}

function generateTempRollsMaster(master, q, s, c, cond, roll) {
    tempRollsMaster = [];
    // console.log(q, s, c, cond, roll)
    for (var i = 0; i < master.length; i++) {
        if (master[i].qualityName == q &&
            master[i].shade == s &&
            master[i].color == c &&
            master[i].isDamage == cond) {
            // console.log("In");
            if (master[i].qty > 0)
                tempRollsMaster.push(master[i]);
            else if (master[i].qty <= 0 && master[i].rollsSeries == roll)
                tempRollsMaster.push(master[i]);
        }
    }
    // console.log(tempRollsMaster.length)
    return tempRollsMaster;

}

function deleteRow(rows) {
    var _row = rows.parentElement.parentElement;
    document.getElementById("editDispatchTable").deleteRow(_row.rowIndex);
    calculateEditTableTotal();
}

function calculateEditTableTotal() {
    totalRolls = 0;
    totalQty = 0;

    var table = document.getElementById("editDispatchTable");
    console.log(table.rows.length);
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        // if (table.rows[r].cells[4].getElementsByTagName("input")[0].value)
        totalRolls = parseInt(totalRolls) + 1;

        if (table.rows[r].cells[6].getElementsByTagName("input")[0].value)
            totalQty = parseFloat(totalQty) + parseFloat(table.rows[r].cells[6].getElementsByTagName("input")[0].value);
        totalQty = parseFloat(totalQty).toFixed(2);

        setValueOfItem("editTotalOrderRolls", totalRolls);
        setValueOfItem("editTotalOrderQty", parseFloat(totalQty).toFixed(2));
    }
}

function resetDispatch() {
    if (confirm("Are you sure you want to reset the changes ? ")) {
        generateEditScreen(printingData);
    }
}

function updateDispatch() {
    // set data
    setEditData();
    console.log(setEditData(), "Edited");
    // console.log(printingData, "Printing");

    //check for minimum change

    console.log(requiredMinimumChange(), "Change");
    if (requiredMinimumChange() == 0) return;


    //perform validation

    //update query
}

function setEditData() {
    editedData.dispatchDate = document.getElementById("editDispatchDate").value;
    if (editedData.dispatchDate.trim() !== '') {
        var tempDateArray = editedData.dispatchDate.split("-");
        // printingData.billDate = 
        editedData.dispatchDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
    }
    editedData.lrNo = document.getElementById("editLRNo").value;

    var tempT = document.getElementById("editTransportNames");
    editedData.transportName = tempT.options[tempT.selectedIndex].text;

    var tempS = document.getElementById("editShippingAddresses");
    editedData.shipTo = tempS.options[tempS.selectedIndex].text;

    editedData.haste = document.getElementById("editHaste").value;

    editedData.rowItems = [];
    var tableInstance = document.getElementById("editDispatchTableBody");

    var i = 0
    for (i = 0; i < tableInstance.rows.length; i++) {
        var c = i + 1;
        var tempQuality = document.getElementById("editTableQuality" + c);
        var rowQuality = tempQuality.options[tempQuality.selectedIndex].text

        var tempShade = document.getElementById("editTableShade" + c);
        var rowShade = tempShade.options[tempShade.selectedIndex].text

        var tempColor = document.getElementById("editTableColor" + c);
        var rowColor = tempColor.options[tempColor.selectedIndex].text

        var tempCondition = document.getElementById("editTableCondition" + c);
        var rowCondition = tempCondition.options[tempCondition.selectedIndex].text

        var tempRollNo = document.getElementById("editTableRollNo" + c);
        var rowRollNo = tempRollNo.options[tempRollNo.selectedIndex].text;

        var rowLotNo = document.getElementById("editTableLotNo" + c).value;

        var rowQty = document.getElementById("editTableRowQty" + c).value;

        var rowRate = document.getElementById("editTableRowRate" + c).value;

        var obj = {
            qualityName: rowQuality,
            shade: rowShade,
            color: rowColor,
            condition: rowCondition,
            rollNo: rowRollNo,
            lotNo: rowLotNo,
            qty: rowQty,
            rate: rowRate
        };
        editedData.rowItems.push(obj);
    }

    editedData.totalRolls = document.getElementById("editTotalOrderRolls").value;
    editedData.totalQty = document.getElementById("editTotalOrderQty").value;
    // if (i == tableInstance.rows.length - 1)
    return editedData;
}

function requiredMinimumChange() {
    if (editedData.dispatchDate != printingData.billDate ||
        editedData.lrNo != printingData.lrNo ||
        editedData.transportName != printingData.transportName ||
        editedData.shipTo != printingData.partyAddress2 ||
        editedData.haste != printingData.miscValue ||
        parseInt(editedData.totalRolls) != parseInt(printingData.totalRolls) ||
        parseFloat(editedData.totalQty) != parseFloat(printingData.totalQty ||
            editedData.rowItems.length != printingData.items.length)
    )
        return 1;

    for (var i = 0; i < editedData.rowItems.length; i++) {
        // var tempSC = printingData.items[i].sc.split("/");
        // var tempS = tempSC[0].trim() == "-" ? "" : tempSC[0].trim();
        // var tempC = tempSC[1].trim() == "-" ? "" : tempSC[1].trim();
        if (editedData.rowItems[i].rollNo != printingData.items[i].rolls ||
            editedData.rowItems[i].lotNo != printingData.items[i].lotNo ||
            parseFloat(editedData.rowItems[i].qty) != parseFloat(printingData.items[i].qty)
        )
            return 1;
    }
    return 0;
}

///////////////////////////////////////////////////////
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