var datatableObj;
var masterTotalQty = 0;
var masterTotalQtyDelivered = 0;
// var masterTotalQtyPending = 0;
var billNumber = "";
var sPNumber = "";
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;


function loadData() {
  viewAllDispatchList();
  displayElement("waitingMessage", true);
  connection.query(
    "SELECT * from salepomaster where totalQtyDelivered > 0 ORDER BY sPNumber desc",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInDispatchTable(results);
    }
  );

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadDataDropdownHome("partyName", results);
    loadDataDropdownHome("brokerName", results);
    displayElement("waitingMessage", false);
  });
}

function viewAllDispatchList() {
  document.title = "All Dispatch List - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Dispatch List";

  document.getElementById("tabularViewOfAllDispatches").hidden = false;
  document.getElementById("partyName").style.display = "initial";
  document.getElementById("brokerName").style.display = "initial";

  document.getElementById("viewDispatchDetails").hidden = true;
  document.getElementById("editDispatchDetails").hidden = true;
  document.getElementById("gRDetails").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadValuesInDispatchTable(results) {
  var tableInstance = document.getElementById("allDispatchTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
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
      // newCell.textContent = results[i].billNumber;
      newCell.textContent = results[i].salePoNumber;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].dateOfPoIssue;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].dateOfDelivery;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].partyName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].brokerName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].totalQty;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = parseFloat(results[i].totalQtyDelivered).toFixed(2);
      newRow.appendChild(newCell);

      // newCell = document.createElement("td");
      // var tablePendingQty = (parseFloat(results[i].totalQty) - parseFloat(results[i].totalQtyDelivered)).toFixed(2);
      // newCell.textContent = tablePendingQty;
      // newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].status;
      if (results[i].status.toUpperCase() == "PENDING") newCell.style.color = "red";
      else newCell.style.color = "green";
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var viewButton = document.createElement("input");
      viewButton.setAttribute("type", "button");
      viewButton.setAttribute("title", "View Pending Dispatch Details");
      viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
      viewButton.setAttribute("style", "width: 60px");
      viewButton.setAttribute(
        "id",
        results[i].salePoNumber + ":" + results[i].sPNumber + ":" + results[i].status + ":" +
        "View"
      );
      viewButton.setAttribute("value", "View");
      viewButton.setAttribute("onclick", "viewDispatchDetails(id)");
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);

      masterTotalQty = parseFloat(masterTotalQty) + parseFloat(results[i].totalQty);
      masterTotalQtyDelivered = parseFloat(masterTotalQtyDelivered) + parseFloat(results[i].totalQtyDelivered);
      // masterTotalQtyPending = parseFloat(masterTotalQtyPending) + parseFloat(tablePendingQty);
    }
  }

  document.getElementById("footerTotalQty").value = masterTotalQty.toFixed(2);
  document.getElementById("footerTotalQtyDelivered").value = masterTotalQtyDelivered.toFixed(2);
  // document.getElementById("footerTotalQtyPending").value = masterTotalQtyPending.toFixed(2);

  datatableObj = $("#allDispatchTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 75,
    "aaSorting": []
  });

}


function loadDataDropdownHome(selectName, results) {
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

function filterByDropdown(id) {
  var tempD = document.getElementById(id);
  var dropdownValue = tempD.options[tempD.selectedIndex].text;
  if (dropdownValue.toUpperCase() == 'SELECT ALL' || dropdownValue.toUpperCase().includes("FILTER BY")) dropdownValue = '';
  // console.log(dropdownValue);

  var table = $('#allDispatchTable').DataTable();
  switch (id) {
    case 'partyName': table.columns(3).search(dropdownValue).draw(); break;
    case 'brokerName': table.columns(4).search(dropdownValue).draw(); break;
  }
}

function viewDispatchDetails(id) {
  var temp = id.split(":");
  billNumber = temp[0];
  sPNumber = temp[1];

  document.title = "Dispatch Details - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Dispatch Details - " + temp[0];

  document.getElementById("tabularViewOfAllDispatches").hidden = true;
  document.getElementById("viewDispatchDetails").hidden = false;
  document.getElementById("editDispatchDetails").hidden = true;
  document.getElementById("partyName").style.display = "none";
  document.getElementById("brokerName").style.display = "none";

  document.getElementById("gRDetails").hidden = true;

  document.getElementById("backButton").hidden = false;
  displayElement("waitingMessage", true);
  loadDataInViewFormat(billNumber, sPNumber);
}

function editDispatchDetails(bill) {
  document.title = "Edit Dispatch Details - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "Edit Dispatch Details - " + bill.replace('-', '/');

  document.getElementById("tabularViewOfAllDispatches").hidden = true;
  document.getElementById("viewDispatchDetails").hidden = true;
  document.getElementById("editDispatchDetails").hidden = false;
  document.getElementById("gRDetails").hidden = true;
  document.getElementById("backButton").hidden = false;
  displayElement("waitingMessage", true);
}
