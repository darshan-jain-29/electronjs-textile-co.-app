var tableData = null;
document.title = "Create & Edit Users - Kalash Infotech";

function checkCredentialsOfSuperUser() {
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
  if (
    document.getElementById("username").value.trim() != null &&
    document.getElementById("password").value.trim() != null
  ) {
    const usName = document.getElementById("username").value;
    const psWord = document.getElementById("password").value;
    var i = 0;
    for (i = 0; i < dbValues.length; i++) {
      if (
        usName == dbValues[i].username &&
        psWord == dbValues[i].password &&
        dbValues[i].caneditmaster == "YES"
      ) {
        console.log("Matched");
        break;
      }
    }
    if (i < dbValues.length) {
      document.getElementById("errorMessage").hidden = true;
      document.getElementById("superUserDetailsForm").hidden = true;
      document.getElementById("userDetailsDiv").hidden = false;
      loadUserCredentials();
    } else {
      console.log("Nahi hua match");
      document.getElementById("errorMessage").style.display = "block";
    }
  }
}

function loadUserCredentials() {
  connection.query("SELECT * from logincredentials", function (
    error,
    results,
    fields
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    tableData = results;
    loadValuesInTable(results);
  });
}

function clearValuesInForm() {
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
}

function loadValuesInTable(results) {
  var t = "";
  var tableInstance = document.getElementById("userTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";

  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      console.log("andar aaya?");
    } else {
      newCell = document.createElement("td");
      newCell.textContent = results[i].username;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].password;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].caneditmaster;
      newRow.appendChild(newCell);

      newCell = document.createElement("input");
      newCell.setAttribute("id", "deleteButton" + i);
      newCell.setAttribute("type", "image");
      newCell.setAttribute("title", "Delete");
      newCell.setAttribute("src", "/assets/img/deleteld.png");
      newCell.setAttribute("class", "imageButton");
      newCell.setAttribute("onclick", "deleteRow(this)");
      newRow.appendChild(newCell);
    }
  }
}

function validatePage() {
  if (
    document.getElementById("newUsername").value == null ||
    document.getElementById("newUsername").value == ""
  ) {
    document.getElementById("newUsername").style.backgroundColor = "red";
    return 0;
  } else
    document.getElementById("newUsername").style.backgroundColor =
      "transparent";

  if (
    document.getElementById("newPassword").value == null ||
    document.getElementById("newPassword").value == ""
  ) {
    document.getElementById("newPassword").style.backgroundColor = "red";
    return 0;
  } else
    document.getElementById("newPassword").style.backgroundColor =
      "transparent";

  if (document.getElementById("editStatus").selectedIndex <= 0) {
    document.getElementById("editStatus").style.backgroundColor = "red";
    return 0;
  } else
    document.getElementById("editStatus").style.backgroundColor = "transparent";
}

function addValuesToDatabase() {
  if (validatePage() == 0) {
    return;
  }

  var usN = document.getElementById("newUsername").value.trim();
  var pass = document.getElementById("newPassword").value.trim();

  var tempD = document.getElementById("editStatus");
  var edS = tempD.options[tempD.selectedIndex].text.trim();

  connection.query(
    "Insert into logincredentials VALUES ('" +
    usN +
    "','" +
    pass +
    "','" +
    edS +
    "')",
    function (err, result) {
      if (err) { alert(err, 'logincredentials'); throw err; }
      console.log(result);
    }
  );
  loadUserCredentials();
}

function deleteRow(id) {
  var parEle = id.parentNode.childNodes;
  var userN = parEle[0].innerHTML;
  var pass = parEle[1].innerHTML;
  var editS = parEle[2].innerHTML;
  //console.log(userN, pass, editS);

  if ((userN != "admin" && pass != "admin@123") || editS != "YES") {
    if (confirm("Are you sure to DELETE the user " + userN + " ? ", "P-IT")) {
      connection.query(
        "DELETE from logincredentials WHERE userName = '" +
        userN +
        "' AND password ='" +
        pass +
        "' AND caneditmaster ='" +
        editS +
        "';",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          console.log(result);
        }
      );

      // var row = id.parentNode.parentNode;
      // row.parentNode.removeChild(row);
      loadUserCredentials();
    }
  } else alert("You cannot delete ADMIN user");
}

function checkIfUserExist() {
  var newUser = document.getElementById("newUsername").value.trim();
  for (var i = 0; i < tableData.length; i++) {
    if (tableData[i].username == newUser) {
      document.getElementById("newUsername").style.backgroundColor = "#ff6666";
      document.getElementById("addRow").disabled = true;
      addRow;
      break;
    } else {
      document.getElementById("newUsername").style.backgroundColor = "white";
      document.getElementById("addRow").disabled = false;
    }
  }
}
