var partyName = "";
var dyeingName = "";
var qualityName = "";
var fromDate = "";
var toDate = "";
var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  viewallSalePOList();
  displayElement("waitingMessage", true);
  // document.getElementById("toDate").valueAsDate = new Date();
  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadDataDropdown('qualityNameDropdown', results);
    displayElement("waitingMessage", false);
  });

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadDataDropdown("partyNameDropdown", results);
    // loadDataDropdown("dyeingNameDropdown", results);
  });
}

function viewallSalePOList() {
  document.title = "Grey Purchase Report - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Grey Purchase Report";
  // document.getElementById("partyNameDropdown").selectedIndex =
  //   // document.getElementById("dyeingNameDropdown").selectedIndex =
  //   document.getElementById("qualityNameDropdown").selectedIndex = "0";
  document.getElementById("selectPanel").hidden = false;
  document.getElementById("detailPanel").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "partyNameDropdown") options.text = "Select Party";
  else if (selectName == "dyeingNameDropdown") options.text = "Select Dyeing";
  else if (selectName == "brokerName") options.text = "Select Broker";
  else if (selectName.includes("qualityNameDropdown")) options.text = "Quality Name";
  else if (selectName.includes("shadeDropdown")) options.text = "Shade";
  else if (selectName.includes("colorDropdown")) options.text = "Color";
  else if (selectName.includes("tableCondition")) options.text = "Condition";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName == "partyNameDropdown" && results[i].type == "parties") {
      options.value = options.text = results[i].partyName.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName == "dyeingNameDropdown" && results[i].type == "dyeing") {
      options.value = options.text = results[i].partyName.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName == "brokerName" && results[i].type == "broker") {
      options.value = options.text = results[i].partyName.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("qualityNameDropdown") && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("shadeDropdown") && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("colorDropdown") && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if (selectName.includes("tableCondition")) {
      options.value = options.text = results[i].value.toUpperCase();
      theSelect.add(options);
      if (i == 0) options.selected = true;
    }
  }
  displayElement("waitingMessage", false);
  return;
}

function setHeaderData() {
  var tempP = document.getElementById("partyNameDropdown");
  partyName = tempP.options[tempP.selectedIndex].text;

  // var tempP = document.getElementById("dyeingNameDropdown");
  // dyeingName = tempP.options[tempP.selectedIndex].text;

  var tempQ = document.getElementById("qualityNameDropdown");
  qualityName = tempQ.options[tempQ.selectedIndex].text;

  fromDate = document.getElementById("fromDate").value;
  toDate = document.getElementById("toDate").value;
}

function validateReportSpecifications() {
  setHeaderData();

  if (partyName.toUpperCase() === "SELECT PARTY" || partyName === "") partyName = '';
  if (dyeingName.toUpperCase() === "SELECT DYEING" || dyeingName === "") dyeingName = '';
  if (qualityName.toUpperCase() === "QUALITY NAME" || qualityName === "") qualityName = '';

  if ((Date.parse(toDate) <= Date.parse(fromDate))) {
    document.getElementById("fromDate").style.backgroundColor = "#ff6666";
    document.getElementById("toDate").style.backgroundColor = "#ff6666";
    errorMessage("From Date cannot be greater than To Date", true);
    return 0;
  } else {
    document.getElementById("fromDate").style.backgroundColor = "white";
    document.getElementById("toDate").style.backgroundColor = "white";
    errorMessage("", false);
  }
}

function generateReport() {

  if (validateReportSpecifications() == 0) return;

  document.getElementById("selectPanel").hidden = true;
  document.getElementById("detailPanel").hidden = false;
  document.getElementById("backButton").hidden = false;
  loadDataInDetailedFormat(partyName, dyeingName, qualityName, fromDate, toDate);
}

function errorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").style.display = showDecision;
}