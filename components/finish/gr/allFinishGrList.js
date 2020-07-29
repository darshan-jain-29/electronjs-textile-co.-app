var datatableObj;
var masterTotalGRQty = 0;
var masterTotalGRRolls = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {

  viewAllGRList();
  displayElement("waitingMessage", true);
  connection.query(
    "SELECT * from finishgrmaster where totalQty > 0 ORDER BY grSeries desc",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInGRTable(results);
    }
  );

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadFilterDataDropdown("partyName", results);
    loadFilterDataDropdown("brokerName", results);
    displayElement("waitingMessage", false);
  });
}

function viewAllGRList() {
  document.title = "All Finish Purchase GR List - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Finish Purchase GR List";

  document.getElementById("tabularViewOfAllGR").hidden = false;
  document.getElementById("partyName").style.display = "initial";
  document.getElementById("brokerName").style.display = "initial";
  document.getElementById("viewGRDetails").hidden = true;
  document.getElementById("gRDetails").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadValuesInGRTable(results) {
  var tableInstance = document.getElementById("allGRTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";

  masterTotalGRQty = 0.00;
  masterTotalGRRolls = 0.00;
  if (datatableObj) {
    datatableObj.fnClearTable();
    datatableObj.fnDraw();
    datatableObj.fnDestroy();
  }
  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      console.log("andar aaya?");
    } else {

      newCell = document.createElement("td");
      newCell.textContent = results[i].invoiceNo;
      newRow.appendChild(newCell);

      // newCell = document.createElement("td");
      // // newCell.textContent = results[i].billNumber;
      // newCell.textContent = results[i].dateOfGR;
      // newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].partyName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].brokerName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].totalRolls;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].totalQty;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var viewButton = document.createElement("input");
      viewButton.setAttribute("type", "button");
      viewButton.setAttribute("title", "View GR Details");
      viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
      viewButton.setAttribute("style", "width: 60px");
      viewButton.setAttribute(
        "id",
        results[i].invoiceNo + ":" +
        "View"
      );
      viewButton.setAttribute("value", "View");
      viewButton.setAttribute("onclick", "viewGRDetails(id)");
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);

      masterTotalGRQty = (parseFloat(masterTotalGRQty) + parseFloat(results[i].totalQty)).toFixed(2);
      masterTotalGRRolls = parseInt(masterTotalGRRolls) + parseInt(1);

      document.getElementById("footerTotalGRQty").value = masterTotalGRQty;
      document.getElementById("footerTotalGRRolls").value = masterTotalGRRolls;
    }
  }

  datatableObj = $("#allGRTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 75,
    "aaSorting": []
  });

}


function loadFilterDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "partyName") options.text = "Filter by Parties";
  else if (selectName == "dyeingName") options.text = "Filter by Dyeing";
  else if (selectName == "brokerName") options.text = "Filter by Broker";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  options = document.createElement("option");
  options.value = options.text = 'Select ALL';
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName == "partyName" && results[i].type == "parties") {
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

function filterByDropdownHome(id) {
  var tempD = document.getElementById(id);
  var dropdownValue = tempD.options[tempD.selectedIndex].text;
  if (dropdownValue.toUpperCase() == 'SELECT ALL' || dropdownValue.toUpperCase().includes("FILTER BY")) dropdownValue = '';
  // console.log(dropdownValue);

  var table = $('#allGRTable').DataTable();
  switch (id) {
    case 'partyName': table.columns(1).search(dropdownValue).draw(); break;
    case 'brokerName': table.columns(2).search(dropdownValue).draw(); break;
  }
}
function viewGRDetails(id) {
  var temp = id.split(":");
  billNumber = temp[0];

  document.title = "GR Details - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "GR Details - " + temp[0];

  document.getElementById("tabularViewOfAllGR").hidden = true;
  document.getElementById("partyName").style.display = "none";
  document.getElementById("brokerName").style.display = "none";

  document.getElementById("tabularViewOfAllGR").hidden = true;
  document.getElementById("viewGRDetails").hidden = false;
  document.getElementById("gRDetails").hidden = true;

  document.getElementById("backButton").hidden = false;
  displayElement("waitingMessage", true);
  loadDataInViewFormat(billNumber);
}

function editGRDetails(id) {
  var temp = id.split("Edit");
  document.title = "All Finish Purchase GR List - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Finish Purchase GR List";

  document.getElementById("tabularViewOfAllPO").hidden = true;
  // document.getElementById("editButton").style.display = "none";
  document.getElementById("viewGRDetails").hidden = true;
  document.getElementById("gRDetails").hidden = true;
  // document.getElementById("editGRDetails").hidden = false;
  document.getElementById("backButton").hidden = false;
  document.getElementById("pageHeading").innerHTML = "Edit Grey Purchase Details - " + temp[0];
  loadDataInEditFormat(id);
}

