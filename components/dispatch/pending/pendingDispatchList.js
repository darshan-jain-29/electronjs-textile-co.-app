var datatableObj;
var billNumber = "";
var sPNumber = "";
var masterTotalQty = 0;
var masterTotalQtyDelivered = 0;
var masterTotalQtyPending = 0;
var selectingLotRow = '';
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  viewAllPendingDispatchList();
  displayElement("waitingMessage", true);
  connection.query(
    "SELECT * from salepomaster where status = 'PENDING' ORDER BY sPNumber desc",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInViewTable(results);
      displayElement("waitingMessage", false);
    }
  );
}

function viewAllPendingDispatchList() {
  document.title = "All Orders Pending for Dispatch - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Orders Pending for Dispatch";

  document.getElementById("tabularViewOfAllPendingDispatch").hidden = false;

  document.getElementById("viewPendingDispatchDetails").hidden = true;
  document.getElementById("editPendingDispatchDetails").hidden = true;
  document.getElementById("backButton").hidden = true;
}

function loadValuesInViewTable(results) {
  var tableInstance = document.getElementById("allPendingDispatchTableBody"),
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
      newCell.textContent = parseFloat(results[i].totalQty).toFixed(2);;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = parseFloat(results[i].totalQtyDelivered).toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var tablePendingQty = (parseFloat(results[i].totalQty) - parseFloat(results[i].totalQtyDelivered)).toFixed(2);
      newCell.textContent = tablePendingQty;
      newRow.appendChild(newCell);

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
      viewButton.setAttribute("value", "Dispatch");
      viewButton.setAttribute("onclick", "viewPendingDispatchDetails(id)");
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);

      masterTotalQty = parseFloat(masterTotalQty) + parseFloat(results[i].totalQty);
      masterTotalQtyDelivered = parseFloat(masterTotalQtyDelivered) + parseFloat(results[i].totalQtyDelivered);
      masterTotalQtyPending = parseFloat(masterTotalQtyPending) + parseFloat(tablePendingQty);
    }
  }
  document.getElementById("footerTotalQty").value = masterTotalQty.toFixed(2);
  document.getElementById("footerTotalQtyDelivered").value = masterTotalQtyDelivered.toFixed(2);
  document.getElementById("footerTotalQtyPending").value = masterTotalQtyPending.toFixed(2);

  datatableObj = $("#allPendingDispatchTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, 100, -1], [10, 25, 50, 75, 100, "All"]],
    "pageLength": 100,
    "aaSorting": []
  });

}

function viewPendingDispatchDetails(id) {
  var temp = id.split(":");

  billNumber = temp[0];
  sPNumber = temp[1];

  document.title = "View Pending Dispatch Details - " + temp[0] + " - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "View Pending Dispatch Details - " + temp[0];

  document.getElementById("tabularViewOfAllPendingDispatch").hidden = true;

  document.getElementById("viewPendingDispatchDetails").hidden = false;
  document.getElementById("editPendingDispatchDetails").hidden = true;
  document.getElementById("backButton").hidden = false;
  loadDataInViewFormat(billNumber, sPNumber, true);
}

function editPendingDispatchDetails(id) {
  var temp = id.split("Edit");
  document.getElementById("tabularViewOfAllPendingDispatch").hidden = true;
  document.getElementById("viewPendingDispatchDetails").hidden = true;
  document.getElementById("editPendingDispatchDetails").hidden = false;
  document.getElementById("backButton").hidden = false;
  document.getElementById("pageHeading").innerHTML = "Edit Pending Dispatch Details - " + temp[0];
  loadDataInEditFormat(id);
}

