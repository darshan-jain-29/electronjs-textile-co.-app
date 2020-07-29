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
      newRow.appendChild(newCell);

      var obj = {
        qualityName: results[i].qualityName,
        sc: results[i].shade + " - " + '',
        rolls: results[i].rollNumber,
        qty: results[i].qty
      };
      tableRowData.push(obj);
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

function modalErrorMessage(message, showDecision) {
  document.getElementById("errorMessage").innerHTML = message;
  document.getElementById("errorMessage").hidden = showDecision;
}

function printInvoiceData() {
  console.log(printingData.items);
  console.log(tableRowData)
  if (document.getElementById('dateFilter').selectedIndex <= 0) {
    alert("Select Dyeing Receival Date");
    document.getElementById('dateFilter').style.backgroundColor = "#ff6666";
    return;
  } else document.getElementById('dateFilter').style.backgroundColor = "white";

  // createInvoice(printingData);
}