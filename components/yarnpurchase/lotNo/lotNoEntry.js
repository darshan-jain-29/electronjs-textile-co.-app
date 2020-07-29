document.title = "Lot No. Entry - Kalash Infotech";
document.getElementById("pageHeading").innerHTML = "Lot No. Entry";
var lotNumber = "";
var datatableObj;
var queryMasterRequest = 1;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;


function loadData() {
    displayElement("waitingMessage", true);
    connection.query(
        "SELECT * from greypomaster where lotNo = '' OR lotNo IS NULL ORDER BY uPoNumber",
        function (error, results) {
            if (error) { alert(error + " : Tab - greypomaster"); throw error; }
            // console.log(results)
            loadValuesInViewTable(results);
            displayElement("waitingMessage", false);
        }
    );
}

function loadValuesInViewTable(results) {
    var tableInstance = document.getElementById("allPOBody"),
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
            newCell.textContent = results[i].poNumber;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = formatDate(results[i].dateOfPoIssue);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].partyName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].dyeingName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].brokerName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].totalRolls;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = parseFloat(results[i].totalQty).toFixed(2);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].status;
            if (results[i].status.toUpperCase() == "PENDING") newCell.style.color = "red";
            else newCell.style.color = "green";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var lotNoTextbox = document.createElement("input");
            lotNoTextbox.setAttribute("type", "text");
            lotNoTextbox.setAttribute("id", "lotNo" + i);
            lotNoTextbox.setAttribute("placeholder", "Enter Lot No.");
            lotNoTextbox.setAttribute("class", "form-control");
            lotNoTextbox.setAttribute("value", results[i].lotNo);
            newCell.appendChild(lotNoTextbox);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var viewButton = document.createElement("input");
            viewButton.setAttribute("type", "button");
            viewButton.setAttribute("title", "View P.O.");
            viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
            viewButton.setAttribute("id", "add:" + results[i].uPoNumber + ":" + results[i].poNumber + ":" + i);
            viewButton.setAttribute("value", "Save");
            viewButton.setAttribute("onclick", "addLotNo(id)");
            newCell.appendChild(viewButton);
            newRow.appendChild(newCell);
        }
    }
    datatableObj = $("#allPO").dataTable({
        "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
        "pageLength": 25,
        "aaSorting": []
    });

}

function addLotNo(id) {
    var temp = id.split(":");
    var tempUPoNumber = temp[1];
    var tempPoNumber = temp[2];
    var rowLotNo = document.getElementById("lotNo" + temp[3]).value.trim();

    // console.log(tempUPoNumber, poNumber, rowLotNo);
    if (rowLotNo != '') {
        document.getElementById("lotNo" + temp[3]).style.backgroundColor = "white";
        document.getElementById(id).disabled = true;
        connection.query(
            "UPDATE greypomaster SET lotNo = '" +
            rowLotNo +
            "' WHERE uPoNumber ='" + tempUPoNumber + "' AND poNumber = '" + tempPoNumber + "';",
            function (err, result) {
                if (err) { alert(err + " : Tab - greypomaster"); throw err; }
                queryMasterResponse += 1;
                checkIfWorkingCompleted(id);
            }
        );

        alert("Saving Lot No...Please wait...");
    } else {
        document.getElementById("lotNo" + temp[3]).style.backgroundColor = "#ff6666";
        document.getElementById("lotNo" + temp[3]).disabled = false;
    }
}

function checkIfWorkingCompleted(id) {
    if (queryMasterRequest == queryMasterResponse) {
        // console.log("Completed")
        alert("Lot No. is Successfully Saved...");
        document.getElementById(id).disabled = false;
        window.location.reload();
    }
    else {
        // console.log("Pending");
        document.getElementById(id).disabled = true;
    }
}