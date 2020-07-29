function loadValuesInTables() {
  document.title = "Utilities - Grey Purchase - Kalash Infotech";
  //fetch qualities from db
  // connection.query("SELECT * from yarnqualities ORDER BY qualityName", function (
  //   error,
  //   results,
  //   fields
  // ) {
  //   if (error) { alert(error + " : Tab - "); throw error; }
  //   loadValuesInQualityTable(results);
  // });
  loadValuesInTable(greyQuality, "qualityTableBody");
  //fetch shades from db
  // connection.query("SELECT * from yarnshades ORDER BY shade", function (
  //   error,
  //   results,
  //   fields
  // ) {
  //   if (error) { alert(error + " : Tab - "); throw error; }
  //   loadValuesInShadesTable(results);
  // });
  loadValuesInTable(greyShade, "shadeTableBody");

  loadValuesInTable(greyColor, "colorTableBody");

  //loadValuesInYarnPartyNameTable(yarnPartyNames);

  //loadValuesInDyeingNameTable(dyeingNames);
  loadValueInDropdown(states, 'states');
  loadValueInDropdown(deliveryCycle, 'deliveryCycle');

  loadCompaniesInTable(yarnPartyNames, "partyNameTableBody");
  loadCompaniesInTable(dyeingNames, "dyeingNameTableBody");
  loadCompaniesInTable(brokerNames, "brokerNameTableBody");
}

function loadValuesInTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow;
  tableInstance.innerHTML = "";
  var helper = "";

  if (tableName == "qualityTableBody") helper = "qualityName";
  else if (tableName == "shadeTableBody") helper = "shade";
  else if (tableName == "colorTableBody") helper = "color";

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
    } else {

      newCell = document.createElement("td");
      newCell.id = helper + i;
      switch (helper) {
        case 'qualityName': newCell.textContent = results[i].qualityName.toUpperCase();
          break;
        case 'shade': newCell.textContent = results[i].shade.toUpperCase();
          break;
        case 'color': newCell.textContent = results[i].color.toUpperCase();
          break;
      }
      newRow.appendChild(newCell);

      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("id", helper + "deleteButton" + i);
      deleteButton.setAttribute("type", "image");
      deleteButton.setAttribute("title", "Delete");
      deleteButton.setAttribute("src", "../../../assets/img/deleteld.png");
      deleteButton.setAttribute("class", "imageButton");
      deleteButton.setAttribute("onclick", "deleteRow(this)");
      newRow.appendChild(deleteButton);
    }
  }
}

function loadCompaniesInTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow;
  tableInstance.innerHTML = "";
  var helper = "";

  if (tableName == "partyNameTableBody") helper = "partyName";
  else if (tableName == "dyeingNameTableBody") helper = "partyName";
  else if (tableName == "brokerNameTableBody") helper = "brokerName";

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
    } else {
      newCell = document.createElement("td");
      newCell.id = helper + i;

      switch (helper) {
        case 'partyName': newCell.textContent = results[i].partyName.toUpperCase();
          break;
        case 'brokerName': newCell.textContent = results[i].brokerName.toUpperCase();
          break;
      }
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "GstNo" + i;
      newCell.textContent = results[i].gstNo.toUpperCase();
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = helper + "EmailId" + i;
      newCell.textContent = results[i].emailId;
      newRow.appendChild(newCell);

      if (helper != "brokerName") {
        newCell = document.createElement("td");
        newCell.id = helper + "DeliveryCycle" + i;
        newCell.textContent = results[i].cycle.toUpperCase();
        newRow.appendChild(newCell);
      }

      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("id", helper + "deleteButton" + i);
      deleteButton.setAttribute("type", "image");
      deleteButton.setAttribute("title", "Delete");
      deleteButton.setAttribute("src", "../../../assets/img/deleteld.png");
      deleteButton.setAttribute("class", "imageButton");
      deleteButton.setAttribute("onclick", "deleteRow(this)");
      newRow.appendChild(deleteButton);
    }
  }
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
      options.value = options.text = results[i].stateName;
    else if (selectName == "deliveryCycle")
      options.value = options.text = results[i].duration;
    theSelect.add(options);
  }
  return;
}

function checkIfValueExist(val, tableName) {
  var q = val.value.trim().toUpperCase();
  console.log(q, tableName);

  var table = document.getElementById(tableName);
  for (var r = 0, n = table.rows.length - 1; r < n; r++) {
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
      helper = "shadeNo";
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

  //add values to the quality table
  // connection.query(
  //   "Insert into yarnqualities VALUES ('" + qualityName + "','" + denier + "')",
  //   function (err, result) {
  //     if (err) { alert(err + " : Tab - "); throw err; }
  //     console.log(result);
  //     alert("New Quality Added!");
  //   }
  // );
  alert("New Value Added!");

  switch (tableName) {
    case 'qualityTableBody':
      greyQuality.push({ 'qualityName': tabTextBox });
      loadValuesInTable(greyQuality, "qualityTableBody");
      break;

    case 'shadeTableBody':
      greyShade.push({ 'shade': tabTextBox });
      loadValuesInTable(greyShade, "shadeTableBody");
      break;

    case 'colorTableBody':
      greyColor.push({ 'color': tabTextBox });
      loadValuesInTable(greyColor, "colorTableBody");
      break;
  }


  //loadValuesInTables();
  document.getElementById(helper).value = "";
  // document.getElementById("denier").value = "";
}

function deleteRow(val) {
  var tempID = val.id.split("deleteButton");
  console.log(tempID);
  var tabTextBox = document.getElementById(tempID[0] + tempID[1]).innerHTML;
  // var denName = document.getElementById("denier" + tempID[1]).value;

  if (confirm("Are you sure to DELETE " + tabTextBox + " ? ")) {
    // connection.query(
    //   "DELETE from yarnqualities where qualityName = '" +
    //   qualName +
    //   "' AND denier = '" +
    //   denName +
    //   "';",
    //   function (err, result) {
    //     if (err) { alert(err + " : Tab - "); throw err; }
    //     console.log(result);
    //   }
    // );
    var row = val.parentNode;
    row.parentNode.removeChild(row);
  }
}
