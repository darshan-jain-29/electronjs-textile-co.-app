var variables = require("../../common/pooldb");
var connection = variables.dbconnection;
document.title = "Sticker Printing";
var dropdownMasterValues = [];
var rollsMaster = [];
var tempRolls = [];
var tempShade = [];
var rollsSeries = 0;
var selectedQualityName = '';
var selectedShade = '';
var selectedColor = '';
var selectedRollNo = '';
var availableMtrs = 0.000;
var selectedLotNo = "";
var selectedCondition = "";
var queryMasterRequest = 0;
var queryMasterResponse = 0;

const printingData = {
  stickerFolderName: 'Stickers',

  stickerCompanyName: "KHIMESARA",

  stickers: [

  ],
}

function loadInitials() {
  displayElement("waitingMessage", true);
  connection.query("SELECT seriesValue from seriesnumber where seriesName in ('nFNumber', 'rollsSeries') ;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results)
    rollsSeries = results[0].seriesValue;
    nFNumber = results[1].seriesValue;
    // console.log(nFNumber, rollsSeries)
  });

  connection.query("SELECT * from qsc ORDER BY type", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dropdownMasterValues = results;
    // console.log(results)
    loadDataDropdown('qualityName', results);
    loadDataDropdown('shade', results);
    // loadDataDropdown('color', results);
    // displayElement("waitingMessage", false);
  });

  connection.query("SELECT * from stockrows where qty > 0 and rollsSeries != '' ORDER BY rollsSeries desc", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    rollsMaster = results;
    // console.log(results)
    loadDataDropdown('rolls', results);
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
  if (selectName == "purchasePartyName") options.text = "Select Party";
  else if (selectName == "dyeingName") options.text = "Select Dyeing";
  else if (selectName == "brokerName") options.text = "Select Broker";
  else if (selectName.includes("qualityName")) options.text = "Select Quality";
  else if (selectName.includes("shade")) options.text = "Select Shade";
  else if (selectName.includes("color")) options.text = "Select Color";
  else if (selectName.includes("rolls")) options.text = "Select Roll";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  options = document.createElement("option");
  if (selectName.includes("shade")) options.text = "";
  else if (selectName.includes("color")) options.text = "";

  if (selectName.includes("shade") || selectName.includes("color"))
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

    else if (selectName.includes("qualityName") && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("shade") && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("color") && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("rolls")) {
      options.value = options.text = results[i].rollsSeries.toUpperCase();
      theSelect.add(options);
    }
  }
  return;
}

function loadRollNumbers() {
  displayElement("waitingMessage", true);
  setHeaderData();
  tempRolls = [];
  tempShade = [];
  // console.log(rollsMaster, rollsMaster.length);
  for (var i = 0; i < rollsMaster.length; i++) {
    if (rollsMaster[i].qualityName == selectedQualityName) {
      tempRolls.push(rollsMaster[i]);
      tempShade.push(rollsMaster[i].shade);
    }
  }
  // console.log(tempRolls, tempRolls.length);
  loadUniqueShades(tempShade.removeDuplicates());
  loadDataDropdown('rolls', tempRolls);
  displayElement("waitingMessage", false);
}

Array.prototype.removeDuplicates = function () {
  return this.filter(function (item, index, self) {
    return self.indexOf(item) == index;
  });
};

function loadUniqueShades(results) {
  var theSelect = document.getElementById("shade");

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  options.text = "Select Shade";
  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");
    options.value = options.text = results[i].toUpperCase();
    theSelect.add(options);

  }
}

function loadRollNumbersOnTopOfQualityName() {
  displayElement("waitingMessage", true);
  setHeaderData();
  var tempRolls2 = [];
  for (var i = 0; i < rollsMaster.length; i++) {
    if ((rollsMaster[i].qualityName == selectedQualityName && rollsMaster[i].shade == selectedShade) || (rollsMaster[i].qualityName == selectedQualityName && selectedShade == "Select Shade"))
      tempRolls2.push(rollsMaster[i]);
  }
  // console.log(tempRolls2, tempRolls2.length);
  loadDataDropdown('rolls', tempRolls2);
  displayElement("waitingMessage", false);
}

function getDetails() {
  document.getElementById("availableMtrs").textContent = "0.000";
  if (validateHeaderData() == 0) return;

  for (var i = 0; i < rollsMaster.length; i++) {
    if (rollsMaster[i].qualityName == selectedQualityName && rollsMaster[i].rollsSeries == selectedRollNo) {
      document.getElementById("availableMtrs").textContent = availableMtrs = parseFloat(rollsMaster[i].qty).toFixed(2);
      document.getElementById("tableQualityName1").value = rollsMaster[i].qualityName;
      document.getElementById("tableShade1").value = rollsMaster[i].shade;
      // document.getElementById("tableColor1").value = rollsMaster[i].color;
      document.getElementById("tableRollNo1").value = rollsMaster[i].rollsSeries;
      selectedLotNo = rollsMaster[i].lotNo;
      selectedCondition = rollsMaster[i].isDamage;
      selectedColor = rollsMaster[i].color;
      // console.log(availableMtrs, "availableMtrs");
      // document.getElementById("totalRolls").value = 1;
      // document.getElementById("tableQty1").value = document.getElementById("totalQty").value = parseFloat(rollsMaster[i].qty).toFixed(2);
      break;
    }
  }
}

function validateHeaderData() {
  setHeaderData();
  // console.log(selectedQualityName, ": ", selectedShade, ": ", selectedRollNo)
  if ((selectedQualityName === "" || selectedQualityName === "Select Quality")) {
    hideUnhideModalError("block", "Please select Quality  ");
    return 0;
  } else hideUnhideModalError("block", "");;

  if (selectedRollNo == 'Select Roll') {
    hideUnhideModalError("block", "Please select Roll.");
    return 0;
  } else hideUnhideModalError("block", "");;

}

function setHeaderData() {
  var tempQ = document.getElementById("qualityName");
  selectedQualityName = tempQ.options[tempQ.selectedIndex].text;

  var tempS = document.getElementById("shade");
  selectedShade = tempS.options[tempS.selectedIndex].text;
  if (selectedShade == "Select Shade") selectedShade = "";

  // var tempC = document.getElementById("color");
  // selectedColor = tempC.options[tempC.selectedIndex].text;

  var tempR = document.getElementById("rolls");
  selectedRollNo = tempR.options[tempR.selectedIndex].text;
  if (selectedRollNo == "Select Roll") selectedRollNo = "";
}

function hideUnhideModalError(showError, errorM) {
  document.getElementById("errorMessage").style.display = showError;
  document.getElementById("errorMessage").innerHTML = errorM;
}

function addTableRows() {
  setHeaderData();
  if (validateTable() == 0) return;
  var mytable = document.getElementById("stockDetailsTableBody");

  var currentIndex = mytable.rows.length;
  // console.log(currentIndex, "CI")
  var currentRow = mytable.insertRow(currentIndex);
  currentIndex += 1;

  var qualityNameTextbox = document.createElement("input");
  qualityNameTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  qualityNameTextbox.setAttribute("id", "tableQualityName" + currentIndex);
  qualityNameTextbox.setAttribute("type", "text");
  qualityNameTextbox.setAttribute("value", selectedQualityName);
  qualityNameTextbox.setAttribute("disabled", "true");

  var shadeTextbox = document.createElement("input");
  shadeTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  shadeTextbox.setAttribute("id", "tableShade" + currentIndex);
  shadeTextbox.setAttribute("type", "text");
  shadeTextbox.setAttribute("value", selectedShade);
  shadeTextbox.setAttribute("disabled", "true");

  var rollNoTextbox = document.createElement("input");
  rollNoTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rollNoTextbox.setAttribute("id", "tableShade" + currentIndex);
  rollNoTextbox.setAttribute("type", "number");
  rollNoTextbox.setAttribute("value", parseInt(rollsSeries) + 1 + currentIndex);
  // rollsSeries = parseInt(rollsSeries) + 1;
  rollNoTextbox.setAttribute("disabled", "true");

  var rowQtyTextbox = document.createElement("input");
  rowQtyTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
  rowQtyTextbox.setAttribute("id", "tableRowQty" + currentIndex);
  rowQtyTextbox.setAttribute("type", "number");

  // rowQtyTextbox.setAttribute("disabled", "true");
  rowQtyTextbox.setAttribute("onchange", "calculateTableTotal()");

  var addRowBox = document.createElement("input");
  addRowBox.setAttribute("id", "addButton" + currentIndex);
  addRowBox.setAttribute("type", "image");
  addRowBox.setAttribute("title", "Add New Row");
  addRowBox.setAttribute("src", "../../../assets/img/addld.png");
  addRowBox.setAttribute("class", "imageButton");
  addRowBox.setAttribute("onclick", "addTableRows();");

  var addDeleteBox = document.createElement("input");
  addDeleteBox.setAttribute("type", "deleteButton" + currentIndex);
  addDeleteBox.setAttribute("type", "image");
  addDeleteBox.setAttribute("title", "Delete Row");
  addDeleteBox.setAttribute("src", "../../../assets/img/deleteld.png");
  addDeleteBox.setAttribute("class", "imageButton");
  addDeleteBox.setAttribute("onclick", "deleteRow(this);");

  var currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(qualityNameTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(shadeTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(rollNoTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.appendChild(rowQtyTextbox);

  currentCell = currentRow.insertCell(-1);
  currentCell.setAttribute("class", "displayGrid")
  currentCell.appendChild(addRowBox);

  currentCell.appendChild(addDeleteBox);
}

function deleteRow(rows) {
  var _row = rows.parentElement.parentElement;
  document.getElementById("stockDetailsTable").deleteRow(_row.rowIndex);
  calculateTableTotal();
}

function calculateTableTotal() {
  totalNoOfRolls = 0;
  totalQty = 0;
  printingData.stickers = [];
  var tempRollNo = 0;
  var tempQty = 0;

  var table = document.getElementById("stockDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[3].getElementsByTagName("input")[0].value) {
      totalQty = parseFloat(totalQty) + parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value);
      document.getElementById('totalQty').value = totalQty.toFixed(2);

      document.getElementById('totalRolls').value = totalNoOfRolls += 1;

      tempRollNo = table.rows[r].cells[2].getElementsByTagName("input")[0].value;
      tempQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value;

      var obj = {
        qualityName: selectedQualityName,
        shade: selectedShade,
        qty: tempQty,
        rollNo: tempRollNo
      };
      printingData.stickers.push(obj);

    }
  }
  validateTotal();
  calculateQueryMasterRequest();
}

function validateTable() {
  var table = document.getElementById("stockDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    //Qty
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
  }

  return 1;
}

function validateTotal() {
  console.log(totalQty, " - totqlQty", availableMtrs, " - availableMtrs")
  if (parseFloat(totalQty) != parseFloat(availableMtrs)) {
    hideUnhideModalError("block", "Total Qty is not equal to Available Mtrs");
    return 0;
  } else {
    hideUnhideModalError("none", "");
  }
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  // updating first row: add 1 
  // console.log(printingData.stickers.length, "Stickers len")
  if (totalNoOfRolls > 1) {
    queryMasterRequest += 1;

    // console.log(printingData.stickers.length - 1);
    // inserting stockrows : add new rows 
    queryMasterRequest += parseInt(totalNoOfRolls - 1);

    //updating series master : add 1
    queryMasterRequest += 1;
  }
  console.log(queryMasterRequest);
}

function print() {

  if (calculateTableTotal() == 0) return 0;
  if (validateTable() == 0) return 0;
  if (validateTotal() == 0) return 0;

  //update stock rows - change qty of first and insert new rows
  if (totalNoOfRolls > 1) {
    updateStockRows();
    updateSeriesNumber();
  }

  printAllStickers(printingData, printingData.stickers.length);

  if (totalNoOfRolls == 1)
    checkIfWorkingCompleted();
}

function updateStockRows() {
  var myQuery = "UPDATE stockrows set qty = " + printingData.stickers[0].qty +
    " where  qualityName='" + printingData.stickers[0].qualityName +
    "' and rollsSeries = '" + printingData.stickers[0].rollNo + "' ;";

  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });

  if (printingData.stickers.length > 1) {
    for (var i = 1; i < printingData.stickers.length; i++) {
      var qualityName = printingData.stickers[i].qualityName;
      var shade = printingData.stickers[i].shade;
      var color = selectedColor;
      var isDamage = selectedCondition;
      var lotNo = selectedLotNo;
      var rollNo = printingData.stickers[i].rollNo;
      var gRQty = printingData.stickers[i].qty;

      console.log(rollNo, "- rollNo", isDamage, " - isDamage", lotNo, " - lotNo");
      connection.query(
        "Insert into stockrows VALUES ('" +
        rollNo +
        "','" +
        lotNo +
        "','" +
        qualityName +
        "','" +
        shade +
        "','" +
        color +
        "','" +
        gRQty +
        "','" +
        isDamage +
        "','" +
        '0' +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
          console.log(result);
        }
      );
    }
  }
}

function updateSeriesNumber() {
  var table = document.getElementById("stockDetailsTable").rows.length;
  rollsSeries = parseInt(rollsSeries) + parseInt(totalNoOfRolls - 1);
  connection.query(
    "UPDATE seriesnumber SET seriesValue = '" +
    rollsSeries +
    "' WHERE seriesName ='rollsSeries';",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
      console.log(result);
    }
  );
}

function checkIfWorkingCompleted() {
  console.log(queryMasterRequest, "- queryMasterRequest", queryMasterResponse, "- queryMasterResponse");
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed");
    alert("Done. Please Check...");
    document.getElementById("printButton").disabled = false;

    window.location.reload();
  }
  else {
    console.log("Pending");
    document.getElementById("printButton").disabled = true;
  }
}