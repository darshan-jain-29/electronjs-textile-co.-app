document.title = "New Finish P. O. Form - Kalash Infotech";
document.getElementById("pageHeading").innerHTML = "New Finish P. O. Form";

var dropdownMasterValues = [];
var nFNumber = 0;
var rollsSeries = 0;
var billNumber = "";
var dateOFinishPO = '';
var dateODeliveryPO = '';
var partyName = '';
var brokerName = '';
var lotNumber = "";
var totalQty = 0;
var totalNetAmt = 0;
var primaryRowObject = [];
var masterRowId = 1;
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;
var condition = [
  {
    'value': 'FRESH'
  },
  {
    'value': 'DAMAGE'
  },
];

const printingData = {
  stickerFolderName: 'Stickers',

  companyName: "KHIMESARA",
  stickerCompanyName: "KHIMESARA",

  stickers: [
  ],

}

function loadbillNumber() {
  displayElement("waitingMessage", true);
  connection.query("SELECT seriesValue from seriesnumber where seriesName = 'nFNumber' ;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results) 
    document.getElementById("billNumber").value = nFNumber = results[0].seriesValue;
  });

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadDataDropdown("purchasePartyName", results);
    loadDataDropdown("brokerName", results);
  });

  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dropdownMasterValues = results;
    // console.log(results)
    loadDataDropdown('tableQuality1', results);
    loadDataDropdown('tableShade1', results);
    displayElement("waitingMessage", false);
  });
  // loadDataDropdown('tableCondition1', condition);
}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "purchasePartyName") options.text = "Select Party";
  else if (selectName == "dyeingName") options.text = "Select Dyeing";
  else if (selectName == "brokerName") options.text = "Select Broker";
  else if (selectName.includes("tableQuality")) options.text = "Quality Name";
  else if (selectName.includes("tableShade")) options.text = "Shade";
  else if (selectName.includes("tableColor")) options.text = "Color";
  else if (selectName.includes("tableCondition")) options.text = "Condition";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName == "purchasePartyName" && results[i].type == "parties") {
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

    else if (selectName.includes("tableQuality") && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("tableShade") && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("tableColor") && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("tableCondition")) {
      options.value = options.text = results[i].value.toUpperCase();
      theSelect.add(options);
      if (i == 0) options.selected = true;
    }
  }
  return;
}

function resetTableErrors() {
  var table = document.getElementById("poDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "white";
    // table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";
  }
}

function checkDuplicateQSCC() {
  resetTableErrors();
  var table = document.getElementById("poDetailsTable");
  var selectedQSCC = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var tempS = table.rows[r].cells[1].getElementsByTagName("select")[0];
    var tableShade = tempS.options[tempS.selectedIndex].text;

    // var tempCond = table.rows[r].cells[2].getElementsByTagName("select")[0];
    // var tableCondition = tempCond.options[tempCond.selectedIndex].text;

    // console.log(tableQuality, tableShade, tableCondition, selectedQSCC)
    var j = 0;
    for (j = 0; j < selectedQSCC.length; j++) {
      if (selectedQSCC[j].qualityName == tableQuality &&
        selectedQSCC[j].shade == tableShade) {
        // selectedQSCC[j].conditions == tableCondition) {
        console.log("true");
        break;
      }
    }

    if (j < selectedQSCC.length) {
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      // table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else if (j == selectedQSCC.length) {

      var obj = {
        qualityName: tableQuality,
        shade: tableShade
        // condition: tableCondition
      };

      selectedQSCC.push(obj);
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";
      table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "white";
      // table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "white";
    }
  }
  // console.log(selectedQSCC)
  return 1;
}

function addTableRows() {
  var mytable = document.getElementById("poDetailsTableBody");

  var currentIndex = mytable.rows.length;
  var currentRow = mytable.insertRow(currentIndex);
  currentIndex += 1;
  masterRowId += 1;

  var qualityDropdown = document.createElement("select");
  qualityDropdown.setAttribute("id", "tableQuality" + masterRowId);
  // qualityDropdown.setAttribute("onchange", "checkDuplicateQualitySelection()");
  qualityDropdown.setAttribute(
    "class",
    "form-control inputProgramCardWithColMd"
  );
  // qualityDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var shadeNoDropdown = document.createElement("select");
  shadeNoDropdown.setAttribute("id", "tableShade" + masterRowId);
  shadeNoDropdown.setAttribute("class", "form-control inputProgramCardWithColMd");
  // shadeNoDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  // var conditionDropdown = document.createElement("select");
  // conditionDropdown.setAttribute("id", "tableCondition" + masterRowId);
  // conditionDropdown.setAttribute("class", "form-control inputProgramCardWithColMd");
  // conditionDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var rowQtyTextbox = document.createElement("input");
  rowQtyTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowQtyTextbox.setAttribute("id", "tableRowQty" + masterRowId);
  rowQtyTextbox.setAttribute("type", "number");
  rowQtyTextbox.setAttribute("placeholder", "Order Qty");
  rowQtyTextbox.setAttribute("onchange", "calculateTableTotal()");

  var rowRateTextbox = document.createElement("input");
  rowRateTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowRateTextbox.setAttribute("id", "tableRowRate" + masterRowId);
  rowRateTextbox.setAttribute("type", "number");
  rowRateTextbox.setAttribute("placeholder", "Rate/m");
  rowRateTextbox.setAttribute("onchange", "calculateTableTotal()");

  var rowAmtTextbox = document.createElement("input");
  rowAmtTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowAmtTextbox.setAttribute("id", "rowAmt" + masterRowId);
  rowAmtTextbox.setAttribute("type", "number");
  rowAmtTextbox.setAttribute("disabled", "true");

  var addRowBox = document.createElement("input");
  addRowBox.setAttribute("id", "addButton" + masterRowId);
  addRowBox.setAttribute("type", "image");
  addRowBox.setAttribute("title", "Add New Row");
  addRowBox.setAttribute("src", "../../../../assets/img/addld.png");
  addRowBox.setAttribute("class", "imageButton");
  addRowBox.setAttribute("onclick", "addTableRows();");

  var addDeleteBox = document.createElement("input");
  addDeleteBox.setAttribute("type", "deleteButton" + masterRowId);
  addDeleteBox.setAttribute("type", "image");
  addDeleteBox.setAttribute("title", "Delete Row");
  addDeleteBox.setAttribute("src", "../../../../assets/img/deleteld.png");
  addDeleteBox.setAttribute("class", "imageButton");
  addDeleteBox.setAttribute("onclick", "deleteRow(this);");

  var currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(qualityDropdown);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(shadeNoDropdown);

  // currentCell = currentRow.insertCell(-1);
  // currentCell.appendChild(conditionDropdown);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(rowQtyTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(rowRateTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(rowAmtTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.setAttribute("class", "displayGrid")
  currentCell.appendChild(addRowBox);

  currentCell.appendChild(addDeleteBox);

  loadDataDropdown("tableQuality" + masterRowId, dropdownMasterValues);
  loadDataDropdown("tableShade" + masterRowId, dropdownMasterValues);
  // loadDataDropdown("tableCondition" + masterRowId, condition);
}

function deleteRow(rows) {
  var _row = rows.parentElement.parentElement;
  document.getElementById("poDetailsTable").deleteRow(_row.rowIndex);
  calculateTableTotal();
}

function calculateTableTotal() {
  totalQty = 0;
  var tableRowTotal = 0;
  totalNetAmt = 0;

  var table = document.getElementById("poDetailsTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[2].getElementsByTagName("input")[0].value)
      totalQty = parseFloat(totalQty) + parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value);
    document.getElementById('totalQty').value = totalQty.toFixed(2);

    if (parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) > 0
      && parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) > 0) {

      tableRowTotal = parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) *
        parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value);
      tableRowTotal = parseFloat(tableRowTotal).toFixed(2);
      table.rows[r].cells[4].getElementsByTagName("input")[0].value = tableRowTotal;

      totalNetAmt = parseFloat(totalNetAmt) + parseFloat(tableRowTotal);
    }
    document.getElementById('totalNetAmt').value = totalNetAmt.toFixed(2);
  }
  calculateQueryMasterRequest();
  // validateFooterData();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  //inserting purchase master data : add 1 
  queryMasterRequest += 1;

  var tabRows = document.getElementById("poDetailsTable").rows.length - 2;

  // inserting table data rows wise in the FinishPOrows table : add total no of rolls in the table  
  queryMasterRequest += parseInt(tabRows);

  //updating seriesnumber once: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function savePODetails() {
  if (validateHeaderData() == 0) return;
  if (validateFooterData() == 0) return;

  if (checkTableContentIsNotEmpty() == 0) return;

  alert("New Finish P.O. is Saving...Please wait...");
  printingData.stickers = [];

  document.getElementById("saveButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  // Save primary data
  saveHeaderData();

  // save table entries
  var primaryRowObjectReady = saveTableDataInDb();

  //createUpdatePoRows(createUpdateStockMasterArray(primaryRowObjectReady));

  updatebillNumber();
}

function validateHeaderData() {
  setHeaderData();
  if (billNumber === null || billNumber === "") {
    document.getElementById("billNumber").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("billNumber").style.backgroundColor = "white";

  if (dateOFinishPO === null || dateOFinishPO === "") {
    document.getElementById("dateOFinishPO").style.backgroundColor = "#ff6666";
    return 0;
  } else
    document.getElementById("dateOFinishPO").style.backgroundColor = "white";

  if (partyName === null || partyName === "" || partyName == 'Select Party') {
    document.getElementById("purchasePartyName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("purchasePartyName").style.backgroundColor = "white";

  if (brokerName === null || brokerName === "" || brokerName == 'Select Broker') {
    brokerName = '';
  }

  if (lotNumber === null || lotNumber === "") {
    document.getElementById("lotNumber").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("lotNumber").style.backgroundColor = "white";

  if (totalQty === null || totalQty === "" || parseFloat(totalQty) <= 0) {
    document.getElementById("totalQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalQty").style.backgroundColor = "white";

  if (totalNetAmt === null || totalNetAmt === "" || parseFloat(totalNetAmt) <= 0) {
    document.getElementById("totalNetAmt").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalNetAmt").style.backgroundColor = "white";
}

function validateFooterData() {
  if (totalQty === null || totalQty === "" || parseFloat(totalQty) <= 0) {
    document.getElementById("totalQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalQty").style.backgroundColor = "white";

  if (totalNetAmt === null || totalNetAmt === "" || parseFloat(totalNetAmt) <= 0) {
    document.getElementById("totalNetAmt").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalNetAmt").style.backgroundColor = "white";
}

function setHeaderData() {
  billNumber = document.getElementById("billNumber").value;
  dateOFinishPO = document.getElementById("dateOFinishPO").value;
  if (dateOFinishPO.trim() !== '') {
    var tempDateArray = dateOFinishPO.split("-");
    dateOFinishPO =
      tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  dateODeliveryPO = document.getElementById("dateODeliveryPO").value;
  if (dateODeliveryPO.trim() !== '') {
    var tempDateArray = dateODeliveryPO.split("-");
    dateODeliveryPO =
      tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  var tempP = document.getElementById("purchasePartyName");
  partyName = tempP.options[tempP.selectedIndex].text;

  var tempB = document.getElementById("brokerName");
  brokerName = tempB.options[tempB.selectedIndex].text;

  lotNumber = document.getElementById("lotNumber").value;

  totalQty = document.getElementById("totalQty").value;
  totalNetAmt = document.getElementById("totalNetAmt").value;
}

function checkTableContentIsNotEmpty() {
  var table = document.getElementById("poDetailsTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    //Quality dropdown
    if (table.rows[r].cells[0].getElementsByTagName("select")[0].selectedIndex == 0) {
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";

    // //Condition dropdown
    // if (table.rows[r].cells[2].getElementsByTagName("select")[0].selectedIndex == 0) {
    //   table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
    //   return 0;
    // } else table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "white";

    //row qty
    if (table.rows[r].cells[2].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[2].getElementsByTagName("input")[0].value == null ||
      parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) <= 0) {
      table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";

    //row rate
    if (table.rows[r].cells[3].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[3].getElementsByTagName("input")[0].value == null ||
      parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) <= 0) {
      table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";

    //row amount
    if (table.rows[r].cells[4].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[4].getElementsByTagName("input")[0].value == null ||
      parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value) <= 0) {
      table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";
  }

  return 1;
}

function saveHeaderData() {
  connection.query(
    "Insert into finishpomaster VALUES ('" +
    billNumber +
    "','" +
    dateOFinishPO +
    "','" +
    dateODeliveryPO +
    "','" +
    lotNumber +
    "','" +
    partyName +
    "','" +
    brokerName +
    "','" +
    totalQty +
    "','" +
    totalNetAmt +
    "','" +
    '0' +
    "', '0', '0', 'PENDING')",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function saveTableDataInDb() {
  var table = document.getElementById("poDetailsTable");
  primaryRowObject = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var tempS = table.rows[r].cells[1].getElementsByTagName("select")[0];
    var tableShade = tempS.options[tempS.selectedIndex].text;

    // var tempCon = table.rows[r].cells[2].getElementsByTagName("select")[0];
    // var tableCondition = tempCon.options[tempCon.selectedIndex].text;

    var tableQty = table.rows[r].cells[2].getElementsByTagName("input")[0].value;

    var tableRate = table.rows[r].cells[3].getElementsByTagName("input")[0].value;

    // save the value in finishporows rows
    connection.query(
      "Insert into finishporows VALUES ('" +
      billNumber +
      "','" +
      lotNumber +
      "','" +
      tableQuality +
      "','" +
      tableShade +
      "','" +
      '' +
      "','" +
      tableQty +
      "','" +
      tableRate +
      "','0', '0', '0')",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
      }
    );

    var obj = {
      qualityName: tableQuality,
      shade: tableShade,
      qty: tableQty
    };

    primaryRowObject.push(obj);
  }
  return primaryRowObject;
}

function createUpdateStockMasterArray(primaryRowObject) {
  var tempR = [];
  var t = {
    qualityName: primaryRowObject[0].qualityName,
    shade: primaryRowObject[0].shade,
    condition: primaryRowObject[0].condition,
    qty: primaryRowObject[0].qty
  };
  tempR.push(t);
  //console.log(primaryRowObject.length);

  for (var i = 1; i < primaryRowObject.length; i++) {
    if (primaryRowObject[i].qty && primaryRowObject[i].qty > 0) {
      var j = 0;
      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == primaryRowObject[i].qualityName &&
          tempR[j].shade == primaryRowObject[i].shade &&
          tempR[j].color == primaryRowObject[i].color &&
          tempR[j].condition == primaryRowObject[i].condition
        ) break;
      }

      if (j < tempR.length) {
        tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(primaryRowObject[i].qty)).toFixed(2);
        tempR[j].rolls = (parseFloat(tempR[j].rolls) + parseFloat(primaryRowObject[i].rolls)).toFixed(2);
      } else {
        var t = {
          qualityName: primaryRowObject[i].qualityName,
          rolls: primaryRowObject[i].rolls,
          qty: primaryRowObject[i].qty
        };
        tempR.push(t);
      }
    }
  }
  // console.log(tempR);
  return tempR;
}

function createUpdatePoRows(rowMaster) {
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var whereQuery = "";
  var allQuality = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(primaryRowObject[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var rolls = rowMaster[i].rolls;
    var qty = rowMaster[i].qty;

    if (rolls == "" || rolls == null) rolls = 0;
    if (qty == "" || qty == null) qty = 0;

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    caseQueryRolls =
      caseQueryRolls +
      "when (qualityName = '" +
      qName +
      "' ) THEN rolls + " +
      rolls +
      " ";

    caseQueryQty =
      caseQueryQty +
      "when (qualityName = '" +
      qName +
      "' ) THEN qty + " +
      qty +
      " ";
  }
  caseQueryRolls = caseQueryRolls + " else rolls end)";
  caseQueryQty = caseQueryQty + " else qty end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality + " )";

  performFinalUpdateOfStockMasterTable(caseQueryRolls, caseQueryQty, whereQuery);
  //return primaryRowObject;
}

function performFinalUpdateOfStockMasterTable(caseQueryRolls, caseQueryQty, whereQuery) {
  var myQuery = "UPDATE stockmaster set rolls = " + caseQueryRolls +
    ", qty = " + caseQueryQty + " where  " + whereQuery;
  // console.log(myQuery, "performFinalUpdateOfStockMasterTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
    // console.log(result.rowAffected, result, "YEh update query ha");
  });
}

function updatebillNumber() {
  // nFNumber = parseInt(nFNumber) + 1;
  // rollsSeries = parseInt(rollsSeries) + 1;
  // var caseQuery = "(case ";
  // var whereQuery = '';
  // caseQuery = caseQuery + "when (seriesName = 'nFNumber' ) THEN seriesValue + 1 when (seriesName = 'rollsSeries' ) THEN '" + rollsSeries + "' else seriesValue end)";
  // whereQuery = whereQuery + "seriesName in ('nFNumber','rollsSeries')";

  var myQuery = "UPDATE seriesnumber set seriesValue = seriesValue + 1  where seriesName = 'nFNumber';";
  console.log(myQuery);
  connection.query(myQuery, function (error, results) {
    if (error)
      throw alert(
        error,
        "Please take screenshot of this and contact developer."
      );
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
    // console.log(result.rowAffected, results, "YEh update series query");
  });
}

function checkIfWorkingCompleted() {
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed")
    alert("New Finish P.O. is Successfully Saved...");
    document.getElementById("saveButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    // printAllStickers(printingData, printingData.stickers.length);
    window.location.reload();
  }
  else {
    console.log("Pending");
    document.getElementById("saveButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  }
}