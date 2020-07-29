document.title = "Sale P.O. Form - Kalash Infotech";
document.getElementById("pageHeading").innerHTML = "Sale P.O. Form";
var sPNumber = '';
var salePoNumber = '';
var dropdownMasterValues = [];
var partyName = '';
var brokerName = '';
var allShades = [];
var allColors = [];
var totalNetQty = 0;
var totalNetAmt = 0;
var dateOfPOIssue = '';
var dateOfDelivery = '';
var condition = [
  {
    'value': 'FRESH'
  },
  {
    'value': 'DAMAGE'
  },
];
var primaryRowObject = [];
var date1 = '';
var date2 = '';
var masterRowId = 1;
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadPONumber() {
  displayElement("waitingMessage", true);
  connection.query("SELECT seriesValue from seriesnumber where seriesName in ('sPNumber', 'salePoNumber') ;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    sPNumber = results[0].seriesValue;
    salePoNumber = document.getElementById("salePoNumber").value = results[1].seriesValue;
  });

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadDataDropdown("finishPartyNames", results);
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
    loadDataDropdown('tableColor1', results);
    displayElement("waitingMessage", false);
  });
  loadDataDropdown('tableCondition1', condition);
}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "finishPartyNames") options.text = "Select Party";
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

    if (selectName == "finishPartyNames" && results[i].type == "parties") {
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

function checkDuplicateQSCC() {
  resetTableErrors();
  var table = document.getElementById("salesPoDetailsTable");
  var selectedQSCC = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var tempS = table.rows[r].cells[1].getElementsByTagName("select")[0];
    var tableShade = tempS.options[tempS.selectedIndex].text;

    var tempC = table.rows[r].cells[2].getElementsByTagName("select")[0];
    var tableColor = tempC.options[tempC.selectedIndex].text;

    var tempCond = table.rows[r].cells[3].getElementsByTagName("select")[0];
    var tableCondition = tempCond.options[tempCond.selectedIndex].text;

    var j = 0;
    for (j = 0; j < selectedQSCC.length; j++) {
      if (selectedQSCC[j].qualityName == tableQuality &&
        selectedQSCC[j].shade == tableShade &&
        selectedQSCC[j].color == tableColor &&
        selectedQSCC[j].conditions == tableCondition)
        break;
    }

    if (j < selectedQSCC.length) {
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      table.rows[r].cells[3].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else if (j == selectedQSCC.length) {

      var obj = {
        qualityName: tableQuality,
        shade: tableShade,
        color: tableColor,
        condition: tableCondition
      };

      selectedQSCC.push(obj);
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";
      table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "white";
      table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "white";
      table.rows[r].cells[3].getElementsByTagName("select")[0].style.backgroundColor = "white";
    }
  }
  return 1;
}

function resetTableErrors() {
  var table = document.getElementById("salesPoDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[1].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[2].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[3].getElementsByTagName("select")[0].style.backgroundColor = "white";
    table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[6].getElementsByTagName("input")[0].style.backgroundColor = "white";
  }
}

function addTableRow() {
  //if (validateHeaderData() == 0) return;

  var mytable = document.getElementById("salesPoDetailsTableBody");

  //if (checkTableContentIsNotEmpty(mytable) == 0) return;
  var currentIndex = mytable.rows.length;
  var currentRow = mytable.insertRow(currentIndex);
  currentIndex += 1;
  masterRowId += 1;

  var qualityDropdown = document.createElement("select");
  qualityDropdown.setAttribute("id", "tableQuality" + masterRowId);
  qualityDropdown.setAttribute(
    "class",
    "form-control inputProgramCardWithColMd"
  );
  qualityDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var shadeNoDropdown = document.createElement("select");
  shadeNoDropdown.setAttribute("id", "tableShade" + masterRowId);
  shadeNoDropdown.setAttribute("class", "form-control inputProgramCardWithColMd");
  shadeNoDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var colorDropdown = document.createElement("select");
  colorDropdown.setAttribute("id", "tableColor" + masterRowId);
  colorDropdown.setAttribute("class", "form-control inputProgramCardWithColMd");
  colorDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var conditionDropdown = document.createElement("select");
  conditionDropdown.setAttribute("id", "tableCondition" + masterRowId);
  conditionDropdown.setAttribute("class", "form-control inputProgramCardWithColMd");
  conditionDropdown.setAttribute("onchange", "checkDuplicateQSCC()");

  var rowQtyTextbox = document.createElement("input");
  rowQtyTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowQtyTextbox.setAttribute("id", "tableRowQty" + masterRowId);
  rowQtyTextbox.setAttribute("type", "number");
  rowQtyTextbox.setAttribute("placeholder", "Pur. Qty");
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
  //rowAmtTextbox.setAttribute("onchange", "calculateTableTotal()");

  var addRowBox = document.createElement("input");
  addRowBox.setAttribute("id", "addButton" + masterRowId);
  addRowBox.setAttribute("type", "image");
  addRowBox.setAttribute("title", "Add New Row");
  addRowBox.setAttribute("src", "../../../assets/img/addld.png");
  addRowBox.setAttribute("class", "imageButton");
  addRowBox.setAttribute("onclick", "addTableRow();");

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
  currentCell.appendChild(shadeNoDropdown);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(colorDropdown);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(conditionDropdown);

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
  loadDataDropdown("tableColor" + masterRowId, dropdownMasterValues);
  loadDataDropdown("tableCondition" + masterRowId, condition);
}

function deleteRow(rows) {
  var _row = rows.parentElement.parentElement;
  document.getElementById("salesPoDetailsTable").deleteRow(_row.rowIndex);
  calculateTableTotal();
}

function calculateTableTotal() {
  // totalNoOfRolls = 0;
  totalNetQty = 0;
  var tableRowTotal = 0;
  totalNetAmt = 0;
  var table = document.getElementById("salesPoDetailsTable");
  //console.log(table.rows.length);
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[4].getElementsByTagName("input")[0].value)
      totalNetQty = parseFloat(totalNetQty) + parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value);
    document.getElementById('totalNetQty').value = totalNetQty.toFixed(2);

    if (parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value) > 0
      && parseFloat(table.rows[r].cells[5].getElementsByTagName("input")[0].value) > 0) {
      console.log("In")
      tableRowTotal = parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value) * parseFloat(table.rows[r].cells[5].getElementsByTagName("input")[0].value);
      tableRowTotal = parseFloat(tableRowTotal).toFixed(2);
      table.rows[r].cells[6].getElementsByTagName("input")[0].value = tableRowTotal;
      totalNetAmt = parseFloat(totalNetAmt) + parseFloat(tableRowTotal);
    }
    document.getElementById('totalNetAmt').value = totalNetAmt.toFixed(2);
  }
  calculateQueryMasterRequest();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  //inserting header data into salepomaster : add 1 
  queryMasterRequest += 1;

  // inserting table data rows wise in the saleporows table : add total no of rows in the table  
  var tabRows = document.getElementById("salesPoDetailsTableBody").rows.length;
  queryMasterRequest += tabRows;

  //updating stockmaster 1 row: add 1
  queryMasterRequest += 1;

  //updating seriesnumber once: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function savePODetails() {
  if (validateHeaderData() == 0) return;
  if (checkDuplicateQSCC() == 0) return;
  if (checkTableContentIsNotEmpty() == 0) return;

  alert("New Sales P.O. is Saving...Please wait...");
  document.getElementById("saveButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  saveHeaderData();

  // save table entries and prepare stock master update query
  createUpdatePoRows(createUpdateStockMasterArray(saveTableDataInDb()));

  updatebillNumber();
}

function validateHeaderData() {
  setHeaderData();
  if (salePoNumber === null || salePoNumber === "") {
    document.getElementById("salePoNumber").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("salePoNumber").style.backgroundColor = "white";

  if (dateOfPOIssue === null || dateOfPOIssue === "") {
    document.getElementById("dateOfPOIssue").style.backgroundColor = "#ff6666";
    return 0;
  } else
    document.getElementById("dateOfPOIssue").style.backgroundColor = "white";

  // if (dateOfDelivery === null || dateOfDelivery === "") {
  //   document.getElementById("dateOfDelivery").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else
  //   document.getElementById("dateOfDelivery").style.backgroundColor = "white";

  //date comparison - delivery date cannot be lesser than order date
  console.log(date2);
  if (date2 != "" && date1 > date2) {
    document.getElementById("dateOfPOIssue").style.backgroundColor = "#ff6666";
    document.getElementById("dateOfDelivery").style.backgroundColor = "#ff6666";
    errorMessage("Delivery Date cannot be less then Order Date", false)
    return 0;
  } else {
    document.getElementById("dateOfPOIssue").style.backgroundColor = "white";
    document.getElementById("dateOfDelivery").style.backgroundColor = "white";
    errorMessage("", true)
  }

  if (partyName === null || partyName === "" || partyName == 'Select Party') {
    document.getElementById("finishPartyNames").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("finishPartyNames").style.backgroundColor = "white";

  // if (brokerName === null || brokerName === "" || brokerName == 'Select Broker') {
  //   document.getElementById("brokerName").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("brokerName").style.backgroundColor = "white";

  // if (totalNoOfRolls === null || totalNoOfRolls === "" || totalNoOfRolls <= 0) {
  //   document.getElementById("totalNoOfRolls").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("totalNoOfRolls").style.backgroundColor = "white";

  if (totalNetQty === null || totalNetQty === "" || totalNetQty <= 0) {
    document.getElementById("totalNetQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalNetQty").style.backgroundColor = "white";

  if (totalNetAmt === null || totalNetAmt === "" || totalNetAmt <= 0) {
    document.getElementById("totalNetAmt").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalNetAmt").style.backgroundColor = "white";
}

function setHeaderData() {
  salePoNumber = document.getElementById("salePoNumber").value;

  dateOfPOIssue = document.getElementById("dateOfPOIssue").value;
  if (dateOfPOIssue.trim() != "") {
    date1 = Date.parse(dateOfPOIssue);
    var tempDateArray = dateOfPOIssue.split("-");
    dateOfPOIssue = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  dateOfDelivery = document.getElementById("dateOfDelivery").value;
  if (dateOfDelivery.trim() != "") {
    date2 = Date.parse(dateOfDelivery);
    tempDateArray = dateOfDelivery.split("-");
    dateOfDelivery = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  var tempP = document.getElementById("finishPartyNames");
  partyName = tempP.options[tempP.selectedIndex].text;
  //console.log(partyName, "partyName");

  // var tempD = document.getElementById("dyeingName");
  // dyeingName = tempD.options[tempD.selectedIndex].text;

  var tempB = document.getElementById("brokerName");
  brokerName = tempB.options[tempB.selectedIndex].text;
  if (brokerName.toUpperCase() == "SELECT BROKER") brokerName = '';

  // lotNumber = document.getElementById("lotNumber").value;

  // totalNoOfRolls = document.getElementById("totalNoOfRolls").value;
  totalNetQty = document.getElementById("totalNetQty").value;
  totalNetAmt = document.getElementById("totalNetAmt").value;
}

function checkTableContentIsNotEmpty() {
  var table = document.getElementById("salesPoDetailsTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    //Quality dropdown
    if (table.rows[r].cells[0].getElementsByTagName("select")[0].selectedIndex == 0) {
      table.rows[r].cells[0].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[0].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "white";

    // shade no
    // if (
    //   table.rows[r].cells[1].getElementsByTagName("input")[0].value == "" ||
    //   table.rows[r].cells[1].getElementsByTagName("input")[0].value == null
    // ) {
    //   table.rows[r].cells[1].getElementsByTagName(
    //     "input"
    //   )[0].style.backgroundColor = "#ff6666";
    //   return 0;
    // } else
    //   table.rows[r].cells[1].getElementsByTagName(
    //     "input"
    //   )[0].style.backgroundColor = "white";

    // color
    // if (
    //   table.rows[r].cells[2].getElementsByTagName("select")[0].selectedIndex ==
    //   "0"
    // ) {
    //   table.rows[r].cells[2].getElementsByTagName(
    //     "select"
    //   )[0].style.backgroundColor = "#ff6666";
    //   return 0;
    // } else
    //   table.rows[r].cells[2].getElementsByTagName(
    //     "select"
    //   )[0].style.backgroundColor = "white";

    // Condition
    if (table.rows[r].cells[3].getElementsByTagName("select")[0].selectedIndex == "0") {
      table.rows[r].cells[3].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[3].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "white";

    //no of qty
    if (
      table.rows[r].cells[4].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[4].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[4].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[4].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";

    //row rate
    if (
      table.rows[r].cells[5].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[5].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[5].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[5].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";

    //row amount
    if (
      table.rows[r].cells[6].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[6].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[6].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[6].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";
  }
  return 1;
}

function errorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").hidden = showDecision;
}

function saveHeaderData() {
  connection.query(
    "Insert into salepomaster VALUES ('" +
    sPNumber +
    "','" +
    salePoNumber +
    "','" +
    dateOfPOIssue +
    "','" +
    dateOfDelivery +
    "','" +
    partyName +
    "','" +
    brokerName +
    "','" +
    totalNetQty +
    "','" +
    totalNetAmt +
    "', '0', '0', '1', 'PENDING')",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function saveTableDataInDb() {
  var table = document.getElementById("salesPoDetailsTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var tempS = table.rows[r].cells[1].getElementsByTagName("select")[0];
    var tableShade = tempS.options[tempS.selectedIndex].text;
    if (tableShade == "Shade") tableShade = '';

    var tempC = table.rows[r].cells[2].getElementsByTagName("select")[0];
    var tableColor = tempC.options[tempC.selectedIndex].text;
    if (tableColor == "Color") tableColor = '';

    var tempCondition = table.rows[r].cells[3].getElementsByTagName("select")[0];
    var tableCondition = tempCondition.options[tempCondition.selectedIndex].text;
    if (tableCondition.toUpperCase() == "CONDITION") tableCondition = '';

    var tableQty = table.rows[r].cells[4].getElementsByTagName("input")[0]
      .value;

    var tableRate = table.rows[r].cells[5].getElementsByTagName("input")[0]
      .value;

    connection.query(
      "Insert into saleporows VALUES ('" +
      sPNumber +
      "','" +
      salePoNumber +
      "','" +
      tableQuality +
      "','" +
      tableShade +
      "','" +
      tableColor +
      "','" +
      tableCondition +
      "','" +
      tableQty +
      "','" +
      tableRate +
      "', '0', '0', 'PENDING')",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
      }
    );

    var obj = {
      qualityName: tableQuality,
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
    qty: primaryRowObject[0].qty
  };
  tempR.push(t);
  //console.log(primaryRowObject.length);

  for (var i = 1; i < primaryRowObject.length; i++) {
    if (primaryRowObject[i].qty && primaryRowObject[i].qty > 0) {
      var j = 0;
      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == primaryRowObject[i].qualityName) break;
      }

      if (j < tempR.length) {
        tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(primaryRowObject[i].qty)).toFixed(2);
      } else {
        var t = {
          qualityName: primaryRowObject[i].qualityName,
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
  var caseQueryPendingOrders = "(case ";
  var whereQuery = "";
  var allQuality = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(primaryRowObject[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var qty = rowMaster[i].qty;

    if (qty == "" || qty == null) qty = 0;

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    caseQueryPendingOrders =
      caseQueryPendingOrders +
      "when (qualityName = '" +
      qName +
      "' ) THEN pendingOrders + " +
      qty +
      " ";
  }
  caseQueryPendingOrders = caseQueryPendingOrders + " else pendingOrders end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality + " )";

  performFinalUpdateOfStockMasterTable(caseQueryPendingOrders, whereQuery);
  //return primaryRowObject;
}

function performFinalUpdateOfStockMasterTable(caseQueryPendingOrders, whereQuery) {
  var myQuery = "UPDATE stockmaster set pendingOrders = " + caseQueryPendingOrders + " where  " + whereQuery;
  // console.log(myQuery, "performFinalUpdateOfStockMasterTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function updatebillNumber() {
  sPNumber = parseInt(sPNumber) + 1;
  salePoNumber = parseInt(salePoNumber) + 1;

  var caseQuery = "(case ";
  var whereQuery = '';

  caseQuery = caseQuery + "when (seriesName = 'sPNumber' ) THEN seriesValue + 1 when(seriesName = 'salePoNumber') THEN seriesValue + 1  else seriesValue end)";
  whereQuery = whereQuery + "seriesName in ('sPNumber','salePoNumber')";

  var myQuery = "UPDATE seriesnumber set seriesValue = " + caseQuery + " where  " + whereQuery;
  console.log(myQuery);
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
    console.log("Completed")
    alert("New Sales P.O. is Successfully Saved...");
    document.getElementById("saveButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    window.location.reload();
  }
  else {
    console.log("Pending");
    document.getElementById("saveButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  }
}