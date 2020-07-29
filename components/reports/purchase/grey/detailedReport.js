
var quantityPurchased = 0;
var masterPurchased = 0;
// var masterPurchased = 0;

const printingData = {
  docType: "Sale P.O. Details",
  invoiceType: "Sale BILL NO.",
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

function loadDataInDetailedFormat(partyName, dyeingName, qualityName, fromDate, toDate) {
  document.getElementById("viewPartyName").value = partyName == "" ? "ALL" : partyName;
  // document.getElementById("viewDyeingName").value = dyeingName == "" ? "ALL" : dyeingName;
  document.getElementById("viewQualityName").value = qualityName == "" ? "ALL" : qualityName;

  document.getElementById("viewFromDate").value = fromDate == "" ? "ALL" : formatDate(fromDate);
  document.getElementById("viewToDate").value = toDate == "" ? "ALL" : formatDate(toDate);
  document.getElementById("masterQtyPurchased").textContent = masterPurchased = 0;

  var queryString = "select s1.poNumber, s1.uPoNumber, s1.partyName, s1.dyeingName, s1.dateOfPoIssue, s2.qualityName, s2.qty, s2.noOfRolls, s1.totalQty, s1.totalRolls from greypomaster as s1, greyporows s2 where s1.poNumber = s2.poNumber and s1.uPoNumber = s2.uPoNumber and ";

  if (partyName.trim().length > 0) queryString += "s1.partyName = '" + partyName + "' and ";

  if (qualityName.trim().length > 0) queryString += "s2.qualityName = '" + qualityName + "' and ";

  if (fromDate.trim().length > 0) queryString += "str_to_date(s1.dateOfPoIssue,'%d-%m-%Y' ) >= '" + fromDate + "' and ";

  if (toDate.trim().length > 0) queryString += "str_to_date(dateOfPoIssue,'%d-%m-%Y' ) <= '" + toDate + "' and ";

  queryString += " 1 order by s1.uPoNumber desc, s1.partyName,  s2.qualityName; "

  console.log(queryString);
  connection.query(
    queryString,
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      addDataInDetailReport(results);
    }
  );
}

function addDataInDetailReport(results) {
  var divMaster = document.getElementById("detailedReportDiv");
  divMaster.innerHTML = "";

  var currentBillNumber = "";
  var oldBillNumber = "";
  var srNo = 0;

  for (var i = 0; i < results.length; i++) {

    if (i == 0) currentBillNumber = results[i].poNumber;
    else {
      oldBillNumber = currentBillNumber;
      currentBillNumber = results[i].poNumber
    }

    var firstInnerDiv = document.createElement("div");
    var secondInnerDiv = document.createElement("div");
    if (oldBillNumber != currentBillNumber) {
      srNo = 1;
      quantityPurchased = 0;

      var outerDiv = document.createElement("div");
      outerDiv.setAttribute("class", "card");
      outerDiv.setAttribute("id", results[i].poNumber + "Div");
      divMaster.appendChild(outerDiv);

      firstInnerDiv.setAttribute("class", "row rRLM p-T10 p-B10");
      outerDiv.appendChild(firstInnerDiv);
      fillUpFirstInnerDivContent(firstInnerDiv, results[i].poNumber, results[i].partyName, results[i].dateOfPoIssue, results[i].totalQty);

      secondInnerDiv.setAttribute("class", "row rRLM p-R5");
      outerDiv.appendChild(secondInnerDiv);
      fillUpSecondInnerDivContent(results[i].poNumber, secondInnerDiv, srNo, results[i].qualityName, results[i].qty, results[i].noOfRolls, results[i].totalQty, results[i].totalRolls, true);
    } else if (oldBillNumber == currentBillNumber) {
      srNo += 1;
      fillUpSecondInnerDivContent(results[i].poNumber, secondInnerDiv, srNo, results[i].qualityName, results[i].qty, results[i].noOfRolls, results[i].totalQty, results[i].totalRolls, false);
    }
  }
}

function fillUpFirstInnerDivContent(firstInnerDiv, billNumber, partyName, dateOfPoIssue, totalOrder) {

  //PoNumber
  var poNumberDiv = document.createElement("div");
  poNumberDiv.setAttribute("class", "col-md-2");
  firstInnerDiv.appendChild(poNumberDiv);

  var poNumberLabel = document.createElement("LABEL");
  poNumberLabel.setAttribute("class", "f-s14");
  poNumberLabel.innerHTML = "BILL NO.:"
  poNumberDiv.appendChild(poNumberLabel);

  var poNumberValue = document.createElement("LABEL");
  poNumberValue.setAttribute("class", "f-s14 fontBold p-L10");
  poNumberValue.innerHTML = billNumber
  poNumberDiv.appendChild(poNumberValue);

  //Party Name 
  var partyNameDiv = document.createElement("div");
  partyNameDiv.setAttribute("class", "col-md-4");
  firstInnerDiv.appendChild(partyNameDiv);

  var partyNameLabel = document.createElement("LABEL");
  partyNameLabel.setAttribute("class", "f-s14");
  partyNameLabel.innerHTML = "Party Name:";
  partyNameDiv.appendChild(partyNameLabel);

  var partyNameValue = document.createElement("LABEL");
  partyNameValue.setAttribute("class", "f-s14 fontBold p-L10");
  partyNameValue.innerHTML = partyName;
  partyNameDiv.appendChild(partyNameValue);

  //PO Date 
  var poDateDiv = document.createElement("div");
  poDateDiv.setAttribute("class", "col-md-3");
  firstInnerDiv.appendChild(poDateDiv);

  var poDateLabel = document.createElement("LABEL");
  poDateLabel.setAttribute("class", "f-s14");
  poDateLabel.innerHTML = "Purchase Date:";
  poDateDiv.appendChild(poDateLabel);

  var poDateValue = document.createElement("LABEL");
  poDateValue.setAttribute("class", "f-s14 fontBold p-L10");
  poDateValue.innerHTML = dateOfPoIssue;
  poDateDiv.appendChild(poDateValue);

  //PO Qty
  var poQtyDiv = document.createElement("div");
  poQtyDiv.setAttribute("class", "col-md-3");
  firstInnerDiv.appendChild(poQtyDiv);

  var poQtyLabel = document.createElement("LABEL");
  poQtyLabel.setAttribute("class", "f-s14");
  poQtyLabel.innerHTML = "Purchase Qty:";
  poQtyDiv.appendChild(poQtyLabel);

  var poQtyValue = document.createElement("LABEL");
  poQtyValue.setAttribute("class", "f-s14 fontBold p-L10");
  poQtyValue.innerHTML = totalOrder;
  poQtyDiv.appendChild(poQtyValue);
}

var createTable = "";
function fillUpSecondInnerDivContent(billNumber, secondInnerDiv, s, qualityName, rowQty, rowRolls, totalQty, totalRolls, toCreateTable) {

  //Create Table
  if (toCreateTable) {
    createTable = document.createElement("table");
    createTable.setAttribute("class", "table table-hover table-striped ");
    createTable.setAttribute("style", "margin-bottom: 0px;");
    secondInnerDiv.appendChild(createTable);
    createTableHeader(createTable);
    createTableFooter(createTable, billNumber);
    addOneRowToTable(createTable, s, qualityName, rowRolls, rowQty, totalQty, totalRolls, billNumber);
  } else {
    addOneRowToTable(createTable, s, qualityName, rowRolls, rowQty, totalQty, totalRolls, billNumber);
  }
}

function createTableHeader(createTable) {
  var thead = document.createElement('thead');
  // thead.setAttribute("class", "");
  createTable.appendChild(thead);

  var srNoColumn = document.createElement("th");
  srNoColumn.setAttribute("class", "col-md-2 p-T10 p-B10");
  srNoColumn.appendChild(document.createTextNode("Sr. No."));
  thead.appendChild(srNoColumn);

  var firstColumn = document.createElement("th");
  firstColumn.setAttribute("class", "col-md-5 p-T10 p-B10");
  firstColumn.appendChild(document.createTextNode("QUALITY"));
  thead.appendChild(firstColumn);

  var secondColumn = document.createElement("th");
  secondColumn.setAttribute("class", "col-md-2");
  secondColumn.appendChild(document.createTextNode("ROLLS PURCHASED"));
  thead.appendChild(secondColumn);

  var thirdColumn = document.createElement("th");
  thirdColumn.setAttribute("class", "col-md-3");
  thirdColumn.appendChild(document.createTextNode("QTY PURCHASED"));
  thead.appendChild(thirdColumn);

  // var fourthColumn = document.createElement("th");
  // fourthColumn.setAttribute("class", "col-md-1");
  // fourthColumn.appendChild(document.createTextNode("CONDITION"));
  // thead.appendChild(fourthColumn);

  // var fifthColumn = document.createElement("th");
  // fifthColumn.setAttribute("class", "col-md-3");
  // fifthColumn.appendChild(document.createTextNode("QTY PURCHASED"));
  // thead.appendChild(fifthColumn);

  // var sixthColumn = document.createElement("th");
  // sixthColumn.setAttribute("class", "col-md-2");
  // sixthColumn.appendChild(document.createTextNode("QTY PENDING"));
  // thead.appendChild(sixthColumn);
}

function createTableFooter(createTable, billNumber) {
  var tfoot = document.createElement('tfoot');
  createTable.appendChild(tfoot);

  var srColumn = document.createElement("th");
  tfoot.appendChild(srColumn);

  var firstColumn = document.createElement("th");
  tfoot.appendChild(firstColumn);

  // var secondColumn = document.createElement("th");
  // tfoot.appendChild(secondColumn);

  // var thirdColumn = document.createElement("th");
  // tfoot.appendChild(thirdColumn);

  var fourthColumn = document.createElement("th");
  fourthColumn.appendChild(document.createTextNode("TOTAL"));
  tfoot.appendChild(fourthColumn);

  var fifthColumn = document.createElement("th");
  fifthColumn.setAttribute("class", "  p-T10 p-B10");
  fifthColumn.setAttribute("id", billNumber + "QtyPurchased");
  // fifthColumn.appendChild(document.createTextNode("QTY PURCHASED"));
  tfoot.appendChild(fifthColumn);

  // var sixthColumn = document.createElement("th");
  // sixthColumn.setAttribute("class", "p-T10 p-B10");
  // // sixthColumn.appendChild(document.createTextNode("QTY PENDING"));
  // sixthColumn.setAttribute("id", billNumber + "QtyPending");
  // tfoot.appendChild(sixthColumn);
}

function addOneRowToTable(createTable, s, qualityName, rowRolls, rowQty, totalQty, totalRolls, billNumber) {
  console.log(rowRolls, rowQty)
  var newRow = document.createElement('tr');
  createTable.appendChild(newRow);

  var sColumn = document.createElement("td");
  sColumn.setAttribute("class", "col-md-2");
  sColumn.appendChild(document.createTextNode(s));
  newRow.appendChild(sColumn);

  var firstColumn = document.createElement("td");
  firstColumn.setAttribute("class", "col-md-5");
  firstColumn.appendChild(document.createTextNode(qualityName));
  newRow.appendChild(firstColumn);

  var secondColumn = document.createElement("td");
  secondColumn.setAttribute("class", "col-md-2");
  secondColumn.appendChild(document.createTextNode(rowRolls));
  newRow.appendChild(secondColumn);

  // var thirdColumn = document.createElement("td");
  // thirdColumn.setAttribute("class", "col-md-3");
  // thirdColumn.appendChild(document.createTextNode(rowQty));
  // newRow.appendChild(thirdColumn);

  // var fourthColumn = document.createElement("td");
  // fourthColumn.setAttribute("class", "col-md-1");
  // fourthColumn.appendChild(document.createTextNode(conditions));
  // newRow.appendChild(fourthColumn);

  var fifthColumn = document.createElement("td");
  fifthColumn.setAttribute("class", "col-md-3");
  fifthColumn.appendChild(document.createTextNode(rowQty));
  newRow.appendChild(fifthColumn);
  quantityPurchased = parseFloat(quantityPurchased) + parseFloat(rowQty);

  // var sixthColumn = document.createElement("td");
  // sixthColumn.setAttribute("class", "col-md-2");
  // var tempQP = (parseFloat(qty) - parseFloat(rowQty).toFixed(2));
  // sixthColumn.appendChild(document.createTextNode(tempQP));
  // newRow.appendChild(sixthColumn);

  masterPurchased = parseFloat(masterPurchased) + parseFloat(rowQty);

  document.getElementById(billNumber + "QtyPurchased").textContent = quantityPurchased.toFixed(2);
  document.getElementById("masterQtyPurchased").textContent = masterPurchased.toFixed(2);
}

function printInvoiceData() {
  createInvoice(printingData);
}