$(document).ready(function () {
    var theme = 'energyblue';
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var vUserID = User_UserID;
    //getUser(vUserID);
    //getUserInfo(User_UserID);

    $("#RadiologistProfile").click(function() {
        // var promise_AllGrid = AllGrid();
        // promise_AllGrid.then( function() {
        //     gridHospital(User_UserID);
        //     getUserInfo(User_UserID);
        //     console.log("RadiologistProfile Click!!!");
        // });
        // AllGrid();
        // setTimeout(function() {
        //     gridHospital(User_UserID);
        //     getUserInfo(User_UserID);
        // }, 1000);
    });

    //var promise_AllGrid = AllGrid();
    // AllGrid().then( function() {
    //     gridHospital(User_UserID);
    //     getUserInfo(User_UserID);
    //     console.log("RadiologistProfile Click!!!");
    // });

    AllGrid();
    // setTimeout(function() {
    //     gridHospital(User_UserID);
    //     getUserInfo(User_UserID);
    // }, 1000);
    
    //gridTemplate(vUserID);

});

function gridHospital(UserID) {
    let function_name = 'gridHospital';
    let getUserTypeAPI = "https://localhost:4443/api/hospital/options";
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = getUserTypeAPI;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {
            var new_data = JSON.stringify(data);
            length = data["Options"].length;
            var databases = new Array();
            console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
            for (var i = 0; i < length; i++) {
                var row = {};
                row.Hos_Name = JSON.stringify(data["Options"][i].DisplayText);
                databases[i] = row;
            }
            var source =
            {
                localdata: databases,
                datatype: "array"
            };
            console.log("source = ", source);
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridHospital").jqxGrid({ source: dataAdapter });

        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function gridTemplate(UserID) {
    var act = 'SRAD_MSG_TEMPLATE';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        User_ID: UserID,
        SQL_ACTION: "SEC"
    };

    var source =
    {
        type: 'POST',
        datatype: "json",
        datafields: [
            { name: 'Template_ID', type: 'string' },
            { name: 'Template_Code', type: 'string' },
            { name: 'User_ID', type: 'string' },
            { name: 'Template_Text', type: 'string' }
        ],
        id: 'id',
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridTemplate").jqxGrid({ source: dataAdapter });
}

function getUserInfo(User_UserID){
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "getUserInfo";
    var params = "";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = "https://localhost:4443/api/users/" + User_UserID ;
		$.get(url, params, function (data) {
			//resolve(data);
            //console.log("data = ", data);
            console.log("data = ", data.user[0]);
            information = data.user[0];
            $("#vUser_ID").val(information.id);
            $("#vUser_InfoID").val(information.userinfo.id);
            $("#vUserType_ID").val(information.usertypeId);
            $('#vUser_UserName').val(information.username);
            $('#vUser_Password').val(information.userinfo.username);
            $('#vUser_Name_EN').val(information.userinfo.User_NameEN);
            $('#vUser_LastName_EN').val(information.userinfo.User_LastNameEN);
            $('#vUser_Name_TH').val(information.userinfo.User_NameTH);
            $('#vUser_LastName_TH').val(information.userinfo.User_LastNameTH);
            $('#vUser_Email').val(information.userinfo.User_Email);
            $('#vUser_Phone').val(information.userinfo.User_Phone);
            $('#vUser_LineID').val(information.userinfo.User_LineID);
            $('#vUser_HospitalID').val(information.hospitalId);
            //$('#vUser_LineID_Code').val(information.username);
            $('#vUser_PathRadiant').val(information.userinfo.User_PathRadiant);
            //$('#vUser_Auth').val(information.username);
            $('#vUser_Active').val(information.userstatus.UserStatus_Name);
            console.log("function_name : " + function_name + " => Success in get data");
		}).fail(function (error) {
			console.log(JSON.stringify(error));
			reject(error);
		});
		console.log("function_name : " + function_name + " => end");
	});
}

function UpdateUser(UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "UpdateUser";
    var params = "";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url = "https://localhost:4443/api/user/update" ;
        var vUser_ID = UserID;
        var vUser_InfoID = $("#vUser_InfoID").val();
        var vUser_UserName = $('#vUser_UserName').val();
        var vUser_Name_EN = $('#vUser_Name_EN').val();
        var vUser_LastName_EN = $('#vUser_LastName_EN').val();
        var vUser_Name_TH = $('#vUser_Name_TH').val();
        var vUser_LastName_TH = $('#vUser_LastName_TH').val();
        var vUser_Email = $('#vUser_Email').val();
        var vUser_Phone = $('#vUser_Phone').val();
        var vUser_LineID = $('#vUser_LineID').val();
        var vUser_LineID_Code = $('#vUser_LineID_Code').val();
        var vUserType_ID = $('#vUserType_ID').val();
        var vUser_Auth = $('#vUser_Auth').val();
        var vUser_PathRadiant = $('#vUser_PathRadiant').val();
        var vUser_Active = $('#vUser_Active').val();
        var vUser_HospitalID = $('#vUser_HospitalID').val();

        console.log("vUser_ID = " + vUser_ID);
        console.log("vUser_InfoID = " + vUser_InfoID);
        console.log("vUser_UserName = " + vUser_UserName);
        console.log("vUser_Name_EN = " + vUser_Name_EN);
        console.log("vUser_LastName_EN = " + vUser_LastName_EN);
        console.log("vUser_Name_TH = " + vUser_Name_TH);
        console.log("vUser_LastName_TH = " + vUser_LastName_TH);
        console.log("vUser_Email = " + vUser_Email);
        console.log("vUser_Phone = " + vUser_Phone);
        console.log("vUser_LineID = " + vUser_LineID);
        console.log("vUserType_ID = " + vUserType_ID);
        console.log("vUser_PathRadiant = " + vUser_PathRadiant);
        console.log("vUser_HospitalID = " + vUser_HospitalID);

        var params = {
            id: vUser_InfoID,
            User_NameEN: vUser_Name_EN,
            User_LastNameEN: vUser_LastName_EN,
            User_NameTH: vUser_Name_TH,
            User_LastNameTH: vUser_LastName_TH,
            User_Email: vUser_Email,
            User_Phone: vUser_Phone,
            User_LineID: vUser_LineID,
            User_PathRadiant: vUser_PathRadiant,
            usertypeId: vUserType_ID,
            hospitalId: vUser_HospitalID,
            username: vUser_UserName,
            //password: vUser_Password,
        };

		$.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.Result == "OK"){
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                getUserInfo(vUser_ID);
            }else{
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function SRAD_MSG_TEMPLATE_INS(UserID) {
    var TemplateID = $('#vTemplate_ID').val();
    var TemplateCode = $('#vTemplateCode').val();
    var TemplateText = $('#vTemplateText').val();

    var act = 'SRAD_MSG_TEMPLATE';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Template_ID: TemplateID,
        Template_Code: TemplateCode,
        User_ID: UserID,
        Template_Text: TemplateText,
        SQL_ACTION: 'INS'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vResult, "success");
                    //RadHospital(vUserID);
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridTemplate(UserID);
            $('#vTemplate_ID').val('');
            $('#vTemplateCode').val('');
            $('#vTemplateText').val('');
            $('#gridTemplate').jqxGrid('clearselection');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}
function SRAD_MSG_TEMPLATE_DEL(Template_ID, UserID) {

    var act = 'SRAD_MSG_TEMPLATE';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Template_ID: Template_ID,
        SQL_ACTION: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vResult, "success");
                    //RadHospital(vUserID);
                }
                else {
                    ShowNoti(vMsg, "warning");
                }
            }
            else {
                var vResult = data.Result;
                ShowNoti(vResult, "warning");
            }
            gridTemplate(UserID);
            $('#vTemplate_ID').val('');
            $('#vTemplateCode').val('');
            $('#vTemplateText').val('');
            $('#gridTemplate').jqxGrid('clearselection');
        },
        error: function () {
            ShowNoti('Failed', "warning");
        }
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function AllGrid(){
    var theme = 'energyblue';

    $("#gridHospital").jqxGrid(
    {
        width: '100%',
        height: 350,
        pageable: true,
        pagerButtonsCount: 5,
        columnsResize: true,
        //filterable: true,
        //showstatusbar: true,
        autoShowLoadElement: false,
        theme: theme,
        columns: [
            { text: 'โรงพยาบาล', datafield: 'Hos_Name', align: 'center', minwidth: 100 }
            /*{ text: 'Hospital ID', datafield: 'Hos_OrthancID', align: 'center', width: 200}*/
        ]
    });

    $("#gridTemplate").jqxGrid(
        {
            width: '100%',
            height: '100%',
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            //filterable: true,
            //showstatusbar: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'Template', datafield: 'Template_Code', align: 'center', minwidth: 100 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridTemplate").offset();

                        var dataRecord = $("#gridTemplate").jqxGrid('getrowdata', Editrow);
                        var Template_ID = dataRecord.Template_ID;
                        var User_ID = dataRecord.User_ID;
                        var Template_Code = dataRecord.Template_Code;

                        if (confirm("Do you want to Delete Template " + Template_Code + "?")) {
                            SRAD_MSG_TEMPLATE_DEL(Template_ID, User_ID);
                        }
                    }
                }
            ]
        });

    $('#vTemplateText').jqxEditor({
        height: 400,
        width: "100%",
        tools: 'bold | italic | underline | left | center | right | outdent | indent | size | ul | ol | zoom | datetime | print | template | clear',
        createCommand: function (name) {
            switch (name) {
                case "clear":
                    return {
                        type: 'button',
                        tooltip: 'Clear',
                        init: function (widget) {
                            widget.jqxButton({ width: 80 });
                            widget.html("<span style='line-height: 24px;'>Clear</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#vTemplateText').val('');
                        }
                    };
                case "size":
                    return {
                        init: function (widget) {
                            widget.jqxDropDownList({
                                source: [
                                    { label: "VerySmall (10)", value: "x-small" },
                                    { label: "Small (14)", value: "medium" },
                                    { label: "Normal (18)", value: "large" },
                                    { label: "Large (24)", value: "x-large" }
                                ]
                            });
                        }
                    };
                case "datetime":
                    return {
                        type: 'list',
                        tooltip: "Insert Date/Time",
                        init: function (widget) {
                            widget.jqxDropDownList({ placeHolder: "Time&Date", width: 160, source: ['Insert Time', 'Insert Date'], autoDropDownHeight: true });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                            widget.jqxDropDownList('clearSelection');
                        },
                        action: function (widget, editor) {
                            var widgetValue = widget.val();
                            var date = new Date();
                            // return object with command and value members.
                            return { command: "inserthtml", value: widgetValue == "Insert Time" ? date.getHours() + ":" + date.getMinutes() : date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() };
                        }
                    };
                case "template":
                    return{
                        type: 'button',
                        tooltip: 'เปิดหรือปิดเทมเพลต',
                        init: function (widget) {
                            widget.jqxButton({ width: 100 });
                            widget.html("<span style='line-height: 24px;'>Template</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            if( $("#gridTemplate").height() > 40 ){
                                $("#gridTemplate").height(30);
                            }else{
                                $("#gridTemplate").height(320);
                            }
                        }
                    };
                case "zoom":
                    // var current_height = 318;
                    // var current_width = 1022.5; //$('#pRespone').width(); 
                    // var new_height;
                    // var new_width;
                    return{
                        type: 'list',
                        tooltip: "ขยายขนาด",
                        init: function (widget) {
                            widget.jqxDropDownList({
                                placeHolder: "Zoom",
                                width: 100,
                                autoDropDownHeight: true,
                                source: [
                                    { label: "100%", value: 1 },
                                    { label: "150%", value: 1.5 },
                                    { label: "200%", value: 2.0 },
                                    { label: "300%", value: 3.0 }
                                ]
                            });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            var widgetValue = widget.val();
                            //console.log(widgetValue);
                            editor.css("zoom", widgetValue);
                        }
                    };
                case "print":
                    return {
                        type: 'button',
                        tooltip: 'Print',
                        init: function (widget) {
                            widget.jqxButton({ width: 50 });
                            widget.html("<span style='line-height: 23px;'>Print</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#vTemplateText').jqxEditor('print');
                        }
                    };
            }
        },
    });

    setTimeout(function() {
        $("#SaveUser").click(function functionName() {
            var UserID = $('#vUser_ID').val();
            UpdateUser(UserID);
        });
    
        $("#CancelUser").click(function functionName() {
            window.open('index.html', '_self');
        });
    
        $("#SaveTemplate").click(function functionName() {
            var UserID = $('#vUser_ID').val();
            SRAD_MSG_TEMPLATE_INS(UserID);
        });

        gridHospital(User_UserID);
        getUserInfo(User_UserID);
    }, 1000);
    
}

