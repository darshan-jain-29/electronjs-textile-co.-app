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

  companyName: "Khimesara Silk Mills Pvt. Ltd",
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

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadDataInViewFormat(billNumber) {
  totalOrderQty = 0;
  totalOrderAmount = 0;
  billNumber = billNumber;
  nFNumber = nFNumber;

  connection.query(
    "SELECT * from finishpomaster where billNumber = '" + billNumber + "' ;",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      console.log(results);
      printingData.billNo = document.getElementById("viewBillNumber").value = results[0].billNumber;
      printingData.billDate = document.getElementById("viewDateOfFinishPurchase").value = results[0].dateOfPurchase;
      printingData.billDate = document.getElementById("viewDateOfDelivery").value = results[0].deliveryDate;
      printingData.partyName1 = document.getElementById("viewFinishPartyName").value = results[0].partyName;
      printingData.partyAddress1 = fetchPartyAddress(results[0].partyName.trim().toUpperCase(), "PARTIES");

      printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName;
      document.getElementById("viewLotNumber").value = results[0].lotNo;
    }
  );

  connection.query(
    "SELECT * from finishporows where billNumber = '" + billNumber + "'",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      console.log(results);
      addDataInViewTable(results, "viewFinishPurchaseDetailsTableBody");
    }
  );
  if (localStorage.getItem("isAdmin") == 0) displayElement("editButton", false)
  else if (localStorage.getItem("isAdmin") == 1) displayElement("editButton", true)
}

function addDataInViewTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
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
      newCell.textContent = results[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].color;
      newRow.appendChild(newCell);

      // newCell = document.createElement("td");
      // newCell.textContent = results[i].condition;
      // newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var tempQ = (parseFloat(results[i].rawQuantity) - parseFloat(results[i].quantity)
        - parseFloat(results[i].grQty)).toFixed(2);
      totalOrderQty += parseFloat(tempQ);
      newCell.textContent = tempQ;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = (parseFloat(results[i].rate)).toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var tempTotal = 0;
      if (parseFloat(tempQ) > 0 && parseFloat(results[i].rate) > 0)
        tempTotal = parseFloat(tempQ) * parseFloat(results[i].rate);
      totalOrderAmount += parseFloat(tempTotal);
      newCell.textContent = (parseFloat(tempTotal)).toFixed(2);
      newRow.appendChild(newCell);


      printingData.totalQty = document.getElementById("viewTotalNetWt").value = totalOrderQty;
      printingData.totalAmount = document.getElementById("viewTotalAmt").value = totalOrderAmount;

      // console.log(tempQ, tempTotal)
      var obj = {
        qualityName: results[i].qualityName,
        sc: results[i].shade + " - " + results[i].shade,
        rolls: results[i].rollNumber,
        qty: results[i].qty,
        rate: results[i].rate,
        total: tempTotal
      };
      printingData.items.push(obj);
    }
  }
}

function printInvoiceData() {
  createInvoice(printingData);
}

//G R code
function raiseGRHelper() {
  //show GR screen
  var tempBtn = document.getElementById("raiseGRModalHelperButton");
  tempBtn.click();
  loadGRDetails();
}