var modalPcs = 0;
var modalTotalWtPending = 0;
var totalOrderQty = 0;
var totalOrderAmount = 0;
var modalPcsReceiving = 0;
var modalTotalWtReceiving = 0;
var modalReceivingDate = '';
var status = "";
var billNumber = '';
var nFNumber = '';
var rollsSeries = '';
var fPoRecNumber = '';
var modalTotalMtrPending, modalRollsReceiving, modalTotalMtrsReceiving = '';
var lotNumber = "";
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var allReceivalDates = [];
var tableRowData = [];

const printingData = {
  docType: "Finish Purchase Details",
  invoiceType: "Bill No.",
  billNo: '',

  dateType: "Purchase Date",
  billDate: '',

  party1Type: "Party Name",
  partyName1: '',
  partyAddress1: '',

  partyType2: "",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  folderName: 'All-Finish-PO',
  stickerFolderName: 'Stickers',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  stickerCompanyName: "KHIMESARA",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableUpperHeading: 'Finish Purchase',

  tableHeadings: {
    heading1: "Finish Quality",
    heading2: "Shade/Color",
    heading3: "Roll No.",
    heading4: "Qty",
    heading5: "Rate",
    heading6: "Total"
  },

  items: [

  ],

  stickers: [
  ],

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadDataInViewFormat(billNumber) {
  document.getElementById("receiveButton").disabled = false;
  document.getElementById("allReceivedButton").disabled = false;

  totalOrderQty = 0;
  totalOrderAmount = 0;
  billNumber = billNumber;

  connection.query(
    "SELECT * from finishpomaster where billNumber = '" + billNumber + "' ;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      printingData.billNo = document.getElementById("viewBillNumber").value = results[0].billNumber;
      printingData.billDate = document.getElementById("viewDateOfFinishPurchase").value = results[0].dateOfPurchase;
      printingData.billDate = document.getElementById("viewDateOfPoDelivery").value = results[0].deliveryDate;
      printingData.partyName1 = document.getElementById("viewFinishPartyName").value = results[0].partyName;
      printingData.partyAddress1 = fetchPartyAddress(results[0].partyName.trim().toUpperCase(), "PARTIES");

      printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName;
      document.getElementById("viewLotNumber").value = results[0].lotNo;

      document.getElementById("viewTotalOrderQty").value = parseFloat(results[0].totalQty).toFixed(2);
      document.getElementById("viewFinishQtyReceived").value = document.getElementById("viewTotalNetWt").value =
        parseFloat(results[0].quantity).toFixed(2);
      document.getElementById("viewFinishRollsReceived").value = document.getElementById("viewTotalNoOfRolls").value =
        parseInt(results[0].rolls);
      lotNumber = results[0].lotNo;

    }
  );

  connection.query(
    "SELECT * from finishporeceivalrows where billNumber = '" + billNumber + "' order by fPoRecNumber desc;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      addDataInViewTable(results, "viewFinishPurchaseDetailsTableBody");
    }
  );

  connection.query("SELECT seriesValue from seriesnumber where seriesName in ('rollsSeries', 'fPoRecNumber') order by seriesName asc;", function (
    error,
    results
  ) {
    // console.log(results);
    if (error) { alert(error + " : Tab - "); throw error; }
    fPoRecNumber = parseInt(results[0].seriesValue);
    rollsSeries = parseInt(results[1].seriesValue);
    // console.log(rollsSeries + " rollsSeries", fPoRecNumber + " fPoRecNumber");
  });
}

function addDataInViewTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  totalOrderQty = totalOrderAmount = 0;
  printingData.items = [];

  var dateFilter = document.getElementById('dateFilter');
  dateFilter.innerHTML = "";
  var options = dateFilter.getElementsByTagName("option");
  options = document.createElement("option");
  options.value = options.text = 'Select Date';
  options.selected = true;
  options.disabled = true;
  dateFilter.add(options);
  allReceivalDates = [];

  for (var i = 0; i < results.length; i++) {

    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      console.log("andar aaya?");
    } else {
      newCell = document.createElement("td");
      newCell.textContent = results[i].dateOfReceival;
      newRow.appendChild(newCell);
      loadDateFilters(results[i].dateOfReceival);

      newCell = document.createElement("td");
      newCell.textContent = results[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rollNumber;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].qty;
      if (parseFloat(results[i].qty) > 0)
        totalOrderQty = parseFloat(totalOrderQty) * parseFloat(results[i].qty);
      newRow.appendChild(newCell);

      printingData.totalQty = totalOrderQty;

      var obj = {
        qualityName: results[i].qualityName,
        sc: results[i].shade + " - " + '',
        rolls: results[i].rollsSeries,
        qty: results[i].qty
      };
      printingData.items.push(obj);
    }
  }
}

function loadDateFilters(currentDate) {
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

  var rollsReceived = 0;
  var qtyReceived = 0;
  // damageReceived = 0;
  var netQtyReceived = 0;

  var table = document.getElementById("viewFinishPurchaseDetailsTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableReceivingDate = table.rows[r].cells[0].innerHTML;
    // console.log(tableReceivingDate, dropdownValue);

    if (dropdownValue.trim().toUpperCase() == "SELECT DATE") {
      table.rows[r].hidden = false;
      rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(3);
    }
    else if (tableReceivingDate.trim() != dropdownValue) table.rows[r].hidden = true;
    else {
      table.rows[r].hidden = false;
      rollsReceived = (parseFloat(rollsReceived) + parseFloat(table.rows[r].cells[2].innerHTML)).toFixed(3);
      qtyReceived = (parseFloat(qtyReceived) + parseFloat(table.rows[r].cells[3].innerHTML)).toFixed(3);
    }
  }
  printingData.totalRolls = document.getElementById('viewTotalNoOfRolls').value = rollsReceived;
  printingData.totalQty = document.getElementById('viewTotalNetWt').value = netQtyReceived;
  printingData.billDate = dropdownValue.trim().toUpperCase();

  printingData.items = [];
  //console.log(tableRowData);

  for (var j = 0; j < tableRowData.length; j++) {
    if (tableRowData[j].receivingDate == dropdownValue || dropdownValue.trim().toUpperCase() == "SELECT DATE") {
      var condition = "FRESH";
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

function fetchModalData() {
  document.getElementById("modalReceivingDate").value = null;
  document.getElementById("modalSaveButton").disabled = false;
  document.getElementById("modalCloseButton").disabled = false;

  connection.query(
    "SELECT * from finishporows where billNumber = '" + billNumber + "' order by qualityName, shade;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      loadDataInModal(results, "modalPoReceivingTableBody");
    }
  );
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
      newCell.className = "col-md-2";
      newCell.id = "modalTableQuality" + currentIndex;
      newCell.textContent = tableValues[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-2";
      newCell.id = "modaltotalRowQty" + currentIndex;
      var temp1 = parseFloat(tableValues[i].rawQuantity) - parseFloat(tableValues[i].quantity) - parseFloat(tableValues[i].grQty);
      newCell.textContent = parseFloat(temp1).toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.className = "col-md-2";
      var noOfRollsReceivingTextbox = document.createElement("input");
      noOfRollsReceivingTextbox.setAttribute("type", "number");
      noOfRollsReceivingTextbox.setAttribute("class", "form-control");
      noOfRollsReceivingTextbox.setAttribute("id", "modalNoOfRollsReceiving" + currentIndex);
      noOfRollsReceivingTextbox.setAttribute("onchange", "addRows(id, this.value)");
      newCell.appendChild(noOfRollsReceivingTextbox);
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

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableMtrPending = table.rows[r].cells[2].innerHTML;
    //console.log(tablePcs);
    modalTotalMtrPending = parseFloat(modalTotalMtrPending) + parseFloat(tableMtrPending);

    var tableRollsReceiving = table.rows[r].cells[3].getElementsByTagName("input")[0].value;
    if (tableRollsReceiving != '' && parseFloat(tableRollsReceiving) > 0)
      modalRollsReceiving = parseFloat(modalRollsReceiving) + parseFloat(tableRollsReceiving);

    var tableMtrsReceiving = table.rows[r].cells[5].innerHTML.trim();
    if (tableMtrsReceiving !== '' && parseFloat(tableMtrsReceiving) > 0) {
      modalTotalMtrsReceiving = parseFloat(modalTotalMtrsReceiving) + parseFloat(tableMtrsReceiving);
    }

    document.getElementById("modalTotalMtrsPending").value = parseFloat(modalTotalMtrPending).toFixed(2);
    document.getElementById("modalTotalNoOfRollsReceiving").value = parseFloat(modalRollsReceiving).toFixed(2);
    document.getElementById("modalTotalMtrsReceiving").value = parseFloat(modalTotalMtrsReceiving).toFixed(2);
  }
  if (perform) {
    if (validateModalData() == 0) return;
    // else if (modalPoReceivingTableValidation() == 0) return;
  }
}

function addRows(id, val) {
  var tempID = id.split('modalNoOfRollsReceiving');
  var rowUL = document.getElementById('modalrowReceivingDetailsUl' + tempID[1]);
  rowUL.innerHTML = '';
  document.getElementById('modalTableRowMtrsTotal' + tempID[1]).innerHTML = '0';
  if (val <= 0 && val.trim() != '') {
    modalErrorMessage("Rolls receiving cannot be 0 or negative", false);
    document.getElementById(id).style.backgroundColor = "#ff6666";
  }
  else if (val.trim() != '') {
    modalErrorMessage("", false);
    document.getElementById(id).style.backgroundColor = "white";
  }

  for (var i = 0; i < val; i++) {
    var li = document.createElement("li");
    li.style = "display: -webkit-box";

    var liRollsSeriesReceivingTextbox = document.createElement("input");
    liRollsSeriesReceivingTextbox.setAttribute("type", "number");
    liRollsSeriesReceivingTextbox.setAttribute("class", "form-control w-50 rRLM");
    liRollsSeriesReceivingTextbox.setAttribute("placeholder", "Roll No.");
    liRollsSeriesReceivingTextbox.setAttribute("id", "liRollsSeriesReceiving" + tempID[1] + ":" + i);
    liRollsSeriesReceivingTextbox.setAttribute("disabled", true);

    var liMtrsReceivingTextbox = document.createElement("input");
    liMtrsReceivingTextbox.setAttribute("type", "number");
    liMtrsReceivingTextbox.setAttribute("class", "form-control w-50 rRLM");
    liMtrsReceivingTextbox.setAttribute("placeholder", "Mtrs");
    liMtrsReceivingTextbox.setAttribute("id", "liMtrsReceiving" + tempID[1] + ":" + i);
    liMtrsReceivingTextbox.setAttribute("onchange", "calculateRowsTotal()");

    li.innerHTML += liRollsSeriesReceivingTextbox.outerHTML + liMtrsReceivingTextbox.outerHTML;
    rowUL.appendChild(li);
  }
  calculateModalTotal(true);
  calculateRowsTotal();
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

function calculateRowsTotal() {
  var table = document.getElementById("modalPoReceivingTable");
  var rowReceiviedRowTotal = 0;
  var tempSeriesNumber = rollsSeries;
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    rowReceiviedRowTotal = 0;

    var len = parseInt(table.rows[r].cells[3].getElementsByTagName("input")[0].value);
    // var tableUlRow = tableUlRow.getElementsByTagName("li").length;
    if (len > 0) {
      for (var k = 0; k < len; k++) {
        var rowMtrs = document.getElementById("liMtrsReceiving" + (r - 1) + ":" + k).value;
        document.getElementById("liRollsSeriesReceiving" + (r - 1) + ":" + k).value = tempSeriesNumber;
        tempSeriesNumber = parseInt(tempSeriesNumber) + 1;
        if (rowMtrs) {
          rowReceiviedRowTotal = parseFloat(rowReceiviedRowTotal) + parseFloat(rowMtrs);
          table.rows[r].cells[5].innerHTML = parseFloat(rowReceiviedRowTotal).toFixed(2);
        }
      }
    }
  }
  calculateModalTotal(true);
  calculateQueryMasterRequest();
  // modalPoReceivingTableValidation();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  // inserting table data rows wise in the dyeingreceivalmaster table : add total no of rolls receiving where receiving qty is > 0 in the table  
  var tempTotalRolls = document.getElementById("modalTotalNoOfRollsReceiving").value;
  queryMasterRequest = parseInt(queryMasterRequest) + parseInt(tempTotalRolls);

  // console.log(modalRollsReceiving);
  // inserting table data into stockrows row wise: add total no of rolls 
  queryMasterRequest = parseInt(queryMasterRequest) + parseInt(tempTotalRolls);

  //updating finishpomaster once: add 1
  queryMasterRequest += 1;

  //updating finishporows once: add 1
  queryMasterRequest += 1;

  //updating stockmaster once: add 1
  //queryMasterRequest += 1;

  //updating seriesnumber once: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function saveModalData() {
  //validate modal table
  if (validateModalData() == 0) return;

  //check if primary table data is correct
  if (modalPoReceivingTableValidation() == 0) return;

  //check if secondary table data is correct
  if (validateSecondaryTable() == 0) return;

  alert("Saving the Received Quantities... Please wait...");
  document.getElementById("modalSaveButton").disabled = true;
  document.getElementById("modalCloseButton").disabled = true;

  //Not required
  //save modal primary values in dyeing receivals master
  //saveModalPrimaryData();

  //save modal secondary data in dyeing receivals rows
  secondaryModalData = makeSecondaryRowMaster();

  //update finishpomaster with received rolls and qty
  updateFinishPoMaster();

  //update finishporows with received rolls and qty against name
  createUpdatePoRows(makePrimaryRowMaster());
  // // console.log(secondaryModalData);

  //Not required
  // //add the stock receival in finish stock rows
  // var secondaryRowMaster = createUpdateStockRows(secondaryModalData);
  // // console.log(secondaryRowMaster);

  //Not required
  // //add the received stock qty in finish stock master
  // addFinishGoodsToStockMaster(secondaryRowMaster);

  //update rDNumber and rollsSeries
  updateDRNumber();
}

function modalErrorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").hidden = showDecision;
}

function modalPoReceivingTableValidation() {
  var table = document.getElementById("modalPoReceivingTable");
  resetModalTable();

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableRollsReceiving = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
    var tableRowTotal = table.rows[r].cells[5].innerHTML;

    if (tableRollsReceiving != '' && (tableRowTotal == '' || parseFloat(tableRowTotal) <= 0)) {
      table.rows[r].cells[5].style.backgroundColor = "#ff6666";
      modalErrorMessage("Receiving meters shown in RED cannot be BLANK or ZERO or NEGATIVE", false);
      return 0;
    } else {
      table.rows[r].cells[5].style.backgroundColor = "white";
      modalErrorMessage("", true);
    }

    if (parseFloat(tableRowTotal) > 0 && (tableRollsReceiving == '' || parseFloat(tableRollsReceiving) <= 0)) {
      table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      modalErrorMessage("No. of Rolls shown in RED cannot be BLANK or ZERO or NEGATIVE ", false);
      return 0;
    } else {
      table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
      modalErrorMessage("", true);
    }
  }
  return 1;
}

function resetModalTable() {
  var table = document.getElementById("modalPoReceivingTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    table.rows[r].cells[0].style.backgroundColor = "white";
    table.rows[r].cells[1].style.backgroundColor = "white";
    table.rows[r].cells[2].style.backgroundColor = "white";
    table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
    table.rows[r].cells[5].style.backgroundColor = "white";
  }
  modalErrorMessage('', true)
}

function validateSecondaryTable() {

  var table = document.getElementById("modalPoReceivingTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {

    var len = parseInt(table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim());
    if (len > 0) {
      for (var k = 0; k < len; k++) {

        var rowRoll = document.getElementById("liRollsSeriesReceiving" + (r - 1) + ":" + k);
        var rowMtrs = document.getElementById("liMtrsReceiving" + (r - 1) + ":" + k);

        if (rowMtrs.value == "" || parseFloat(rowMtrs.value) <= 0) {
          rowMtrs.style.backgroundColor = "#ff6666";
          modalErrorMessage("Enter correct quantity", false);
          return 0;
        }
        else {
          rowMtrs.style.backgroundColor = "white";
          modalErrorMessage("", true)
        }

        if (rowRoll.value == "") {
          rowRoll.style.backgroundColor = "#ff6666";
          modalErrorMessage("Roll No. cannot be blank", false);
          return 0;
        }
        else {
          rowRoll.style.backgroundColor = "white";
          modalErrorMessage("", true)
        }
      }
    }
  }
}

function makeSecondaryRowMaster() {
  var table = document.getElementById("modalPoReceivingTable");
  secondaryModalData = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableLotNo = lotNumber;
    var tableFinishQuality = '';
    var tableFinishShade = '';

    if (parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) > 0) {
      tableFinishQuality = table.rows[r].cells[0].innerHTML;
      tableFinishShade = table.rows[r].cells[1].innerHTML;
    }

    var tableUl = table.rows[r].cells[4].getElementsByTagName("ul")[0];
    var val = tableUl.getElementsByTagName("li").length;

    // console.log(val, r);
    for (var i = 0; i < val; i++) {
      var tempUlRow = r - 1;

      var rollNo = document.getElementById("liRollsSeriesReceiving" + tempUlRow + ":" + i).value;
      var secondaryRowQty = document.getElementById("liMtrsReceiving" + tempUlRow + ":" + i).value;
      var obj = {
        lotNo: tableLotNo,
        qualityName: tableFinishQuality,
        color: tableFinishShade,
        qty: secondaryRowQty,
        rolls: '1'
      };
      secondaryModalData.push(obj);

      // to enter the qty in the stock rows table
      var secondaryRowQty = document.getElementById("liMtrsReceiving" + tempUlRow + ":" + i).value;

      connection.query(
        "Insert into finishporeceivalrows VALUES ('" +
        fPoRecNumber +
        "','" +
        billNumber +
        "','" +
        tableLotNo +
        "','" +
        modalReceivingDate +
        "','" +
        rollsSeries +
        "','" +
        tableFinishQuality +
        "','" +
        tableFinishShade +
        "','" +
        secondaryRowQty +
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
        tableLotNo +
        "','" +
        tableFinishQuality +
        "','" +
        tableFinishShade +
        "','" +
        '' +
        "','" +
        secondaryRowQty +
        "', 'false', '0')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );

      var obj = {
        qualityName: tableFinishQuality,
        color: tableFinishShade,
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

function updateFinishPoMaster() {
  var myQuery = "UPDATE finishpomaster set rolls = rolls + " + modalRollsReceiving +
    ", quantity = quantity + " + modalTotalMtrsReceiving +
    " where billNumber = '" + billNumber + "'";
  //console.log(myQuery);
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
    var lotNumber = lotNumber;
    var tableQuality = table.rows[r].cells[0].innerHTML;
    var tableShade = table.rows[r].cells[1].innerHTML;
    var tableRollsReceiving = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
    var tableMtrsReceiving = table.rows[r].cells[5].innerHTML;

    var obj = {
      lotNumber: lotNumber,
      qualityName: tableQuality,
      shade: tableShade,
      rollsReceiving: tableRollsReceiving,
      qtyReceiving: tableMtrsReceiving
    };
    modalData.push(obj);
  }
  // console.log(modalData);
  return modalData;
}

function createUpdatePoRows(rowMaster) {
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var whereQuery = "";
  var allBillNumber = "'" + billNumber + "'";
  var allQuality = "";
  var allShade = "";
  var allLotNumber = "'" + lotNumber + "'";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    // var qlotNo = rowMaster[i].lotNumber;
    var qName = rowMaster[i].qualityName;
    var sName = rowMaster[i].shade;
    var rolls = rowMaster[i].rollsReceiving;
    var qty = rowMaster[i].qtyReceiving;

    if (rolls == "" || rolls == null) rolls = 0;
    if (qty == "" || qty == null) qty = 0;

    // if (allLotNumber.indexOf("'" + qlotNo + "'") == -1) {
    //   if (i != rowMaster.length && i > 0)
    //     allLotNumber = allLotNumber + ", '" + qlotNo + "'";
    //   else allLotNumber = allLotNumber + " '" + qlotNo + "'";
    // }

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    if (allShade.indexOf("'" + sName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allShade = allShade + ", '" + sName + "'";
      else allShade = allShade + " '" + sName + "'";
    }

    caseQueryRolls =
      caseQueryRolls +
      "when (qualityName = '" +
      qName +
      "' AND shade = '" +
      sName +
      "' AND billNumber = '" +
      billNumber +
      "' AND lotNo = '" +
      lotNumber +
      "' ) THEN rolls + " +
      rolls +
      " ";

    caseQueryQty =
      caseQueryQty +
      "when (qualityName = '" +
      qName +
      "' AND shade = '" +
      sName +
      "' AND billNumber = '" +
      billNumber +
      "' AND lotNo = '" +
      lotNumber +
      "' ) THEN quantity + " +
      qty +
      " ";
  }
  caseQueryRolls = caseQueryRolls + " else rolls end)";
  caseQueryQty = caseQueryQty + " else quantity end)";

  whereQuery = whereQuery + "lotNo in (" + allLotNumber + " ) AND ";
  whereQuery = whereQuery + "qualityName in (" + allQuality + " ) AND ";
  whereQuery = whereQuery + "shade in (" + allShade + " ) AND ";
  whereQuery = whereQuery + "billNumber in (" + allBillNumber + " ); ";

  performFinalUpdateOfFinishPoRowsTable(caseQueryRolls, caseQueryQty, whereQuery);
  //return rowMaster;
}

function performFinalUpdateOfFinishPoRowsTable(caseQueryRolls, caseQueryQty, whereQuery) {
  var myQuery = "UPDATE finishporows set rolls = " + caseQueryRolls +
    ", quantity = " + caseQueryQty + " where  " + whereQuery;
  console.log(myQuery, "performFinalUpdateOfFinishPoRowsTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
  });
}

function updateDRNumber() {
  fPoRecNumber = fPoRecNumber + 1;
  var caseQuery = "(case ";
  var whereQuery = '';
  caseQuery = caseQuery + "when (seriesName = 'fPoRecNumber' ) THEN " + fPoRecNumber + " " + "when (seriesName = 'rollsSeries' ) THEN " + rollsSeries + " ";
  caseQuery = caseQuery + " else seriesValue end)";
  whereQuery = whereQuery + "seriesName in ('fPoRecNumber','rollsSeries'); ";

  var myQuery = "UPDATE seriesnumber set seriesValue = " + caseQuery + " where  " + whereQuery;
  console.log(myQuery);
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
    loadDataInViewFormat(billNumber);
    // loadReceivedQtyDetails();
    document.getElementById("closeModalButton").click();
  }
  else {
    console.log("Pending");
    document.getElementById("modalSaveButton").disabled = true;
    document.getElementById("modalCloseButton").disabled = true;
  }
}

function allReceived() {
  if (confirm("Are you sure all quantities are received from the P. O. ?")) {
    // console.log(masterSent, masterReceived, masterDamage, shrinkage, uPoNumber, poNumber, lotNo);

    //update the status as completed in greypomaster 
    connection.query(
      "UPDATE finishpomaster SET status = 'COMPLETED' where billNumber = '" + billNumber + "';",
      function (err, result) {
        if (err) { alert(err + " : Tab - "); throw err; }
      }
    );

    //disable all received and receive buttons
    document.getElementById("receiveButton").disabled = true;
    document.getElementById("allReceivedButton").disabled = true;

    // document.getElementById("shrinkageReport").innerHTML = "The shrinkage was " + shrinkage + " MTRS or  " + percentWaste + "%";
    alert("Done.");
  } else document.getElementById("shrinkageReport").innerHTML = "";
}

function printInvoiceData() {
  createInvoice(printingData);
}