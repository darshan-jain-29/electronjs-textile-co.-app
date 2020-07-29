var queryMasterRequest = 1;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadValuesInTables() {
  document.title = "Utilities - Quality Name / Color / Shade - Kalash Infotech";
  displayElement("waitingMessage", true);
  //fetch qualities from db
  loadAllQualitiies();

  //fetch shades from db
  loadAllShades();

  //fetch colors from db
  loadAllColors();
}

function loadAllQualitiies() {
  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc where type='qualityName' ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadValuesInTable(results, "qualityTableBody");
  });
}

function loadAllShades() {
  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc where type='shade' ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadValuesInTable(results, "shadeTableBody");
  });
}

function loadAllColors() {
  connection.query("SELECT *, (name = '-') boolDash, (name = '0') boolZero, (name+0 > 0) boolNum FROM qsc where type='color' ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (name+0), name;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadValuesInTable(results, "colorTableBody");
    displayElement("waitingMessage", false);
  });
}

function loadValuesInTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow;
  tableInstance.innerHTML = "";

  var helper = tableName;

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
    } else {

      newCell = document.createElement("td");
      newCell.id = helper + i;
      newCell.textContent = results[i].name.toUpperCase();
      newRow.appendChild(newCell);

      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("id", helper + "deleteButton" + i);
      deleteButton.setAttribute("type", "image");
      deleteButton.setAttribute("title", "Delete");
      deleteButton.setAttribute("src", "../../../assets/img/deleteld.png");
      deleteButton.setAttribute("class", "imageButton");
      deleteButton.setAttribute("onclick", "deleteRow(this)");
      newRow.appendChild(deleteButton);

      if (localStorage.getItem("isAdmin") == 0) displayElement(helper + "deleteButton" + i, false)
      else if (localStorage.getItem("isAdmin") == 1) displayElement(helper + "deleteButton" + i, true)
    }
  }
}

function checkIfValueExist(val, tableName) {
  var q = val.value.trim().toUpperCase();
  // console.log(q, tableName);

  var table = document.getElementById(tableName);
  for (var r = 0, n = table.rows.length; r < n; r++) {
    var tabTextBox = table.rows[r].cells[0].innerHTML;

    if (tabTextBox === q) {
      val.style.backgroundColor =
        "#ff6666";
      return true;
    } else
      val.style.backgroundColor =
        "white";
  }
  return false;
}

function addValueToDatabase(val, tableName) {
  // check if quality name and the denier is not null
  var temp = val.id.split("addRow");
  var currentID = temp[1];
  var helper = "";
  switch (currentID) {
    case "Quality":
      helper = "qualityName";
      break;
    case "Shade":
      helper = "shade";
      break;
    case "Color":
      helper = "color";
      break;
  }

  var tabTextBox = document.getElementById(helper).value.trim();
  tabTextBox = tabTextBox.toUpperCase();

  if (tabTextBox === "" || tabTextBox === null) {
    document.getElementById(helper).style.backgroundColor = "#ff6666";
    return;
  } else document.getElementById(helper).style.backgroundColor = "white";

  // check if quality already exist or no
  if (checkIfValueExist(document.getElementById(helper), tableName)) {
    document.getElementById(helper).focus();
    alert(
      "Already Exist. You cannot add a duplicate entry. Please check."
    );
    return;
  }
  console.log(helper, tabTextBox);

  alert("Adding New " + helper.toUpperCase() + ". Please Wait...");
  document.getElementById(val.id).disabled = true;

  //add values to the quality table
  connection.query(
    "Insert into qsc VALUES ('" + tabTextBox + "','" + helper + "')",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      console.log(result);
      intermediate(helper, tabTextBox, val.id);
    }
  );
}

function deleteRow(val) {
  var tempID = val.id.split("deleteButton");

  var tabTextBox = document.getElementById(tempID[0] + tempID[1]).innerHTML;
  // var denName = document.getElementById("denier" + tempID[1]).value;

  var type = '';

  switch (tempID[0]) {
    case 'qualityTableBody': type = 'qualityName'; break;
    case 'shadeTableBody': type = 'shade'; break;
    case 'colorTableBody': type = 'color'; break;
  }
  console.log(tabTextBox, type);
  if (confirm("Are you sure to DELETE " + tabTextBox + " ? ")) {
    connection.query(
      "DELETE from qsc where name = '" +
      tabTextBox +
      "' AND type = '" +
      type +
      "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
        var row = val.parentNode;
        row.parentNode.removeChild(row);
      }
    );
  }
}

function intermediate(helper, tabTextBox, id) {
  switch (helper) {
    case 'qualityName':
      //add values to the quality table
      connection.query(
        "Insert into stockmaster VALUES ('" + tabTextBox + "', '0', '0', '0', '0')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          console.log(result);
        }
      );
      loadAllQualitiies();
      break;
    case 'shade': loadAllShades(); break;
    case 'color': loadAllColors(); break;
  }
  alert("New " + helper.toUpperCase() + " Added!");
  document.getElementById(id).disabled = false;
  document.getElementById(helper).value = "";
  document.getElementById(helper).focus();
}