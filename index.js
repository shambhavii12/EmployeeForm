/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var empDBName = 'EMP-DB';
var empRelationName = 'EmpData';
var connToken = "90934313|-31949204597613958|90957318";
setBaseUrl(jpdbBaseURL);
function disableCtrl(ctrl) {
    $('#new').prop("disabled", ctrl);
    $('#save').prop("disabled", ctrl);
    $('#edit').prop("disabled", ctrl);
    $('#change').prop("disabled", ctrl);
    $('#reset').prop("disabled", ctrl);
}

function disableNav(ctrl) {
    $('#first').prop("disabled", ctrl);
    $('#previous').prop("disabled", ctrl);
    $('#next').prop("disabled", ctrl);
    $('#last').prop("disabled", ctrl);
}

function disableForm(bVal) {
    $('#empid').prop("disabled", bVal);
    $('#empname').prop("disabled", bVal);
    $('#empsal').prop("disabled", bVal);
    $('#hra').prop("disabled", bVal);
    $('#da').prop("disabled", bVal);
    $('#deduct').prop("disabled", bVal);
}

function initEmpForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("rec_no");
    console.log("initEmpForm() - done")
}

function setCurRecNoOnLocal(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
}

function getCurRecNoFromLocal() {
    return localStorage.getItem("rec_no");
}

function setFirstRecNoOnLocal(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if (data.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}

function setLastRecNoOnLocal(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if (data.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function getFirstRecNoFromLocal() {
    return localStorage.getItem("first_rec_no");
}

function getLastRecNoFromLocal() {
    return localStorage.getItem("last_rec_no");
}

function saveRecNo(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getEmpIdAsJsonObj() {

    var empid = $('#empid').val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#empname').val(record.name);
    $('#empsal').val(record.salary);
    $('#hra').val(record.hra);
    $('#da').val(record.da);
    $('#deduct').val(record.deduction);
}

function resetForm() {
    disableCtrl(true);
    disableNav(false);
    var getCurRequest = createGET_BY_RECORDRequest(connToken, empDBName, empRelationName, getCurRecNoFromLocal());
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});
    if (isOnlyOneRecordOnLocal() || isNoRecordOnLocal()) {
        disableNav(true);
    }
    $('#new').prop("disabled", false);
    if (isNoRecordOnLocal()) {
        makeDataFormEmpty();
        $('#edit').prop("disabled", true);
    } else {
        $('#edit').prop("disabled", false);
    }
    disableForm(true);

}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var record = (JSON.parse(jsonObj.data)).record;
    setCurRecNoOnLocal(jsonObj);
    $('#empid').val(record.id);
    $('#empname').val(record.name);
    $('#empsal').val(record.salary);
    $('#hra').val(record.hra);
    $('#da').val(record.da);
    $('#deduct').val(record.deduction);
    disableNav(false);
    disableForm(true);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#new').prop('disabled', false);
    $('#edit').prop('disabled', false);
    if (getCurRecNoFromLocal() === getLastRecNoFromLocal()) {
        $('#next').prop('disabled', true);
        $('#last').prop('disabled', true);
    }

    if (getCurRecNoFromLocal() === getFirstRecNoFromLocal()) {
        $('#previous').prop('disabled', true);
        $('#first').prop('disabled', true);
        return;
    }
}

function validateData() {
    var empid, empname, empsal, hra, da, deduct;
    empid = $('#empid').val();
    empname = $('#empname').val();
    empsal = $('#empsal').val();
    hra = $('#hra').val();
    da = $('#da').val();
    deduct = $('#deduct').val();
    if (empid === '') {
        alert('Employee ID is missing');
        $("#empid").focus();
        return "";
    }
    if (empname === "") {
        alert('Employee Name is missing');
        $("#empname").focus();
        return "";
    }
    if (empsal === '') {
        alert('Employee salary is missing');
        $("#empsal").focus();
        return "";
    }
    if (hra === '') {
        alert('HRA is missing');
        $('#hra').focus();
        return "";
    }
    if (da === '') {
        alert('DA is missing');
        $('#da').focus();
        return '';
    }
    if (deduct === '') {
        alert('Deduction is missing');
        $('#deduct').focus();
        return '';
    }

    var jsonObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonObj);
}

function getFirst() {
    var getRequest = createFIRST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getRequest, jpdbIRL);
    showData(result);
    setFirstRecNoOnLocal(result);
    jQuery.ajaxSetup({async: true});
    $('#empid').prop('disabled', true);
    $('#first').prop('disabled', true);
    $('#previous').prop('disabled', true);
    $('#next').prop('disabled', false);
    $('#save').prop('disabled', true);
}

function getPrevious() {
    var r = getCurRecNoFromLocal();
    if (r === 1) {
        $('#previous').prop("disabled", true);
        $('#first').prop("disabled", true);
    }
    var getRequest = createPREV_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurRecNoFromLocal();

    if (r === 1) {
        $('#first').prop("disabled", true);
        $('#previous').prop("disabled", true);
    }
    $('#save').prop("disabled", true);
}

function getNext() {
    var r = getCurRecNoFromLocal();
    var getRequest = createNEXT_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurRecNoFromLocal();

    if (r === 1) {
        $('#last').prop("disabled", true);
        $('#next').prop("disabled", true);
    }
    $('#save').prop("disabled", true);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#empname").focus();
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
    } else if (resJsonObj.status === 200) {
        $('#empid').prop("disabled", true);
        fillData(resJsonObj);
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#empname').focus();
    }
}

function newForm() {
    makeDataFormEmpty();
    disableForm(false);
    $('#empid').focus();
    disableNav(true);
    disableCtrl(true);
    $('#save').prop("disabled", false);
    $('#reset').prop("disabled", false);
}

function makeDataFormEmpty() {
    $('#empid').val("");
    $('#empname').val("");
    $('#empsal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#deduct').val("");
}

function getLast() {
    var getRequest = createLAST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getRequest, jpdbIRL);
    setLastRecNoOnLocal(result);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#first').prop('disabled', false);
    $('#previous').prop('disabled', false);
    $('#last').prop('disabled', true);
    $('#next').prop('disabled', true);
    $('#save').prop('disabled', true);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommand(putRequest, jpdbIML);
    jQuery.ajaxSetup({async: true});
    makeDataFormEmpty();
    $('#empid').prop("disabled", false);
    $('#empid').focus();
    if (isNoRecordOnLocal()) {
        setFirstRecNo(resJsonObj);
    }
    setLastRecNoOnLocal(resJsonObj);
    setCurrRecNoOnLocal(resJsonObj);

}

function editData() {
    disableForm(false);
    $('#empid').prop("disabled", true);
    $('#empname').focus();
    disableNav(true);
    disableCtrl(true);
    $('#change').prop("disabled", false);
    $('#reset').prop("disabled", false);
}

function changeData() {
    $('#change').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#empid').focus();
    $('#edit').focus();
}

function isNoRecordOnLocal() {
    if (getFirstRecNoFromLocal() === "0" && getLastRecNoFromLocal() === "0") {
        return true;
    }
    return false;
}

function isOnlyOneRecordOnLocal() {
    if (isNoRecordOnLocal()) {
        return false;
    }
    if (getFirstRecNoFromLocal() === getLastRecNoFromLocal()) {
        return true;
    }
    return false;
}

function checkNoOrOneRecord() {
    if (isNoRecordOnLocal()) {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled', false);
        return;
    }
    if (isOnlyOneRecordOnLocal()) {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled', false);
        $('#edit').prop('disabled', false);
        return;
    }
}

initEmpForm();
getFirst();
getLast();
checkNoOrOneRecord();