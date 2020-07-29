document.title = "New Grey Purchase Form. - Kalash Infotech";
document.getElementById("pageHeading").innerHTML = "New Grey Purchase Form.";

var allQualityNames = [];
// var allShades = [];
// var allColors = [];
var poNumber = "";
var dateOfPOIssue = '';
var partyName = '';
var dyeingName = '';
var brokerName = '';
var totalNoOfRolls = 0;
var totalNetQty = 0;
var totalNetAmt = 0;
var uPoNumber = 0;
var masterRowId = 1;
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;

const printingData = {
  docType: "Grey P. O. Purchase Bill",
  invoiceType: "P. O. No.",
  billNo: '',

  dateType: "P .O. Date",
  billDate: '',

  party1Type: "Party Name",
  partyName1: '',
  partyAddress1: '',

  partyType2: "Dyeing Name",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  folderName: 'All-Grey-PO',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableHeadings: {
    heading1: "Grey Quality Name",
    heading2: "Rolls",
    heading3: "Qty",
    heading4: "Rate / m",
    heading5: "Total"
  },

  items: [

  ],

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadPONumber() {
  //load unique PO Number
  displayElement("waitingMessage", true);
  connection.query("SELECT seriesValue from seriesnumber where seriesName = 'uPoNumber';", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - seriesnumber"); throw error; }
    uPoNumber = parseInt(results[0].seriesValue);
  });

  connection.query("SELECT partyName, type, address from partiesmaster ORDER BY partyName", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - partiesmaster"); throw error; }
    allParties = results;
    loadDataDropdown("yarnPartyName", results);
    loadDataDropdown("dyeingName", results);
    loadDataDropdown("brokerName", results);
  });

  connection.query("SELECT name from qsc where type='qualityName' ORDER BY name", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - qsc"); throw error; }
    allQualityNames = results;
    loadDataDropdown('tableQuality1', results);
    displayElement("waitingMessage", false);
  });

}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "yarnPartyName") options.text = "Select Party";
  else if (selectName == "dyeingName") options.text = "Select Dyeing";
  else if (selectName == "brokerName") options.text = "Select Broker";
  else if (selectName.includes("tableQuality")) options.text = "Grey Quality Name";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName == "yarnPartyName" && results[i].type == "parties") {
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

    else if (selectName.includes("tableQuality")) {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
  }
  return;
}

function addTableRow() {
  //if (validateHeaderData() == 0) return;

  var mytable = document.getElementById("poDetailsTableBody");

  var currentIndex = mytable.rows.length;
  var currentRow = mytable.insertRow(currentIndex);
  currentIndex += 1;
  masterRowId += 1;

  var qualityDropdown = document.createElement("select");
  qualityDropdown.setAttribute("id", "tableQuality" + masterRowId);
  qualityDropdown.setAttribute("onchange", "checkDuplicateQualitySelection()");
  qualityDropdown.setAttribute(
    "class",
    "form-control inputProgramCardWithColMd"
  );

  var noOfRollsTextbox = document.createElement("input");
  noOfRollsTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  noOfRollsTextbox.setAttribute("id", "tableNoOfRolls" + masterRowId);
  noOfRollsTextbox.setAttribute("type", "number");
  noOfRollsTextbox.setAttribute("onchange", "calculateTableTotal()");

  var rowQtyTextbox = document.createElement("input");
  rowQtyTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowQtyTextbox.setAttribute("id", "tableRowQty" + masterRowId);
  rowQtyTextbox.setAttribute("type", "number");
  rowQtyTextbox.setAttribute("onchange", "calculateTableTotal()");

  var rowRateTextbox = document.createElement("input");
  rowRateTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowRateTextbox.setAttribute("id", "tableRowRate" + masterRowId);
  rowRateTextbox.setAttribute("type", "number");
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
  addRowBox.setAttribute("src", "../../../../assets/img/addld.png");
  addRowBox.setAttribute("class", "imageButton");
  addRowBox.setAttribute("onclick", "addTableRow();");

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
  currentCell.appendChild(noOfRollsTextbox);

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

  loadDataDropdown("tableQuality" + masterRowId, allQualityNames);
}

function deleteRow(rows) {
  var _row = rows.parentElement.parentElement;
  document.getElementById("poDetailsTable").deleteRow(_row.rowIndex);
  calculateTableTotal();
}

function calculateTableTotal() {
  totalNoOfRolls = 0;
  totalNetQty = 0;
  var tableRowTotal = 0;
  totalNetAmt = 0;
  var table = document.getElementById("poDetailsTable");
  //console.log(table.rows.length);
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (
      (table.rows[r].cells[1].getElementsByTagName("input")[0].value)) {
      // console.log("In");
      totalNoOfRolls = parseFloat(totalNoOfRolls) + parseFloat(table.rows[r].cells[1].getElementsByTagName("input")[0].value);
      totalNoOfRolls = parseFloat(totalNoOfRolls).toFixed(2);
      document.getElementById('totalNoOfRolls').value = totalNoOfRolls;
    } else {
      totalNoOfRolls = parseFloat(totalNoOfRolls).toFixed(2);
      document.getElementById('totalNoOfRolls').value = totalNoOfRolls;
    }

    if (
      (table.rows[r].cells[2].getElementsByTagName("input")[0].value)) {
      // console.log("In");
      totalNetQty = parseFloat(totalNetQty) + parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value);
      totalNetQty = parseFloat(totalNetQty).toFixed(2);
      document.getElementById('totalNetQty').value = totalNetQty;
    } else {
      totalNetQty = parseFloat(totalNetQty).toFixed(2);
      document.getElementById('totalNetQty').value = totalNetQty;
    }

    if (
      (table.rows[r].cells[2].getElementsByTagName("input")[0].value > 0
        && table.rows[r].cells[3].getElementsByTagName("input")[0].value > 0)) {
      // console.log("In");
      tableRowTotal = parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) * parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value);
      tableRowTotal = parseFloat(tableRowTotal).toFixed(2);
      table.rows[r].cells[4].getElementsByTagName("input")[0].value = tableRowTotal;
      totalNetAmt = parseFloat(totalNetAmt) + parseFloat(tableRowTotal);
      document.getElementById('totalNetAmt').value = totalNetAmt;
    } else document.getElementById('totalNetAmt').value = totalNetAmt;
  }
  calculateQueryMasterRequest();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;
  //inserting header data : add 1 
  queryMasterRequest += 1;

  // inserting table data rows wise in the greyporows table : add total no of rows in the table  
  var tabRows = document.getElementById("poDetailsTableBody").rows.length;
  queryMasterRequest += tabRows;

  //updating stockmaster 1 row: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function savePODetails() {
  if (validateHeaderData() == 0) return;
  if (checkDuplicateQualitySelection() == 0) return;
  if (checkTableContentIsNotEmpty() == 0) return;

  alert("New Grey Purchase is Saving...Please wait...");
  document.getElementById("saveButton").disabled = true;
  document.getElementById("resetButton").disabled = true;
  // document.getElementById("savePrintButton").disabled = true;

  //save header data
  saveHeaderData();

  // save table row entries
  saveTableDataInDb();

  updatePoNumber();
}

function validateHeaderData() {
  setHeaderData();
  if (poNumber === null || poNumber === "") {
    document.getElementById("poNumber").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("poNumber").style.backgroundColor = "white";

  if (dateOfPOIssue === null || dateOfPOIssue === "") {
    document.getElementById("dateOfPOIssue").style.backgroundColor = "#ff6666";
    return 0;
  } else
    document.getElementById("dateOfPOIssue").style.backgroundColor = "white";

  if (partyName === null || partyName === "" || partyName == 'Select Party') {
    document.getElementById("yarnPartyName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("yarnPartyName").style.backgroundColor = "white";

  if (dyeingName === null || dyeingName === "" || dyeingName == 'Select Dyeing') {
    document.getElementById("dyeingName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("dyeingName").style.backgroundColor = "white";

  if (brokerName === null || brokerName === "" || brokerName == 'Select Broker') {
    brokerName = '';
  }

  if (totalNoOfRolls === null || totalNoOfRolls === "" || totalNoOfRolls <= 0) {
    document.getElementById("totalNoOfRolls").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalNoOfRolls").style.backgroundColor = "white";

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
  // printingData.billNo = 
  poNumber = document.getElementById("poNumber").value;
  dateOfPOIssue = document.getElementById("dateOfPOIssue").value;
  if (dateOfPOIssue.trim() !== '') {
    var tempDateArray = dateOfPOIssue.split("-");
    // printingData.billDate = 
    dateOfPOIssue = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  var tempP = document.getElementById("yarnPartyName");
  // printingData.partyName1 = 
  partyName = tempP.options[tempP.selectedIndex].text;
  //console.log(partyName, "partyName");
  // printingData.partyAddress1 = fetchPartyAddress(partyName.toUpperCase(), "PARTIES");

  var tempD = document.getElementById("dyeingName");
  // printingData.partyName2 = 
  dyeingName = tempD.options[tempD.selectedIndex].text;
  // printingData.partyAddress2 = fetchPartyAddress(dyeingName.toUpperCase(), "DYEING");

  var tempB = document.getElementById("brokerName");
  // printingData.brokerName = 
  brokerName = tempB.options[tempB.selectedIndex].text;

  // printingData.totalRolls = 
  totalNoOfRolls = document.getElementById("totalNoOfRolls").value;
  // printingData.totalQty = 
  totalNetQty = document.getElementById("totalNetQty").value;
  // printingData.totalAmount = 
  totalNetAmt = document.getElementById("totalNetAmt").value;
}

function checkTableContentIsNotEmpty() {
  var table = document.getElementById("poDetailsTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    //Quality dropdown
    if (
      table.rows[r].cells[0].getElementsByTagName("select")[0].selectedIndex ==
      0
    ) {
      table.rows[r].cells[0].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[0].getElementsByTagName(
        "select"
      )[0].style.backgroundColor = "white";

    //no of rolls
    if (
      table.rows[r].cells[1].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[1].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[1].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[1].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";

    //row qty
    if (
      table.rows[r].cells[2].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[2].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[2].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[2].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";

    //row rate
    if (
      table.rows[r].cells[3].getElementsByTagName("input")[0].value == "" ||
      table.rows[r].cells[3].getElementsByTagName("input")[0].value == null
    ) {
      table.rows[r].cells[3].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "#ff6666";
      return 0;
    } else
      table.rows[r].cells[3].getElementsByTagName(
        "input"
      )[0].style.backgroundColor = "white";

    //row amount
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
  }
  return 1;
}

function checkDuplicateQualitySelection() {
  var table = document.getElementById("poDetailsTable");
  var selectedQualities = [];
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var j = 0;
    for (j = 0; j < selectedQualities.length; j++) {
      if (selectedQualities[j] == tableQuality)
        break;
    }
    if (j < selectedQualities.length) {
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#ff6666";
      return 0;
    } else if (j == selectedQualities.length) {
      selectedQualities.push(tableQuality);
      table.rows[r].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "white";
    }
  }
  return 1;
}

function saveHeaderData() {
  connection.query(
    "Insert into greypomaster VALUES ('" +
    uPoNumber +
    "','" +
    poNumber +
    "','" +
    dateOfPOIssue +
    "','" +
    partyName +
    "','" +
    dyeingName +
    "','" +
    brokerName +
    "','" +
    totalNoOfRolls +
    "','" +
    totalNetQty +
    "','" +
    totalNetAmt +
    "','0', '0','0', '0', '' ,'PENDING')",
    function (err, result) {
      if (err) { alert(err + " : Tab - greypomaster"); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function saveTableDataInDb() {
  var table = document.getElementById("poDetailsTable");
  // printingData.items = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tempQ = table.rows[r].cells[0].getElementsByTagName("select")[0];
    var tableQuality = tempQ.options[tempQ.selectedIndex].text;

    var tableNoOfRolls = table.rows[r].cells[1].getElementsByTagName("input")[0].value;
    var tableQty = table.rows[r].cells[2].getElementsByTagName("input")[0].value;
    var tableRate = table.rows[r].cells[3].getElementsByTagName("input")[0].value;

    connection.query(
      "Insert into greyporows VALUES ('" +
      uPoNumber +
      "','" +
      poNumber +
      "','" +
      tableQuality +
      "','" +
      tableNoOfRolls +
      "','" +
      tableQty +
      "','" +
      tableRate +
      "', '0', '0', '0')",
      function (err, result) {
        if (err) { alert(err + " : Tab - greyporows"); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted();
      }
    );

    // var obj = {
    //   qualityName: tableQuality,
    //   rolls: tableNoOfRolls,
    //   qty: tableQty,
    //   rpm: tableRate
    // };
    // printingData.items.push(obj);
  }
}

function updatePoNumber() {
  uPoNumber = uPoNumber + 1;
  connection.query(
    "UPDATE seriesnumber SET seriesValue = '" +
    uPoNumber +
    "' WHERE seriesName ='uPoNumber';",
    function (err, result) {
      if (err) { alert(err + " : Tab - seriesnumber"); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function checkIfWorkingCompleted() {
  if (queryMasterRequest == queryMasterResponse) {
    // console.log("Completed");
    alert("New Grey Purchase is Successfully Saved...");
    document.getElementById("saveButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    // document.getElementById("savePrintButton").disabled = false;
    // if (printInvoice.toUpperCase() == 'YES') printInvoiceData();
    // else 
    window.location.reload();
  }
  else {
    // console.log("Pending");
    document.getElementById("saveButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    // document.getElementById("savePrintButton").disabled = true;
  }
}
