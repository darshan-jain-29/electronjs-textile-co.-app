var qualityName = "";
var shade = "";
// var color = "";
var condition = "";
var dropdownMaster = '';
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  viewallSalePOList();
  displayElement("waitingMessage", true);

  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dropdownMaster = results;
    loadDataDropdown('qualityNameDropdown', results);
    loadDataDropdown('shadeDropdown', results);
    loadDataDropdown('colorDropdown', results);
    displayElement("waitingMessage", false);
  });


  if (localStorage.getItem("isAdmin") == 0) displayElement("editStockButton", false)
  else if (localStorage.getItem("isAdmin") == 1) displayElement("editStockButton", true)
}

function viewallSalePOList() {
  document.title = "Stock Master Report - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Stock Master Report";
  // document.getElementById("qualityNameDropdown").selectedIndex =
  //   document.getElementById("shadeDropdown").selectedIndex = "0";
  // document.getElementById("conditionDropdown").selectedIndex = "0";
  document.getElementById("selectPanel").hidden = false;
  document.getElementById("detailPanel").hidden = true;
  document.getElementById("editStockPanel").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadDataDropdown(selectName, results) {
  // console.log("Called")
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "partyNameDropdown") options.text = "Select Party";
  else if (selectName == "dyeingName") options.text = "Select Dyeing";
  else if (selectName == "brokerName") options.text = "Select Broker";
  else if (selectName.includes("qualityNameDropdown") || selectName.includes("editModalQualityName")) options.text = options.value = "QUALITY NAME";
  else if (selectName.includes("shadeDropdown") || selectName.includes("editModalShade")) options.text = options.value = "SHADE";
  else if (selectName.includes("colorDropdown") || selectName.includes("editModalColor")) options.text = options.value = "COLOR";
  else if (selectName.includes("tableCondition") || selectName.includes("editModalCondition")) options.text = options.value = "CONDITION";

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

    else if ((selectName.includes("qualityNameDropdown") || selectName.includes("editModalQualityName")) && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if ((selectName.includes("shadeDropdown") || selectName.includes("editModalShade")) && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if ((selectName.includes("colorDropdown") || selectName.includes("editModalColor")) && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }

    else if ((selectName.includes("tableCondition") || selectName.includes("editModalCondition")) && results[i].type == "condition") {
      options.value = options.text = results[i].value.toUpperCase();
      theSelect.add(options);
      if (i == 0) options.selected = true;
    }
  }
  displayElement("waitingMessage", false);
  return;
}

function setHeaderData() {
  var tempQ = document.getElementById("qualityNameDropdown");
  qualityName = tempQ.options[tempQ.selectedIndex].text;

  var tempS = document.getElementById("shadeDropdown");
  shade = tempS.options[tempS.selectedIndex].text;

  var tempC = document.getElementById("colorDropdown");
  color = tempC.options[tempC.selectedIndex].text;

  var tempCond = document.getElementById("conditionDropdown");
  condition = tempCond.options[tempCond.selectedIndex].text;

}

function validateReportSpecifications() {
  setHeaderData();
  if (qualityName.toUpperCase() === "QUALITY NAME" || qualityName === "") qualityName = '';
  if (shade.toUpperCase() === "SHADE" || shade === "") shade = '';
  if (color.toUpperCase() === "COLOR" || color === "") color = '';
}

function generateReport() {

  if (validateReportSpecifications() == 0) return;

  document.getElementById("selectPanel").hidden = true;
  document.getElementById("detailPanel").hidden = false;
  document.getElementById("editStockPanel").hidden = true;
  document.getElementById("backButton").hidden = false;
  loadDataInDetailedFormat(qualityName, shade, color, condition);
}

function generateEditStockView() {
  document.title = "Stock Master Edit Page - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Stock Master Edit Page";

  document.getElementById("selectPanel").hidden = true;
  document.getElementById("detailPanel").hidden = true;
  document.getElementById("editStockPanel").hidden = false;
  document.getElementById("backButton").hidden = false;
  loadDataForEditInViewFormat();
}

function errorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").style.display = showDecision;
}

function errorMessageModal(message, showDecision) {
  document.getElementById("errorMessageModal").innerHTML = message;
  document.getElementById("errorMessageModal").style.display = showDecision;
}