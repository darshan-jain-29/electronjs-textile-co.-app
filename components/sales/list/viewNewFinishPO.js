const printingData = {
  docType: "Sale P.O. Details",
  invoiceType: "Sale P.O. No.",
  billNo: '',

  dateType: "P.O. Date",
  billDate: '',

  party1Type: "Party Name",
  partyName1: '',
  partyAddress1: '',

  partyType2: "",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  miscType: "Delivery Dt.",
  miscValue: '',

  folderName: 'All-Sale-PO',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableUpperHeading: 'Sale P.O. Details',

  tableHeadings: {
    heading1: "Finish Quality",
    heading2: "Shade/Color",
    heading3: "Condition",
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

function loadDataInViewFormat(billNumber, sPNumber) {
  connection.query(
    "SELECT * from salepomaster where sPNumber = '" + sPNumber + "' and salePoNumber = '" + billNumber + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      printingData.billNo = document.getElementById("viewBillNumber").value = results[0].salePoNumber;
      printingData.billDate = document.getElementById("viewDateOfSalePO").value = results[0].dateOfPoIssue;
      printingData.miscValue = document.getElementById("viewDateOfDelivery").value = results[0].dateOfDelivery;

      printingData.partyName1 = document.getElementById("viewFinishPartyName").value = results[0].partyName;
      printingData.partyAddress1 = fetchPartyAddress(results[0].partyName.trim().toUpperCase(), "PARTIES");

      printingData.brokerName = document.getElementById("viewBrokerName").value = results[0].brokerName;
      printingData.totalQty = document.getElementById("viewTotalNetWt").value = results[0].totalQty;
      printingData.totalAmount = document.getElementById("viewNetTotal").value = results[0].totalAmt;

      var status = results[0].status.toUpperCase();
      console.log(status)
      if (status == "COMPLETED") displayElement("editButton", false);
      else if (status == "PENDING") {
        displayElement("editButton", true);
        if (localStorage.getItem("isAdmin") == 0) displayElement("editButton", false)
        else if (localStorage.getItem("isAdmin") == 1) displayElement("editButton", true)
      }
    }
  );

  connection.query(
    "SELECT * from saleporows where sPNumber = '" + sPNumber + "' and salePoNumber = '" + billNumber + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      porows = results;
      addDataInViewTable(results, "viewfinishSalePODetailsTableBody");
    }
  );
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

      newCell = document.createElement("td");
      newCell.textContent = results[i].conditions;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].qty;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rate;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var tempRowTotal = 0;
      if (parseFloat(results[i].qty) > 0 && parseFloat(results[i].rate) > 0)
        tempRowTotal = parseFloat(results[i].qty) * parseFloat(results[i].rate);
      newCell.textContent = tempRowTotal;
      newRow.appendChild(newCell);

      //logic to show the damage received in blue color
      if (results[i].conditions.toUpperCase() == 'DAMAGE') newRow.style.backgroundColor = "#add8e6";
      else newRow.style.backgroundColor = "white";

      var obj = {
        qualityName: results[i].qualityName,
        sc: results[i].shade + " - " + results[i].shade,
        rolls: results[i].conditions,
        qty: results[i].qty,
        rate: results[i].rate,
        total: tempRowTotal
      };
      printingData.items.push(obj);
    }
  }
}

function printInvoiceData() {
  createInvoice(printingData);
}