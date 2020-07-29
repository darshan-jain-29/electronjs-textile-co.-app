var partyName = "";
var qualityName = "";
var shade = "";
var color = "";
var fromDate = "";
var toDate = "";
var fromYear = "";
var toYear = "";
var fromMonth = "";
var toMonth = "";
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
    loadDataDropdown('shadeDropdown', results);
    loadDataDropdown('colorDropdown', results);
    displayElement("waitingMessage", false);
  });

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadDataDropdown("partyNameDropdown", results);
  });
}

function viewallSalePOList() {
  document.title = "Sale Register Report - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Sale Register Report";
  // document.getElementById("partyNameDropdown").selectedIndex =
  //   document.getElementById("qualityNameDropdown").selectedIndex =
  //   document.getElementById("shadeDropdown").selectedIndex =
  //   document.getElementById("colorDropdown").selectedIndex = "0";
  document.getElementById("selectPanel").hidden = false;
  document.getElementById("detailPanel").hidden = true;
  document.getElementById("calanderPanel").hidden = true;
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
  else if (selectName == "dyeingName") options.text = "Select Dyeing";
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
    else if (selectName == "dyeingName" && results[i].type == "dyeing") {
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

  var tempQ = document.getElementById("qualityNameDropdown");
  qualityName = tempQ.options[tempQ.selectedIndex].text;

  var tempS = document.getElementById("shadeDropdown");
  shade = tempS.options[tempS.selectedIndex].text;

  var tempC = document.getElementById("colorDropdown");
  color = tempC.options[tempC.selectedIndex].text;

  fromDate = document.getElementById("fromDate").value;
  toDate = document.getElementById("toDate").value;

  var tempFM = document.getElementById("fromMonth");
  fromMonth = tempFM.options[tempFM.selectedIndex].value;

  var tempTM = document.getElementById("toMonth");
  toMonth = tempTM.options[tempTM.selectedIndex].value;

  var tempFY = document.getElementById("fromYear");
  fromYear = tempFY.options[tempFY.selectedIndex].value;

  var tempTY = document.getElementById("toYear");
  toYear = tempTY.options[tempTY.selectedIndex].value;
}

function validateReportSpecifications() {
  setHeaderData();

  if (partyName.toUpperCase() === "SELECT PARTY" || partyName === "") partyName = '';
  if (qualityName.toUpperCase() === "QUALITY NAME" || qualityName === "") qualityName = '';
  if (shade.toUpperCase() === "SHADE" || shade === "") shade = '';
  if (color.toUpperCase() === "COLOR" || color === "") color = '';

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
  document.getElementById("calanderPanel").hidden = true;
  document.getElementById("backButton").hidden = false;
  loadDataInDetailedFormat(partyName, qualityName, shade, color, fromDate, toDate);
}

function validateCalanderSpecifications() {
  var date_From = new Date(fromYear, fromMonth);
  var date_To = new Date(toYear, toMonth);

  if (fromMonth == 0) {
    document.getElementById("fromMonth").style.backgroundColor = "#ff6666";
    errorMessage("From Month is not selected", true);
    return 0;
  } else {
    document.getElementById("fromMonth").style.backgroundColor = "white";
    errorMessage("", true);
  }

  if (fromYear == 0) {
    document.getElementById("fromYear").style.backgroundColor = "#ff6666";
    errorMessage("From Year is not selected", true);
    return 0;
  } else {
    document.getElementById("fromYear").style.backgroundColor = "white";
    errorMessage("", true);
  }

  if (toMonth == 0) {
    document.getElementById("toMonth").style.backgroundColor = "#ff6666";
    errorMessage("To Month is not selected", true);
    return 0;
  } else {
    document.getElementById("toMonth").style.backgroundColor = "white";
    errorMessage("", true);
  }

  if (toYear == 0) {
    document.getElementById("toYear").style.backgroundColor = "#ff6666";
    errorMessage("To Month is not selected", true);
    return 0;
  } else {
    document.getElementById("toYear").style.backgroundColor = "white";
    errorMessage("", true);
  }

  if (date_From.getTime() > date_To.getTime()) {
    document.getElementById("fromMonth").style.backgroundColor = "#ff6666";
    document.getElementById("toMonth").style.backgroundColor = "#ff6666";
    document.getElementById("fromYear").style.backgroundColor = "#ff6666";
    document.getElementById("toYear").style.backgroundColor = "#ff6666";
    errorMessage("From Month-Year cannot be greater than To Month-Year", true);
    return 0;
  } else {
    document.getElementById("fromMonth").style.backgroundColor = "white";
    document.getElementById("toMonth").style.backgroundColor = "white";
    document.getElementById("fromYear").style.backgroundColor = "white";
    document.getElementById("toYear").style.backgroundColor = "white";
    errorMessage("", true);
  }

}

function generateMonthlyReport() {
  alert("This feature will come soon! ")
  // setHeaderData();
  // if (validateCalanderSpecifications() == 0) return;
  // console.log(fromMonth, fromYear, toMonth, toYear);

  // document.getElementById("selectPanel").hidden = true;
  // document.getElementById("detailPanel").hidden = true;
  // document.getElementById("calanderPanel").hidden = false;
  // document.getElementById("backButton").hidden = false;
  // loadDataInCalanderFormat(fromMonth, fromYear, toMonth, toYear);
}

function errorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").style.display = showDecision;
}