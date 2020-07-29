var datatableObj;
var lastEditedRow = 1;
var dbOpeningStockValues = "";
var selectedQualityName = "";
var newQualityName = "";
var selectedShade = "";
var newShade = "";
var selectedColor = "";
var newColor = "";
var selectedCondition = "";
var newCondition = "";
var selectedRollNo = "";
var selectedLotNo = "";
var newLotNo = "";
var selectedQty = "";
var newQty = "";
var datatableObj;

function loadDataForEditInViewFormat() {
  displayElement("waitingMessage", true);
  clearModalFields();
  var queryString = "SELECT * from stockrows where qty > 0 order by qualityName";
  connection.query(queryString,
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      addDataInEditViewTable(results, "viewStockTableBody");
      displayElement("waitingMessage", false);
    }
  );
}

function clearModalFields() {
  document.getElementById("editModalQualityName").style.backgroundColor = "white";
  document.getElementById("editModalShade").style.backgroundColor = "white";
  document.getElementById("editModalColor").style.backgroundColor = "white";
  document.getElementById("editModalCondition").style.backgroundColor = "white";
  document.getElementById("editModalLotNo").style.backgroundColor = "white";
  document.getElementById("editModalQty").style.backgroundColor = "white";
}

function addDataInEditViewTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
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
      newCell.textContent = results[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].color;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].isDamage.toUpperCase() == "TRUE" ? "DAMAGE" : "FRESH";
      newRow.appendChild(newCell);
      if (results[i].isDamage.toUpperCase() == 'DAMAGE') newRow.style.backgroundColor = "#add8e6";
      else newRow.style.backgroundColor = "white";

      newCell = document.createElement("td");
      newCell.textContent = results[i].lotNo;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rollsSeries;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = parseFloat(results[i].qty).toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var viewButton = document.createElement("input");
      viewButton.setAttribute("type", "image");
      viewButton.setAttribute("title", "Edit");
      viewButton.setAttribute("class", "imageButton");
      viewButton.setAttribute("src", "../../../assets/img/editld.png");
      viewButton.setAttribute(
        "id",
        results[i].qualityName + ":" + results[i].shade + ":" + results[i].color + ":" + results[i].isDamage + ":" +
        results[i].lotNo + ":" + results[i].rollsSeries + ":" + results[i].qty + ":" + ":View"
      );
      viewButton.setAttribute("data-toggle", "modal");
      viewButton.setAttribute("data-target", "#stockEditDetails");
      viewButton.setAttribute("onclick", "loadModalEditStockData(this.id)");
      newCell.appendChild(viewButton);

      var addDeleteBox = document.createElement("input");
      addDeleteBox.setAttribute("id", results[i].qualityName + ":" + results[i].shade + ":" + results[i].color + ":" +
        results[i].isDamage + ":" + results[i].lotNo + ":" + results[i].rollsSeries + ":" + results[i].qty + ":" + ":Delete");
      addDeleteBox.setAttribute("type", "image");
      addDeleteBox.setAttribute("title", "Delete Product");
      addDeleteBox.setAttribute("src", "../../../assets/img/deleteld.png");
      addDeleteBox.setAttribute("class", "imageButton");
      addDeleteBox.setAttribute("onclick", "deleteProduct(this.id);");
      newCell.appendChild(addDeleteBox);

      newRow.appendChild(newCell);

    }
  }

  datatableObj = $("#viewStockTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });
}

function loadModalEditStockData(id) {
  loadDataDropdown('editModalQualityName', dropdownMaster);
  loadDataDropdown('editModalShade', dropdownMaster);
  loadDataDropdown('editModalColor', dropdownMaster);

  var tempID = id.split(":");
  console.log(id)

  selectedQualityName = tempID[0];
  selectFromDropdown("editModalQualityName", tempID[0].trim())

  tempID[1].trim() == '' ? selectFromDropdown("editModalShade", "SHADE") : selectFromDropdown('editModalShade', tempID[1].trim());
  selectedShade = tempID[1];

  tempID[2].trim() == '' ? selectFromDropdown("editModalColor", "COLOR") : selectFromDropdown('editModalColor', tempID[2].trim());
  selectedColor = tempID[2];

  var cond = tempID[3] == "true" ? "DAMAGE" : "FRESH";
  selectFromDropdown('editModalCondition', cond);
  selectedCondition = tempID[3];

  selectFromDropdown('editModalLotNo', tempID[4].trim());
  selectedLotNo = tempID[4];

  selectFromDropdown('editModalRollNo', tempID[5].trim());
  selectedRollNo = tempID[5];

  selectFromDropdown('editModalQty', tempID[6].trim());
  selectedQty = tempID[6];
}

function selectFromDropdown(id, value) {
  let element = document.getElementById(id);
  // console.log("value")
  if (value == "undefined") element.selectedIndex = 0;
  else element.value = value.toUpperCase();
}

function setModalHeaders() {
  var tempQ = document.getElementById("editModalQualityName");
  newQualityName = tempQ.options[tempQ.selectedIndex].text;

  var tempS = document.getElementById("editModalShade");
  newShade = tempS.options[tempS.selectedIndex].text;

  var tempC = document.getElementById("editModalColor");
  newColor = tempC.options[tempC.selectedIndex].text;

  var tempCond = document.getElementById("editModalCondition");
  newCondition = tempCond.options[tempCond.selectedIndex].text == "FRESH" ? 'false' : 'true';

  newLotNo = document.getElementById("editModalLotNo").value;
  newQty = document.getElementById("editModalQty").value;
}

function validateModal() {
  setModalHeaders();
  if (newQualityName.toUpperCase() === "QUALITY NAME" || newQualityName === "") {
    document.getElementById("editModalQualityName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalQualityName").style.backgroundColor = "white";

  if (newShade === "") {
    document.getElementById("editModalShade").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalShade").style.backgroundColor = "white";

  // if (newColor.toUpperCase() === "COLOR" || newColor === "") {
  if (newColor === "") {
    document.getElementById("editModalColor").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalColor").style.backgroundColor = "white";

  if (newCondition.toUpperCase() === "CONDITION" || newCondition === "") {
    document.getElementById("editModalCondition").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalCondition").style.backgroundColor = "white";

  if (newLotNo.trim() === "") {
    document.getElementById("editModalLotNo").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalLotNo").style.backgroundColor = "white";

  if (newQty.trim() === "" || parseFloat(newQty) <= 0) {
    document.getElementById("editModalQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("editModalQty").style.backgroundColor = "white";

  if (newShade == "SHADE") newShade = selectedShade;
  if (newColor == "COLOR") newColor = selectedColor;
  // if (newShade == "SHADE") newShade = selectedShade;
  return 1;
}

function minimumChange() {
  // console.log(newQualityName, selectedQualityName);
  // console.log(newShade, selectedShade);
  // console.log(newColor, selectedColor);
  // console.log(newCondition, selectedCondition);
  // console.log(newQty, selectedQty);
  if (newQualityName == selectedQualityName && newShade == selectedShade && newColor == selectedColor
    && newCondition == selectedCondition && newLotNo == selectedLotNo && newQty == selectedQty) {
    // console.log("in")
    return 0;
  }
  else return 1;
}

function updateStock() {
  if (validateModal() == 0) return;
  if (minimumChange() == 0) {
    errorMessageModal("No Changes Done", true);
    return;
  } else errorMessageModal("", true);

  prepareUpdateQuery();
}

function prepareUpdateQuery() {

  alert("Saving Changes. Please wait.");
  document.getElementById("updateButton").disabled = true;
  document.getElementById("closeButton").disabled = true;

  var myQuery = "UPDATE stockrows set ";
  if (newQualityName != selectedQualityName) myQuery += " qualityName = '" + newQualityName + "' ,";
  if (newShade != selectedShade) myQuery += " shade = '" + newShade + "' ,";
  if (newColor != selectedColor) myQuery += " color = '" + newColor + "' ,";
  if (newCondition != selectedCondition) myQuery += " isDamage = '" + newCondition + "' ,";
  if (newLotNo != selectedLotNo) myQuery += " lotNo = '" + newLotNo + "' ,";
  if (newQty != selectedQty) myQuery += " qty = '" + newQty + "' ,";

  myQuery = myQuery.slice(0, -1);

  myQuery += "where qualityName = '" + selectedQualityName + "' and " +
    "shade = '" + selectedShade + "' and " +
    "color = '" + selectedColor + "' and " +
    "isDamage = '" + selectedCondition + "' and " +
    "lotNo = '" + selectedLotNo + "' and " +
    "qty = '" + selectedQty + "' and " +
    "rollsSeries = '" + selectedRollNo + "' ";
  console.log(myQuery);

  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }

    displayElement("waitingMessage", false);
    alert("Changes Saved.")
    document.getElementById("updateButton").disabled = false;
    document.getElementById("closeButton").disabled = false;
    document.getElementById("closeModalButton").click();

    loadDataForEditInViewFormat();
  });
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product??")) {
    var tempID = id.split(":");

    selectedQualityName = tempID[0];
    selectedShade = tempID[1];
    selectedColor = tempID[2];
    selectedCondition = tempID[3];
    selectedLotNo = tempID[4];
    selectedRollNo = tempID[5];
    selectedQty = tempID[6];

    var myQuery = "delete from stockrows ";

    myQuery += "where qualityName = '" + selectedQualityName + "' and " +
      "shade = '" + selectedShade + "' and " +
      "color = '" + selectedColor + "' and " +
      "isDamage = '" + selectedCondition + "' and " +
      "lotNo = '" + selectedLotNo + "' and " +
      "qty = '" + selectedQty + "' and " +
      "rollsSeries = '" + selectedRollNo + "' ";

    console.log(myQuery);
    connection.query(myQuery, function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }

      displayElement("waitingMessage", false);
      alert("Deleted the product.")

      loadDataForEditInViewFormat();
    });
  }
}