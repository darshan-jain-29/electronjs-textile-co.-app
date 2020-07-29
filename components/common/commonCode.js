var dbValues = null;
var mysql = require("mysql");
var fs = require("fs");
// NodePdfPrinter.listPrinter(); // printer object
var allParties = [];
var partyGst = [];

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function formatDate(date) {
  var tempD = date.split("-");
  return tempD[2] + "-" + tempD[1] + "-" + tempD[0];
}

function checkIfUserExist(data) {
  var i = 0;
  for (i = 0; i < data.length; i++) {
    if (data[i].username == userN && data[i].password == pass) {
      //console.log("Matched");
      break;
    }
  }
  if (i < data.length) {
    showErrorMessage("", false);
    console.log(data[i].isadmin);
    localStorage.setItem("isAdmin", data[i].isadmin);
    console.log(localStorage.getItem("isAdmin"));
    alert("Login Successful!", "Kalash-Infotech");
    ipcRenderer.send('SUCCESSFUL');
  }
  else {
    //console.log("Nahi hua match");
    showErrorMessage("Incorrect Login Credentials. Please Try Again", true);
  }
}

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

function displayElement(id, show) {
  if (show)
    document.getElementById(id).style.display = "initial";
  else document.getElementById(id).style.display = "none";
}

function fetchAdminFlag() {
  return isAdmin;
}

function fetchAddresses(conn) {
  // console.log(conn)
  conn.query("SELECT * from partiesmaster ORDER BY partyName", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    allParties = results;
    // console.log(allParties, "CALLED");
    // return allParties;
  });
}

function fetchPartyAddress(partyName, type) {
  // fetchAddresses();
  var address = '';
  // console.log(partyName);
  for (var i = 0; i < allParties.length; i++) {
    if (allParties[i].partyName.toUpperCase() == partyName && allParties[i].type.toUpperCase() == type)
      return allParties[i].address;
  }
  return '';
}

function fetchPartyGST(partyName, type) {
  // console.log(partyName, type);
  var gstNo = '';
  // console.log(allParties);
  for (var i = 0; i < allParties.length; i++) {
    if (allParties[i].partyName.toUpperCase() == partyName && allParties[i].type.toUpperCase() == type) {
      var obj = {
        gst: allParties[i].gstNo,
        state: allParties[i].state,
        stateCode: allParties[i].codeNo
      }
      return obj;
    }
  }
  return [];
}

//Logout
function promptUserForLogout() {
  if (
    confirm("Are you sure you want to Close Application ? ", "Kalash-Infotech")
  ) {
    window.close();
  }
}

