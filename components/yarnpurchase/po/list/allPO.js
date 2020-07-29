var allRows = [];
var poNumber = "";
var datatableObj;
var dTable = "";
var minDateFilter = "";
var maxDateFilter = "";
var variables = require("../../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  allRows = [];
  viewAllPoList();
  displayElement("waitingMessage", true);
  connection.query(
    "SELECT * from greypomaster ORDER BY uPoNumber desc",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
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
  document.title = "All Grey Purchase Orders - Kalash Infotech";
  document.getElementById("pageHeading").innerHTML = "All Grey Purchase Orders";
  document.getElementById("tabularViewOfAllPO").hidden = false;
  document.getElementById("partyName").style.display = "initial";
  document.getElementById("dyeingName").style.display = "initial";
  document.getElementById("brokerName").style.display = "initial";
  // document.getElementById("printButton").style.display = "initial";
  document.getElementById("viewPODetails").hidden = true;
  document.getElementById("editPODetails").hidden = true;
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
      newCell.textContent = results[i].lotNo;
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
      viewButton.setAttribute("onclick", "viewPODetails(id)");
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);
    }
  }
  datatableObj = $("#allPO").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });


  // // Event listener to the two range filtering inputs to redraw on input
  // $('#min, #max').keyup(function () {
  //   dTable.draw();
  // });

  // $('#startdate').change(function () {
  //   var inputDate = formatDate(this.value);
  //   minDateFilter = new Date(inputDate).getTime();
  //   dTable.draw();
  // });

  // $('#enddate').change(function () {
  //   var inputDate = formatDate(this.value);
  //   maxDateFilter = new Date(inputDate).getTime();
  //   dTable.draw();
  // });

  // $('#startdate, #enddate').keyup(function () {
  //   dTable.draw();
  // });
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
  // else if (selectName.includes("tableShade")) options.text = "Shade";
  // else if (selectName.includes("tableColor")) options.text = "Color";

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
  if (dropdownValue.toUpperCase() == 'SELECT ALL') dropdownValue = '';
  // console.log(dropdownValue);

  var table = $('#allPO').DataTable();
  switch (id) {
    case 'partyName': table.columns(2).search(dropdownValue).draw(); break;
    case 'dyeingName': table.columns(3).search(dropdownValue).draw(); break;
    case 'brokerName': table.columns(4).search(dropdownValue).draw(); break;
  }
}

function viewPODetails(id) {
  var temp = id.split(":");
  poNumber = temp[1];
  document.getElementById("tabularViewOfAllPO").hidden = true;
  // document.getElementById("printButton").style.display = "none";
  document.getElementById("partyName").style.display = "none";
  document.getElementById("dyeingName").style.display = "none";
  document.getElementById("brokerName").style.display = "none";
  document.getElementById("viewPODetails").hidden = false;
  document.getElementById("editPODetails").hidden = true;
  document.getElementById("backButton").hidden = false;
  document.getElementById("pageHeading").innerHTML = "View Grey Purchase Details - " + temp[1];
  displayElement("waitingMessage", true);
  loadDataInViewFormat(id);
}

function editPODetails(id) {
  var temp = id.split("Edit");
  document.getElementById("tabularViewOfAllPO").hidden = true;
  // document.getElementById("printButton").style.display = "none";
  // document.getElementById("editButton").style.display = "none";
  document.getElementById("viewPODetails").hidden = true;
  document.getElementById("editPODetails").hidden = false;
  document.getElementById("backButton").hidden = false;
  document.getElementById("pageHeading").innerHTML = "Edit Grey Purchase Details - " + temp[0];
  loadDataInEditFormat(id);
}

// $('#startdate').change(function () {
//   var inputDate = formatDate(this.value);
//   minDateFilter = new Date(inputDate).getTime();
//   console.log(dTable)
//   dTable.draw();
// });

// $('#enddate').change(function () {
//   var inputDate = formatDate(this.value);
//   maxDateFilter = new Date(inputDate).getTime();
//   dTable.draw();
// });

// $(document).ready(function () {
//   $('#startdate').change(function () {
//     var inputDate = formatDate(this.value);
//     minDateFilter = new Date(inputDate).getTime();
//     dTable.draw();
//   });

//   $('#enddate').change(function () {
//     var inputDate = formatDate(this.value);
//     maxDateFilter = new Date(inputDate).getTime();
//     dTable.draw();
//   });

//   $.fn.dataTable.ext.search.push(
//     function (settings, data, dataIndex) {
//       minDateFilter = $('#startdate').value;
//       console.log(minDateFilter);
//       maxDateFilter = parseInt($('#max').val(), 10);
//       var dateColumn = parseFloat(data[2]) || 0; // use data for the age column

//       if ((isNaN(minDateFilter) && isNaN(maxDateFilter)) ||
//         (isNaN(minDateFilter) && dateColumn <= maxDateFilter) ||
//         (minDateFilter <= dateColumn && isNaN(maxDateFilter)) ||
//         (minDateFilter <= dateColumn && dateColumn <= maxDateFilter)) {
//         return true;
//       }
//       return false;
//     }
//   );
// });


// $(document).ready(function () {

//   $.fn.dataTable.ext.search.push(
//     function (settings, data, dataIndex) {
//       var min = $('#min').datepicker("getDate");
//       var max = $('#max').datepicker("getDate");
//       var startDate = new Date(data[1]);
//       if (min == null && max == null) { return true; }
//       if (min == null && startDate <= max) { return true; }
//       if (max == null && startDate >= min) { return true; }
//       if (startDate <= max && startDate >= min) { return true; }
//       return false;
//     }
//   );

//   $("#min").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
//   $("#max").datepicker({ onSelect: function () { table.draw(); }, changeMonth: true, changeYear: true });
//   //var table = $('#example').DataTable();

// });


function printInvoice() {

  var doc = new jsPDF();
  var table = document.getElementById("allPO");
  var ths = table.getElementsByTagName("th");
  var headarr = [];
  var text = "Hi How are you",
    xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
  doc.text('Montex India: Stock Details', 70, 10);
  var bodyData = [];
  for (var s = 0; s <= 7; s++) {
    headarr.push(ths[s].innerHTML);
  }

  for (var r = 1; r < table.rows.length - 1; r++) {
    var temp = [table.rows[r].cells[1].innerHTML,
    table.rows[r].cells[2].innerHTML,
    table.rows[r].cells[3].innerHTML,
    table.rows[r].cells[4].innerHTML];

    bodyData.push(temp);
  }

  doc.autoTable({
    head: [['DESIGN NAME', 'DESIGN NO.', 'SHADE NO', 'PCS', 'QTY']],
    body: bodyData
  });

  var pageCount = doc.internal.getNumberOfPages();

  for (i = 0; i < pageCount; i++) {
    doc.setPage(i);
    doc.text(150, 285, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + " page");
  }

  var m = (new Date(Date.now()).getMonth()) + 1;
  var folderName = (new Date(Date.now()).getDate() + "" + "." + m + "" + "." + new Date(Date.now()).getFullYear()).toString();

  doc.save(folderName + '- Montex-India-Stock-Details.pdf');
  var oHiddFrame = document.createElement("iframe");
  oHiddFrame.onload = setPrint;
  oHiddFrame.style.visibility = "hidden";
  oHiddFrame.style.position = "fixed";
  oHiddFrame.style.right = "0";
  oHiddFrame.style.bottom = "0";
  oHiddFrame.src = doc;
  document.body.appendChild(oHiddFrame);

}

function closePrint() {
  document.body.removeChild(this.__container__);
}

function setPrint() {
  this.contentWindow.__container__ = this;
  this.contentWindow.onbeforeunload = closePrint;
  this.contentWindow.onafterprint = closePrint;
  this.contentWindow.focus(); // Required for IE
  console.log(this.contentWindow);
  this.contentWindow.print();
}