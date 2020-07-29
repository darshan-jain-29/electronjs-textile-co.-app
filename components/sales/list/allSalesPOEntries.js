var datatableObj;
var billNumber = "";
var sPNumber = "";
var masterTotalQty = 0;
var masterTotalAmount = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  viewallSalePOList();
  displayElement("waitingMessage", true);
  fetchAddresses(connection);
  connection.query(
    "SELECT * from salepomaster ORDER BY sPNumber desc",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInViewTable(results);
    }
  );

  connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadDataDropdown("partyName", results);
    loadDataDropdown("brokerName", results);
    displayElement("waitingMessage", false);
  });
}

function viewallSalePOList() {
  document.title = "All Sales P.O. - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Sales P.O";

  document.getElementById("tabularViewOfAllFinishPurchase").hidden = false;
  document.getElementById("partyName").style.display = "initial";
  document.getElementById("brokerName").style.display = "initial";
  document.getElementById("viewSalePODetails").hidden = true;
  document.getElementById("editFinishPurchaseDetails").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadValuesInViewTable(results) {
  var tableInstance = document.getElementById("allSalePOBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  masterTotalQty = 0;
  masterTotalAmount = 0;

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
      newCell.textContent = results[i].totalAmt;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].status;
      if (results[i].status.toUpperCase() == "PENDING") newCell.style.color = "red";
      else newCell.style.color = "green";
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var viewButton = document.createElement("input");
      viewButton.setAttribute("type", "button");
      viewButton.setAttribute("title", "View Sale P.O. Details");
      viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
      viewButton.setAttribute(
        "id",
        results[i].salePoNumber + ":" + results[i].sPNumber + ":" +
        "View"
      );
      viewButton.setAttribute("value", "View");
      viewButton.setAttribute("onclick", "viewSalePODetails(id)");
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);

      masterTotalQty = parseFloat(masterTotalQty) + parseFloat(results[i].totalQty);
      masterTotalAmount = parseFloat(masterTotalAmount) + parseFloat(results[i].totalAmt);
    }
  }

  document.getElementById("footerTotalQty").value = masterTotalQty.toFixed(2);
  document.getElementById("footerTotalAmount").value = masterTotalAmount.toFixed(2);

  datatableObj = $("#allSalePO").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });

}

function loadDataDropdown(selectName, results) {
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

  var table = $('#allSalePO').DataTable();
  switch (id) {
    case 'partyName': table.columns(3).search(dropdownValue).draw(); break;
    case 'brokerName': table.columns(4).search(dropdownValue).draw(); break;
  }
}

function viewSalePODetails(id) {
  var temp = id.split(":");
  billNumber = temp[0];
  sPNumber = temp[1];

  document.title = "View Sales P.O. Details - " + billNumber + " - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "View Sales P.O. Details - " + billNumber;

  document.getElementById("tabularViewOfAllFinishPurchase").hidden = true;
  document.getElementById("partyName").style.display = "none";
  document.getElementById("brokerName").style.display = "none";

  document.getElementById("viewSalePODetails").hidden = false;
  document.getElementById("editFinishPurchaseDetails").hidden = true;
  document.getElementById("backButton").hidden = false;
  loadDataInViewFormat(billNumber, sPNumber);
}

function editFinishPurchaseDetails(id) {
  var temp = id.split("Edit");
  document.getElementById("tabularViewOfAllFinishPurchase").hidden = true;
  // document.getElementById("searchText").style.display = "none";
  // document.getElementById("printButton").style.display = "none";
  // document.getElementById("editButton").style.display = "none";
  document.getElementById("viewSalePODetails").hidden = true;
  document.getElementById("editFinishPurchaseDetails").hidden = false;
  document.getElementById("backButton").hidden = false;
  document.getElementById("pageHeading").innerHTML = "Edit Grey Purchase Details - " + temp[0];
  loadDataInEditFormat(id);
}

