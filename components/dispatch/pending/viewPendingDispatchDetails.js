var salePoNumber = '';
var sPNumber = '';
var dUNumber = 0;
var salePoRows = [];
var totalOrderQty = 0;
var totalDispatchedRolls = 0;
var totalDispatchedQty = 0;
var partyName = '';
var modalQualityName = "";
var modalShade = "";
var modalColor = "";
var modalCondition = "";
var modalQtyRequired = 0;
var modalWtSelecting = 0;
var selectingLotRow = -1;
var currentDeliveryNo = '';

var rollsSeries = 0;
var nonZeroNewRows = 0;

var invoiceNo = "";
var dispatchDate = "";
var lrNo = "";
var transportName = "";
var shippingAddress = "";
var haste = "";
var totalDispatchingRolls = 0;
var totalDispatchingQty = 0;
var tableSecondaryData = [];
var queryMasterRequest = 0;
var queryMasterResponse = 0;

const printingData = {
  stickerFolderName: 'Stickers',

  companyName: "KHIMESARA",
  stickerCompanyName: "KHIMESARA",

  stickers: [
  ],
}

function loadDataInViewFormat(billNumber, sPNumber, secondFetchFlag) {
  connection.query(
    "SELECT * from salepomaster where sPNumber = '" + sPNumber + "' and salePoNumber = '" + billNumber + "';",
    function (error, results) {
      // console.log(results)
      if (error) { alert(error + " : Tab - "); throw error; }
      sPNumber = sPNumber;
      salePoNumber = document.getElementById("viewBillNumber").value = results[0].salePoNumber;
      document.getElementById("viewDateOfSalePO").value = results[0].dateOfPoIssue;
      document.getElementById("viewDateOfDelivery").value = results[0].dateOfDelivery;
      partyName = document.getElementById("viewFinishPartyName").value = results[0].partyName.toUpperCase();
      document.getElementById("viewBrokerName").value = results[0].brokerName;

      totalOrderQty = document.getElementById("viewOrderQty").value = document.getElementById("viewTotalOrderQty").value = results[0].totalQty;
      // totalDispatchedRolls = document.getElementById("viewTotalRollsDelivered").value = results[0].totalRollsDelivered;
      // totalDispatchedQty = document.getElementById("viewTotalQtyDelivered").value = results[0].totalQtyDelivered;
      currentDeliveryNo = results[0].deliveryNo;

      // invoiceNo = document.getElementById("invoiceNo").value = salePoNumber + "/" + currentDeliveryNo;
      invoiceNo = document.getElementById("invoiceNo").value = "";

      // if we are calling the funciton first time then we are passing true else false
      if (secondFetchFlag) fetchShippingAddresses(partyName)
      else {
        document.getElementById("dispatchDate").value = document.getElementById("lrNo").value = document.getElementById("haste").value = '';
        document.getElementById("transportNames").selectedIndex = document.getElementById("shippingAddresses").selectedIndex = "0";
        document.getElementById("totalDispatchingRolls").value = document.getElementById("totalDispatchingQty").value = '0';
      };

      if (results[0].status.toUpperCase() == "COMPLETED") {
        document.getElementById("saveDispatchButton").disabled = true;
        document.getElementById("resetButton").disabled = true;
      } else if (results[0].status.toUpperCase() == "PENDING") {
        document.getElementById("saveDispatchButton").disabled = false;
        document.getElementById("resetButton").disabled = false;
      }

    }

  );

  //fetch dispatch unique number
  connection.query("SELECT seriesValue from seriesnumber where seriesName in ('dUNumber', 'rollsSeries');", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results)
    rollsSeries = parseInt(results[0].seriesValue);
    dUNumber = parseInt(results[1].seriesValue);
    // console.log(rollsSeries);
  });

  connection.query(
    "SELECT * from saleporows where sPNumber = '" + sPNumber + "' and salePoNumber = '" + billNumber + "';",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      salePoRows = results;
      addDataInViewTable(results);
      // console.log(salePoRows, "salePoRows");
    }
  );
  // if we are calling the funciton first time then we are passing true else false
  if (secondFetchFlag) {
    connection.query("SELECT partyName from partiesmaster where type='transport' ORDER BY partyName", function (
      error,
      results
    ) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      loadDataDropdown("transportNames", results);
    });
  }
  nonZeroNewRows = 0;
}

function fetchShippingAddresses(partyName) {
  connection.query("SELECT address, address2, address3 from partiesmaster where type='parties' and partyName = '" + partyName + "' ORDER BY partyName", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    loadDataDropdown("shippingAddresses", results);
  });
}

function addDataInViewTable(tableValues) {
  var tableInstance = document.getElementById("dispatchPendingTableBody");
  tableInstance.innerHTML = "";
  for (var i = 0; i < tableValues.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);

    if (tableValues[i] instanceof Array) {
    } else {
      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].qualityName;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].shade;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].color;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].conditions;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].qty;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = tableValues[i].rate;
      newRow.appendChild(newCell);

      // newCell = document.createElement("td");
      // newCell.textContent = tableValues[i].qtyDelivered;
      // newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var pendingRowQty = parseFloat(tableValues[i].qty) - parseFloat(tableValues[i].qtyDelivered);
      newCell.textContent = pendingRowQty.toFixed(2);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.id = "availableRowQty" + i;
      var rowCondition = tableValues[i].conditions == "FRESH" ? "false" : "true";
      var selectButtonID = tableValues[i].qualityName + ":" + tableValues[i].shade + ":" + tableValues[i].color + ":" + tableValues[i].conditions + ":" + pendingRowQty + ":" + tableValues[i].conditions + ":" + i;
      fetchAvailableQty(tableValues[i].qualityName, tableValues[i].shade, tableValues[i].color, rowCondition, "availableRowQty" + i, pendingRowQty, selectButtonID);
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      var viewButton = document.createElement("input");
      viewButton.setAttribute("type", "button");
      viewButton.setAttribute("title", "Select Lots");
      viewButton.setAttribute("class", "btn btn-danger btn-fill statusBtn");
      viewButton.setAttribute("id", selectButtonID);
      viewButton.setAttribute("value", "Select");
      viewButton.setAttribute("data-toggle", "modal");
      viewButton.setAttribute("data-target", "#selectDispatch");
      viewButton.setAttribute("onclick", "loadStockModalTableData(this.id)");
      viewButton.setAttribute("disabled", true);
      newCell.appendChild(viewButton);
      newRow.appendChild(newCell);

      // console.log(selectButtonID)
      newCell = document.createElement("td");

      var selectedDropdown = document.createElement("ul");
      selectedDropdown.setAttribute("id", "selectedStock" + i);
      newCell.appendChild(selectedDropdown);
      newRow.appendChild(newCell);

      if (tableValues[i].conditions.toUpperCase() == 'DAMAGE') newRow.style.backgroundColor = "#add8e6";
      else newRow.style.backgroundColor = "white";
    }
  }
}

function fetchAvailableQty(qualityName, shade, color, conditions, id, pendingRowQty, selectButtonID) {
  // console.log(conditions)
  connection.query("select sum(qty) as total from stockrows where qualityName = '" + qualityName + "' and shade = '" + shade + "' and color = '" + color + "' and isDamage = '" + conditions + "' ;", function (
    error,
    results
  ) {
    if (error) { alert(error + " : Tab - "); throw error; }
    // console.log(results);
    var availableRowQty = 0;
    if (parseFloat(results[0].total) > 0) {
      availableRowQty = parseFloat(results[0].total);
      if (parseFloat(pendingRowQty) > 0)
        document.getElementById(selectButtonID).disabled = false;
    }

    //else document.getElementById(selectButtonID).disabled = "true";

    document.getElementById(id).innerHTML = availableRowQty.toFixed(2);
    if (parseFloat(availableRowQty) < parseFloat(pendingRowQty))
      document.getElementById(id).style = "color: red";
    else document.getElementById(id).style = "color: green";
  });
}

function loadDataDropdown(selectName, results) {
  var theSelect = document.getElementById(selectName);

  var options = theSelect.getElementsByTagName("option");
  theSelect.innerHTML = "";

  // add first row as dummy in select
  options = document.createElement("option");
  options.value = "";
  if (selectName == "transportNames") options.text = "Select Transport";
  else if (selectName == "shippingAddresses") options.text = "Select Ship Add.";

  options.disabled = false;
  options.selected = true;
  theSelect.add(options);

  for (var i = 0; i < results.length; i++) {
    options = document.createElement("option");

    if (selectName == "transportNames") {
      options.value = options.text = results[i].partyName.toUpperCase();
      theSelect.add(options);
    }
    else if (selectName == "shippingAddresses") {

      options.value = options.text = results[i].address.toUpperCase();
      theSelect.add(options);

      options = document.createElement("option");
      options.value = options.text = results[i].address2.toUpperCase();
      theSelect.add(options);

      options = document.createElement("option");
      options.value = options.text = results[i].address3.toUpperCase();
      theSelect.add(options);
    }
  }
  return;
}

function loadStockModalTableData(id) {

  var tempID = id.split(":");
  // console.log(tempID);
  modalQualityName = tempID[0].trim();
  modalShade = tempID[1].trim();
  modalColor = tempID[2].trim();
  modalCondition = tempID[3].trim();
  modalQtyRequired = tempID[4].trim();
  selectingLotRow = tempID[6].trim();
  modalWtSelecting = 0;

  document.getElementById("modalQualityName").textContent = tempID[0].trim() + " ";
  document.getElementById("modalShadeNo").textContent = tempID[1] ? tempID[1].trim() + " " : "-" + " ";
  document.getElementById("modalColor").textContent = tempID[2] ? tempID[2].trim() + " " : "-" + " ";
  document.getElementById("modalCondition").textContent = tempID[3] ? tempID[3].trim() + " " : "-" + " ";
  document.getElementById("modalQtyRequired").textContent = tempID[4] ? tempID[4].trim() : "-";
  document.getElementById("modalNetWtSelecting").value = "0";

  connection.query(
    "SELECT * from stockrows where qualityName = '" +
    modalQualityName +
    "' AND shade = '" +
    modalShade +
    "' AND color = '" +
    modalColor +
    "' and qty > 0 ORDER BY lotNo",
    function (error, results) {
      if (error) { alert(error + " : Tab - "); throw error; }
      // console.log(results);
      loadValuesInStockModalStockTable(results);
      document.getElementById("modalTotalNoOfRolls").innerHTML = results.length;
    }
  );
}

function loadValuesInStockModalStockTable(results) {
  var tableInstance = document.getElementById("modalDispatchSelectionTableBody"),
    newRow,
    newCell;
  tableInstance.innerHTML = "";
  var rowAvailableTotal = 0;
  //console.log(results);
  for (var i = 0; i < results.length; i++) {
    newRow = document.createElement("tr");
    tableInstance.appendChild(newRow);
    if (results[i] instanceof Array) {
      //console.log("andar aaya?");
    } else {
      newCell = document.createElement("td");
      newCell.textContent = results[i].lotNo;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = results[i].rollsSeries;
      newRow.appendChild(newCell);

      newCell = document.createElement("td");
      newCell.textContent = parseFloat(results[i].qty) > 0 ? results[i].qty : 0;
      newCell.id = "availableQty" + i;
      newRow.appendChild(newCell);
      if (parseFloat(results[i].qty) > 0) rowAvailableTotal = parseFloat(results[i].qty);

      newCell = document.createElement("td");
      var rowWtSelectingTextbox = document.createElement("input");
      rowWtSelectingTextbox.setAttribute("type", "number");
      rowWtSelectingTextbox.setAttribute("class", "form-control inputProgramCardWithColMd");
      rowWtSelectingTextbox.setAttribute("id", "modaltotalRowQtySelecting" + i);
      rowWtSelectingTextbox.setAttribute("onchange", "calculateModalTotal()");
      newCell.appendChild(rowWtSelectingTextbox)
      newRow.appendChild(newCell)
    }
  }
  document.getElementById("modalTotalQty").innerHTML = rowAvailableTotal.toFixed(2);
}

function calculateModalTotal() {
  var table = document.getElementById("modalDispatchSelectionTable");
  modalWtSelecting = 0;

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var currentSelVal = table.rows[r].cells[3].getElementsByTagName("input")[0].value;
    if (currentSelVal > 0) {

      if (currentSelVal > parseFloat(table.rows[r].cells[2].innerHTML)) {
        hideUnhideModalError('block', 'Selected Qty is greater than the AVAILABLE QTY', true);
        table.rows[r].cells[2].style.backgroundColor = table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
      } else {
        table.rows[r].cells[2].style.backgroundColor = table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
        hideUnhideModalError('none', '', false);
      }

      //Dispatch qty can be greater then order qty
      // var tableSelectedQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value;
      // //console.log(tablePcs);
      // modalWtSelecting = parseFloat(modalWtSelecting) + parseFloat(tableSelectedQty);
      // if (parseFloat(modalWtSelecting) > parseFloat(modalQtyRequired)) {
      //   hideUnhideModalError('block', 'Selected quantity is greater than the required quantity.', true);
      //   return;
      // } else {
      //   hideUnhideModalError('none', '', false);
      // }
      document.getElementById("modalNetWtSelecting").value = parseFloat(modalWtSelecting).toFixed(2);
    }
  }
}

function hideUnhideModalError(showError, errorM, disableSave) {
  document.getElementById("errorMessage").style.display = showError;
  document.getElementById("errorMessage").innerHTML = errorM;
  document.getElementById("modalSaveButton").disabled = disableSave;
}

function saveModalData() {
  //validate modal table
  if (validateModalData() == 0) {
    hideUnhideModalError('block', 'No Lot Selected. Select Atleast 1 Lot To Proceed Ahead.', true);
    return false;
  } else {
    hideUnhideModalError('none', '', false);
  }

  //add data in the pending changes and update the list
  // modalData = makeRowMasterObject(updateModalData()); // old logic where roll no was not considered

  modalData = updateModalData();
  // console.log(modalData);

  //add modal data in the database // we are saving this data while we  are pushing the save dispatch data
  //saveValues(modalData);

  //show data on the view details page
  loadValuesInDispatchPendingTable(modalData);

  calculateDispatchingQtyTotal();

  document.getElementById("closeModalButton").click();
  // console.log(modalData);
}

function validateModalData() {
  //check if table data is correct
  return modalTableValidation();
}

function modalTableValidation() {
  var counter = 0;
  var table = document.getElementById("modalDispatchSelectionTable");
  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableSelectedQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();

    if (parseFloat(tableSelectedQty) > 0)
      counter += 1;
  }
  if (counter == 0)
    return 0;
  else return 1;
}

function updateModalData() {
  modalData = [];
  var table = document.getElementById("modalDispatchSelectionTable");

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    if (table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim()) {
      var tableLotNo = table.rows[r].cells[0].innerHTML;
      var tableRollNo = table.rows[r].cells[1].innerHTML;
      var tableSelectedQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
      tableSelectedQty = parseFloat(tableSelectedQty).toFixed(2);

      var tableQtypending = parseFloat(table.rows[r].cells[2].innerHTML) - parseFloat(tableSelectedQty);
      tableQtypending = parseFloat(tableQtypending).toFixed(2);
      if (tableSelectedQty > 0) {
        var obj = {
          rowNumber: selectingLotRow,
          lotNo: tableLotNo,
          rollNo: tableRollNo,
          qtySelected: tableSelectedQty,
          qtyPending: tableQtypending
        };
        modalData.push(obj);
      }
    }
    ///console.log(obj);
  }
  //console.log(modalData);
  return modalData;
}

function loadValuesInDispatchPendingTable(m) {
  // console.log(m);
  // var selectButtonID = document.getElementById("comingFromRow").innerHTML;
  // var tempID = selectButtonID.split("Select");
  var ul = document.getElementById("selectedStock" + selectingLotRow);
  ul.innerHTML = "";

  for (var i = 0; i < m.length; i++) {
    if (document.getElementById("selectedStock" + selectingLotRow)) {
      var selLot = m[i].lotNo;
      var selRollNo = m[i].rollNo;
      var selValue = m[i].qtySelected;

      if (selValue == "" || selValue == null) selValue = 0;

      if (parseFloat(selValue) > 0) {
        var li = document.createElement("li");
        li.appendChild(
          document.createTextNode(
            selLot + " / " + selRollNo + " / " + selValue
          )
        );
        li.setAttribute("id", selLot + ":" + selRollNo + ":" + m[i].qtyPending);
        ul.appendChild(li);
      }
    }
  }
  // document.getElementById("closeModal").click();
  // if (verifyEnableSaveButton())
  //   document.getElementById("saveProgramButton").disabled = false;
}

function calculateDispatchingQtyTotal() {
  var table = document.getElementById("dispatchPendingTable");
  totalDispatchingQty = 0;
  totalDispatchingRolls = 0;

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    //console.log("In");
    var tableSelectedLot = table.rows[r].cells[9].getElementsByTagName("ul")[0].getElementsByTagName("li");
    if (tableSelectedLot.length > 0) {
      var ul = document.getElementById("selectedStock" + r - 1);
      for (var i = 0; i < tableSelectedLot.length; i++) {

        var ulRow = tableSelectedLot[i].innerHTML;
        var tempData = ulRow.split(" / ");
        totalDispatchingRolls = parseFloat(totalDispatchingRolls) + 1;
        totalDispatchingQty = parseFloat(totalDispatchingQty) + parseFloat(tempData[2]);
        totalDispatchingQty = parseFloat(totalDispatchingQty).toFixed(2);
      }
    }
  }
  document.getElementById("totalDispatchingRolls").value = totalDispatchingRolls;
  document.getElementById("totalDispatchingQty").value = totalDispatchingQty;
  calculateQueryMasterRequest();
}

function calculateQueryMasterRequest() {
  queryMasterRequest = 0;
  queryMasterResponse = 0;

  // inserting table data into dispatchmaster master: add 1 
  queryMasterRequest += 1;

  console.log(totalDispatchingRolls);
  // inserting table data into dispatchrows row wise: add total no of rolls 
  queryMasterRequest += parseInt(totalDispatchingRolls);

  //updating stockrows once: add 1
  queryMasterRequest += 1;

  // add new rows in stock rows
  queryMasterRequest += parseInt(nonZeroNewRows);

  //updating saleporows once: add 1
  queryMasterRequest += 1;

  //updating stockmaster once: add 1
  queryMasterRequest += 1;

  //updating salepomaster once: add 1
  queryMasterRequest += 1;

  //updating seriesnumber once: add 1
  queryMasterRequest += 1;

  console.log(queryMasterRequest);
}

function saveDispatch() {
  //validate modal table
  if (validatePageHeader() == 0) return;
  //delete below both the lines
  //setHeaderData();
  //calculateDispatchingQtyTotal();

  alert("Saving Dispatch...Please Wait...");
  printingData.stickers = [];
  document.getElementById("saveDispatchButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  //save the primary details in the dispatch master table
  savePrimaryData();

  //reduce the qty against the row-lot no in stock rows table and in make row master push the values in the dispatch rows table
  var receivedSecondaryTableData = prepareUpdateStockRowsQuery(makeRowMaster());

  // insert into stockrows new rows with new rollNumber for all modalData where pendingQty>0
  addNewRowsIntoStockRowsTable(receivedSecondaryTableData);

  //prepare sale po master row
  var tempSecondaryTableData = makeSalePoRowMaster(receivedSecondaryTableData);
  // console.log(tempSecondaryTableData, "tempSecondaryTableData");

  //add the qty and rolls delivered in salePoRows array
  var updatedSalePoRows = makeUpdatedSalePoRows(salePoRows, tempSecondaryTableData);

  //save the table details in the sale po rows table
  prepareUpdateSalePoRowsQuery(updatedSalePoRows);

  // console.log(tempSecondaryTableData)
  //reduce the no of rolls, qty delivered in the stock master table
  prepareUpdateStockMasterQuery(makeStockMasterRowMaster(tempSecondaryTableData));

  //update the no of rolls, qty delivered in the salepomaster table. Also, update no of delivery couonter
  performUpdatesOnSalePoMasterTable();

  //update dUNumber
  updateSeriesNumber();

}

function validatePageHeader() {
  calculateDispatchingQtyTotal();
  setHeaderData();

  if (invoiceNo === null || invoiceNo === "") {
    document.getElementById("invoiceNo").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("invoiceNo").style.backgroundColor = "white";

  if (dispatchDate === null || dispatchDate === "") {
    document.getElementById("dispatchDate").style.backgroundColor = "#ff6666";
    return 0;
  } else
    document.getElementById("dispatchDate").style.backgroundColor = "white";

  // if (lrNo === null || lrNo === "") {
  //   document.getElementById("lrNo").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("lrNo").style.backgroundColor = "white";

  if (transportName === null || transportName === "" || transportName == 'Select Transport') {
    document.getElementById("transportNames").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("transportNames").style.backgroundColor = "white";

  if (shippingAddress === null || shippingAddress === "" || shippingAddress == 'Select Ship Add.') {
    document.getElementById("shippingAddresses").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("shippingAddresses").style.backgroundColor = "white";

  // if (haste === null || haste === "") {
  //   document.getElementById("haste").style.backgroundColor = "#ff6666";
  //   return 0;
  // } else document.getElementById("haste").style.backgroundColor = "white";

  if (totalDispatchingRolls === null || totalDispatchingRolls === "" || totalDispatchingRolls <= 0) {
    document.getElementById("totalDispatchingRolls").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalDispatchingRolls").style.backgroundColor = "white";

  if (totalDispatchingQty === null || totalDispatchingQty === "" || totalDispatchingQty <= 0) {
    document.getElementById("totalDispatchingQty").style.backgroundColor = "#ff6666";
    return 0;
  } else document.getElementById("totalDispatchingQty").style.backgroundColor = "white";
}

function setHeaderData() {
  invoiceNo = document.getElementById("invoiceNo").value;

  dispatchDate = document.getElementById("dispatchDate").value;
  if (dispatchDate) {
    var tempDateArray = dispatchDate.split("-");
    dispatchDate =
      tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
  }

  lrNo = document.getElementById("lrNo").value.trim();

  var tempT = document.getElementById("transportNames");
  transportName = tempT.options[tempT.selectedIndex].text;

  var tempS = document.getElementById("shippingAddresses");
  shippingAddress = tempS.options[tempS.selectedIndex].text;

  haste = document.getElementById("haste").value.trim();
  totalDispatchingRolls = document.getElementById("totalDispatchingRolls").value;
  totalDispatchingQty = document.getElementById("totalDispatchingQty").value;
}

function savePrimaryData() {
  //save dispatch master
  connection.query(
    "Insert into dispatchmaster VALUES ('" +
    dUNumber +
    "','" +
    salePoNumber +
    "','" +
    invoiceNo +
    "','" +
    dispatchDate +
    "','" +
    lrNo +
    "','" +
    transportName +
    "','" +
    shippingAddress +
    "','" +
    haste +
    "','" +
    totalDispatchingRolls +
    "','" +
    totalDispatchingQty +
    "','" +
    0 +
    "')",
    function (err, result) {
      if (err) { alert(err + " : Tab - "); throw err; }
      queryMasterResponse += 1;
      checkIfWorkingCompleted();
    }
  );
}

function makeRowMaster() {
  var table = document.getElementById("dispatchPendingTable");
  tableSecondaryData = [];

  for (var r = 1, n = table.rows.length - 1; r < n; r++) {
    var tableQualityName = table.rows[r].cells[0].innerHTML;
    var tableShade = table.rows[r].cells[1].innerHTML;
    var tableColor = table.rows[r].cells[2].innerHTML;
    var tableCondition = table.rows[r].cells[3].innerHTML;
    var tableRate = table.rows[r].cells[5].innerHTML;
    var tableIsDamage = 'true';
    if (tableCondition.toUpperCase() == 'FRESH') tableIsDamage = 'false';

    var tableUl = table.rows[r].cells[9].getElementsByTagName("ul")[0];
    var val = tableUl.getElementsByTagName("li").length;
    // console.log(val)
    if (val > 0)
      for (var i = 0; i < val; i++) {

        var ulRow = tableUl.getElementsByTagName("li")[i].innerHTML;
        // console.log(ulRow)
        var tempId = tableUl.getElementsByTagName("li")[i].getAttribute('id');
        var tempQtyPending = tempId.split(":");
        var newQty = tempQtyPending[2];
        var tempData = ulRow.split(" / ");

        var ulLotNo = tempData[0];
        var ulRollNo = tempData[1];
        var ulQtySelected = tempData[2];
        var newRollNo = 0;
        if (parseFloat(newQty) > 0) {
          newRollNo = rollsSeries;
          rollsSeries = parseInt(rollsSeries) + 1;
          nonZeroNewRows += 1;
        }

        var obj = {
          qualityName: tableQualityName,
          shade: tableShade,
          color: tableColor,
          conditions: tableCondition,
          isDamage: tableIsDamage,
          lotNo: ulLotNo,
          rollNo: ulRollNo,
          qty: ulQtySelected,
          newQty: newQty,
          newRollNo: newRollNo
        };

        var stickerObj = {
          qualityName: tableQualityName,
          shade: tableShade,
          color: tableColor,
          qty: ulQtySelected,
          rollNo: ulRollNo
        };
        printingData.stickers.push(stickerObj);

        tableSecondaryData.push(obj);

        //console.log(obj);
        connection.query(
          "Insert into dispatchrows VALUES ('" +
          dUNumber +
          "','" +
          invoiceNo +
          "','" +
          tableQualityName +
          "','" +
          tableShade +
          "','" +
          tableColor +
          "','" +
          tableCondition +
          "','" +
          ulLotNo +
          "','" +
          ulRollNo +
          "','" +
          ulQtySelected +
          "','" +
          0 +
          "','" +
          tableRate +
          "')",
          function (err, result) {
            if (err) { alert(err + " : Tab - "); throw err; }
            queryMasterResponse += 1;
            checkIfWorkingCompleted();
          }
        );
      }
  }
  // console.log(tableSecondaryData);
  return tableSecondaryData;
}

function prepareUpdateStockRowsQuery(rowMaster) {
  // console.log(rowMaster)
  var caseQueryQty = "(case ";
  var whereQuery = "";
  var allQuality = "";
  var allShade = "";
  var allColor = "";
  var allIsDamage = "";
  var allRollNo = "";
  var allLotNo = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var shade = rowMaster[i].shade;
    var color = rowMaster[i].color;
    var isDamage = rowMaster[i].isDamage;
    var lotNo = rowMaster[i].lotNo;
    var rollNo = rowMaster[i].rollNo;
    var qty = rowMaster[i].qty.trim();

    if (qty == "" || qty == null) qty = 0;

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    if (allShade.indexOf("'" + shade + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allShade = allShade + ", '" + shade + "'";
      else allShade = allShade + " '" + shade + "'";
    }

    if (allColor.indexOf("'" + color + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allColor = allColor + ", '" + color + "'";
      else allColor = allColor + " '" + color + "'";
    }

    if (allIsDamage.indexOf("'" + isDamage + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allIsDamage = allIsDamage + ", '" + isDamage + "'";
      else allIsDamage = allIsDamage + " '" + isDamage + "'";
    }

    if (allLotNo.indexOf("'" + lotNo + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allLotNo = allLotNo + ", '" + lotNo + "'";
      else allLotNo = allLotNo + " '" + lotNo + "'";
    }

    if (allRollNo.indexOf("'" + rollNo + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allRollNo = allRollNo + ", '" + rollNo + "'";
      else allRollNo = allRollNo + " '" + rollNo + "'";
    }

    caseQueryQty = caseQueryQty + "when (qualityName = '" + qName +
      "' AND shade = '" + shade +
      "' AND color = '" + color +
      "' AND isDamage = '" + isDamage +
      "' AND lotNo = '" + lotNo +
      "' AND rollsSeries = '" + rollNo +
      "' ) THEN 0 ";
  }
  caseQueryQty = caseQueryQty + " else qty end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality +
    " )  AND shade in (" + allShade +
    " )  AND color in (" + allColor +
    " )  AND isDamage in (" + allIsDamage +
    " )  AND lotNo in (" + allLotNo +
    " )  AND rollsSeries in (" + allRollNo +
    ")";
  performUpdatesOnStockRowsTable(caseQueryQty, whereQuery);
  console.log(rowMaster, "NEW ROWMASTER");
  return rowMaster;
}

function performUpdatesOnStockRowsTable(caseQueryQty, whereQuery, rowMaster) {
  var myQuery = "UPDATE stockrows set qty = " + caseQueryQty +
    " where  " + whereQuery;
  console.log(myQuery, "performUpdatesOnStockRowsTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
    return rowMaster;
  });
}

function addNewRowsIntoStockRowsTable(m) {
  console.log(m);
  for (var k = 0; k < m.length; k++) {
    var qName = m[k].qualityName;
    var shade = m[k].shade;
    var color = m[k].color;
    var rollNo = m[k].newRollNo;
    var lotNo = m[k].lotNo;
    var isDam = m[k].isDamage;
    var qty = m[k].newQty;

    var stickerObj = {
      qualityName: qName,
      shade: shade,
      color: color,
      qty: qty + "*",
      rollNo: rollNo
    };
    printingData.stickers.push(stickerObj);

    if (parseFloat(qty) > 0) {
      connection.query(
        "Insert into stockrows VALUES ('" +
        rollNo +
        "','" +
        lotNo +
        "','" +
        qName +
        "','" +
        shade +
        "','" +
        color +
        "','" +
        qty +
        "','" +
        isDam +
        "','" +
        '0' +
        "')",
        function (err, result) {
          if (err) { alert(err + " : Tab - "); throw err; }
          queryMasterResponse += 1;
          checkIfWorkingCompleted();
        }
      );
    }
  }
}

function makeSalePoRowMaster(sTD) {
  var tempR = [];
  var t = {
    qualityName: sTD[0].qualityName,
    shade: sTD[0].shade,
    color: sTD[0].color,
    conditions: sTD[0].conditions,
    qty: sTD[0].qty,
    rolls: 1
  };
  tempR.push(t);
  //console.log(sTD.length);

  for (var i = 1; i < sTD.length; i++) {
    if (sTD[i].qty && parseFloat(sTD[i].qty) > 0) {

      var j = 0;

      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == sTD[i].qualityName &&
          tempR[j].shade == sTD[i].shade &&
          tempR[j].color == sTD[i].color &&
          tempR[j].conditions == sTD[i].conditions) break;
      }

      if (j < tempR.length) {
        tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(sTD[i].qty)).toFixed(2);
        tempR[j].rolls = parseInt(tempR[j].rolls) + 1;
      } else {
        var t = {
          qualityName: sTD[i].qualityName,
          shade: sTD[i].shade,
          color: sTD[i].color,
          conditions: sTD[i].conditions,
          qty: sTD[i].qty,
          rolls: 1
        };
        tempR.push(t);
      }
    }
  }
  return tempR;
}

function makeUpdatedSalePoRows(sPR, tSTD) {
  for (var i = 0; i < sPR.length; i++) {
    for (var j = 0; j < tSTD.length; j++) {
      if (sPR[i].qualityName == tSTD[j].qualityName &&
        sPR[i].shade == tSTD[j].shade &&
        sPR[i].color == tSTD[j].color &&
        sPR[i].conditions == tSTD[j].conditions) {

        sPR[i].rollsDelivered = parseInt(sPR[i].rollsDelivered) + parseInt(tSTD[j].rolls);
        sPR[i].qtyDelivered = parseFloat(sPR[i].qtyDelivered) + parseFloat(tSTD[j].qty);
        if (sPR[i].qtyDelivered == sPR[i].qty) sPR[i].status = "COMPLETED";

      }
    }
  }
  return sPR;
}

function prepareUpdateSalePoRowsQuery(rowMaster) {
  // console.log(rowMaster)
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var caseQueryStatus = "(case ";

  var whereQuery = "";

  var allQuality = "";
  var allShade = "";
  var allColor = "";
  var allCondition = "";
  var allSalePoNumber = "'" + salePoNumber + "'";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var shade = rowMaster[i].shade;
    var color = rowMaster[i].color;
    var conditions = rowMaster[i].conditions;
    var rollsDelivered = rowMaster[i].rollsDelivered;
    var qtyDelivered = rowMaster[i].qtyDelivered;
    var status = rowMaster[i].status;

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    if (allShade.indexOf("'" + shade + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allShade = allShade + ", '" + shade + "'";
      else allShade = allShade + " '" + shade + "'";
    }

    if (allColor.indexOf("'" + color + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allColor = allColor + ", '" + color + "'";
      else allColor = allColor + " '" + color + "'";
    }

    if (allCondition.indexOf("'" + conditions + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allCondition = allCondition + ", '" + conditions + "'";
      else allCondition = allCondition + " '" + conditions + "'";
    }

    caseQueryRolls = caseQueryRolls + "when (qualityName = '" + qName +
      "' AND shade = '" + shade +
      "' AND color = '" + color +
      "' AND conditions = '" + conditions +
      "' AND salePoNumber = '" + salePoNumber +
      "' ) THEN  " + rollsDelivered + " ";

    caseQueryQty = caseQueryQty + "when (qualityName = '" + qName +
      "' AND shade = '" + shade +
      "' AND color = '" + color +
      "' AND conditions = '" + conditions +
      "' AND salePoNumber = '" + salePoNumber +
      "' ) THEN  " + qtyDelivered + " ";

    caseQueryStatus = caseQueryStatus + "when (qualityName = '" + qName +
      "' AND shade = '" + shade +
      "' AND color = '" + color +
      "' AND conditions = '" + conditions +
      "' AND salePoNumber = '" + salePoNumber +
      "' ) THEN '" + status + "' ";
  }

  caseQueryRolls = caseQueryRolls + " else rollsDelivered end)";
  caseQueryQty = caseQueryQty + " else qtyDelivered end)";
  caseQueryStatus = caseQueryStatus + " else status end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality +
    " )  AND shade in (" + allShade +
    " )  AND color in (" + allColor +
    " )  AND conditions in (" + allCondition +
    " )  AND salePoNumber in (" + allSalePoNumber +
    ")";

  performUpdatesOnSalePoRowsTable(caseQueryRolls, caseQueryQty, caseQueryStatus, whereQuery);
}

function performUpdatesOnSalePoRowsTable(caseQueryRolls, caseQueryQty, caseQueryStatus, whereQuery) {
  var myQuery = "UPDATE saleporows set rollsDelivered = " + caseQueryRolls +
    ", qtyDelivered = " + caseQueryQty +
    ", status = " + caseQueryStatus + " where  " + whereQuery;

  // console.log(myQuery, "performUpdatesOnSalePoRowsTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err, "saleporows"); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
    // console.log(result);
  });
}

function makeStockMasterRowMaster(sTD) {
  var tempR = [];
  var qty0 = sTD[0].conditions == "FRESH" ? sTD[0].qty : 0
  var damage0 = sTD[0].conditions == "DAMAGE" ? sTD[0].qty : 0
  var t = {
    qualityName: sTD[0].qualityName,
    qty: qty0,
    rolls: sTD[0].rolls,
    damage: damage0,
    pending: sTD[0].qty
  };
  tempR.push(t);

  for (var i = 1; i < sTD.length; i++) {
    if (sTD[i].qty && parseFloat(sTD[i].qty) > 0) {

      var j = 0;

      for (j = 0; j < tempR.length; j++) {
        if (tempR[j].qualityName == sTD[i].qualityName) break;
      }

      if (j < tempR.length) {
        tempR[j].rolls = parseInt(tempR[j].rolls) + parseInt(sTD[i].rolls);

        if (sTD[i].conditions.toUpperCase() == "FRESH") {
          tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(sTD[i].qty)).toFixed(2);
          tempR[j].damage = (parseFloat(tempR[j].damage) + parseFloat(0)).toFixed(2);
        }
        else if (sTD[i].conditions.toUpperCase() == "DAMAGE") {
          tempR[j].qty = (parseFloat(tempR[j].qty) + parseFloat(0)).toFixed(2);
          tempR[j].damage = (parseFloat(tempR[j].damage) + parseFloat(sTD[i].qty)).toFixed(2);
        }

        tempR[j].pending = (parseInt(tempR[j].pending) + parseInt(sTD[i].qty)).toFixed(2);
      } else {
        var t = {
          qualityName: sTD[i].qualityName,
          rolls: sTD[i].rolls,
          qty: sTD[i].conditions == "FRESH" ? sTD[i].qty : 0,
          damage: sTD[i].conditions == "DAMAGE" ? sTD[i].qty : 0,
          pending: sTD[i].qty
        };
        tempR.push(t);
      }
    }
  }
  return tempR;
}

function prepareUpdateStockMasterQuery(rowMaster) {
  // console.log(rowMaster)
  var caseQueryRolls = "(case ";
  var caseQueryQty = "(case ";
  var caseQueryDamage = "(case ";
  var caseQueryPendingOrders = "(case ";

  var whereQuery = "";

  var allQuality = "";

  for (var i = 0; i < rowMaster.length; i++) {
    //console.log(rowMaster[i], "iiii");
    var qName = rowMaster[i].qualityName;
    var rolls = rowMaster[i].rolls;
    var qty = rowMaster[i].qty;
    var damage = rowMaster[i].damage;
    var pending = rowMaster[i].pending;

    if (allQuality.indexOf("'" + qName + "'") == -1) {
      if (i != rowMaster.length && i > 0)
        allQuality = allQuality + ", '" + qName + "'";
      else allQuality = allQuality + " '" + qName + "'";
    }

    caseQueryRolls = caseQueryRolls + "when (qualityName = '" + qName +
      "' ) THEN rolls - " + rolls + " ";

    caseQueryQty = caseQueryQty + "when (qualityName = '" + qName +
      "' ) THEN qty - " + qty + " ";

    caseQueryDamage = caseQueryDamage + "when (qualityName = '" + qName +
      "' ) THEN damage - " + damage + " ";

    caseQueryPendingOrders = caseQueryPendingOrders + "when (qualityName = '" + qName +
      "' ) THEN pendingOrders - " + pending + " ";
  }

  caseQueryRolls = caseQueryRolls + " else rolls end)";
  caseQueryQty = caseQueryQty + " else qty end)";
  caseQueryDamage = caseQueryDamage + " else damage end)";
  caseQueryPendingOrders = caseQueryPendingOrders + " else pendingOrders end)";

  whereQuery = whereQuery + "qualityName in (" + allQuality + ")";

  performUpdatesOnStockMasterTable(caseQueryRolls, caseQueryQty, caseQueryDamage, caseQueryPendingOrders, whereQuery);
}

function performUpdatesOnStockMasterTable(caseQueryRolls, caseQueryQty, caseQueryDamage, caseQueryPendingOrders, whereQuery) {
  var myQuery = "UPDATE stockmaster set rolls = " + caseQueryRolls +
    ", qty = " + caseQueryQty +
    ", damage = " + caseQueryDamage +
    ", pendingOrders = " + caseQueryPendingOrders + " where  " + whereQuery;

  // console.log(myQuery, "performUpdatesOnStockMasterTable");
  connection.query(myQuery, function (err, result) {
    if (err) { alert(err + " : Tab - "); throw err; }
    queryMasterResponse += 1;
    checkIfWorkingCompleted();
    // console.log(result)
  });
}

function performUpdatesOnSalePoMasterTable() {
  var status = (parseFloat(totalOrderQty) - parseFloat(totalDispatchedQty) - parseFloat(totalDispatchingQty)).toFixed(2) == parseFloat(0.000) ? "COMPLETED" : "PENDING";
  // console.log(status, totalOrderQty, totalDispatchedQty, totalDispatchingQty, "CHECK");

  var myQuery = "UPDATE salepomaster set totalRollsDelivered = totalRollsDelivered + " + totalDispatchingRolls +
    ", totalQtyDelivered = totalQtyDelivered + " + totalDispatchingQty +
    ", deliveryNo = deliveryNo + " + 1 +
    ", status = '" + status +
    "' where  salePoNumber = '" + salePoNumber + "' and sPNumber = '" + sPNumber + "';";
  // console.log(myQuery, "performUpdatesOnSalePoMasterTable");
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

function updateSeriesNumber() {
  // var myQuery = "UPDATE seriesnumber set seriesValue = seriesValue +" + 1 + " where  seriesName = 'dUNumber'";
  // console.log(myQuery, "updateSeriesNumber");
  // connection.query(myQuery, function (error, results) {
  //   if (error)
  //     throw alert(
  //       error,
  //       "Please take screenshot of this and contact developer."
  //     );
  //   queryMasterResponse += 1;
  //   checkIfWorkingCompleted();
  // });

  var caseQuery = "(case ";
  var whereQuery = '';
  caseQuery = caseQuery + "when (seriesName = 'dUNumber' ) THEN seriesValue + 1 when (seriesName = 'rollsSeries' ) THEN '" + rollsSeries + "' else seriesValue end)";
  whereQuery = whereQuery + "seriesName in ('dUNumber','rollsSeries')";

  var myQuery = "UPDATE seriesnumber set seriesValue = " + caseQuery + " where  " + whereQuery;
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

function checkIfWorkingCompleted() {
  if (queryMasterRequest == queryMasterResponse) {
    // console.log("Completed");
    alert("Dispatch Successfully Saved...");
    document.getElementById("saveDispatchButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    printAllStickers(printingData, printingData.stickers.length);
    //show data on the view details page
    loadDataInViewFormat(salePoNumber, sPNumber, false);
  }
  else {
    // console.log("Pending");
    document.getElementById("saveDispatchButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  }
}

