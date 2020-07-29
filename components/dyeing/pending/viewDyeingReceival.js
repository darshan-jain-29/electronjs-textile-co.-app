var modalReceivingDate = "";
var masterId = "";
var poNumber = '';
var uPoNumber = '';
var lotNo = '';
var rollsReceived = 0;
var qtyPending = 0;
var qtyReceived = 0;
var damageReceived = 0;
var totalRollsReceived = 0;
var netQtyReceived = 0;
var modalTotalMtrPending = 0;
var modalRollsReceiving = 0;
var modalTotalMtrsReceiving = 0;
var modalTotalDamageMtrsReceiving = 0;
var modalData = [];
var secondaryModalData = [];
var dRNumber = '';
var rollsSeries = '';

var masterSent = 0;
var masterReceived = 0;
var masterDamage = 0;

var dropdownMasterValues = [];
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var allReceivalDates = [];
var tableRowData = [];

const printingData = {
  docType: "Dyeing Receival Details",
  invoiceType: "Bill No.",
  billNo: '',

  dateType: "Receival Date",
  billDate: '',

  party1Type: "Party Name",
  partyName1: '',
  partyAddress1: '',

  partyType2: "Dyeing Name",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  folderName: 'All-Dyeing-Receivals',

  stickerFolderName: 'Stickers',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  stickerCompanyName: "KHIMESARA",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableUpperHeading: 'Dyeing Receivals',

  tableHeadings: {
    heading1: "Finish Quality",
    heading2: "Shade/Color",
    heading3: "Condition",
    heading4: "Rolls",
    heading5: "Qty"
  },

  items: [
  ],

  stickers: [
  ],

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadDataInViewFormat(id) {
  masterId = id;
  var temp = id.split(":");
  poNumber = temp[1];
  uPoNumber = temp[0];

  loadPOOrderDetails(poNumber, uPoNumber);

  connection.query("SELECT seriesValue from seriesnumber where seriesName in ('rollsSeries', 'dRNumber') order by seriesName asc;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dRNumber = parseInt(results[0].seriesValue);
    rollsSeries = parseInt(results[1].seriesValue);
    //console.log(dRNumber, rollsSeries);
  });
  document.getElementById("viewLotNumber").style.backgroundColor = "white";

}

function loadPOOrderDetails(poNumber, uPoNumber) {
  // console.log(allParties);
  connection.query(
    "SELECT * from greypomaster where poNumber = '" + poNumber + "' AND uPoNumber = '" + uPoNumber + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      printingData.billNo = document.getElementById("viewPONumber").value = results[0].poNumber;
      document.getElementById("viewDateOfPOIssue").value = formatDate(results[0].dateOfPoIssue);
      document.getElementById("viewYarnPartyName").value = results[0].partyName;
      printingData.partyName2 = document.getElementById("viewDyeingName").value = results[0].dyeingName;
      printingData.partyAddress2 = fetchPartyAddress(results[0].dyeingName.trim().toUpperCase(), "DYEING");

      printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName;

      printingData.party1Type = "Lot No.";
      printingData.partyName1 = lotNo = document.getElementById("viewLotNumber").value = results[0].lotNo;

      document.getElementById("viewTotalNoOfRolls").value = results[0].totalRolls;
      masterSent = document.getElementById("viewTotalNetQty").value = results[0].totalQty;

      totalRollsReceived = document.getElementById("viewRollsReceivedFromDyeing").value = results[0].rollsReceived;
      masterReceived = parseFloat(results[0].qtyReceived).toFixed(2);
      masterDamage = parseFloat(results[0].totalDamage).toFixed(2);
      document.getElementById("viewQtyReceivedFromDyeing").value = parseFloat(masterReceived).toFixed(2);
      document.getElementById("viewDamageQtyReceivedFromDyeing").value = parseFloat(masterDamage).toFixed(2);
      document.getElementById("viewShrinkageFromDyeing").value = parseFloat(results[0].shrinkage).toFixed(2);

      if (results[0].status.toUpperCase() == 'COMPLETED') {
        document.getElementById("receiveButton").disabled = true;
        document.getElementById("allReceivedButton").disabled = true;
      }
      else {
        document.getElementById("receiveButton").disabled = false;
        document.getElementById("allReceivedButton").disabled = false;
      }

      if (lotNo == '') {
        document.getElementById("receiveButton").disabled = true;
        document.getElementById("allReceivedButton").disabled = true;
        // document.getElementById("printButton").disabled = true;
        document.getElementById("viewLotNumber").style.backgroundColor = "#ff6666";
        document.getElementById("shrinkageReport").innerHTML = "Lot No. is Blank";
      }
      else {
        document.getElementById("receiveButton").disabled = false;
        document.getElementById("allReceivedButton").disabled = false;
        // document.getElementById("printButton").disabled = false;
        document.getElementById("viewLotNumber").style.backgroundColor = "white";
        document.getElementById("shrinkageReport").innerHTML = "";
      }
      loadReceivedQtyDetails();
    }
  );
}

function loadReceivedQtyDetails() {
  var dateFilter = document.getElementById('dateFilter');
  dateFilter.innerHTML = "";
  var options = dateFilter.getElementsByTagName("option");
  options = document.createElement("option");
  options.value = options.text = 'Select Date';
  options.selected = true;
  dateFilter.add(options);
  allReceivalDates = [];

  // console.log(poNumber, uPoNumber, lotNo)
  //received from dyeing data
  connection.query(
    "SELECT * from dyeingreceivalmaster where poNumber = '" + poNumber + "' AND uPoNumber = '" +
    uPoNumber + "' AND lotNo = '" + lotNo + "' ORDER BY dRNumber;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      loadValuesInReceivedTable(results);
    }
  );
}

function loadValuesInReceivedTable(results) {
  var tableInstance = document.getElementById("viewReceivingDetailsTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  printingData.items = [];
  printingData.stickers = [];

  for (var i = 0; i < results.length; i++) {

    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      console.log("andar aaya?");
    } else {
      newCell = document.createElement("td");
      newCell.textContent = results[i].receivingDate;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].greyQualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rollsReceiving;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].qtyReceiving;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].finishQualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var receivedValuesUl = document.createElement("ul");
      receivedValuesUl.setAttribute("id", "receivedValuesFinishDetailsUl" + i);
      newCell.appendChild(receivedValuesUl);
      newRow.appendChild(newCell);
      fetchReceivedQualityDetails(results[i].dRNumber, results[i].greyQualityName, "receivedValuesFinishDetailsUl" + i);

      newCell = document.createElement("td");
      newCell.textContent = (parseFloat(results[i].qtyReceiving)).toFixed(2);
      newRow.appendChild(newCell);

      //logic to show the damage received in blue color
      if (results[i].isDamage == "true") {
        newRow.style.backgroundColor = "#add8e6";
        // condition = "DAMAGE";
      }
      else newRow.style.backgroundColor = "white";

      loadDateFilters(results[i].receivingDate);
    }
  }
  calculateReceivedTableTotal();
}

function calculateReceivedTableTotal() {
  rollsReceived = 0;
  qtyReceived = 0;
  damageReceived = 0;
  netQtyReceived = 0;

  var table = document.getElementById("viewReceivingDetailsTable");
  //console.log(table.rows.length);
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[2].innerHTML)
      rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[2].innerHTML)).toFixed(2);

    if (table.rows[r].cells[3].innerHTML)
      qtyReceived = (parseFloat(qtyReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);

    // if (table.rows[r].cells[4].innerHTML)
    //   damageReceived = (parseFloat(damageReceived) + parseFloat(table.rows[r].cells[4].innerHTML)).toFixed(2);

    if (table.rows[r].cells[6].innerHTML)
      netQtyReceived = (parseFloat(netQtyReceived) + parseFloat(table.rows[r].cells[6].innerHTML)).toFixed(2);

    printingData.totalRolls = document.getElementById('viewRollsReceived').value = rollsReceived;
    printingData.totalQty = document.getElementById('viewTotalReceivedMtrs').value = qtyReceived;
    // document.getElementById('viewTotalDamageMtrs').value = damageReceived;
    document.getElementById('viewTotalNetMtrs').value = netQtyReceived;
  }
}

function loadDateFilters(currentDate) {
  //console.log(currentDate);
  var i = 0;
  for (i = 0; i < allReceivalDates.length; i++) {
    if (allReceivalDates[i] == currentDate) break;
  }

  if (i == allReceivalDates.length) {
    // console.log("in")
    allReceivalDates.push(currentDate);
    var dateFilter = document.getElementById('dateFilter');
    var options = dateFilter.getElementsByTagName("option");
    options = document.createElement("option");
    options.value = options.text = currentDate;
    dateFilter.add(options);
  }
}

function filterByDate(id) {
  var tempD = document.getElementById(id);
  var dropdownValue = tempD.options[tempD.selectedIndex].text;

  rollsReceived = 0;
  qtyReceived = 0;
  damageReceived = 0;
  netQtyReceived = 0;

  var table = document.getElementById("viewReceivingDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableReceivingDate = table.rows[r].cells[0].innerHTML;
    // console.log(tableReceivingDate, dropdownValue);

    if (dropdownValue.trim().toUpperCase() == "SELECT DATE") {
      table.rows[r].hidden = false;
      rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[2].innerHTML)).toFixed(2);
      qtyReceived = (parseFloat(qtyReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);
      netQtyReceived = (parseFloat(netQtyReceived) + parseFloat(table.rows[r].cells[6].innerHTML)).toFixed(2);
    }
    else if (tableReceivingDate.trim() != dropdownValue) table.rows[r].hidden = true;
    else {
      table.rows[r].hidden = false;
      rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[2].innerHTML)).toFixed(2);
      qtyReceived = (parseFloat(qtyReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(2);
      netQtyReceived = (parseFloat(netQtyReceived) + parseFloat(table.rows[r].cells[6].innerHTML)).toFixed(2);
    }
  }
  printingData.totalRolls = document.getElementById('viewRollsReceived').value = rollsReceived;
  printingData.totalQty = document.getElementById('viewTotalReceivedMtrs').value = qtyReceived;
  document.getElementById('viewTotalNetMtrs').value = netQtyReceived;
  printingData.billDate = dropdownValue.trim().toUpperCase();

  printingData.items = [];
  //console.log(tableRowData);

  for (var j = 0; j < tableRowData.length; j++) {
    if (tableRowData[j].receivingDate == dropdownValue || dropdownValue.trim().toUpperCase() == "SELECT DATE") {
      var condition = tableRowData[j].isDamage == "true" ? "DAMAGE" : "FRESH";
      var obj = {
        qualityName: tableRowData[j].qualityName,
        sc: tableRowData[j].sc,
        condition: condition,
        rolls: "1",
        qty: tableRowData[j].qty
      };
      printingData.items.push(obj);
    }
  }
}

function fetchReceivedQualityDetails(dR, greyQ, rowId) {
  connection.query(
    "SELECT receivingDate, qualityName, shade, color, qty, isDamage from dyeingreceivalrows where dRNumber = '" + dR
    + "' AND greyQuality = '" + greyQ + "' ORDER BY qualityName;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      if (results.length > 0) appendToUl(results, rowId);
    }
  );
}

function appendToUl(data, id) {
  var rowUL = document.getElementById(id);
  rowUL.innerHTML = '';

  for (var i = 0; i < data.length; i++) {
    var li = document.createElement("li");
    // var q = data[i].qualityName == '' ? '-' : data[i].qualityName;
    var s = data[i].shade == '' ? '-' : data[i].shade;
    var c = data[i].color == '' ? '-' : data[i].color;

    var val = s + " / " + c + " / " + data[i].qty;
    var condition = data[i].isDamage == "true" ? "DAMAGE" : "FRESH";

    var obj = {
      receivingDate: data[i].receivingDate,
      qualityName: data[i].qualityName,
      sc: s + " / " + c,
      condition: condition,
      rolls: "1",
      qty: data[i].qty
    };
    printingData.items.push(obj);
    tableRowData.push(obj);

    li.appendChild(document.createTextNode(val));
    rowUL.appendChild(li);
  }
}

function fetchModalData() {
  document.getElementById("modalReceivingDate").value = null;
  document.getElementById("modalSaveButton").disabled = false;
  document.getElementById("modalCloseButton").disabled = false;

  connection.query(
    "SELECT * from greyporows where poNumber = '" + poNumber + "' AND uPoNumber = '" + uPoNumber + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      loadDataInModal(results, "modalPoReceivingTableBody");
    }
  );
  connection.query("SELECT * from qsc ORDER BY type, name", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dropdownMasterValues = results;
    // console.log(results, "Drop")
  });
}

function loadDataInModal(tableValues, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow,
    newCell;
  tableInstance.innerHTML = "";

  for (var i = 0; i < tableValues.length; i++) {
    var currentIndex = tableInstance.rows.length;
    // var currentRow = tableInstance.insertRow(currentIndex);
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (tableValues[i] instanceof Array) {
    } else {

      newCell = document.createElement("td");
      newCell.className = "col-md-2";
      newCell.id = "modalTableQuality" + currentIndex;
      newCell.textContent = tableValues[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-1";
      newCell.id = "modaltotalRowQty" + currentIndex;
      var temp1 = parseFloat(tableValues[i].qty) - parseFloat(tableValues[i].qtyReceived) - parseFloat(tableValues[i].damageReceived);
      newCell.textContent = parseFloat(temp1).toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-1";
      var noOfRollsReceivingTextbox = document.createElement("input");
      noOfRollsReceivingTextbox.setAttribute("type", "number");
      noOfRollsReceivingTextbox.setAttribute("class", "form-control");
      noOfRollsReceivingTextbox.setAttribute("id", "modaltableNoOfRollsReceiving" + currentIndex);
      noOfRollsReceivingTextbox.setAttribute("onchange", "addRows(id, this.value)");
      newCell.appendChild(noOfRollsReceivingTextbox);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-1";
      var rowMtrsReceivingTextbox = document.createElement("input");
      rowMtrsReceivingTextbox.setAttribute("type", "number");
      rowMtrsReceivingTextbox.setAttribute("class", "form-control");
      rowMtrsReceivingTextbox.setAttribute("id", "modaltotalRowMtrsReceiving" + currentIndex);
      rowMtrsReceivingTextbox.setAttribute("onchange", "calculateModalTotal(true)");
      newCell.appendChild(rowMtrsReceivingTextbox);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-1";
      var rowDamageMtrsReceivingCheckbox = document.createElement("input");
      rowDamageMtrsReceivingCheckbox.setAttribute("type", "checkbox");
      rowDamageMtrsReceivingCheckbox.setAttribute("class", "h-20");
      rowDamageMtrsReceivingCheckbox.setAttribute("title", "Click here when you are receiving Damage Rolls");
      rowDamageMtrsReceivingCheckbox.setAttribute("id", "modaltotalRowDamageMtrsCheckbox" + currentIndex);
      newCell.appendChild(rowDamageMtrsReceivingCheckbox);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-2";
      var rowReceivingQualityNameTextbox = document.createElement("select");
      rowReceivingQualityNameTextbox.setAttribute("class", "form-control");
      rowReceivingQualityNameTextbox.setAttribute("id", "modalrowReceivingQualityName" + currentIndex);
      rowReceivingQualityNameTextbox.setAttribute("style", "display: none");
      rowReceivingQualityNameTextbox.setAttribute("onchange", "modalPoReceivingTableValidation();");

      newCell.appendChild(rowReceivingQualityNameTextbox);
      newRow.appendChild(newCell);


      newCell = document.createElement("td");
      newCell.className = "col-md-3";
      var rowReceivingDetailsUl = document.createElement("ul");
      rowReceivingDetailsUl.setAttribute("id", "modalrowReceivingDetailsUl" + currentIndex);
      rowReceivingDetailsUl.setAttribute("class", "m-B0");
      newCell.appendChild(rowReceivingDetailsUl);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-1";
      newCell.id = "modalTableRowMtrsTotal" + currentIndex;
      newCell.textContent = '0';
      newRow.appendChild(newCell);
    }
    calculateModalTotal(false);
  }
}

function calculateModalTotal(perform) {

  var table = document.getElementById("modalPoReceivingTable");
  modalTotalMtrPending = 0;
  modalRollsReceiving = 0;
  modalTotalMtrsReceiving = 0;
  modalTotalDamageMtrsReceiving = 0;

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableMtrPending = table.rows[r].cells[1].innerHTML;
    //console.log(tablePcs);
    modalTotalMtrPending = parseFloat(modalTotalMtrPending) + parseFloat(tableMtrPending);

    var tableRollsReceiving = table.rows[r].cells[2].getElementsByTagName("input")[0].value;
    if (tableRollsReceiving != '' && parseFloat(tableRollsReceiving) > 0)
      modalRollsReceiving = parseFloat(modalRollsReceiving) + parseFloat(tableRollsReceiving);

    var tableMtrsReceiving = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
    if (tableMtrsReceiving !== '' && parseFloat(tableMtrsReceiving) > 0) {
      modalTotalMtrsReceiving = parseFloat(modalTotalMtrsReceiving) + parseFloat(tableMtrsReceiving);
    }

    var damageCheck = table.rows[r].cells[4].getElementsByTagName("input")[0].checked;
    // console.log(damageCheck)
    if (damageCheck) modalTotalDamageMtrsReceiving = parseFloat(modalTotalDamageMtrsReceiving) + parseFloat(tableMtrsReceiving);

    document.getElementById("modalTotalMtrsPending").value = parseFloat(modalTotalMtrPending).toFixed(2);
    document.getElementById("modalTotalNoOfRollsReceiving").value = parseFloat(modalRollsReceiving).toFixed(2);
    document.getElementById("modalTotalMtrsReceiving").value = parseFloat(modalTotalMtrsReceiving).toFixed(2);
  }
  if (perform) {
    if (validateModalData() == 0) return;
    else if (modalPoReceivingTableValidation() == 0) return;
  }
}

function addRows(id, val) {
  var tempID = id.split('modaltableNoOfRollsReceiving');
  var rowUL = document.getElementById('modalrowReceivingDetailsUl' + tempID[1]);
  rowUL.innerHTML = '';

  if (val > 0)
    document.getElementById("modalrowReceivingQualityName" + tempID[1]).style.display = "initial";
  else document.getElementById("modalrowReceivingQualityName" + tempID[1]).style.display = "none";

  loadModalDataDropdown("modalrowReceivingQualityName" + tempID[1], dropdownMasterValues);
  for (var i = 0; i < val; i++) {
    var li = document.createElement("li");
    li.style = "display: -webkit-box";

    var shadeNoDropdown = document.createElement("select");
    shadeNoDropdown.setAttribute("id", "rowULShade" + tempID[1] + ":" + i);
    shadeNoDropdown.setAttribute("class", "form-control w-40");

    var colorDropdown = document.createElement("select");
    colorDropdown.setAttribute("id", "rowULColor" + tempID[1] + ":" + i);
    colorDropdown.setAttribute("class", "form-control w-40");

    var liMtrsReceivingTextbox = document.createElement("input");
    liMtrsReceivingTextbox.setAttribute("type", "number");
    liMtrsReceivingTextbox.setAttribute("class", "form-control w-20 rRLM");
    liMtrsReceivingTextbox.setAttribute("placeholder", "Mtrs");
    liMtrsReceivingTextbox.setAttribute("id", "liMtrsReceiving" + tempID[1] + ":" + i);
    liMtrsReceivingTextbox.setAttribute("onchange", "calculateRowsTotal()");

    li.innerHTML += shadeNoDropdown.outerHTML + colorDropdown.outerHTML + liMtrsReceivingTextbox.outerHTML;
    rowUL.appendChild(li);
    loadModalDataDropdown("rowULShade" + tempID[1] + ":" + i, dropdownMasterValues);
    loadModalDataDropdown("rowULColor" + tempID[1] + ":" + i, dropdownMasterValues);
  }
  calculateModalTotal(true);

  // if (validateModalData() == 0) return;
  // else if (modalPoReceivingTableValidation() == 0) return;
}

function loadModalDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);
  // console.log(theSelect);
  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName.includes("modalrowReceivingQualityName")) {
    options.text = "Quality Name"; options.value = "DEFAULT";
  }
  else if (selectName.includes("rowULShade")) {
    options.text = "Shade"; options.value = "DEFAULT";
  }
  else if (selectName.includes("rowULColor")) {
    options.text = "Color"; options.value = "DEFAULT";
  }

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName.includes("modalrowReceivingQualityName") && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName.includes("rowULShade") && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName.includes("rowULColor") && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
  }
  return;
}

function calculateRowsTotal() {
  var table = document.getElementById("modalPoReceivingTable");
  var rowReceiviedRowTotal = 0;
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    rowReceiviedRowTotal = 0;

    var tableUlRow = table.rows[r].cells[6].getElementsByTagName("ul")[0];
    var len = tableUlRow.getElementsByTagName("li").length;
    if (len > 0) {
      for (var k = 0; k < len; k++) {
        var rowMtrs = document.getElementById("liMtrsReceiving" + (r - 1) + ":" + k).value;
        if (rowMtrs) {
          rowReceiviedRowTotal = parseFloat(rowReceiviedRowTotal) + parseFloat(rowMtrs);
          table.rows[r].cells[7].innerHTML = parseFloat(rowReceiviedRowTotal).toFixed(2);
        }
      }
    }
  }
  calculateQueryMasterRequest();
  modalPoReceivingTableValidation();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  // inserting table data rows wise in the dyeingreceivalmaster table : add total no of rows where receiving qty is > 0 in the table  
  var table = document.getElementById("modalPoReceivingTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableMtrsReceiving = table.rows[r].cells[7].innerHTML;
    if (parseFloat(tableMtrsReceiving) > 0) queryMasterRequest += 1;
  }

  // console.log(modalRollsReceiving);
  // inserting table data into dyeingreceivalrows row wise: add total no of rolls 
  queryMasterRequest += parseInt(modalRollsReceiving);

  // inserting table data into stockrows row wise: add total no of rolls 
  queryMasterRequest += parseInt(modalRollsReceiving);

  //updating greypomaster once: add 1
  queryMasterRequest += 1;

  //updating greyporows once: add 1
  queryMasterRequest += 1;

  //updating stockmaster once: add 1
  queryMasterRequest += 1;

  //updating seriesnumber once: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function saveModalData() {
  //validate modal table
  if (validateModalData() == 0) return;

  //check if primary table data is correct
  if (modalPoReceivingTableValidation() == 0) return;

  // //check if secondary table data is correct
  if (validateSecondaryTable() == 0) return;

  calculateModalTotal(true);

  alert("Saving the Received Quantities... Please wait...");
  document.getElementById("modalSaveButton").disabled = true;
  document.getElementById("modalCloseButton").disabled = true;

  //save modal primary values in dyeing receivals master
  saveModalPrimaryData();

  //save modal secondary data in dyeing receivals rows
  secondaryModalData = makeSecondaryRowMaster();

  //update greypomaster with received rolls and qty
  updateGreyPoMaster();

  //update greyporows with received rolls and qty against name
  createUpdatePoRows(makePrimaryRowMaster());
  // console.log(secondaryModalData);

  //add the stock receival in finish stock rows
  var secondaryRowMaster = createUpdateStockRows(secondaryModalData);
  // console.log(secondaryRowMaster);

  //add the received stock qty in finish stock master
  addFinishGoodsToStockMaster(secondaryRowMaster);

  //update rDNumber and rollsSeries
  updateDRNumber();
}

function modalPoReceivingTableValidation() {
  var table = document.getElementById("modalPoReceivingTable");
  resetModalTable();

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableMtrsPending = table.rows[r].cells[1].innerHTML;
    var tableRollsReceiving = table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim();
    var tableMtrsReceiving = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();

    var tableIsDamage = table.rows[r].cells[4].getElementsByTagName("input")[0].checked;
    var tableRowQuality = table.rows[r].cells[5].getElementsByTagName("select")[0];
    var tableRowTotal = table.rows[r].cells[7].innerHTML;

    // console.log("tableMtrsReceiving", tableMtrsReceiving, "Entered")
    // if (tableMtrsReceiving == '') {
    //   table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
    //   modalErrorMessage("Receiving meters shown in RED cannot be blank", false);
    //   return 0;
    // } else {
    //   table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
    //   modalErrorMessage("", true);
    // }

    if (tableRollsReceiving != '' && (tableMtrsReceiving == '' || parseFloat(tableMtrsReceiving) <= 0)) {
      table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      modalErrorMessage("Receiving meters shown in RED cannot be BLANK or ZERO or NEGATIVE", false);
      return 0;
    } else {
      table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
      modalErrorMessage("", true);
    }

    if (tableMtrsReceiving != '' && (tableRollsReceiving == '' || parseFloat(tableRollsReceiving) <= 0)) {
      table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      modalErrorMessage("No. of Rolls shown in RED cannot be BLANK or ZERO or NEGATIVE ", false);
      return 0;
    } else {
      table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";
      modalErrorMessage("", true);
    }

    if (tableMtrsReceiving != '') {

      if (parseFloat(tableMtrsReceiving) > parseFloat(tableMtrsPending)) {
        table.rows[r].cells[1].style.backgroundColor = "#ff6666";
        table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
        modalErrorMessage("Receiving meters cannot be greater than PENDING mtrs", false);
        return 0;
      } else {
        table.rows[r].cells[1].style.backgroundColor = "white";
        table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
        modalErrorMessage("Receiving meters cannot be greater than PENDING mtrs", true);
      }

      if ((parseFloat(tableRowTotal)) != parseFloat(tableMtrsReceiving)) {
        table.rows[r].cells[7].style.backgroundColor = "#ff6666";
        modalErrorMessage("Receiving meters total is incorrect.", false);
        return 0;
      } else {
        table.rows[r].cells[7].style.backgroundColor = "white";
        modalErrorMessage("Receiving meters total is incorrect", true);
      }
    }

    if (tableRowQuality.selectedIndex == 0) {
      tableRowQuality.style.backgroundColor = "#ff6666";
      modalErrorMessage("Select Quality", false);
      return 0;
    }
    else {
      tableRowQuality.style.backgroundColor = "white";
      modalErrorMessage("", true)
    }
  }
  return 1;
}

function resetModalTable() {
  var table = document.getElementById("modalPoReceivingTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    table.rows[r].cells[0].style.backgroundColor = "white";
    table.rows[r].cells[1].style.backgroundColor = "white";
    table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[6].style.backgroundColor = "white";
  }
  modalErrorMessage('', true)
}

function modalErrorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").hidden = showDecision;
}

function validateModalData() {
  //check if date of receival is not null
  modalReceivingDate = document.getElementById("modalReceivingDate").value;

  if (modalReceivingDate.length > 0) {
    var tempArray = modalReceivingDate.split("-");
    modalReceivingDate = tempArray[2] + "-" + tempArray[1] + "-" + tempArray[0];
    document.getElementById("modalReceivingDate").style.backgroundColor = "white";
    modalErrorMessage("", false);
  } else {
    dateOfProgramIssue = "";
    document.getElementById("modalReceivingDate").style.backgroundColor = "#ff6666";
    modalErrorMessage("Date not selected", false);
    return 0;
  }

  if (modalRollsReceiving <= 0) {
    document.getElementById("modalTotalNoOfRollsReceiving").style.backgroundColor = "#ff6666";
    modalErrorMessage("No. of Rolls cannot be ZERO or NEGATIVE or BLANK", false);
    return 0;
  }
  else {
    document.getElementById("modalTotalNoOfRollsReceiving").style.backgroundColor = "white";
    modalErrorMessage("", true);
  }

  if (modalTotalMtrsReceiving <= 0) {
    document.getElementById("modalTotalMtrsReceiving").style.backgroundColor = "#ff6666";
    modalErrorMessage("Total receiving meters cannot be ZERO", false);
    return 0;
  }
  else {
    document.getElementById("modalTotalMtrsReceiving").style.backgroundColor = "white";
    modalErrorMessage("", false);
  }
}

function validateSecondaryTable() {

  var table = document.getElementById("modalPoReceivingTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {

    var tableUlRow = table.rows[r].cells[6].getElementsByTagName("ul")[0];
    var len = tableUlRow.getElementsByTagName("li").length;
    if (len > 0) {
      for (var k = 0; k < len; k++) {

        var rowShade = document.getElementById("rowULShade" + (r - 1) + ":" + k);
        var rowMtrs = document.getElementById("liMtrsReceiving" + (r - 1) + ":" + k);

        // if (rowShade.selectedIndex == 0) {
        //   rowShade.style.backgroundColor = "#ff6666";
        //   modalErrorMessage("Select Shade", false);
        //   return 0;
        // }
        // else {
        //   rowShade.style.backgroundColor = "white";
        //   modalErrorMessage("", true)
        // }

        if (rowMtrs.value == "" || parseFloat(rowMtrs.value) <= 0) {
          rowMtrs.style.backgroundColor = "#ff6666";
          modalErrorMessage("Enter correct quantity", false);
          return 0;
        }
        else {
          rowMtrs.style.backgroundColor = "white";
          modalErrorMessage("", true)
        }
      }
    }
  }
}

function saveModalPrimaryData() {
  var table = document.getElementById("modalPoReceivingTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableGreyQuality = table.rows[r].cells[0].innerHTML;
    var tableRollsReceiving = table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim();

    var tableIsDamage = table.rows[r].cells[4].getElementsByTagName("input")[0].checked;
    var tableMtrsReceiving = table.rows[r].cells[7].innerHTML;

    if (parseFloat(tableMtrsReceiving) > 0) {
      var tempQ = table.rows[r].cells[5].getElementsByTagName("select")[0];
      var tableFinishQuality = tempQ.options[tempQ.selectedIndex].value;

      //save receival entry
      connection.query(
        "Insert into dyeingreceivalmaster VALUES ('" +
        dRNumber +
        "','" +
        uPoNumber +
        "','" +
        poNumber +
        "','" +
        lotNo +
        "','" +
        modalReceivingDate +
        "','" +
        tableGreyQuality +
        "','" +
        tableRollsReceiving +
        "','" +
        tableMtrsReceiving +
        "','" +
        tableFinishQuality +
        "','" +
        tableIsDamage +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );
    }
  }
}

function makeSecondaryRowMaster() {
  var table = document.getElementById("modalPoReceivingTable");
  secondaryModalData = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableGreyQuality = table.rows[r].cells[0].innerHTML;
    var tableIsDamage = table.rows[r].cells[4].getElementsByTagName("input")[0].checked;
    var tableFinishQuality = "";
    if (parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) > 0) {
      var tempQ = table.rows[r].cells[5].getElementsByTagName("select")[0];
      tableFinishQuality = tempQ.options[tempQ.selectedIndex].value;
    }

    var tableUl = table.rows[r].cells[6].getElementsByTagName("ul")[0];
    var val = tableUl.getElementsByTagName("li").length;

    // console.log(val, r);
    for (var i = 0; i < val; i++) {
      var tempUlRow = r - 1;

      var tempS = document.getElementById("rowULShade" + tempUlRow + ":" + i);
      var secondaryRowShade = tempS.options[tempS.selectedIndex].value;
      if (secondaryRowShade == "DEFAULT") secondaryRowShade = '';

      var tempC = document.getElementById("rowULColor" + tempUlRow + ":" + i);
      var secondaryRowColor = tempC.options[tempC.selectedIndex].value;
      if (secondaryRowColor == "DEFAULT") secondaryRowColor = '';

      var secondaryRowQty = document.getElementById("liMtrsReceiving" + tempUlRow + ":" + i).value;

      // to prepare the object we are changing secondaryRowQty to 0
      var damageQty = 0;
      if (tableIsDamage) {
        damageQty = secondaryRowQty;
        secondaryRowQty = 0;
      }

      var obj = {
        qualityName: tableFinishQuality,
        shade: secondaryRowShade,
        color: secondaryRowColor,
        qty: secondaryRowQty,
        rolls: '1',
        damageQty: damageQty
      };
      secondaryModalData.push(obj);

      // to enter the qty in the stock rows table
      secondaryRowQty = document.getElementById("liMtrsReceiving" + tempUlRow + ":" + i).value;

      ///console.log(obj);
      connection.query(
        "Insert into dyeingreceivalrows VALUES ('" +
        dRNumber +
        "','" +
        uPoNumber +
        "','" +
        lotNo +
        "','" +
        modalReceivingDate +
        "','" +
        tableGreyQuality +
        "','" +
        tableFinishQuality +
        "','" +
        secondaryRowShade +
        "','" +
        secondaryRowColor +
        "','" +
        secondaryRowQty +
        "','" +
        tableIsDamage +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );

      // Insert into finish stock rows
      connection.query(
        "Insert into stockrows VALUES ('" +
        rollsSeries +
        "','" +
        lotNo +
        "','" +
        tableFinishQuality +
        "','" +
        secondaryRowShade +
        "','" +
        secondaryRowColor +
        "','" +
        secondaryRowQty +
        "','" +
        tableIsDamage +
        "','" +
        '0' +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );

      var obj = {
        qualityName: tableFinishQuality,
        shade: secondaryRowShade,
        color: secondaryRowColor,
        qty: secondaryRowQty,
        rollNo: rollsSeries
      };

      printingData.stickers.push(obj);
      rollsSeries = rollsSeries + 1;
    }
  }
  //console.log(modalData);
  return secondaryModalData;
}

function updateGreyPoMaster() {
  var myQuery = "UPDATE greypomaster set rollsReceived = rollsReceived + " + modalRollsReceiving +
    ", qtyReceived = qtyReceived + " + modalTotalMtrsReceiving + " - " + modalTotalDamageMtrsReceiving +
    ", totalDamage = totalDamage + " + modalTotalDamageMtrsReceiving +
    " where uPoNumber = '" + uPoNumber + "' and poNumber = '" + poNumber + "'";
  // console.log(myQuery);
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function makePrimaryRowMaster() {
  var table = document.getElementById("modalPoReceivingTable");
  modalData = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableQuality = table.rows[r].cells[0].innerHTML;
    var tableRollsReceiving = table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim();
    var tableDamageMtrsCheck = table.rows[r].cells[4].getElementsByTagName("input")[0].checked;
    var tableMtrsReceiving = table.rows[r].cells[7].innerHTML;
    var tableDamageMtrs = 0;
    if (tableDamageMtrsCheck) {
      tableDamageMtrs = tableMtrsReceiving;
      tableMtrsReceiving = 0;
    }
    var obj = {
      qualityName: tableQuality,
      rollsReceiving: tableRollsReceiving,
      qtyReceiving: tableMtrsReceiving,
      damageMeters: tableDamageMtrs
    };
    modalData.push(obj);
    ///console.log(obj);
  }
  console.log(modalData);
  return modalData;
}

function createUpdatePoRows(rowMaster) {
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var caseQueryDamageQty = "(case ";
  var whereQuery = "";
  var allPoNumber = "'" + poNumber + "'";
  var allUPoNumber = "'" + uPoNumber + "'";
  var allQuality = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var rolls = rowMaster[i].rollsReceiving;
    var qty = rowMaster[i].qtyReceiving;
    var damage = rowMaster[i].damageMeters;

    if (rolls == "" || rolls == null) rolls = 0;
    if (qty == "" || qty == null) qty = 0;
    if (damage == '' || damage == null) damage = 0;
    // if (damage) qty = (parseFloat(qty) - parseFloat(damage)).toFixed(2);

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    caseQueryRolls =
      caseQueryRolls +
      "when (qualityName = '" +
      qName +
      "' AND poNumber = '" +
      poNumber +
      "' AND uPoNumber = '" +
      uPoNumber +
      "' ) THEN rollsReceived + " +
      rolls +
      " ";

    caseQueryQty =
      caseQueryQty +
      "when (qualityName = '" +
      qName +
      "' AND poNumber = '" +
      poNumber +
      "' AND uPoNumber = '" +
      uPoNumber +
      "' ) THEN qtyReceived + " +
      qty +
      " ";

    caseQueryDamageQty =
      caseQueryDamageQty +
      "when (qualityName = '" +
      qName +
      "' AND poNumber = '" +
      poNumber +
      "' AND uPoNumber = '" +
      uPoNumber +
      "' ) THEN damageReceived + " +
      damage +
      " ";
  }
  caseQueryRolls = caseQueryRolls + " else rollsReceived end)";
  caseQueryQty = caseQueryQty + " else qtyReceived end)";
  caseQueryDamageQty = caseQueryDamageQty + " else damageReceived end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality + " ) AND ";
  whereQuery = whereQuery + "poNumber in (" + allPoNumber + " ) AND ";
  whereQuery = whereQuery + "uPoNumber in (" + allUPoNumber + " ); ";

  performFinalUpdateOfGreyPoRowsTable(caseQueryRolls, caseQueryQty, caseQueryDamageQty, whereQuery);
  //return rowMaster;
}

function performFinalUpdateOfGreyPoRowsTable(caseQueryRolls, caseQueryQty, caseQueryDamageQty, whereQuery) {
  var myQuery = "UPDATE greyporows set rollsReceived = " + caseQueryRolls +
    ", qtyReceived = " + caseQueryQty +
    ", damageReceived = " + caseQueryDamageQty + " where  " + whereQuery;
  // console.log(myQuery, "performFinalUpdateOfGreyPoRowsTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function createUpdateStockRows(secondaryModalData) {
  var tempR = [];
  var t = {
    qualityName: secondaryModalData[0].qualityName,
    shade: secondaryModalData[0].shade,
    color: secondaryModalData[0].color,
    qty: secondaryModalData[0].qty,
    rolls: secondaryModalData[0].rolls,
    damageQty: secondaryModalData[0].damageQty
  };
  tempR.push(t);
  //console.log(secondaryModalData.length);

  for (var i = 1; i < secondaryModalData.length; i++) {
    if (secondaryModalData[i].qty && secondaryModalData[i].qty > 0 ||
      secondaryModalData[i].damageQty && secondaryModalData[i].damageQty > 0) {
      var j = 0;
      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == secondaryModalData[i].qualityName && tempR[j].isDamage == secondaryModalData[i].isDamage) break;
      }

      if (j < tempR.length) {
        tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(secondaryModalData[i].qty)).toFixed(2);
        tempR[j].damageQty = (parseFloat(tempR[j].damageQty) + parseFloat(secondaryModalData[i].damageQty)).toFixed(2);
        tempR[j].rolls = parseInt(tempR[j].rolls) + 1;
      } else {
        var t = {
          qualityName: secondaryModalData[i].qualityName,
          shade: secondaryModalData[i].shade,
          color: secondaryModalData[i].color,
          qty: secondaryModalData[i].qty,
          rolls: secondaryModalData[i].rolls,
          damageQty: secondaryModalData[i].damageQty
        };
        tempR.push(t);
      }
    }
  }
  // console.log(tempR);
  return tempR;
}

function addFinishGoodsToStockMaster(rowMaster) {
  console.log(rowMaster);
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var caseQueryDamageQty = "(case ";
  var whereQuery = "";
  var allQuality = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var rolls = rowMaster[i].rolls;
    var qty = rowMaster[i].qty;
    var damage = rowMaster[i].damageQty;

    if (rolls == "" || rolls == null) rolls = 0;
    if (qty == "" || qty == null) qty = 0;
    if (damage == '' || damage == null) damage = 0;
    // if (damage) qty = (parseFloat(qty) - parseFloat(damage)).toFixed(2);

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    caseQueryRolls = caseQueryRolls + "when (qualityName = '" + qName + "' ) THEN rolls + " + rolls + " ";
    caseQueryQty = caseQueryQty + "when (qualityName = '" + qName + "' ) THEN qty + " + qty + " ";
    caseQueryDamageQty = caseQueryDamageQty + "when (qualityName = '" + qName + "' ) THEN damage + " + damage + " ";
  }
  caseQueryRolls = caseQueryRolls + " else rolls end)";
  caseQueryQty = caseQueryQty + " else qty end)";
  caseQueryDamageQty = caseQueryDamageQty + " else damage end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality + " )  ";
  performFinalUpdateOfStockMasterTable(caseQueryRolls, caseQueryQty, caseQueryDamageQty, whereQuery);
}

function performFinalUpdateOfStockMasterTable(caseQueryRolls, caseQueryQty, caseQueryDamageQty, whereQuery) {
  var myQuery = "UPDATE stockmaster set rolls = " + caseQueryRolls +
    ", qty = " + caseQueryQty +
    ", damage = " + caseQueryDamageQty + " where  " + whereQuery;
  console.log(myQuery, "performFinalUpdateOfStockMasterTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function updateDRNumber() {
  dRNumber = dRNumber + 1;
  var caseQuery = "(case ";
  var whereQuery = '';
  caseQuery = caseQuery + "when (seriesName = 'dRNumber' ) THEN " + dRNumber + " " + "when (seriesName = 'rollsSeries' ) THEN " + rollsSeries + " ";
  caseQuery = caseQuery + " else seriesValue end)";
  whereQuery = whereQuery + "seriesName in ('dRNumber','rollsSeries'); ";

  var myQuery = "UPDATE seriesnumber set seriesValue = " + caseQuery + " where  " + whereQuery;
  // console.log(myQuery);
  connection.query(myQuery, function (error, results) {
    if (error)
      throw alert(
        error,
        "Please take screenshot of this and contact developer."
      );
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function checkIfWorkingCompleted() {
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed");
    alert("Received Quantities Successfully Saved...");
    document.getElementById("modalSaveButton").disabled = false;
    document.getElementById("modalCloseButton").disabled = false;

    printAllStickers(printingData, printingData.stickers.length);

    //show data on the view details page
    loadDataInViewFormat(masterId);
    loadReceivedQtyDetails();
    document.getElementById("closeModalButton").click();
  }
  else {
    console.log("Pending");
    document.getElementById("modalSaveButton").disabled = true;
    document.getElementById("modalCloseButton").disabled = true;
  }
}

function allReceived() {
  if (confirm("Are you sure all quantities are received from the dyeing ?")) {
    //calculate shrinkage percentage
    var shrinkage = parseFloat(masterSent) - parseFloat(masterReceived) - parseFloat(masterDamage);
    // console.log(masterSent, masterReceived, masterDamage, shrinkage, uPoNumber, poNumber, lotNo);

    //update the status as completed in greypomaster
    connection.query(
      "UPDATE greypomaster SET shrinkage = '" +
      shrinkage +
      "' , status = 'COMPLETED' where poNumber = '" + poNumber + "' AND uPoNumber = '" + uPoNumber + "' AND lotNo = '" + lotNo + "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
      }
    );
    var percentWaste = ((parseFloat(shrinkage) * 100) / parseFloat(masterSent)).toFixed(2);

    //disable all received and receive buttons
    document.getElementById("receiveButton").disabled = true;
    document.getElementById("allReceivedButton").disabled = true;

    document.getElementById("shrinkageReport").innerHTML = "The shrinkage was " + shrinkage + " MTRS or  " + percentWaste + "%";
    alert("Done. Shrinkage report generated. Please Check.");
  } else document.getElementById("shrinkageReport").innerHTML = "";
}

function printInvoiceData() {
  createInvoice(printingData);
}
