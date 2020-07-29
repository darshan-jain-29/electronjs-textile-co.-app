
function prepareEditScreen(masterData, rowData) {

  connection.query(
    "SELECT * from programcard where designName = '" + designName + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      oldValue = document.getElementById("designName").value =
        results[0].designName;
      document.getElementById("dateOfCreation").value = formatDate(
        results[0].dateOfCreation
      );
      document.getElementById("reedCount").value = results[0].reedCount;
      document.getElementById("picks").value = results[0].picks;
      document.getElementById("reedSpace").value = results[0].reedSpace;
      document.getElementById("tapeLength").value = results[0].tapeLength;
      document.getElementById("warpTotalWt").value = results[0].totalWarpWt;
      document.getElementById("weftTotalWt").value = results[0].totalWeftWt;
      document.getElementById("totalNetWt").value = results[0].totalNetWt;
    }
  );

  connection.query(
    "SELECT * from programcardwarprowdata where designName = '" +
    designName +
    "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      addDataInEditTable(results, "warpTableBody");
    }
  );

  connection.query(
    "SELECT * from programcardweftrowdata where designName = '" +
    designName +
    "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      addDataInEditTable(results, "weftTableBody");
    }
  );
}

function addDataInEditTable(tableValues, tableName) {
  var tableInstance = document.getElementById(tableName);
  tableInstance.innerHTML = "";
  var head = "";
  if (tableName == "warpTableBody") head = "warp";
  else if (tableName == "weftTableBody") head = "weft";
  for (var i = 0; i < tableValues.length; i++) {
    var currentIndex = tableInstance.rows.length;
    var currentRow = tableInstance.insertRow(currentIndex);
    if (tableValues[i] instanceof Array) {
    } else {
      var qualityDropdown = document.createElement("select");
      qualityDropdown.setAttribute("id", head + "Quality" + currentIndex);
      qualityDropdown.setAttribute("class", "form-control inputProgramCard");
      qualityDropdown.setAttribute(
        "onchange",
        "loadDenier(this.id,this.value)"
      );

      var denierTextbox = document.createElement("input");
      denierTextbox.setAttribute("id", head + "Denier" + currentIndex);
      denierTextbox.setAttribute("type", "number");
      denierTextbox.setAttribute("class", "form-control inputProgramCard");
      denierTextbox.setAttribute("disabled", true);
      denierTextbox.setAttribute("value", tableValues[i].denier);

      var shadeNoDropdown = document.createElement("select");
      shadeNoDropdown.setAttribute("id", head + "Shade" + currentIndex);
      shadeNoDropdown.setAttribute("class", "form-control inputProgramCard");

      var colorDropdown = document.createElement("select");
      colorDropdown.setAttribute("id", head + "Color" + currentIndex);
      colorDropdown.setAttribute("class", "form-control inputProgramCard");

      var noOfEndsTextbox = document.createElement("input");
      noOfEndsTextbox.setAttribute("class", "form-control inputProgramCard");
      noOfEndsTextbox.setAttribute("type", "number");
      noOfEndsTextbox.setAttribute(
        "class",
        "form-control inputProgramCardWidth7em"
      );
      if (head == "warp") {
        noOfEndsTextbox.setAttribute("id", head + "noOfEnds" + currentIndex);
        noOfEndsTextbox.setAttribute("onchange", "findRowNetWt('warpTable')");
        noOfEndsTextbox.setAttribute("value", tableValues[i].noOfEnds);
      } else if (head == "weft") {
        noOfEndsTextbox.setAttribute("id", head + "noOfPicks" + currentIndex);
        noOfEndsTextbox.setAttribute("onchange", "findRowNetWt('weftTable')");
        noOfEndsTextbox.setAttribute("value", tableValues[i].noOfPicks);
      }

      var netRowWtTextbox = document.createElement("input");
      netRowWtTextbox.setAttribute("class", "form-control inputProgramCard");
      netRowWtTextbox.setAttribute("id", head + "netWt" + currentIndex);
      netRowWtTextbox.setAttribute(
        "class",
        "form-control inputProgramCardWidth7em"
      );
      netRowWtTextbox.setAttribute("disabled", true);
      netRowWtTextbox.setAttribute("type", "number");
      netRowWtTextbox.setAttribute("value", tableValues[i].netRowWt);

      if (head == "warp") head = "Warp";
      else if (head == "weft") head = "Weft";
      var addRowBox = document.createElement("input");
      addRowBox.setAttribute("type", "addButton" + head + currentIndex);
      addRowBox.setAttribute("type", "image");
      addRowBox.setAttribute("title", "Add Yarn");
      addRowBox.setAttribute("src", "../../../../assets/img/addld.png");
      addRowBox.setAttribute("class", "imageButton");
      addRowBox.setAttribute("onclick", "add" + head + "Row();");

      if (i !== 0) {
        var addDeleteBox = document.createElement("input");
        addDeleteBox.setAttribute("type", "deleteButton" + head + currentIndex);
        addDeleteBox.setAttribute("type", "image");
        addDeleteBox.setAttribute("title", "Delete Yarn");
        addDeleteBox.setAttribute("src", "../../../../assets/img/deleteld.png");
        addDeleteBox.setAttribute("class", "imageButton");
        addDeleteBox.setAttribute("onclick", "delete" + head + "Row( this);");
      }

      if (head == "Warp") head = "warp";
      else if (head == "Weft") head = "weft";

      var currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(qualityDropdown);

      currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(denierTextbox);

      currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(shadeNoDropdown);

      currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(colorDropdown);

      currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(noOfEndsTextbox);

      currentCell = currentRow.insertCell(-1);
      currentCell.appendChild(netRowWtTextbox);

      currentCell = currentRow.insertCell(-1);
      currentCell.setAttribute("class", "displayGrid")
      currentCell.appendChild(addRowBox);

      if (i !== 0) currentCell.appendChild(addDeleteBox);

      fetchQualitiesForDropdown(
        currentIndex,
        head + "Table",
        tableValues[i].qualityName
      );
      fetchShadeNoForDropdown(
        currentIndex,
        head + "Table",
        tableValues[i].shadeNo
      );
      fetchColorsForDropdown(
        currentIndex,
        head + "Table",
        tableValues[i].color
      );
    }
  }
}

function saveCardDetails() {
  setHeaderData();

  if (checkIfDesignNameExist(oldValue) == 0) return;

  if (validateHeaderData() == 0) return;

  if (checkTableContentIsNotEmpty(document.getElementById("warpTable")) == 0)
    return;

  if (checkTableContentIsNotEmpty(document.getElementById("weftTable")) == 0)
    return;

  if (totalNetWt == 0) {
    alert("Total Net Wt cannot be 0");
    return;
  }
  enableDisableEditButtons(true);
  // first delete the data and then add new data
  deleteCardDetails(designName, false);

  alert("Program Card Saved SUCCESSFULLY...Please wait...");

  setTimeout(function () {
    enableDisableEditButtons(false);
    // reset the page
    window.location.reload();
  }, 3000);
}

function deleteCardDetails(designName, showAlert) {
  enableDisableEditButtons(true);

  if (showAlert) {
    if (
      confirm(
        "Are you sure to DELETE the Program Card " + designName + " ? ",
        "Kalash Infotech"
      )
    ) {
      deleteData(designName, false);

      alert("Program Card Deleted SUCCESSFULLY...Please wait...");

      setTimeout(function () {
        window.location.reload();

        enableDisableEditButtons(false);
      }, 3000);
    }
  } else deleteData(designName, true);
}

function deleteData(designName, save) {
  // delete from parent table
  connection.query(
    "DELETE from programcard WHERE designName = '" + designName + "';",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      if (save) saveHeaderData();
    }
  );
  // delete warp row data
  connection.query(
    "DELETE from programcardwarprowdata WHERE designName = '" +
    designName +
    "';",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      if (save) saveTableDataInDb("warpTable");
    }
  );
  // delete weft row data
  connection.query(
    "DELETE from programcardweftrowdata WHERE designName = '" +
    designName +
    "';",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      if (save) saveTableDataInDb("weftTable");
    }
  );
}

function enableDisableEditButtons(suKaru) {
  document.getElementById("updateButton").disabled = suKaru;
  document.getElementById("deleteButton").disabled = suKaru;
}
