document.title = "Edit Stock Master- Kalash Infotech";
function checkCredentialsOfAdmin() {
  var dbValues = null;
  connection.query("SELECT * from logincredentials", function (
    error,
    results,
    fields
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    furtherCheck(results);
  });
}

function furtherCheck(dbValues) {
  document.getElementById("errorMessage").hidden = true;
  if (
    document.getElementById("username").value.trim() != null &&
    document.getElementById("password").value.trim() != null
  ) {
    const usName = document.getElementById("username").value;
    const psWord = document.getElementById("password").value;
    var i = 0;
    console.log(usName, psWord, dbValues);
    for (i = 0; i < dbValues.length; i++) {
      if (
        usName == dbValues[i].username &&
        psWord == dbValues[i].password &&
        dbValues[i].caneditmaster == "YES"
      ) {
        //console.log("Matched");
        break;
      }
    }
    if (i < dbValues.length) {
      document.getElementById("errorMessage").hidden = true;
      document.getElementById("adminDetailsForm").hidden = true;
      document.getElementById("myInput").style.display = "block";
      document.getElementById("stockDataDiv").hidden = false;
      alert("Login Successful");
      loadData();
    } else {
      //console.log("Nahi hua match");
      document.getElementById("errorMessage").hidden = false;
    }
  }
}

function loadData() {
  connection.query(
    "SELECT * from stockmaster ORDER BY qualityName, shadeNo",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInTable(results);
    }
  );
}

function loadValuesInTable(results) {
  var t = "";
  var tableInstance = document.getElementById("stockMasterTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
    } else {
      var qualityNameBox = document.createElement("input");
      qualityNameBox.setAttribute("id", "qualityName" + i);
      qualityNameBox.setAttribute("class", "form-control blackText");
      qualityNameBox.setAttribute("value", results[i].qualityName);
      qualityNameBox.setAttribute("disabled", "true");

      var shadeNoBox = document.createElement("input");
      shadeNoBox.setAttribute("id", "shadeNo" + i);
      shadeNoBox.setAttribute("class", "form-control blackText");
      shadeNoBox.setAttribute("value", results[i].shadeNo);
      shadeNoBox.setAttribute("disabled", "true");

      var inProductionBox = document.createElement("input");
      inProductionBox.setAttribute("type", "number");
      inProductionBox.setAttribute("id", "inProduction" + i);
      inProductionBox.setAttribute("class", "form-control blackText");
      inProductionBox.setAttribute("value", results[i].inProduction);
      inProductionBox.setAttribute("onfocus", "this.oldvalue = this.value");
      inProductionBox.setAttribute(
        "onchange",
        "onProductionChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].inProduction) < 0)
        inProductionBox.setAttribute("style", "background-color: #ff6666;");

      var inDyeingBox = document.createElement("input");
      inDyeingBox.setAttribute("type", "number");
      inDyeingBox.setAttribute("id", "inDyeing" + i);
      inDyeingBox.setAttribute("class", "form-control blackText");
      inDyeingBox.setAttribute("value", results[i].inDyeing);
      inDyeingBox.setAttribute("onfocus", "this.oldvalue = this.value");
      inDyeingBox.setAttribute(
        "onchange",
        "onDyeingChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].inDyeing) < 0)
        inDyeingBox.setAttribute("style", "background-color: #ff6666;");

      var finishPcsBox = document.createElement("input");
      finishPcsBox.setAttribute("type", "number");
      finishPcsBox.setAttribute("id", "pcsFinish" + i);
      finishPcsBox.setAttribute("class", "form-control blackText");
      finishPcsBox.setAttribute("value", results[i].pcsFinish);
      finishPcsBox.setAttribute("onfocus", "this.oldvalue = this.value");
      finishPcsBox.setAttribute(
        "onchange",
        "onFinishPcsChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].pcsFinish) < 0)
        finishPcsBox.setAttribute("style", "background-color: #ff6666;");

      var finishStockBox = document.createElement("input");
      finishStockBox.setAttribute("id", "finishQty" + i);
      finishStockBox.setAttribute("type", "number");
      finishStockBox.setAttribute("class", "form-control blackText");
      finishStockBox.setAttribute("onfocus", "this.oldvalue = this.value");
      finishStockBox.setAttribute("value", results[i].qty);
      finishStockBox.setAttribute(
        "onchange",
        "onFinishStockChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].qty) < 0)
        finishStockBox.setAttribute("style", "background-color: #ff6666;");

      var deleteButtonBox = document.createElement("input");
      deleteButtonBox.setAttribute("id", "deleteButton" + i);
      deleteButtonBox.setAttribute("type", "image");
      deleteButtonBox.setAttribute("title", "Delete");
      deleteButtonBox.setAttribute("src", "/assets/img/deleteld.png");
      deleteButtonBox.setAttribute("class", "imageButton");
      deleteButtonBox.setAttribute("onclick", "deleteRow(this)");

      var currentCell = newRow.insertCell(-1);
      currentCell.appendChild(qualityNameBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(shadeNoBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(inProductionBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(inDyeingBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(finishPcsBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(finishStockBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(deleteButtonBox);
    }
  }
}

function resetErrorMessage() {
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
  document.getElementById("errorMessage").hidden = true;
}

function searchInTable() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("stockMasterTableBody");
  tr = table.getElementsByTagName("tr");
  var i = null;

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    for (j = 0; j <= 5; j++) {
      td = tr[i].getElementsByTagName("td")[j];
      //console.log(td);
      if (td) {
        if (
          td
            .getElementsByTagName("input")[0]
            .value.toUpperCase()
            .indexOf(filter) > -1
        ) {
          tr[i].style.display = "";
          printDisableCounter = 1;
          break;
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

function getrowData(id) {
  var data = [];
  data.push(document.getElementById("qualityName" + id).value);
  data.push(document.getElementById("shadeNo" + id).value);
  data.push(document.getElementById("inProduction" + id).value);
  data.push(document.getElementById("inDyeing" + id).value);
  data.push(document.getElementById("pcsFinish" + id).value);
  data.push(document.getElementById("finishQty" + id).value);
  return data;
}

function resetColorOfThePage() {
  var table = document.getElementById("stockMasterTableBody");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (
      table.rows[r].cells[2].children[0].value.trim() == "" ||
      parseFloat(table.rows[r].cells[2].children[0].value) < 0
    ) {
      table.rows[r].cells[2].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[2].children[0].style.backgroundColor = "white";

    if (
      table.rows[r].cells[3].children[0].value.trim() == "" ||
      parseFloat(table.rows[r].cells[3].children[0].value) < 0
    ) {
      table.rows[r].cells[3].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[3].children[0].style.backgroundColor = "white";

    if (
      table.rows[r].cells[4].children[0].value.trim() == "" ||
      parseFloat(table.rows[r].cells[4].children[0].value) < 0
    ) {
      table.rows[r].cells[4].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[4].children[0].style.backgroundColor = "white";

    if (
      table.rows[r].cells[5].children[0].value.trim() == "" ||
      parseFloat(table.rows[r].cells[5].children[0].value) < 0
    ) {
      table.rows[r].cells[5].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[5].children[0].style.backgroundColor = "white";
  }
}

function onProductionChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("inProduction");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[2]).toFixed(2);
    if (
      confirm(
        "Are you sure to update In Production Qty from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      var myQuery =
        "UPDATE stockmaster set inProduction = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND shadeNo = '" +
        rowData[1] +
        "' AND inDyeing = '" +
        rowData[3] +
        "'  AND pcsFinish = '" +
        rowData[4] +
        "'  AND  qty= '" +
        rowData[5] +
        "';";
      console.log(myQuery);
      connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
        document.getElementById(val.id).style.backgroundColor = "lightgreen";
      });
    }
  } else {
    document.getElementById("inProdution" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function onDyeingChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("inDyeing");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[3]).toFixed(2);
    if (
      confirm(
        "Are you sure to update In Dyeing Qty from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      var myQuery =
        "UPDATE stockmaster set inDyeing = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND shadeNo = '" +
        rowData[1] +
        "' AND inProduction = '" +
        rowData[2] +
        "'  AND pcsFinish = '" +
        rowData[4] +
        "'  AND  qty= '" +
        rowData[5] +
        "';";
      connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
        document.getElementById(val.id).style.backgroundColor = "lightgreen";
      });
    }
  } else {
    document.getElementById("inDyeing" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function onFinishPcsChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("pcsFinish");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[4]).toFixed(2);
    if (
      confirm(
        "Are you sure to update Finish Pcs Qty from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      var myQuery =
        "UPDATE stockmaster set pcsFinish = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND shadeNo = '" +
        rowData[1] +
        "' AND inProduction = '" +
        rowData[2] +
        "'  AND inDyeing = '" +
        rowData[3] +
        "'  AND  qty= '" +
        rowData[5] +
        "';";
      connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
        document.getElementById(val.id).style.backgroundColor = "lightgreen";
      });
    }
  } else {
    document.getElementById("pcsFinish" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function onFinishPcsChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("finishQty");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[5]).toFixed(2);
    if (
      confirm(
        "Are you sure to update Finish Qty from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      var myQuery =
        "UPDATE stockmaster set qty = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND shadeNo = '" +
        rowData[1] +
        "' AND inProduction = '" +
        rowData[2] +
        "'  AND inDyeing = '" +
        rowData[3] +
        "'  AND  pcsFinish= '" +
        rowData[4] +
        "';";
      connection.query(myQuery, function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
        document.getElementById(val.id).style.backgroundColor = "lightgreen";
      });
    }
  } else {
    document.getElementById("finishQty" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function deleteRow(val) {
  resetColorOfThePage();
  var tempID = val.id.split("deleteButton");
  var rowData = getrowData(tempID[1]);
  if (
    confirm("Are you sure to DELETE " + rowData[0] + " - " + rowData[1] + " ? ")
  ) {
    connection.query(
      "DELETE from stockmaster where qualityName = '" +
      rowData[0] +
      "' AND shadeNo = '" +
      rowData[1] +
      "' AND inProduction = '" +
      rowData[2] +
      "' AND inDyeing = '" +
      rowData[3] +
      "' AND  pcsFinish= '" +
      rowData[4] +
      "' AND qty = '" +
      rowData[5] +
      "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
        console.log(result);
      }
    );
    var row = val.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
}
