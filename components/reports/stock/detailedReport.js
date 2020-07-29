var datatableObj;
var masterRollsTotal = 0;
var masterQtyTotal = 0;
var datatableObj;
var currentQuality, currentShade, currentColor, currentCondition, currentLotNo = '';
var currentRolls, currentQuantity = 0;
var tempPrintData = [];

const printingData = {
  docType: "Available Stock Details",
  invoiceType: "",
  billNo: '',

  dateType: "Stock Date: ",
  billDate: '',

  party1Type: "",
  partyName1: '',
  partyAddress1: '',

  partyType2: "",
  partyName2: '',
  partyAddress2: '',

  brokerName: '',

  miscType: "",
  miscValue: '',

  folderName: 'Stock-Details',

  companyName: "Khimesara Silk Mills Pvt. Ltd",
  companyAddress: "440, B Wing, 4th Floor, Kewal Ind. Estate, Senapati Bapat Marg, Lower Parel, Mumbai - 400013 Tel No. 666 36 999",

  tableUpperHeading: 'Available Stock Details',

  tableHeadings: {
    heading1: "Quality",
    heading2: "Shade",
    heading3: "Color",
    heading4: "Cond.",
    heading5: "Lot No.",
    heading6: "Roll No.",
    heading7: "Qty"
  },

  items: [

  ],

  totalRolls: '',
  totalQty: '',
  totalAmount: ''
}

function loadDataInDetailedFormat(qualityName, shade, color, condition) {
  displayElement("waitingMessage", true);
  document.getElementById("viewQualityName").value = qualityName == "" ? "ALL" : qualityName;
  document.getElementById("viewShade").value = shade == "" ? "ALL" : shade;
  document.getElementById("viewColor").value = color == "" ? "ALL" : color;
  document.getElementById("viewCondition").value = condition == "CONDITION" ? "ALL" : condition;
  document.getElementById("viewTotalRolls").value = "0000";
  document.getElementById("viewTotalQty").value = "0.000";
  masterQtyTotal = 0;
  masterRollsTotal = 0;

  var queryString = "SELECT qualityName, shade, color, isDamage, lotNo, sum(qty) as availableQty, count(rollsSeries) as availableRolls from stockrows where ";


  if (qualityName.trim().length > 0) {
    queryString += "qualityName = '" + qualityName + "' and ";
  }

  if (shade.trim().length > 0) {
    queryString += "shade = '" + shade + "' and ";
  }

  if (color.trim().length > 0) {
    queryString += "color = '" + color + "' and ";
  }

  //console.log(condition){
  if (condition.trim() == 'FRESH')
    condition = "false";
  else if (condition.trim() == 'DAMAGE')
    condition = "true";
  else condition = '';

  // console.log(condition, "--");
  if (condition.trim() != "") {
    queryString += "isDamage = '" + condition + "' and ";
  }

  queryString += " 1 group by  qualityName, shade, isDamage order by qualityName, CAST(shade as UNSIGNED), shade;"

  console.log(queryString);
  connection.query(queryString,
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      tempPrintData = results;
      displayElement("waitingMessage", false);
      addDataInViewTable(results, "viewDetailedReportTableBody");
    }
  );

}

function addDataInViewTable(results, tableName) {
  var tableInstance = document.getElementById(tableName),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  printingData.items = [];
  masterQtyTotal = 0;
  var typeRollTotal = 0;
  var typeQtyTotal = 0;

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
      conditionTemp = results[i].isDamage.toUpperCase() == "TRUE" ? "DAMAGE" : "FRESH";

      // console.log("Old Type")
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
      newCell.textContent = conditionTemp;
      newRow.appendChild(newCell);
      if (results[i].isDamage.toUpperCase() == 'DAMAGE') newRow.style.backgroundColor = "#add8e6";
      else newRow.style.backgroundColor = "white";

      newCell = document.createElement("td");
      newCell.textContent = results[i].availableRolls;
      if (parseFloat(results[i].availableQty) > 0)
        masterRollsTotal += parseFloat(results[i].availableRolls);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = parseFloat(results[i].availableQty).toFixed(2);
      if (parseFloat(results[i].availableQty) > 0)
        masterQtyTotal += parseFloat(results[i].availableQty);
      newRow.appendChild(newCell);
      ;

      printingData.totalRolls = document.getElementById("viewTotalRolls").value = document.getElementById("viewMasterRollsTotal").value = masterRollsTotal.toFixed(2);
      printingData.totalQty = document.getElementById("viewTotalQty").value = document.getElementById("viewMasterQtyTotal").value = masterQtyTotal.toFixed(2);
    }
  }

  datatableObj = $("#viewDetailedReportTable").dataTable({
    "aLengthMenu": [[5, 10, 25, 50, 75, -1], [5, 10, 25, 50, 75, "All"]],
    "pageLength": -1,
    "aaSorting": []
  });
}

function loadModalTableData(id) {
  // console.log(id)
  var tempID = id.split(":");
  document.getElementById("modalQualityName").textContent = tempID[0];
  document.getElementById("modalShadeNo").textContent = tempID[1];
  document.getElementById("modalColor").textContent = tempID[2];
  document.getElementById("modalCondition").innerHTML = tempID[3].toUpperCase() == "TRUE" ? "DAMAGE" : "FRESH";
  document.getElementById("modalLotNo").innerHTML = tempID[4];
  document.getElementById("modalTotalNoOfRolls").textContent = document.getElementById("modalTotalRolls").textContent = tempID[5];
  document.getElementById("modalTotalQuantity").textContent = document.getElementById("modalTotalQty").textContent = parseFloat(tempID[6]).toFixed(2);

  var qString = "SELECT * from stockrows where qualityName = '" +
    tempID[0] +
    "' AND shade = '" +
    tempID[1] +
    "' AND color = '" +
    tempID[2] +
    "' AND isDamage = '" +
    tempID[3] +
    "' AND lotNo = '" +
    tempID[4] +
    "' ORDER BY rollsSeries";

  // console.log(qString);

  connection.query(
    qString,
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      loadValuesInModalStockTable(results);
    }
  );
}

function loadValuesInModalStockTable(results) {
  var tableInstance = document.getElementById("modalStockTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  // console.log(results);
  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      console.log("andar aaya?");
    } else {
      newCell = document.createElement("td");
      newCell.textContent = results[i].lotNo;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rollsSeries;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].qty;
      newRow.appendChild(newCell);
    }
  }
}

function printStockData() {
  printingData.items = tempPrintData;
  // console.log(printingData.items)
  createStockPrint(printingData);
}