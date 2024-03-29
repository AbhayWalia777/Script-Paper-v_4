﻿var LaptopImage = '<i class="fa fa-laptop" style=" color: orangered; font-size: large; font-weight: bold;"></i>';
var MobileImage = '<i class="fa fa-mobile-Phone" style="color: lawngreen; font-size: large; font-weight: bold;"></i>';
var UserRoles = "";
$(document).ready(function () {
    $('.date').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
    $('.date').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: true,
        endDate: "today",
        todayBtn: "linked"
    });
    UserRoles = $('#UserRoles').val();
    $('.clientdrop').select2({
        placeholder: "Client",
        allowClear: true
    });

    $('.segmentdrop').select2({
        placeholder: "Seg..",
        allowClear: true
    });

    $('.symboldrop').select2({
        placeholder: "Symbol",
        allowClear: true
    });

    $('#Buy-Sell-drp').select2({
        placeholder: "Buy/Sell",
        allowClear: true
    });
    $('#DRPBUYSELL').select2({
        placeholder: "Buy/Sell",
        allowClear: true
    });
    $('#Trade-seg').select2({
        placeholder: "Trade",
        allowClear: true
    });
    $('#Buy-Sell-drp').val(null).trigger('change');
    $('.clientdrop').val(null).trigger('change');
    $('.segmentdrop').val(null).trigger('change');
    $('.symboldrop').val(null).trigger('change');
    $('#DRPBUYSELL').val(null).trigger('change');
    $('#Trade-seg').val(null).trigger('change');

    $("#btn-findtrade").on("click", function () {                // For Trade Book Page Only
        GetTradeData();
    });
});
$(document).on('change', '#Drp-seg', function () {

    SetScriptNameData();

});
function SetScriptNameData() {
    var Tempscriptname = $('#Drp-seg option:selected').text() != "" ? $('#Drp-seg').val() : "";
    var WID = $('#Drp-seg option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-seg option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType };
    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetResultscriptName(data);
        }
    });
}

function SetResultscriptName(results) {
    //var results = JSON.parse(data);
    if (results != null) {
        $('#Drp-seg-sym').html('');
        if (results != null) {
            //Set data for WatchList trade
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var result = results[i].ScriptName;
                    $('#Drp-seg-sym').append(new Option(result, result));
                }
                $('#Drp-seg-sym').val(null).trigger('change');
            }
            else {
                $('#Drp-seg-sym').html('');
            }
        }
    }
}

function GetTradeData() {
    var Tempscriptname = $('#Drp-seg option:selected').text() != "" ? $('#Drp-seg').val() : "";
    var WID = $('#Drp-seg option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-seg option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var ScriptName = $('#Drp-seg-sym option:selected').text() != "" ? $('#Drp-seg-sym').val() : "";
    var CurrentPosition = $('#DRPBUYSELL option:selected').text() != "" ? $('#DRPBUYSELL').val() : "";
    var input = { 'IsAdminWise': 1, 'ScriptExchange': WID, 'ScriptInstumentType': ScriptInstrumentType, 'ScriptTradingSymbol': ScriptName, 'startDate': $('#StartDate').val(), 'endDate': $('#EndDate').val(), 'CurrentPosition': CurrentPosition, 'tradetype': $('#Trade-seg').val(), "IsOrderLog": 1 };
    $.ajax({
        url: "/Trade/GetCompletedTradeForTradesPage",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (data) {
            $('.t_body').html('');
            for (var i = 0; i < data.length; i++) {
                var inputdata = data[i];
                SetTradeData(inputdata);
            }
        }
    });

}
function SetTradeData(item) {
    var user = "";
    if (item.Userroleid == 1)
        user = "Administrator";
    if (item.Userroleid == 2)
        user = "User";
    if (item.Userroleid == 3)
        user = "Broker";
    if (item.Userroleid == 4)
        user = "SuperAdministrator";
    if (item.Userroleid == 5)
        user = "Support";
    if (item.Userroleid == 6)
        user = "Fund Manager";
    if (item.Userroleid == 7)
        user = "Sub Broker";
    var deleteTradeBtn = "";
    if (UserRoles == 4) {
        var deleteTradeBtn = '<a href="javascript:void(0)" onclick="DeleteCompletedTrade(' + item.Completedtradeid + ')" data-bind=' + item.Completedtradeid + ' style="margin-right:10px;" ><i class="fa fa-trash-o" style="color:red;font-weight:200;font-size:16px;"></i> </a> ';
    }
    var Orderplacedfrom = item.Orderplacedfrom.toUpperCase() == "MOBILE" ? MobileImage : LaptopImage;
    //$('#TblTradesList').DataTable().row.add([
    //    '<input type="checkbox" onclick="toastr.warning(\'Access Denied!\');" />&nbsp;&nbsp;&nbsp;',
    //    Orderplacedfrom,
    //    'T',
    //    item.ExitDate,
    //    item.Username,
    //    item.Sponsorid,
    //    item.TradeSymbol,
    //    item.CurrentPosition,
    //    item.ScriptExchange=="NFO"?item.Qty :item.Qty / item.ScriptLotSize,
    //    item.Qty,
    //    item.Exitprice,
    //    item.Exitprice,
    //    item.ProductType,
    //    user,
    //    item.Userip,
    //    '<span style="display:inline-flex">' + item.ExitDate + ' ' + item.Exittime + '</span>'
    //]).draw();
    var Status = item.Userip.length > 0 ? item.Userip : "<div style='color:transparent'>_</div>";
    var Htmp = "<tr>" +
        '<td data-title="">' + '<input type="checkbox" onclick="toastr.warning(\'Access Denied!\');" />&nbsp;&nbsp;&nbsp;' + '</td>' +
        '<td data-title="">' + Orderplacedfrom + '</td>' +
        '<td data-title="O/T">T</td>' +
        '<td data-title="Trade Date">' + item.ExitDate + '</td>' +
        '<td data-title="Client">' + item.Username + '</td>' +
        '<td data-title="Sbcode">' + item.Sponsorid + '</td>' +
        '<td data-title="Script">' + item.TradeSymbol + '</td>' +
        '<td data-title="Type">' + item.CurrentPosition + '</td>' +
        '<td data-title="Lot">' + (item.ScriptExchange == "NFO" ? item.Qty : item.Qty / item.ScriptLotSize) + '</td>' +
        '<td data-title="Qty">' + item.Qty + '</td>' +
        '<td data-title="Rate">' + item.Exitprice + '</td>' +
        '<td data-title="Net Rate">' + item.Exitprice + '</td>' +
        '<td data-title="TradeType">' + item.ProductType + '</td>' +
        '<td data-title="User">' + user+ '</td>' +
        '<td data-title="User IP">' + item.Userip + '</td>' +
        '<td data-title="Add Time">' + '<span style="display:inline-flex">' + item.ExitDate + ' ' + item.Exittime + '</span>' + '</td>' +
        
        '</tr>';
    $('#TblTradesList').append(Htmp);
}
function DeleteCompletedTrade(TransactionId) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/SoftDeleteCompletedTrade?ID=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                    GetTradeData();
                }
            }
        });
    }
}