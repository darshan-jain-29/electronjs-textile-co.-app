var partyName = "";
var gstNo = "";
var state = "";
var codeNo = "";
var email = "";
var address = "";
var shippingAddress = "";
var otherAddress = '';
var contactNumber = "";
var datatableObj;
var cType = '';
var queryMasterRequest = 1;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadValuesInTables(type, tableName) {
  document.title = "Utilities - Parties List - Kalash Infotech";
  displayElement("waitingMessage", true);
  if (tableName != "brokerNameTable")
    connection.query("SELECT * from states ORDER BY statename", function (
      error,
      results
    ) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValueInDropdown(results, "states");
    });

  if (tableName == "partyNameTable") cType = "parties";
  else if (tableName == "dyeingNameTable") cType = "dyeing";
  else if (tableName == "brokerNameTable") cType = "broker";
  else if (tableName == "transportNameTable") cType = "transport";

  loadParties(type, tableName);
}

function loadParties(type, tableName) {
  connection.query("SELECT * from partiesmaster where type = '" + type + "' ORDER BY partyName", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    loadCompaniesInTable(results, tableName);
    displayElement("waitingMessage", false);
  });
}

function loadCompaniesInTable(results, tableName) {
  var tableInstance = document.getElementById(tableName + "Body"),
    newRow;
  tableInstance.innerHTML = "";
  var helper = "";

  if (datatableObj) {
    datatableObj.fnClearTable();
    datatableObj.fnDraw();
    datatableObj.fnDestroy();
  }

  if (tableName == "partyNameTable") helper = "partyName";
  else if (tableName == "dyeingNameTable") helper = "dyeingName";
  else if (tableName == "brokerNameTable") helper = "brokerName";
  else if (tableName == "transportNameTable") helper = "transportName";

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
    } else {
      newCell = document.createElement("td");
      newCell.id = helper + i;
      newCell.textContent = results[i].partyName.toUpperCase();
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "GstNo" + i;
      newCell.textContent = results[i].gstNo.toUpperCase();
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "Address" + i;
      newCell.textContent = results[i].address ? results[i].address.toUpperCase() : '';
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "Address" + i;
      newCell.textContent = results[i].address2 ? results[i].address2.toUpperCase() : '';
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "Address" + i;
      newCell.textContent = results[i].address3 ? results[i].address3.toUpperCase() : '';
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "email" + i;
      newCell.textContent = results[i].email;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "ContactNumber" + i;
      newCell.textContent = results[i].contactNumber;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("id", helper + "deleteButton" + i);
      deleteButton.setAttribute("type", "image");
      deleteButton.setAttribute("title", "Delete");
      deleteButton.setAttribute("src", "../../../assets/img/deleteld.png");
      deleteButton.setAttribute("class", "imageButton");
      deleteButton.setAttribute("onclick", "deleteRow(this)");
      newCell.appendChild(deleteButton);
      newRow.appendChild(newCell);

      if (localStorage.getItem("isAdmin") == 0) displayElement(helper + "deleteButton" + i, false)
      else if (localStorage.getItem("isAdmin") == 1) displayElement(helper + "deleteButton" + i, true)
    }
  }
  datatableObj = $("#" + tableName).dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });

}

function loadValueInDropdown(results, selectName) {
  var theSelect = document.getElementById(selectName);
  theSelect.innerHTML = "";

  var options = theSelect.getElementsByTagName("option");
  for (var i = 0; i < options.length; i++) {
    if (options[i].value) {
      theSelect.removeChild(options[i]);
      i--;
    }
  }
  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "states") options.text = "Select State";
  else if (selectName == "deliveryCycle") options.text = "Delivery Cycle";
  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");
    //options.value = i;
    if (selectName == "states")
      options.value = options.text = results[i].statename;
    else if (selectName == "deliveryCycle")
      options.value = options.text = results[i].duration;
    theSelect.add(options);
  }
  return;
}

function checkIfPartyNameExist(tableName) {
  partyName = document.getElementById("partyName").value.trim().toUpperCase();

  var table = document.getElementById(tableName);
  for (var r = 0, n = table.rows.length - 1; r < n; r++) {
    var tabTextBox = table.rows[r].cells[0].innerHTML;

    if (tabTextBox === partyName) {
      document.getElementById("partyName").style.backgroundColor = "#ff6666";
      return true;
    } else document.getElementById("partyName").style.backgroundColor = "white";
  }
  return false;
}

function setHeaderData() {
  partyName = document.getElementById("partyName").value.trim().toUpperCase();
  gstNo = document.getElementById("gstNo").value.trim().toUpperCase();

  if (cType != 'broker') {
    var tempS = document.getElementById("states");
    state = tempS.options[tempS.selectedIndex].text.toUpperCase();
    codeNo = document.getElementById("codeNo").value.trim().toUpperCase();
  }

  email = document.getElementById("email").value.trim();

  address = document.getElementById("address").value.trim().toUpperCase();

  shippingAddress = document.getElementById("address2").value.trim().toUpperCase();
  otherAddress = document.getElementById("address3").value.trim().toUpperCase();

  contactNumber = document.getElementById("contactNumber").value.trim().toUpperCase();
}

function validations(tableName) {
  setHeaderData();
  if (checkIfPartyNameExist(tableName)) return 0;

  if (partyName === null || partyName === "") {
    document.getElementById("partyName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("partyName").style.backgroundColor = "white";

  if (cType != 'broker' || gstNo !== "") {
    if (gstNo === null || gstNo === "" || gstNo.length != 15) {
      document.getElementById("gstNo").style.backgroundColor = "#ff6666";
      return 0;
    } else document.getElementById("gstNo").style.backgroundColor = "white";
  }

  if (cType != 'broker') {
    if (state === null || state === "" || state == 'Select State') {
      document.getElementById("states").style.backgroundColor = "#ff6666";
      return 0;
    } else document.getElementById("states").style.backgroundColor = "white";

    // if (codeNo === null || codeNo === "") {
    //   document.getElementById("codeNo").style.backgroundColor = "#ff6666";
    //   return 0;
    // } else document.getElementById("codeNo").style.backgroundColor = "white";
  }

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (email !== "") {
    if (reg.test(email) == false) {
      //alert('Invalid Email Address');
      document.getElementById("email").style.backgroundColor = "#ff6666";
      return 0;
    } else document.getElementById("email").style.backgroundColor = "white";
    // document.getElementById("email").style.backgroundColor = "#ff6666";
    // return 0;
  } else document.getElementById("email").style.backgroundColor = "white";

  // if (address === null || address === "") {
  //   document.getElementById("address").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("address").style.backgroundColor = "white";

  // if (contactNumber === null || contactNumber === "") {
  //   document.getElementById("contactNumber").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("contactNumber").style.backgroundColor = "white";

  if (contactNumber != "" && (contactNumber.length != 10)) {
    document.getElementById("contactNumber").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("contactNumber").style.backgroundColor = "white";
}

function addPartyToDatabase(tableName) {
  if (validations(tableName) == 0) return;
  console.log("pass");

  alert("Adding New " + cType.toUpperCase() + ". Please Wait...");
  document.getElementById("addButton").disabled = true;

  if (cType == 'broker')
    state = codeNo = '';
  //add values to the parties table
  connection.query(
    "Insert into partiesmaster VALUES ('" +
    partyName + "','" +
    gstNo + "','" +
    state + "','" +
    codeNo + "','" +
    email + "','" +
    address + "','" +
    shippingAddress + "','" +
    otherAddress + "','" +
    contactNumber + "','" +
    cType + "')",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      console.log(result);
      queryMasterResponse += 1;
      checkIfWorkingCompleted(cType.toUpperCase());

    }
  );
}

function deleteRow(val) {
  var tempID = val.id.split("deleteButton");
  console.log(tempID);
  var tabPartyNametBox = document.getElementById(tempID[0] + tempID[1]).innerHTML;
  var tabGstNoBox = '';
  if (cType == 'parties') tabGstNoBox = document.getElementById("partyNameGstNo" + tempID[1]).innerHTML;
  else if (cType == 'dyeing') tabGstNoBox = document.getElementById("dyeingNameGstNo" + tempID[1]).innerHTML;
  else if (cType == 'broker') tabGstNoBox = document.getElementById("brokerNameGstNo" + tempID[1]).innerHTML;
  else if (cType == 'transport') tabGstNoBox = document.getElementById("transportNameGstNo" + tempID[1]).innerHTML;

  if (confirm("Are you sure to DELETE " + tabPartyNametBox + " ? ")) {
    connection.query(
      "DELETE from partiesmaster where partyName = '" +
      tabPartyNametBox +
      "' AND gstNo = '" +
      tabGstNoBox +
      "' AND type = '" +
      cType +
      "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        window.location.reload();
      }
    );
    // var row = val.parentNode;
    // row.parentNode.removeChild(row);
  }
}

function checkIfWorkingCompleted(categoryType) {
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed")
    alert("New " + categoryType.toUpperCase() + " Added!");
    window.location.reload();
  }
  else {
    console.log("Pending");
    document.getElementById("addButton").disabled = true;
  }
}