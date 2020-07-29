
var quantityDelivered = 0;
var masterQtySale = 0;

const printingData = {
  docType: "Sale P.O. Details",
  invoiceType: "Invoice No. ",
  billNo: '',

  dateType: "Dispatch Date",
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

function loadDataInDetailedFormat(partyName, qualityName, shade, color, fromDate, toDate) {
  document.getElementById("viewPartyName").value = partyName == "" ? "ALL" : partyName;
  document.getElementById("viewQualityName").value = qualityName == "" ? "ALL" : qualityName;
  document.getElementById("viewShade").value = shade == "" ? "ALL" : shade;
  document.getElementById("viewColor").value = color == "" ? "ALL" : color;

  document.getElementById("viewFromDate").value = fromDate == "" ? "ALL" : formatDate(fromDate);
  document.getElementById("viewToDate").value = toDate == "" ? "ALL" : formatDate(toDate);
  document.getElementById("masterQtySale").textContent = masterQtySale = 0;

  // console.log(partyName, qualityName, shade, color, fromDate, toDate);
  var queryString = "select s1.invoiceNumber, s1.dispatchDate, (s1.qtyDelivering - s1.qtyGR) as qtyDelivered, s1.rollsDelivering, s2.qualityName, s2.shade, s2.color,  s2.lotNo, s2.conditions, (s2.qty - s2.grQty) as qtySale, s3.partyName from dispatchmaster as s1, dispatchrows s2, salepomaster as s3 where s1.dUNumber = s2.dUNumber and s1.salePoNumber = s3.salePoNumber and ";

  if (partyName.trim().length > 0) queryString += "s3.partyName = '" + partyName + "' and ";

  if (qualityName.trim().length > 0) queryString += "s2.qualityName = '" + qualityName + "' and ";

  if (shade.trim().length > 0) queryString += "s2.shade = '" + shade + "' and ";

  if (color.trim().length > 0) queryString += "s2.color = '" + color + "' and ";

  if (fromDate.trim().length > 0) queryString += "str_to_date(s1.dispatchDate,'%d-%m-%Y' ) >= '" + fromDate + "' and ";

  if (toDate.trim().length > 0) queryString += "str_to_date(s1.dispatchDate,'%d-%m-%Y' ) <= '" + toDate + "' and ";

  queryString += " 1 order by s3.partyName, s1.duNumber desc, s2.qualityName, s2.shade, s2.color, s2.lotNo; "

  // console.log(queryString);
  connection.query(
    queryString,
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      console.log(results);
      addDataInDetailReport(results);
    }
  );
}

function addDataInDetailReport(results) {
  var divMaster = document.getElementById("detailedReportDiv");
  divMaster.innerHTML = "";

  var currentInvoiceNumber = "";
  var oldInvoiceNumber = "";
  var srNo = 0;

  for (var i = 0; i < results.length; i++) {

    if (i == 0) currentInvoiceNumber = results[i].invoiceNumber;
    else {
      oldInvoiceNumber = currentInvoiceNumber;
      currentInvoiceNumber = results[i].invoiceNumber
    }

    var firstInnerDiv = document.createElement("div");
    var secondInnerDiv = document.createElement("div");
    if (oldInvoiceNumber != currentInvoiceNumber) {
      srNo = 1;
      quantityDelivered = 0;

      var outerDiv = document.createElement("div");
      outerDiv.setAttribute("class", "card");
      outerDiv.setAttribute("id", results[i].invoiceNumber + "Div");
      divMaster.appendChild(outerDiv);

      firstInnerDiv.setAttribute("class", "row rRLM p-T10 p-B10");
      outerDiv.appendChild(firstInnerDiv);
      fillUpFirstInnerDivContent(firstInnerDiv, results[i].invoiceNumber, results[i].partyName, results[i].dispatchDate, results[i].qtyDelivered);

      secondInnerDiv.setAttribute("class", "row rRLM p-R5");
      outerDiv.appendChild(secondInnerDiv);
      fillUpSecondInnerDivContent(results[i].invoiceNumber, secondInnerDiv, srNo, results[i].qualityName, results[i].shade, results[i].color, results[i].lotNo, results[i].conditions, results[i].qtySale, true);
    } else if (oldInvoiceNumber == currentInvoiceNumber) {
      srNo += 1;
      fillUpSecondInnerDivContent(results[i].invoiceNumber, secondInnerDiv, srNo, results[i].qualityName, results[i].shade, results[i].color, results[i].lotNo, results[i].conditions, results[i].qtySale, false);
    }
  }
}

function fillUpFirstInnerDivContent(firstInnerDiv, invoiceNumber, partyName, dispatchDate, totalOrder) {

  //PoNumber
  var poNumberDiv = document.createElement("div");
  poNumberDiv.setAttribute("class", "col-md-2");
  firstInnerDiv.appendChild(poNumberDiv);

  var poNumberLabel = document.createElement("LABEL");
  poNumberLabel.setAttribute("class", "f-s14");
  poNumberLabel.innerHTML = "Invoice No.: "
  poNumberDiv.appendChild(poNumberLabel);

  var poNumberValue = document.createElement("LABEL");
  poNumberValue.setAttribute("class", "f-s14 fontBold p-L10");
  poNumberValue.innerHTML = invoiceNumber
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
  poDateLabel.innerHTML = "Dispatch Date:";
  poDateDiv.appendChild(poDateLabel);

  var poDateValue = document.createElement("LABEL");
  poDateValue.setAttribute("class", "f-s14 fontBold p-L10");
  poDateValue.innerHTML = dispatchDate;
  poDateDiv.appendChild(poDateValue);

  //PO Qty
  var poQtyDiv = document.createElement("div");
  poQtyDiv.setAttribute("class", "col-md-3");
  firstInnerDiv.appendChild(poQtyDiv);

  var poQtyLabel = document.createElement("LABEL");
  poQtyLabel.setAttribute("class", "f-s14");
  poQtyLabel.innerHTML = "Dispatch Qty:";
  poQtyDiv.appendChild(poQtyLabel);

  var poQtyValue = document.createElement("LABEL");
  poQtyValue.setAttribute("class", "f-s14 fontBold p-L10");
  poQtyValue.innerHTML = parseFloat(totalOrder).toFixed(2);
  poQtyDiv.appendChild(poQtyValue);
}

var createTable = "";
function fillUpSecondInnerDivContent(salePo, secondInnerDiv, s, qualityName, shade, color, lotNo, conditions, qtyDelivered, toCreateTable) {

  //Create Table
  if (toCreateTable) {
    createTable = document.createElement("table");
    createTable.setAttribute("class", "table table-hover table-striped ");
    createTable.setAttribute("style", "margin-bottom: 0px;");
    secondInnerDiv.appendChild(createTable);
    createTableHeader(createTable);
    createTableFooter(createTable, salePo);
    addOneRowToTable(createTable, s, qualityName, shade, color, lotNo, conditions, qtyDelivered, salePo);
  } else {
    addOneRowToTable(createTable, s, qualityName, shade, color, lotNo, conditions, qtyDelivered, salePo);
  }
}

function createTableHeader(createTable) {
  var thead = document.createElement('thead');
  // thead.setAttribute("class", "");
  createTable.appendChild(thead);

  var srNoColumn = document.createElement("th");
  srNoColumn.setAttribute("class", "col-md-1 p-T10 p-B10");
  srNoColumn.appendChild(document.createTextNode("Sr. No."));
  thead.appendChild(srNoColumn);

  var firstColumn = document.createElement("th");
  firstColumn.setAttribute("class", "col-md-3 p-T10 p-B10");
  firstColumn.appendChild(document.createTextNode("QUALITY"));
  thead.appendChild(firstColumn);

  var secondColumn = document.createElement("th");
  secondColumn.setAttribute("class", "col-md-2");
  secondColumn.appendChild(document.createTextNode("SHADE"));
  thead.appendChild(secondColumn);

  var thirdColumn = document.createElement("th");
  thirdColumn.setAttribute("class", "col-md-1");
  thirdColumn.appendChild(document.createTextNode("COLOR"));
  thead.appendChild(thirdColumn);

  var sixthColumn = document.createElement("th");
  sixthColumn.setAttribute("class", "col-md-2");
  sixthColumn.appendChild(document.createTextNode("LOT NO."));
  thead.appendChild(sixthColumn);

  var fourthColumn = document.createElement("th");
  fourthColumn.setAttribute("class", "col-md-1");
  fourthColumn.appendChild(document.createTextNode("CONDITION"));
  thead.appendChild(fourthColumn);

  var fifthColumn = document.createElement("th");
  fifthColumn.setAttribute("class", "col-md-2");
  fifthColumn.appendChild(document.createTextNode("Sale Qty"));
  thead.appendChild(fifthColumn);

}

function createTableFooter(createTable, salePo) {
  var tfoot = document.createElement('tfoot');
  createTable.appendChild(tfoot);

  var srColumn = document.createElement("th");
  tfoot.appendChild(srColumn);

  var firstColumn = document.createElement("th");
  tfoot.appendChild(firstColumn);

  var secondColumn = document.createElement("th");
  tfoot.appendChild(secondColumn);

  var thirdColumn = document.createElement("th");
  tfoot.appendChild(thirdColumn);

  var thirdColumn = document.createElement("th");
  tfoot.appendChild(thirdColumn);

  var fourthColumn = document.createElement("th");
  fourthColumn.appendChild(document.createTextNode("TOTAL"));
  tfoot.appendChild(fourthColumn);

  var fifthColumn = document.createElement("th");
  fifthColumn.setAttribute("class", "  p-T10 p-B10");
  fifthColumn.setAttribute("id", salePo + "QtyDelivered");
  tfoot.appendChild(fifthColumn);
}

function addOneRowToTable(createTable, s, qualityName, shade, color, lotNo, conditions, qtyDelivered, salePo) {
  var newRow = document.createElement('tr');
  createTable.appendChild(newRow);

  var sColumn = document.createElement("td");
  sColumn.setAttribute("class", "col-md-1");
  sColumn.appendChild(document.createTextNode(s));
  newRow.appendChild(sColumn);

  var firstColumn = document.createElement("td");
  firstColumn.setAttribute("class", "col-md-3");
  firstColumn.appendChild(document.createTextNode(qualityName));
  newRow.appendChild(firstColumn);

  var secondColumn = document.createElement("td");
  secondColumn.setAttribute("class", "col-md-2");
  secondColumn.appendChild(document.createTextNode(shade));
  newRow.appendChild(secondColumn);

  var thirdColumn = document.createElement("td");
  thirdColumn.setAttribute("class", "col-md-1");
  thirdColumn.appendChild(document.createTextNode(color));
  newRow.appendChild(thirdColumn);

  var fourthColumn = document.createElement("td");
  fourthColumn.setAttribute("class", "col-md-1");
  fourthColumn.appendChild(document.createTextNode(lotNo));
  newRow.appendChild(fourthColumn);

  var fifthColumn = document.createElement("td");
  fifthColumn.setAttribute("class", "col-md-1");
  fifthColumn.appendChild(document.createTextNode(conditions));
  newRow.appendChild(fifthColumn);

  var sixthColumn = document.createElement("td");
  sixthColumn.setAttribute("class", "col-md-2");
  sixthColumn.appendChild(document.createTextNode(qtyDelivered));
  newRow.appendChild(sixthColumn);
  quantityDelivered = parseFloat(quantityDelivered) + parseFloat(qtyDelivered);
  masterQtySale = parseFloat(masterQtySale) + parseFloat(quantityDelivered);

  document.getElementById(salePo + "QtyDelivered").textContent = quantityDelivered.toFixed(2);
  document.getElementById("masterQtySale").textContent = masterQtySale.toFixed(2);
}



function printInvoiceData() {
  createInvoice(printingData);
}