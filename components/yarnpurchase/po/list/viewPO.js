
var partyName = '';
var dyeingName = '';
var allQualitiesNames = [];
var allShades = [];
var allColors = [];
var totalNoOfPcs = 0;
var totalNetWt = 0;
var dateOfPOIssue = '';
var selectedStatus = '';

var modalPcs = 0;
var modalTotalWtPending = 0;
var modalPcsReceiving = 0;
var modalTotalWtReceiving = 0;
var modalReceivingDate = '';
var status = "";
var masterData = "";
var rowData = "";

const printingData = {
  docType: "Grey P. O. Purchase Bill",
  invoiceType: "P. O. No.",
  billNo: '',

  dateType: "P .O. Date",
  billDate: '',

  party1Type: "Party Name",
  partyName1: '',
  partyAddress1: '',

  partyType2: "Dyeing Name",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  folderName: 'All-Grey-PO',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableHeadings: {
    heading1: "Grey Quality Name",
    heading2: "Rolls",
    heading3: "Qty",
    heading4: "Rate / m",
    heading5: "Total"
  },

  items: [

  ],

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadDataInViewFormat(id) {
  var temp = id.split(":")

  // console.log(localStorage.getItem("isAdmin"), "Is ADMINN");

  connection.query(
    "SELECT * from greypomaster where poNumber = '" + temp[1] + "' AND uPoNumber = '" + temp[0] + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      masterData = results;
      printingData.billNo = document.getElementById("viewPONumber").value = results[0].poNumber;
      printingData.billDate = document.getElementById("viewDateOfPOIssue").value = results[0].dateOfPoIssue;
      printingData.partyName1 = document.getElementById("viewYarnPartyName").value = results[0].partyName;
      printingData.partyName2 = document.getElementById("viewDyeingName").value = results[0].dyeingName;
      printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName;
      printingData.totalRolls = document.getElementById("viewTotalNoOfRolls").innerHTML = results[0].totalRolls;
      printingData.totalQty = document.getElementById("viewTotalNetQty").innerHTML = results[0].totalQty;
      printingData.totalAmount = document.getElementById("viewTotalNetAmt").innerHTML = results[0].netAmount;
      status = results[0].status.toUpperCase();
      if (status == "COMPLETED") displayElement("editButton", false);
      else if (status == "PENDING") {
        displayElement("editButton", true);

        if (localStorage.getItem("isAdmin") == 0) displayElement("editButton", false)
        else if (localStorage.getItem("isAdmin") == 1) displayElement("editButton", true)
      }
    }
  );

  connection.query(
    "SELECT * from greyporows where poNumber = '" + temp[1] + "' AND uPoNumber = '" + temp[0] + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      rowData = results;
      addDataInViewTable(results, "viewPoDetailsTableBody");
    }
  );

  connection.query("SELECT partyName, type, address from partiesmaster ORDER BY partyName", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    allParties = results;
    printingData.partyAddress1 = fetchPartyAddress(printingData.partyName1.toUpperCase(), "PARTIES");
    printingData.partyAddress2 = fetchPartyAddress(printingData.partyName2.toUpperCase(), "DYEING");
    displayElement("waitingMessage", false);
  });
}

function addDataInViewTable(tableValues, tableName) {
  var tableInstance = document.getElementById(tableName);
  tableInstance.innerHTML = "";

  for (var i = 0; i < tableValues.length; i++) {
    var currentIndex = tableInstance.rows.length;
    var currentRow = tableInstance.insertRow(currentIndex);
    if (tableValues[i] instanceof Array) {
    } else {

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].qualityName;
      currentRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].noOfRolls;
      currentRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].qty;
      currentRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].rate;
      currentRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = (parseFloat(tableValues[i].qty) * parseFloat(tableValues[i].rate)).toFixed(2);
      currentRow.appendChild(newCell);

      var obj = {
        qualityName: tableValues[i].qualityName,
        rolls: tableValues[i].noOfRolls,
        qty: tableValues[i].qty,
        rpm: tableValues[i].rate
      };
      printingData.items.push(obj);
    }
  }
}

function printInvoideData() {
  createInvoice(printingData);
}

function editCommand() {
  if (status == "COMPLETED") {
    alert("You cannot edit this order now because order is completed");
    return;
  } else {
    prepareEditScreen(masterData, rowData);
  }
}