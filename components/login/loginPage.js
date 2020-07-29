const electron = require("electron");
const { ipcRenderer } = electron;
var userN = null;
var pass = null;
var variables = require("../common/pooldb");
var dbConnection = variables.dbconnection;
console.log(dbConnection, "Pool");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function checkLoginDetails() {
  if (validatePage() == 0) return;

  userN = document.getElementById("usrname").value;
  pass = document.getElementById("psword").value;
  displayElement("waitingMessageLogin", true);
  // document.getElementById("waitingMessageLogin").style.display = "block";
  dbConnection.query("SELECT * from logincredentials WHERE username = '" + userN + "' AND password ='" + pass + "';"
    , function (error, results) {
      if (error) {
        displayElement("serverFailure", true);
        alert("ERROR: Server is down. Please start the server PC and then restart the application." + "Table - logincredentials")
        throw error;
      } else displayElement("serverFailure", false);
      displayElement("waitingMessageLogin", false);
      checkIfUserExist(results);
    });
}

function validatePage() {
  if (document.getElementById("usrname").value.trim() === "") {
    document.getElementById("usrname").style.backgroundColor = "#ff6666";
    showErrorMessage("Please Enter Username", true);
    return 0;
  } else {
    document.getElementById("usrname").style.backgroundColor = "white";
    showErrorMessage("", false);
  }

  if (document.getElementById("psword").value.trim() === "") {
    document.getElementById("psword").style.backgroundColor = "#ff6666";
    showErrorMessage("Please Enter Password", true);
    return 0;
  } else {
    document.getElementById("psword").style.backgroundColor = "white";
    showErrorMessage("", false);
  }
  return 1;
}

// function checkIfUserExist(data) {
//   var i = 0;
//   for (i = 0; i < data.length; i++) {
//     if (data[i].username == userN && data[i].password == pass) {
//       //console.log("Matched");
//       break;
//     }
//   }
//   if (i < data.length) {
//     showErrorMessage("", false);
//     isadmin = data[i].isadmin;
//     alert("Login Successful!", "Kalash-Infotech");
//     ipcRenderer.send('SUCCESSFUL');
//   }
//   else {
//     //console.log("Nahi hua match");
//     showErrorMessage("Incorrect Login Credentials. Please Try Again", true);
//   }
// }

function showErrorMessage(message, visiblity) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").style.display = visiblity
    ? "block"
    : "none";
}
