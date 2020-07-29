var allRows = [];
var poNumber = "";
var datatableObj;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
    viewAllPoList();
    displayElement("waitingMessage", true);

    connection.query(
        "SELECT * from greypomaster where qtyReceived > 0 and rollsReceived > 0 ORDER BY uPoNumber DESC, status",
        function (error, results) {
            if (error) { alert(error + " : Tab - "); throw error; }
            // console.log(results)
            allRows = results;
            loadValuesInViewTable(results);
        }
    );

    connection.query("SELECT *, (partyName = '-') boolDash, (partyName = '0') boolZero, (partyName+0 > 0) boolNum FROM partiesmaster ORDER BY boolDash DESC, boolZero DESC, boolNum DESC, (partyName+0), partyName;", function (
        error,
        results
    ) {
        if (error) { alert(error + " : Tab - "); throw error; }
        // console.log(results);
        loadDataDropdown("partyName", results);
        loadDataDropdown("dyeingName", results);
        loadDataDropdown("brokerName", results);
        displayElement("waitingMessage", false);
    });
}

function viewAllPoList() {
    document.title = "All Grey Pending In Dyeing - Kalash Infotech";
    document.getElementById("pageHeading").innerHTML = "All Grey Pending In Dyeing";
    document.getElementById("tabularViewOfAllDyeingPO").hidden = false;
    document.getElementById("partyName").style.display = "initial";
    document.getElementById("dyeingName").style.display = "initial";
    document.getElementById("brokerName").style.display = "initial";
    // document.getElementById("printButton").style.display = "initial";

    document.getElementById("viewDyeingReceivalDetails").hidden = true;
    // document.getElementById("editDyeingReceivalDetails").hidden = true;
    document.getElementById("backButton").hidden = true;
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
            // newCell.textContent = results[i].poNumber;
            newCell.textContent = results[i].poNumber;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].lotNo;
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
            newCell.textContent = results[i].totalQty;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].rollsReceived;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = (parseFloat(results[i].qtyReceived) + parseFloat(results[i].totalDamage) + parseFloat(results[i].shrinkage)).toFixed(2);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = results[i].status;
            if (results[i].status.toUpperCase() == "PENDING") newCell.style.color = "red";
            else newCell.style.color = "green";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var viewButton = document.createElement("input");
            viewButton.setAttribute("type", "button");
            viewButton.setAttribute("title", "View P.O.");
            viewButton.setAttribute("class", "btn btn-success btn-fill statusBtn");
            viewButton.setAttribute(
                "id",
                results[i].uPoNumber + ":" + results[i].poNumber + ":" +
                "View"
            );
            viewButton.setAttribute("value", "View");
            viewButton.setAttribute("onclick", "viewDyeingReceivalDetails(id)");
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

function loadDataDropdown(selectName, results) {
    var theSelect = document.getElementById(selectName);

    var options = theSelect.getElementsByTagName("option");
    theSelect.innerHTML = "";

    // add first row as dummy in select
    options = document.createElement("option");
    options.value = "";
    if (selectName == "partyName") options.text = "Filter by Parties";
    else if (selectName == "dyeingName") options.text = "Filter by Dyeing";
    else if (selectName == "brokerName") options.text = "Filter by Broker";

    options.disabled = false;
    options.selected = true;
    theSelect.add(options);

    options = document.createElement("option");
    options.value = options.text = 'Select ALL';
    theSelect.add(options);

    for (var i = 0; i < results.length; i++) {
        options = document.createElement("option");

        if (selectName == "partyName" && results[i].type == "parties") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }
        else if (selectName == "dyeingName" && results[i].type == "dyeing") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }

        else if (selectName == "brokerName" && results[i].type == "broker") {
            options.value = options.text = results[i].partyName.toUpperCase();
            theSelect.add(options);
        }

        else if (selectName.includes("tableQuality")) {
            options.value = options.text = results[i].name.toUpperCase();
            theSelect.add(options);
        }
        // else if (selectName.includes("tableShade")) {
        //   options.value = options.text = results[i].shade.toUpperCase();
        //   theSelect.add(options);
        // }
        // else if (selectName.includes("tableColor")) {
        //   options.value = options.text = results[i].color.toUpperCase();
        //   theSelect.add(options);
        // }
    }
    return;
}

function filterByDropdown(id) {
    var tempD = document.getElementById(id);
    var dropdownValue = tempD.options[tempD.selectedIndex].text;
    if (dropdownValue.toUpperCase() == 'SELECT ALL' || dropdownValue.toUpperCase().includes("FILTER BY")) dropdownValue = '';
    // console.log(dropdownValue);

    var table = $('#allPO').DataTable();
    switch (id) {
        case 'partyName': table.columns(3).search(dropdownValue).draw(); break;
        case 'dyeingName': table.columns(4).search(dropdownValue).draw(); break;
        case 'brokerName': table.columns(5).search(dropdownValue).draw(); break;
    }
}

function viewDyeingReceivalDetails(id) {
    var temp = id.split(":");
    poNumber = temp[1];

    document.getElementById("tabularViewOfAllDyeingPO").hidden = true;
    // document.getElementById("printButton").style.display = "none";
    document.getElementById("partyName").style.display = "none";
    document.getElementById("dyeingName").style.display = "none";
    document.getElementById("brokerName").style.display = "none";

    document.getElementById("viewDyeingReceivalDetails").hidden = false;
    // document.getElementById("editDyeingReceivalDetails").hidden = true;
    document.getElementById("backButton").hidden = false;
    document.title = "View Grey Receival From Dyeing Details - " + temp[1] + " - Kalash Infotech";
    document.getElementById("pageHeading").innerHTML = "View Grey Receival From Dyeing Details - " + temp[1];
    loadDataInViewFormat(id);
}