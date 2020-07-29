// var jsPDF = require("jspdf");
// require("jspdf-autotable");
var datatableObj;
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  document.title = "All Opening Stock Entries - Kalash Infotech";
  displayElement("waitingMessage", true);
  connection.query(
    "SELECT * from openingstock ORDER BY  oSNumber DESC",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInTable(results);
      displayElement("waitingMessage", false);
    }
  );
}

function loadValuesInTable(tableValues) {
  var t = "";
  var tableInstance = document.getElementById("stockTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";

  if (datatableObj) {
    datatableObj.fnClearTable();
    datatableObj.fnDraw();
    datatableObj.fnDestroy();
  }

  for (var i = 0; i < tableValues.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);

    if (tableValues[i] instanceof Array) {
    } else {
      newCell = document.createElement("td");
      newCell.id = "dateOfEntry" + i;
      newCell.textContent = tableValues[i].dateOfEntry;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "lotNo" + i;
      newCell.textContent = tableValues[i].lotNo;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "damage" + i;
      if (tableValues[i].isDamage == "true") newCell.textContent = "DAMAGE";
      else newCell.textContent = "FRESH";
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "qualityName" + i;
      newCell.textContent = tableValues[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "shade" + i;
      newCell.textContent = tableValues[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "color" + i;
      newCell.textContent = tableValues[i].color;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "qty" + i;
      if (parseFloat(tableValues[i].damageQty) > 0)
        newCell.textContent = tableValues[i].damageQty;
      else newCell.textContent = tableValues[i].qty;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "rollNo" + i;
      newCell.textContent = tableValues[i].rollNo;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("id", "deleteButton" + i);
      deleteButton.setAttribute("type", "image");
      deleteButton.setAttribute("title", "Delete");
      deleteButton.setAttribute("src", "../../../../assets/img/deleteld.png");
      deleteButton.setAttribute("class", "imageButton");
      deleteButton.setAttribute("onclick", "deleteRow(this)");
      newCell.appendChild(deleteButton);
      newRow.appendChild(newCell);

      if (localStorage.getItem("isAdmin") == 0) displayElement("deleteButton" + i, false)
      else if (localStorage.getItem("isAdmin") == 1) displayElement("deleteButton" + i, true)
    }
  }
  datatableObj = $("#stockTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });

}

function deleteRow(val) {
  alert("Delete Option only availble for Admin"); return;
  calculateQueryMasterRequest();
  var tempID = val.id.split("deleteButton");
  // console.log(tempID);
  var tabledateOfEntry = document.getElementById("dateOfEntry" + tempID[1]).innerHTML;
  var tablelotNo = document.getElementById("lotNo" + tempID[1]).innerHTML;
  var tabledamage = document.getElementById("damage" + tempID[1]).innerHTML;
  tabledamage = tabledamage.toUpperCase() == "DAMAGE" ? "true" : "false";

  var tablequalityName = document.getElementById("qualityName" + tempID[1]).innerHTML;
  var tableshade = document.getElementById("shade" + tempID[1]).innerHTML;
  var tablecolor = document.getElementById("color" + tempID[1]).innerHTML;
  var tableqty = document.getElementById("qty" + tempID[1]).innerHTML;
  var tablerollNo = document.getElementById("rollNo" + tempID[1]).innerHTML;


  if (confirm("Are you sure to delete Quality Name = " + tablequalityName + ", Shade = " + tableshade + ", Color = " + tablecolor + ", Roll No. = " + tablerollNo + ", Qty = " + tableqty + "mtr? ")) {
    //delete from opening stock entry
    connection.query(
      "DELETE from openingstock where dateOfEntry = '" +
      tabledateOfEntry +
      "' AND lotNo = '" +
      tablelotNo +
      "' AND isDamage = '" +
      tabledamage +
      "' AND qualityName = '" +
      tablequalityName +
      "' AND shade = '" +
      tableshade +
      "' AND color = '" +
      tablecolor +
      "' AND qty = '" +
      tableqty +
      "' AND rollNo = '" +
      tablerollNo +
      "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted(val);
      }
    );

    //delete/reduce the row from stock rows
    connection.query(
      "DELETE from stockrows where rollsSeries = '" +
      tablerollNo +
      "' AND lotNo = '" +
      tablelotNo +
      "' AND qualityName = '" +
      tablequalityName +
      "' AND shade = '" +
      tableshade +
      "' AND color = '" +
      tablecolor +
      "' AND qty = '" +
      tableqty +
      "' AND isDamage = '" +
      tabledamage +
      "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        checkIfWorkingCompleted(val);
      }
    );

    if (tabledamage == 'true') {
      tabledamage = tableqty;
      tableqty = 0;
    } else tabledamage = 0;

    //reduce the qty from stock master
    connection.query(
      "UPDATE stockmaster SET rolls = rolls - 1, qty = qty - " + tableqty +
      ", damage = damage - " + tabledamage + " WHERE qualityName ='" + tablequalityName + "';",
      function (err) {
        if (err) { alert(err + " : Tab - "); throw err; }
        queryMasterResponse += 1;
        // var row = val.parentNode;
        // row.parentNode.removeChild(row);
        checkIfWorkingCompleted(val);
      }
    );
  }
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  // delete row from openingstock table : add 1
  queryMasterRequest += 1;

  // delete row from stock rows table : add 1
  queryMasterRequest += 1;

  //updating stockmaster : add 1 for quality name
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function checkIfWorkingCompleted(val) {
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed");
    alert("Opening Stock Entry Deleted Successfully...");
    window.location.reload();
  }
  else {
    console.log("Pending");
    //document.getElementById(val.id).disabled = true;
  }
}