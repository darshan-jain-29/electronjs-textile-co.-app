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

  companyName: "Khimesara Silk Mills Pvt. Ltd",
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
      console.log(printingData.partyAddress1)
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
        var shrinkage = parseFloat(masterSent) - parseFloat(masterReceived) - parseFloat(masterDamage);
        var percentWaste = ((parseFloat(shrinkage) * 100) / parseFloat(masterSent)).toFixed(2);
        document.getElementById("shrinkageReport").innerHTML = "The shrinkage was " + shrinkage + " MTRS or  " + percentWaste + "%";
        displayElement("editButton", false);
      }
      else if (results[0].status.toUpperCase() == "PENDING") {
        document.getElementById("shrinkageReport").innerHTML = "";
        displayElement("editButton", true);
      }

      status = results[0].status.toUpperCase();
      if (status == "COMPLETED") displayElement("editButton", false);
      else if (status == "PENDING") {
        displayElement("editButton", true);

        if (localStorage.getItem("isAdmin") == 0) displayElement("editButton", false)
        else if (localStorage.getItem("isAdmin") == 1) displayElement("editButton", true)
      }
      // if (lotNo == '') {
      //   document.getElementById("viewLotNumber").style.backgroundColor = "#ff6666";
      //   document.getElementById("shrinkageReport").innerHTML = document.getElementById("shrinkageReport").innerHTML + " // Lot No. is Blank";
      // }
      // else {
      //   document.getElementById("viewLotNumber").style.backgroundColor = "white";
      //   document.getElementById("shrinkageReport").innerHTML = "";
      // }

      var dateFilter = document.getElementById('dateFilter');
      dateFilter.innerHTML = "";
      var options = dateFilter.getElementsByTagName("option");
      options = document.createElement("option");
      options.value = options.text = 'Select Date';
      options.selected = true;
      dateFilter.add(options);

      loadReceivedQtyDetails();
    }
  );
}

function loadReceivedQtyDetails() {
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
      if (results[i].isDamage == "true") newRow.style.backgroundColor = "#add8e6";
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

function printInvoiceData() {
  console.log(printingData.items);
  console.log(tableRowData)
  if (document.getElementById('dateFilter').selectedIndex <= 0) {
    alert("Select Dyeing Receival Date");
    document.getElementById('dateFilter').style.backgroundColor = "#ff6666";
    return;
  } else document.getElementById('dateFilter').style.backgroundColor = "white";

  createInvoice(printingData);
}
