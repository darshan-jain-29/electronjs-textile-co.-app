document.title = "LR No. Entry - Kalash Infotech";
document.getElementById("pageHeading").innerHTML = "LR No. Entry";
var lotNumber = "";
var datatableObj;
var queryMasterRequest = 1;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
    displayElement("waitingMessage", true);
    connection.query(
        "SELECT m.dUNumber, m.invoiceNumber, m.dispatchDate, m.lrNo, m.transportName, m.shippingAddress, m.haste, m.qtyDelivering, m.rollsDelivering, s.partyName from dispatchmaster as m, salepomaster as s where m.salePoNumber = s.salePoNumber and m.lrNo = '' OR  m.lrNo IS NULL ORDER BY m.dUNumber desc",
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            // console.log(results);
            loadValuesInViewTable(results);
            displayElement("waitingMessage", false);
        }
    );
}

function loadValuesInViewTable(results) {
    var tableInstance = document.getElementById("allDispatchBody"),
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
            newCell.textContent = results[i].invoiceNumber;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].dispatchDate;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].partyName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].transportName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].qtyDelivering;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].rollsDelivering;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].shippingAddress;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].haste;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var lrNoTextbox = document.createElement("input");
            lrNoTextbox.setAttribute("type", "text");
            lrNoTextbox.setAttribute("id", "lrNo" + i);
            lrNoTextbox.setAttribute("placeholder", "Enter LR No.");
            lrNoTextbox.setAttribute("class", "form-control");
            lrNoTextbox.setAttribute("value", results[i].lrNo);
            newCell.appendChild(lrNoTextbox);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var viewButton = document.createElement("input");
            viewButton.setAttribute("type", "button");
            viewButton.setAttribute("title", "View P.O.");
            viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
            viewButton.setAttribute("id", "add:" + results[i].dUNumber + ":" + results[i].invoiceNumber + ":" + i);
            viewButton.setAttribute("value", "Save");
            viewButton.setAttribute("onclick", "addLrNo(id)");
            newCell.appendChild(viewButton);
            newRow.appendChild(newCell);
        }
    }
    datatableObj = $("#allDispatch").dataTable({
        "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
        "pageLength": 25,
        "aaSorting": []
    });
}

function addLrNo(id) {
    var temp = id.split(":");
    var tempUDuNumber = temp[1].trim();
    var tempInvoiceNumber = temp[2].trim();
    var rowLrNo = document.getElementById("lrNo" + temp[3]).value.trim();

    if (rowLrNo != '') {
        document.getElementById(id).disabled = true;
        alert("Saving LR No...Please wait...");
        connection.query(
            "UPDATE dispatchmaster SET lrNo = '" +
            rowLrNo +
            "' WHERE dUNumber ='" + tempUDuNumber + "' AND invoiceNumber = '" + tempInvoiceNumber + "';",
            function (err, result) {
                if (err) { alert(err + " : Tab - "); throw err; }
                if (result.changedRows > 0) {
                    window.location.reload();
                    document.getElementById(id).disabled = false;
                    alert("LR No. is Successfully Saved...");
                }
            }
        );
    } else {
        document.getElementById("lrNo" + temp[3]).style.backgroundColor = "#ff6666";
        document.getElementById("lrNo" + temp[3]).disabled = false;
    }
}
