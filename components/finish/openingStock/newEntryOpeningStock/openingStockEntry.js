var dropdownMasterValues = [];
var oSNumber = '';
var dateOfEntry = "";
var lotNo = "0";
var isDamage = "false";
var noOfRolls = "0";
var qualityName = "";
var totalQty = 0;
var openingStockData = [];
var tableOpeningStockData = [];
var datatableObj;
var queryMasterRequest = 0;
var queryMasterResponse = 0;
var variables = require("../../common/pooldb");
var connection = variables.dbconnection;

function loadData() {
  document.title = "Finish Stock Entry - Kalash Infotech";

  displayElement("waitingMessage", true);
  connection.query("SELECT seriesValue from seriesnumber where seriesName ='oSNumber' order by seriesName asc;", function (error, results) {
    if (error) { alert(error + " : Tab - "); throw error; }
    oSNumber = parseInt(results[0].seriesValue);
    // console.log(oSNumber);
  });

  // connection.query(
  //   "SELECT * from openingstock ORDER BY qualityName, shadeNo, qty, pcsFinish",
  //   function (error, results) {
  //     if (error) { alert(error + " : Tab - "); throw error; }
  //     loadValuesInTable(results);
  //   }
  // );
  connection.query("SELECT * from qsc ORDER BY type, name", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    dropdownMasterValues = results;
    loadDataDropdown("qualityName", dropdownMasterValues);
    displayElement("waitingMessage", false);
  });

  selectTodaysDate();
  //loadValuesInTable(tableOpeningStockData);
}

function selectTodaysDate() {
  document.getElementById("dateOfEntry").valueAsDate = new Date();
}

function loadValuesInTable(tableValues) {
  var t = "";
  var tableInstance = document.getElementById("stockTableBody"),
    newRow,
    newCell;
  //tableInstance.innerHTML = "";
  // for (var i = 0; i < tableValues.length; i++) {
  newRow = document.createElement("tr");
  tableInstance.appendChild(newRow);
  if (datatableObj) {
    datatableObj.fnClearTable();
    datatableObj.fnDraw();
    datatableObj.fnDestroy();
  }
  if (tableValues instanceof Array) {
  } else {
    newCell = document.createElement("td");
    newCell.textContent = dateOfEntry;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    newCell.textContent = lotNo;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    if (parseFloat(tableValues.damageQty) > 0) newCell.textContent = "DAMAGE";
    else newCell.textContent = "FRESH";
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    newCell.textContent = tableValues.qualityName;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    newCell.textContent = tableValues.shade;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    newCell.textContent = tableValues.color;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    if (parseFloat(tableValues.damageQty) > 0)
      newCell.textContent = tableValues.damageQty;
    else newCell.textContent = tableValues.qty;
    newRow.appendChild(newCell);

    newCell = document.createElement("td");
    newCell.textContent = tableValues.rollNo;
    newRow.appendChild(newCell);

  }
  datatableObj = $("#stockTable").dataTable({
    "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
    "pageLength": 25,
    "aaSorting": []
  });

}

function addRows(id, val) {
  var rowUL = document.getElementById('openingStockUL');
  rowUL.innerHTML = '';

  if (val > 0)
    document.getElementById("openingStockUL").style.display = "initial";
  else document.getElementById("openingStockUL").style.display = "none";

  for (var i = 0; i < val; i++) {
    var li = document.createElement("li");
    li.style = "display: -webkit-box";

    var shadeNoDropdown = document.createElement("select");
    shadeNoDropdown.setAttribute("id", "openingStockULShade" + ":" + i);
    shadeNoDropdown.setAttribute("class", "form-control w-30");

    var colorDropdown = document.createElement("select");
    colorDropdown.setAttribute("id", "openingStockULColor" + ":" + i);
    colorDropdown.setAttribute("class", "form-control w-30");

    var liMtrsReceivingTextbox = document.createElement("input");
    liMtrsReceivingTextbox.setAttribute("type", "number");
    liMtrsReceivingTextbox.setAttribute("class", "form-control w-20 rRLM");
    liMtrsReceivingTextbox.setAttribute("placeholder", "Mtrs");
    liMtrsReceivingTextbox.setAttribute("id", "openingStockULMtrsReceiving" + ":" + i);
    liMtrsReceivingTextbox.setAttribute("onchange", "calculateRowsTotal()");

    var rollNoTextbox = document.createElement("input");
    rollNoTextbox.setAttribute("type", "text");
    rollNoTextbox.setAttribute("class", "form-control w-20 rRLM");
    rollNoTextbox.setAttribute("placeholder", "Roll No.");
    rollNoTextbox.setAttribute("id", "openingStockULRollNo" + ":" + i);

    li.innerHTML += shadeNoDropdown.outerHTML + colorDropdown.outerHTML + liMtrsReceivingTextbox.outerHTML + rollNoTextbox.outerHTML;
    rowUL.appendChild(li);
    loadDataDropdown("openingStockULShade" + ":" + i, dropdownMasterValues);
    loadDataDropdown("openingStockULColor" + ":" + i, dropdownMasterValues);
  }
  calculateRowsTotal();
}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);
  // console.log(theSelect);
  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName.includes("qualityName")) {
    options.text = "Quality Name"; options.value = "DEFAULT";
  }
  else if (selectName.includes("openingStockULShade")) {
    options.text = "Shade"; options.value = "DEFAULT";
  }
  else if (selectName.includes("openingStockULColor")) {
    options.text = "Color"; options.value = "DEFAULT";
  }

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName.includes("qualityName") && results[i].type == "qualityName") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName.includes("openingStockULShade") && results[i].type == "shade") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName.includes("openingStockULColor") && results[i].type == "color") {
      options.value = options.text = results[i].name.toUpperCase();
      theSelect.add(options);
    }
  }
  return;
}

function calculateRowsTotal() {
  var rowReceiviedRowTotal = 0;

  var tableUlRow = document.getElementById("openingStockUL");
  var len = tableUlRow.getElementsByTagName("li").length;
  if (len > 0) {
    for (var k = 0; k < len; k++) {
      var rowMtrs = document.getElementById("openingStockULMtrsReceiving" + ":" + k).value;

      if (rowMtrs) rowReceiviedRowTotal = parseFloat(rowReceiviedRowTotal) + parseFloat(rowMtrs);
      else rowReceiviedRowTotal = parseFloat(rowReceiviedRowTotal) + parseFloat(0);

      document.getElementById("totalQty").value = parseFloat(rowReceiviedRowTotal).toFixed(2);
    }
  } else document.getElementById("totalQty").value = "0";

  calculateQueryMasterRequest();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;
  noOfRolls = parseInt(document.getElementById("noOfRolls").value);

  // inserting the UL data in openingstock table : add total no of LI in UL
  queryMasterRequest += noOfRolls;

  // inserting the UL data in stockrows table : add total no of LI in UL
  queryMasterRequest += noOfRolls;

  //updating stockmaster : add 1 for quality name
  queryMasterRequest += 1;

  //updating seriesnumber : add 1 for oSNumber
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function addValuesToDatabase() {

  if (validate() == 0) return;
  alert("Adding to the Stock. Please wait....");

  document.getElementById("addRow").disabled = true;

  //Make Opening stock row and save entry in stock rows and opening stock entry table
  openingStockData = makeSecondaryRowMaster();
  // console.log(openingStockData);

  //add the stock receival in finish stock rows
  var openingStockRowMaster = createUpdateStockRows(openingStockData);
  // console.log(openingStockRowMaster);

  //add the received stock qty in finish stock master
  addReceivedGoodsToFinishStock(openingStockRowMaster);

  //update oSNumber 
  updateOSNumber();

  // console.log(openingStockData)
  addDataToTable(openingStockData);
}

function validate() {
  setHeaders();

  if (dateOfEntry == "" || dateOfEntry == null) {
    document.getElementById("dateOfEntry").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("dateOfEntry").style.backgroundColor = "white";

  if (lotNo == "" || lotNo == null) {
    document.getElementById("lotNo").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("lotNo").style.backgroundColor = "white";

  if (noOfRolls == "" || noOfRolls == null || parseFloat(noOfRolls) <= 0) {
    document.getElementById("noOfRolls").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("noOfRolls").style.backgroundColor = "white";

  if (qualityName == "" || qualityName == null || qualityName.toUpperCase() == "QUALITY NAME" || qualityName.toUpperCase() == "DEFAULT") {
    document.getElementById("qualityName").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("qualityName").style.backgroundColor = "white";

  var tableUlRow = document.getElementById("openingStockUL");
  var len = tableUlRow.getElementsByTagName("li").length;
  if (len > 0) {
    for (var k = 0; k < len; k++) {
      var rowMtrs = document.getElementById("openingStockULMtrsReceiving" + ":" + k).value.trim();

      if (rowMtrs == "" || rowMtrs == null || parseFloat(rowMtrs) <= 0) {
        document.getElementById("openingStockULMtrsReceiving" + ":" + k).style.backgroundColor = "#ff6666";
        return 0;
      } else document.getElementById("openingStockULMtrsReceiving" + ":" + k).style.backgroundColor = "white";

      var rowRollNo = document.getElementById("openingStockULRollNo" + ":" + k).value.trim();

      if (rowRollNo == "" || rowRollNo == null || rowRollNo.length <= 0) {
        document.getElementById("openingStockULRollNo" + ":" + k).style.backgroundColor = "#ff6666";
        return 0;
      } else document.getElementById("openingStockULRollNo" + ":" + k).style.backgroundColor = "white";
    }
  }

  if (totalQty == "" || totalQty == null) {
    document.getElementById("totalQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalQty").style.backgroundColor = "white";

  return 1;
}

function setHeaders() {
  dateOfEntry = document.getElementById("dateOfEntry").value;

  if (dateOfEntry.length > 0) {
    var tempArray = dateOfEntry.split("-");
    dateOfEntry = tempArray[2] + "-" + tempArray[1] + "-" + tempArray[0];
  }

  lotNo = document.getElementById("lotNo").value.trim();
  isDamage = document.getElementById("isDamage").checked;
  noOfRolls = document.getElementById("noOfRolls").value;

  var tempQ = document.getElementById("qualityName");
  qualityName = tempQ.options[tempQ.selectedIndex].value;

  totalQty = document.getElementById("totalQty").value;
}

function makeSecondaryRowMaster() {
  var tableUlRow = document.getElementById("openingStockUL");
  var len = tableUlRow.getElementsByTagName("li").length;
  openingStockData = [];

  if (len > 0) {
    for (var k = 0; k < len; k++) {

      var tempS = document.getElementById("openingStockULShade" + ":" + k);
      var secondaryRowShade = tempS.options[tempS.selectedIndex].value;
      if (secondaryRowShade == "DEFAULT") secondaryRowShade = '';

      var tempC = document.getElementById("openingStockULColor" + ":" + k);
      var secondaryRowColor = tempC.options[tempC.selectedIndex].value;
      if (secondaryRowColor == "DEFAULT") secondaryRowColor = '';

      var rowMtrs = document.getElementById("openingStockULMtrsReceiving" + ":" + k).value.trim();
      var rowRollNo = document.getElementById("openingStockULRollNo" + ":" + k).value.trim();

      // to prepare the object we are changing rowMtrs to 0
      var damageQty = 0;
      console.log(isDamage)
      if (isDamage) {
        damageQty = rowMtrs;
        rowMtrs = 0;
      }

      var obj = {
        qualityName: qualityName,
        shade: secondaryRowShade,
        color: secondaryRowColor,
        qty: rowMtrs,
        rolls: '1',
        rollNo: rowRollNo,
        damageQty: damageQty
      };
      openingStockData.push(obj);

      // to enter the qty in the stock rows table
      rowMtrs = document.getElementById("openingStockULMtrsReceiving" + ":" + k).value.trim();

      //console.log(obj);
      connection.query(
        "Insert into openingstock VALUES ('" +
        oSNumber +
        "', '" +
        dateOfEntry +
        "', '" +
        lotNo +
        "', '" +
        isDamage +
        "', '" +
        // noOfRolls +
        // "', '" +
        qualityName +
        "', '" +
        secondaryRowShade +
        "', '" +
        secondaryRowColor +
        "', '" +
        rowMtrs +
        "', '" +
        rowRollNo +
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
        rowRollNo +
        "','" +
        lotNo +
        "','" +
        qualityName +
        "','" +
        secondaryRowShade +
        "','" +
        secondaryRowColor +
        "','" +
        rowMtrs +
        "','" +
        isDamage +
        "','" +
        '0' +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );
      oSNumber = oSNumber + 1;
    }
  }
  //console.log(modalData);
  return openingStockData;
}

function createUpdateStockRows(openingStockData) {
  var tempR = [];
  var t = {
    qualityName: openingStockData[0].qualityName,
    qty: openingStockData[0].qty,
    rolls: 1,
    damageQty: openingStockData[0].damageQty
  };
  tempR.push(t);
  //console.log(openingStockData.length);

  for (var i = 1; i < openingStockData.length; i++) {
    if (openingStockData[i].qty && openingStockData[i].qty > 0 ||
      openingStockData[i].damageQty && openingStockData[i].damageQty > 0) {
      var j = 0;
      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == openingStockData[i].qualityName && tempR[j].isDamage == openingStockData[i].isDamage) break;
      }

      if (j < tempR.length) {
        tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(openingStockData[i].qty)).toFixed(2);
        tempR[j].damageQty = (parseFloat(tempR[j].damageQty) + parseFloat(openingStockData[i].damageQty)).toFixed(2);
        tempR[j].rolls = parseInt(tempR[j].rolls) + 1;
      } else {
        var t = {
          qualityName: openingStockData[i].qualityName,
          qty: openingStockData[i].qty,
          rolls: openingStockData[i].rolls,
          damageQty: openingStockData[i].damageQty
        };
        tempR.push(t);
      }
    }
  }
  // console.log(tempR);
  return tempR;
}

function addReceivedGoodsToFinishStock(secondaryRowMaster) {
  //console.log(secondaryRowMaster);
  for (var i = 0; i < secondaryRowMaster.length; i++) {
    checkIfQualityNameExists(secondaryRowMaster[i], i);
  }
}

function checkIfQualityNameExists(data) {
  connection.query(
    "SELECT rolls, qty from stockmaster where qualityName = '" +
    data.qualityName +
    "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      console.log(results);
      if (results.length > 0) updateStockMaster(data);
      else saveNewEntryIntoStockMaster(data);
    }
  );
}

function updateStockMaster(data) {
  // console.log(data, "Exist");
  connection.query(
    "UPDATE stockmaster SET rolls = rolls + " + data.rolls +
    ", qty = qty + " + data.qty +
    ", damage = damage + " + data.damageQty + " WHERE qualityName ='" + data.qualityName + "';",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function saveNewEntryIntoStockMaster(data) {
  // insert a new entry in the master
  connection.query(
    "Insert into stockmaster VALUES ('" +
    data.qualityName +
    "', '" +
    data.rolls +
    "', '" +
    data.qty +
    "', '" +
    data.damageQty +
    "', '0');",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      console.log(result);
    }
  );
}

function updateOSNumber() {
  var myQuery = "UPDATE seriesnumber set seriesValue = '" + oSNumber + "' where  seriesName = 'oSNumber';";
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

function addDataToTable(openingStockData) {
  var tempA = [];
  console.log(openingStockData, openingStockData.length)
  for (var i = 0; i < openingStockData.length; i++) {
    loadValuesInTable(openingStockData[i]);
  }
}

function checkIfWorkingCompleted() {
  if (queryMasterRequest == queryMasterResponse) {
    console.log("Completed");
    alert("Added to the Stock Successfully...");
    document.getElementById("addRow").disabled = false;
    resetPage();
    // window.location.reload();
  }
  else {
    console.log("Pending");
    document.getElementById("addRow").disabled = true;
  }
}

function resetPage() {
  document.getElementById("dateOfEntry").value =
    document.getElementById("lotNo").value =
    document.getElementById("noOfRolls").value = '';
  document.getElementById("isDamage").checked = false;
  document.getElementById("qualityName").selectedIndex = 0;
  document.getElementById('openingStockUL').innerHTML = '';
  document.getElementById("totalQty").value = 0.00;
}