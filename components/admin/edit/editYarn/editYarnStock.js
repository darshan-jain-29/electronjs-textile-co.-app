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
    "SELECT * from yarnstock ORDER BY qualityName, denier, shadeNo, color, challanNo, lotNo;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInTable(results);
    }
  );
}

function loadValuesInTable(results) {
  var t = "";
  var tableInstance = document.getElementById("yarnStockTableBody"),
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
      qualityNameBox.setAttribute("class", "form-control blackText ");
      qualityNameBox.setAttribute("value", results[i].qualityName);
      qualityNameBox.setAttribute("disabled", "true");

      var denierBox = document.createElement("input");
      denierBox.setAttribute("id", "denier" + i);
      denierBox.setAttribute("class", "form-control blackText");
      denierBox.setAttribute("value", results[i].denier);
      denierBox.setAttribute("disabled", "true");

      var shadeNoBox = document.createElement("input");
      shadeNoBox.setAttribute("id", "shadeNo" + i);
      shadeNoBox.setAttribute("class", "form-control blackText");
      shadeNoBox.setAttribute("value", results[i].shadeNo);
      shadeNoBox.setAttribute("disabled", "true");

      var colorBox = document.createElement("input");
      colorBox.setAttribute("id", "color" + i);
      colorBox.setAttribute("class", "form-control blackText");
      colorBox.setAttribute("value", results[i].color);
      colorBox.setAttribute("disabled", "true");

      var challanNoBox = document.createElement("input");
      challanNoBox.setAttribute("type", "number");
      challanNoBox.setAttribute("id", "challanNo" + i);
      challanNoBox.setAttribute("class", "form-control blackText");
      challanNoBox.setAttribute("value", results[i].challanNo);
      challanNoBox.setAttribute("onfocus", "this.oldvalue = this.value");
      challanNoBox.setAttribute(
        "onchange",
        "onChallanNoChange(this); this.oldvalue = this.value"
      );

      var lotNoBox = document.createElement("input");
      lotNoBox.setAttribute("type", "text");
      lotNoBox.setAttribute("id", "lotNo" + i);
      lotNoBox.setAttribute("class", "form-control blackText");
      lotNoBox.setAttribute("value", results[i].lotNo);
      lotNoBox.setAttribute("onfocus", "this.oldvalue = this.value");
      lotNoBox.setAttribute(
        "onchange",
        "onLotNoChange(this); this.oldvalue = this.value"
      );

      var noOfConesBox = document.createElement("input");
      noOfConesBox.setAttribute("type", "number");
      noOfConesBox.setAttribute("id", "noOfCones" + i);
      noOfConesBox.setAttribute("class", "form-control blackText");
      noOfConesBox.setAttribute("value", results[i].noOfCones);
      noOfConesBox.setAttribute("onfocus", "this.oldvalue = this.value");
      noOfConesBox.setAttribute(
        "onchange",
        "onNoOfConesChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].noOfCones) < 0)
        noOfConesBox.setAttribute("style", "background-color: #ff6666;");

      var netWtBox = document.createElement("input");
      netWtBox.setAttribute("id", "netWt" + i);
      netWtBox.setAttribute("type", "number");
      netWtBox.setAttribute("class", "form-control blackText");
      netWtBox.setAttribute("onfocus", "this.oldvalue = this.value");
      netWtBox.setAttribute("value", results[i].netWt);
      netWtBox.setAttribute(
        "onchange",
        "newWtChange(this); this.oldvalue = this.value"
      );
      if (parseFloat(results[i].netWt) < 0)
        netWtBox.setAttribute("style", "background-color: #ff6666;");

      var boxWtBox = document.createElement("input");
      boxWtBox.setAttribute("id", "boxNo" + i);
      boxWtBox.setAttribute("type", "text");
      boxWtBox.setAttribute("class", "form-control blackText");
      boxWtBox.setAttribute("value", results[i].boxNo);
      boxWtBox.setAttribute("onfocus", "this.oldvalue = this.value");
      boxWtBox.setAttribute(
        "onchange",
        "boxNoChange(this); this.oldvalue = this.value"
      );

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
      currentCell.appendChild(denierBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(shadeNoBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(colorBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(challanNoBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(lotNoBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(noOfConesBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(netWtBox);

      currentCell = newRow.insertCell(-1);
      currentCell.appendChild(boxWtBox);

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
  table = document.getElementById("yarnStockTableBody");
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

function onChallanNoChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("challanNo");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    if (
      confirm(
        "Are you sure to update challan no from " +
        val.oldvalue +
        " to " +
        rowData[4] +
        " ? "
      )
    ) {
      connection.query(
        "UPDATE yarnstock set challanNo = '" +
        rowData[4] +
        "' where qualityName = '" +
        rowData[0] +
        "' AND denier = '" +
        rowData[1] +
        "'  AND shadeNo = '" +
        rowData[2] +
        "' AND color = '" +
        rowData[3] +
        "'  AND lotNo = '" +
        rowData[5] +
        "'  AND noOfCones = '" +
        rowData[6] +
        "'  AND netWt = '" +
        rowData[7] +
        "'  AND boxNo = '" +
        rowData[8] +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          document.getElementById(val.id).style.backgroundColor = "lightgreen";
        }
      );
    }
  } else {
    document.getElementById("challanNo" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function onLotNoChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("lotNo");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    if (
      confirm(
        "Are you sure to update Lot No. from " +
        val.oldvalue +
        " to " +
        rowData[5] +
        " ? "
      )
    ) {
      connection.query(
        "UPDATE yarnstock set lotNo = '" +
        rowData[5] +
        "' where qualityName = '" +
        rowData[0] +
        "' AND denier = '" +
        rowData[1] +
        "'  AND shadeNo = '" +
        rowData[2] +
        "' AND color = '" +
        rowData[3] +
        "'  AND challanNo = '" +
        rowData[4] +
        "'  AND noOfCones = '" +
        rowData[6] +
        "'  AND netWt = '" +
        rowData[7] +
        "'  AND boxNo = '" +
        rowData[8] +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          document.getElementById(val.id).style.backgroundColor = "lightgreen";
        }
      );
    }
  } else {
    document.getElementById("lotNo" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function onNoOfConesChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("noOfCones");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[6]).toFixed(2);
    if (
      confirm(
        "Are you sure to update No. of Cones from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      connection.query(
        "UPDATE yarnstock set noOfCones = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND denier = '" +
        rowData[1] +
        "'  AND shadeNo = '" +
        rowData[2] +
        "' AND color = '" +
        rowData[3] +
        "'  AND challanNo = '" +
        rowData[4] +
        "'  AND lotNo = '" +
        rowData[5] +
        "'  AND netWt = '" +
        rowData[7] +
        "'  AND boxNo = '" +
        rowData[8] +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          document.getElementById(val.id).style.backgroundColor = "lightgreen";
        }
      );
    }
  } else {
    document.getElementById("noOfCones" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function newWtChange(val) {
  resetColorOfThePage();
  var tempID = val.id.split("netWt");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    var finalData = parseFloat(rowData[7]).toFixed(2);
    if (
      confirm(
        "Are you sure to update Net Wt. from " +
        val.oldvalue +
        " to " +
        finalData +
        " ? "
      )
    ) {
      connection.query(
        "UPDATE yarnstock set netWt = '" +
        finalData +
        "' where qualityName = '" +
        rowData[0] +
        "' AND denier = '" +
        rowData[1] +
        "'  AND shadeNo = '" +
        rowData[2] +
        "' AND color = '" +
        rowData[3] +
        "'  AND challanNo = '" +
        rowData[4] +
        "'  AND lotNo = '" +
        rowData[5] +
        "'  AND noOfCones = '" +
        rowData[6] +
        "'  AND boxNo = '" +
        rowData[8] +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          document.getElementById(val.id).style.backgroundColor = "lightgreen";
        }
      );
    }
  } else {
    document.getElementById("netWt" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function boxNoChange(val) {
  console.log(val.oldvalue);
  resetColorOfThePage();
  var tempID = val.id.split("boxNo");
  if (val.value.trim()) {
    var rowData = getrowData(tempID[1]);
    if (
      confirm(
        "Are you sure to update Box No. from " +
        val.oldvalue +
        " to " +
        rowData[8] +
        " ? "
      )
    ) {
      connection.query(
        "UPDATE yarnstock set boxNo = '" +
        rowData[8] +
        "' where qualityName = '" +
        rowData[0] +
        "' AND denier = '" +
        rowData[1] +
        "'  AND shadeNo = '" +
        rowData[2] +
        "' AND color = '" +
        rowData[3] +
        "'  AND challanNo = '" +
        rowData[4] +
        "'  AND lotNo = '" +
        rowData[5] +
        "'  AND noOfCones = '" +
        rowData[6] +
        "'  AND netWt = '" +
        rowData[7] +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          document.getElementById(val.id).style.backgroundColor = "lightgreen";
        }
      );
    }
  } else {
    document.getElementById("boxNo" + tempID[1]).value = val.oldvalue;
    document.getElementById(val.id).style.backgroundColor = "#ff6666";
  }
}

function getrowData(id) {
  var data = [];
  data.push(document.getElementById("qualityName" + id).value);
  data.push(document.getElementById("denier" + id).value);
  data.push(document.getElementById("shadeNo" + id).value);
  data.push(document.getElementById("color" + id).value);
  data.push(document.getElementById("challanNo" + id).value);
  data.push(document.getElementById("lotNo" + id).value);
  data.push(document.getElementById("noOfCones" + id).value);
  data.push(document.getElementById("netWt" + id).value);
  data.push(document.getElementById("boxNo" + id).value);
  return data;
}

function deleteRow(val) {
  resetColorOfThePage();
  var tempID = val.id.split("deleteButton");
  var rowData = getrowData(tempID[1]);
  if (
    confirm(
      "Are you sure to DELETE " +
      rowData[0] +
      " - " +
      rowData[1] +
      " - " +
      rowData[2] +
      " - " +
      rowData[3] +
      " ? "
    )
  ) {
    connection.query(
      "DELETE from yarnstock where qualityName = '" +
      rowData[0] +
      "' AND denier = '" +
      rowData[1] +
      "'  AND shadeNo = '" +
      rowData[2] +
      "' AND color = '" +
      rowData[3] +
      "'  AND challanNo = '" +
      rowData[4] +
      "'  AND lotNo = '" +
      rowData[5] +
      "'  AND noOfCones = '" +
      rowData[6] +
      "'  AND netWt = '" +
      rowData[7] +
      "'  AND boxNo = '" +
      rowData[8] +
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

function resetColorOfThePage() {
  var table = document.getElementById("yarnStockTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[4].children[0].value.trim() == "") {
      table.rows[r].cells[4].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[4].children[0].style.backgroundColor = "white";

    if (table.rows[r].cells[5].children[0].value.trim() == "") {
      table.rows[r].cells[5].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[5].children[0].style.backgroundColor = "white";

    if (parseFloat(table.rows[r].cells[6].children[0].value) < 0) {
      table.rows[r].cells[6].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[6].children[0].style.backgroundColor = "white";

    if (parseFloat(table.rows[r].cells[7].children[0].value) < 0) {
      table.rows[r].cells[7].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[7].children[0].style.backgroundColor = "white";

    if (table.rows[r].cells[8].children[0].value.trim() == "") {
      table.rows[r].cells[8].children[0].style.backgroundColor = "#ff6666";
    } else table.rows[r].cells[8].children[0].style.backgroundColor = "white";
  }
}
