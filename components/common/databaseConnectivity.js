// import NodePdfPrinter from 'node-pdf-printer';
var mysql = require("mysql");
var lastBackupDate = '';
var lastBackupTime = '';
var queryMasterRequest = 1;
var queryMasterResponse = 0;
var path = require('path');
var fs = require("fs"); // file system variable
var variables = require("../common/pooldb");
var dbConnection = variables.dbconnection;
var globals = {
  isAdmin: "0"
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function checkWhenLastBackupWasTaken() {
  //displayElement("waitingMessage", true);
  dbConnection.query(
    "SELECT seriesValue from seriesnumber WHERE seriesName = 'backupDate' OR seriesName = 'backupTime';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      if (results) {
        // console.log("Waiting");
        lastBackupDate = results[0].seriesValue;
        lastBackupTime = results[1].seriesValue;
        document.getElementById("backupTimeLabel").innerHTML =
          results[0].seriesValue + " @ " + results[1].seriesValue;
        showBackupError();
        //displayElement("waitingMessage", false);
      }
    }
  );
  // fetchAddresses();
}

function showBackupError() {
  var temp = lastBackupDate.split(".");
  // console.log(temp);

  var d = temp[0] + "/" + temp[1] + "/" + temp[2];
  var d1 = new Date(); // todays date

  d1 = d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();

  var da = new Date(temp[1] + "/" + temp[0] + "/" + temp[2]);

  var temptodaysDate = ((new Date(Date.now()).getMonth() + 1) + "/" +
    new Date(Date.now()).getDate() + "/" + new Date(Date.now()).getFullYear()).toString();;

  var todaysDate = new Date(temptodaysDate);
  const diffTime = Math.abs(da - todaysDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // console.log(diffDays);

  if (diffDays > 1) {
    document.getElementById("backupButton").className = "btn btn-danger btn-fill  view";
    document.getElementById("backupMessage").textContent = "Pending to take NEW BACKUP. Last backup was taken on :";
    document.getElementById("backupMessage").style.color = "#ff6666";
    document.getElementById("backupTimeLabel").style.color = "#ff6666";
  } else {
    document.getElementById("backupButton").className = "btn btn-success btn-fill view";
    document.getElementById("backupMessage").textContent = "Last backup was taken on :";
    document.getElementById("backupMessage").style.color = "#9a9a9a";
    document.getElementById("backupTimeLabel").style.color = "#9a9a9a";
  }
}

// console.log("LOADED DB CONNECTIVITY");

//Function that takes backup and saves it in the C drive
function takeBackup() {
  displayElement("waitingMessage", true);
  document.getElementById("backupButton").disabled = true;
  alert("We are taking the backup. Please Wait...");
  var mysqldump = require("mysqldump");
  var datetime = new Date();
  var folderName = ('data-backup' +
    new Date(Date.now()).getDate() +
    "." +
    (new Date(Date.now()).getMonth() + 1) +
    "." +
    new Date(Date.now()).getFullYear()
  ).toString();

  var backupDate = (new Date(Date.now()).getDate() + "." + (new Date(Date.now()).getMonth() + 1) + "." + new Date(Date.now()).getFullYear()).toString();;
  var backupTime =
    new Date(Date.now()).getHours() +
    ":" +
    new Date(Date.now()).getMinutes() +
    ":" +
    new Date(Date.now()).getSeconds();

  var dir = "C:\\kalash-data-backup\\";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  dir = "C:\\kalash-data-backup\\" + folderName;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  var fileName =
    folderName +
    "@" +
    new Date(Date.now()).getHours() +
    "." +
    new Date(Date.now()).getMinutes() +
    "." +
    new Date(Date.now()).getSeconds();

  document.getElementById("backupButton").disabled = true;

  if (variables.connectToLocalhost)
    mysqldump({
      connection: {
        //localhost credentials
        host: "localhost", //host:"116.72.230.84"
        port: "3306",
        user: "root", //user: "root", //user: "kalash",
        password: "darshanjain@123",
        database: "khimesara"
      },
      dumpToFile: "C:\\kalash-data-backup\\" + folderName + "/" + fileName + ".sql"
    });

  else mysqldump({
    connection: {
      //server credentials
      host: "116.72.230.84",
      port: "3306",
      user: "kalash",
      password: "darshanjain@123",
      database: "khimesaratest",
      connectionLimit: 100
    },
    dumpToFile: "C:\\kalash-data-backup\\" + folderName + "/" + fileName + ".sql"
  });


  console.log(backupDate, backupTime);
  //update backup datetime in the database
  dbConnection.query(
    "UPDATE seriesnumber SET seriesValue = (case when seriesName = 'backupDate' then '" +
    backupDate +
    "' when seriesName = 'backupTime' then '" +
    backupTime +
    "' end) WHERE seriesName in ('backupDate', 'backupTime');",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function checkIfWorkingCompleted(id) {
  if (queryMasterRequest == queryMasterResponse) {
    // console.log("Completed")
    document.getElementById("backupButton").disabled = false;
    alert("We have successfully taken the backup.");
    checkWhenLastBackupWasTaken();
    displayElement("waitingMessage", false);
  }
  else {
    // console.log("Pending");
    document.getElementById("backupButton").disabled = true;
  }
}
