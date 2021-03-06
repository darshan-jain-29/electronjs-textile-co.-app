// import NodePdfPrinter from 'node-pdf-printer';
var dbValues = null;
var mysql = require("mysql");
var lastBackupDate = '';
var lastBackupTime = '';
var queryMasterRequest = 1;
var queryMasterResponse = 0;
// var jsPDF = require('jspdf');
// require('jspdf-autotable');
var path = require('path');
var fs = require("fs"); // file system variable
var allParties = [];
// var connection = require('../common/db');
console.log(connection);

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

var connection = mysql.createConnection({
    host: "116.72.230.84",
    port: "3306",
    user: "kalash",
    password: "darshanjain@123",
    database: "khimesaratest"
});

function checkWhenLastBackupWasTaken() {
    connection.query(
        "SELECT seriesValue from seriesnumber WHERE seriesName = 'backupDate' OR seriesName = 'backupTime';",
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            lastBackupDate = results[0].seriesValue;
            lastBackupTime = results[1].seriesValue;
            document.getElementById("backupTimeLabel").innerHTML =
                results[0].seriesValue + " @ " + results[1].seriesValue;
            showBackupError();
        }
    );

    // fetchAddresses();
}

function showBackupError() {
    var temp = lastBackupDate.split(".");
    var d = temp[0] + "/" + temp[1] + "/" + temp[2];
    var d1 = new Date();
    d1 = d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();

    // console.log(d, d1);
    // console.log(d < d1);
    if (d > d1) {
        document.getElementById("backupButton").className = "btn btn-danger btn-fill  view";
        document.getElementById("backupTimeLabel").style.color = "#ff6666";
    } else if (d <= d1) {
        document.getElementById("backupButton").className = "btn btn-success btn-fill view";
        document.getElementById("backupTimeLabel").style.color = "#9a9a9a";
    }
}

//Function that takes backup and saves it in the C drive
function takeBackup() {
    alert("We are taking the backup. Please Wait...");
    document.getElementById("backupButton").disabled = true;
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
    mysqldump({
        connection: {
            host: "116.72.230.84",
            port: "3306",
            user: "kalash",
            password: "darshanjain@123",
            database: "khimesaratest"
        },
        dumpToFile: "C:\\kalash-data-backup\\" + folderName + "/" + fileName + ".sql"
    });

    console.log(backupDate, backupTime);
    //update backup datetime in the database
    connection.query(
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

//Logout
function promptUserForLogout() {
    if (
        confirm("Are you sure you want to Close Application ? ", "Kalash-Infotech")
    ) {
        window.close();
    }
}

function formatDate(date) {
    var tempD = date.split("-");
    return tempD[2] + "-" + tempD[1] + "-" + tempD[0];
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

function checkIfWorkingCompleted(id) {
    if (queryMasterRequest == queryMasterResponse) {
        // console.log("Completed")
        document.getElementById("backupButton").disabled = false;
        alert("We have successfully taken the backup.");
        checkWhenLastBackupWasTaken();
    }
    else {
        // console.log("Pending");
        document.getElementById("backupButton").disabled = true;
    }
}

function fetchAddresses() {
    connection.query("SELECT partyName, type, address from partiesmaster ORDER BY partyName", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        allParties = results;
        console.log(allParties);
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





















var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;

displayElement("waitingMessage", true);