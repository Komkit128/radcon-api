$(document).ready(function () {
    var theme = 'energyblue';

    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });

    $("#gridUser").jqxGrid(
        {
            width: '100%',
            height: 385,
            pageable: true,
            pagerButtonsCount: 10,
            columnsResize: true,
            filterable: true,
            showfilterrow: true,
            //showstatusbar: true,
            theme: theme,
            columns: [
                { text: 'User Name', datafield: 'User_UserName', align: 'center', minwidth: 100 },
                { text: 'FirstName', datafield: 'User_Name_EN', align: 'center', width: 120 },
                { text: 'LastName', datafield: 'User_LastName_EN', align: 'center', width: 120 },
                { text: 'ชื่อ', datafield: 'User_Name_TH', align: 'center', width: 120 },
                { text: 'นามสกุล', datafield: 'User_LastName_TH', align: 'center', width: 120 },
                { text: 'Phone', datafield: 'User_Phone', align: 'center', cellsalign: 'center', width: 100 },
                { text: 'Line ID', datafield: 'User_LineID', align: 'center', cellsalign: 'center', width: 100 },
                { text: 'Type', datafield: 'UserType_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 120 },
                { text: 'Status', datafield: 'UserStatus_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 80 },
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridUser").offset();

                        var dataRecord = $("#gridUser").jqxGrid('getrowdata', Editrow);
                        var User_ID = dataRecord.User_ID;
                        var User_UserName = dataRecord.User_UserName;

                        if (confirm("Do you want to delete user " + User_UserName + "?")) {
                            RadRegisterDel(User_ID);
                        }
                    }
                }
            ]
        });
    gridUser();

    $("#gridUser").on('rowselect', function (event) {

        var args = event.args;
        var row = args.row;
        let User_ID = row.User_ID;
        let User_UserName = row.User_UserName;
        let User_Password = row.User_Password;
        let User_Name = row.User_Name;
        let User_LastName = row.User_LastName;
        let User_Email = row.User_Email;
        let User_Phone = row.User_Phone;
        let User_LineID = row.User_LineID;
        let User_LineID_Code = row.User_LineID_Code;
        let UserType_ID = row.UserType_ID;
        let User_Active = row.User_Active;

        $("#User_ID").val(User_ID);
        $("#User_FirstName").val(User_UserName);
        $("#Password").val(User_Password);
        $("#FirstName").val(User_Name);
        $("#User_LastName").val(User_LastName);
        $("#Email").val(User_Email);
        $("#Phone").val(User_Phone);
        $("#LineID").val(User_LineID);
        $("#LineCode").val(User_LineID_Code);
        $("#Type").val(UserType_ID);
        $("#Active").val(User_Active);
        //console.log("The row you selected is: " + JSON.stringify(row));
        gridHospital();

    });

    $("#gridHospital").jqxGrid(
        {
            width: '100%',
            height: 385,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            //filterable: true,
            //showstatusbar: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'Hospital Name', datafield: 'Hos_Name', align: 'center', minwidth: 200 },
                /*{ text: 'Hospital ID', datafield: 'Hos_OrthancID', align: 'center', width: 200}*/
                {
                    text: 'Delete', datafield: 'Delete', align: 'center', columntype: 'button', cellsalign: 'center', width: 60,
                    cellsrenderer: function (row) { return "Delete"; }, buttonclick: function (row) {
                        Editrow = row;
                        var offset = $("#gridHospital").offset();

                        var dataRecord = $("#gridHospital").jqxGrid('getrowdata', Editrow);
                        var HosLink_ID = dataRecord.HosLink_ID;
                        var Hos_Name = dataRecord.Hos_Name;

                        if (confirm("Do you want to unlink Hospital " + Hos_Name + "?")) {
                            SRAD_MSG_HOS_LINK_DEL(HosLink_ID);
                        }
                    }
                }
            ]
        });
    
    $("#RegisterPage").click(function (){
        UserTypeAPI();
        gridHospital();
        ListHospital();
    });

    $("#SaveUser").click(function functionName() {
        RadRegister();
    });
    $("#CancelUser").click(function functionName() {
        ClearText();
    });
    $("#SaveHos").click(function functionName() {
        SRAD_MSG_HOS_LINK();
    });

    UserTypeAPI();
    gridHospital();
    ListHospital();

});

function gridUser() {
    let function_name = 'gridUser';
    let getUserTypeAPI = "https://localhost:4443/api/users";
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = getUserTypeAPI;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {
            //resolve(data);
            var databases = new Array();
            console.log("data = " + data);
            length = data.users.length;
            for (var i = 0; i < length; i++) {
                var row = {};
                row['User_ID'] = data.users[i].userinfo.id;
                row['User_UserName'] = data.users[i].username;
                row['User_Name_EN'] = data.users[i].userinfo.User_NameEN;
                row['User_LastName_EN'] = data.users[i].userinfo.User_LastNameEN;
                row['User_Name_TH'] = data.users[i].userinfo.User_NameTH;
                row['User_LastName_TH'] = data.users[i].userinfo.User_LastNameTH;
                row['User_Phone'] = data.users[i].userinfo.User_Phone;
                row['User_Email'] = data.users[i].userinfo.User_Email;
                row['User_LineID'] = data.users[i].userinfo.User_LineID;
                row['UserType_Name'] = data.users[i].usertype.UserType_Name;
                row['UserStatus_Name'] = data.users[i].userstatus.UserStatus_Name;
                row['User_LineID'] = data.users[i].userinfo.User_LineID;
                row['User_PathRadiant'] = data.users[i].userinfo.User_PathRadiant;
                databases[i] = row;
            }
            var source =
            {
                localdata: databases,
                datatype: "array"
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridUser").jqxGrid({ source: dataAdapter });

        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function gridHospital() {
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

function RadRegister() {
    let function_name = 'RadRegister';
    let API = "https://localhost:4443/api/users";
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        var url = API;
        var CountError = 0;

        //let User_ID = $("#User_ID").val();
        let input_username = $("#User_FirstName").val();
        let input_password = $("#Password").val();
        let retrypassword = $("#ReTryPassword").val();
        let vUserType = $("#Type").val();
        let vUser_NameEN = $("#FirstNameEng").val();
        let vUser_LastNameEN = $("#LastNameEng").val();
        let vUser_NameTH = $("#FirstNameThai").val();
        let vUser_LastNameTH = $("#vLastNameThai").val();
        let vUser_Email = $("#Email").val();
        let vUser_Phone = $("#Phone").val();
        let vUser_LineID = $("#LineID").val();
        let vUser_PathRadiant = $("#PathRadiant").val();
        let vHospitalID = $("#HospitalType").val();

        if (input_username == "") {
            CountError += 1;
            $("#User_FirstName").css("border", "1px solid red");
            $("#Validation_UserName").text("กรุณาใส่ UserName.");
        } else {

        }
        if (input_password == "") {
            CountError += 1;
            $("#Password").css("border", "1px solid red");
            $("#Validation_Password").text("กรุณาใส่ Password.");
        } else {

        }
        if (input_password != retrypassword) {
            CountError += 1;
            $("#Password").css("border", "1px solid red");
            $("#ReTryPassword").css("border", "1px solid red");
            $("#Validation_Password").text("Password และ ReTryPassword ไม่ตรงกัน.");
            $("#Validation_ReTryPassword").text("Password และ ReTryPassword ไม่ตรงกัน.");
        } else {

        }
        if (vUser_NameEN == "") {
            CountError += 1;
            $("#FirstNameEng").css("border", "1px solid red");
            $("#Validation_FirstNameEng").text("กรุณาใส่ ชื่อ(ภาษาอังกฤษ).");
        } else {

        }
        if (vUser_LastNameEN == "") {
            CountError += 1;
            $("#LastNameEng").css("border", "1px solid red");
            $("#Validation_LastNameEng").text("กรุณาใส่ นามสกุล(ภาษาอังกฤษ).");
        } else {

        }
        if (vUser_Email == "") {
            CountError += 1;
            $("#Email").css("border", "1px solid red");
            $("#Validation_Email").text("กรุณาใส่ Email.");
        } else {

        }
        if (vUser_Phone == "") {
            CountError += 1;
            $("#Phone").css("border", "1px solid red");
            $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์.");
        } else {

        }
        if (vUser_Phone.length != 10) {
            CountError += 1;
            $("#User_FirstName").css("border", "1px solid red");
            $("#Validation_Phone").text("กรุณาใส่ เบอร์โทรศัพท์ ให้ครบ 10 ตัว.");
        } else {

        }
        console.log("username : " + input_username);
        console.log("password : " + input_password);
        console.log("retrypassword : " + retrypassword);
        console.log("usertypeId : " + vUserType);
        console.log("User_NameEN : " + vUser_NameEN);
        console.log("User_LastNameEN : " + vUser_LastNameEN);
        console.log("User_NameTH : " + vUser_NameTH);
        console.log("User_LastNameTH : " + vUser_LastNameTH);
        console.log("useUser_Emailrname : " + vUser_Email);
        console.log("User_Phone : " + vUser_Phone);
        console.log("User_LineID : " + vUser_LineID);
        console.log("User_PathRadiant : " + vUser_PathRadiant);
        console.log("hospitalId = " + vHospitalID);

        var params = {
            User_NameEN: vUser_NameEN, 
            User_LastNameEN: vUser_LastNameEN, 
            User_NameTH: vUser_NameTH, 
            User_LastNameTH: vUser_LastNameTH, 
            User_Email: vUser_Email, 
            User_Phone: vUser_Phone, 
            User_LineID: vUser_LineID, 
            User_PathRadiant: vUser_PathRadiant, 
            usertypeId: vUserType, 
            hospitalId: vHospitalID, 
            username: input_username, 
            password: input_password,
        };

        console.log("params = "+ params);

        if (CountError === 0) {
            $.post(url, params, function (data) {
                //resolve(data);
                console.log("Successful Conntection");
                console.log("data = ", data);
                if (data.error) {
                    $("#User_FirstName").css("border", "1px solid red");
                    $("#Validation_UserName").text(data.error.why);
                } else {
                    //$('#RegisterPage').click();
                    $("#RegisterNotification").text('การสมัครสมาชิกสำเร็จ');
                    ClearText();
                }

            }).fail(function (error) {
                console.log("failed");
                console.log(JSON.stringify(error));
                reject(error);
            });
        } else {
            console.log("Error => CountError = " + CountError);
        }
        console.log("function_name : " + function_name + " => end");

    });
}

function RadRegisterDel(User_ID) {

    var act = 'RadRegisterDel';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        UserID: User_ID
        , SQL_Action: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            var vResult = data.data[0].Result;
            var vMsg = data.data[0].Msg;
            if (vResponse == 'success') {
                if (vResult != 'Success') {
                    ShowNoti(vMsg, 'warning');
                }
                else {
                    ShowNoti(vMsg, 'success');
                }

                gridUser();
                ClearText();
            } else {
                ShowNoti(vMsg, "warning");
            }
        }
    });
}

function SRAD_MSG_HOS_LINK() {

    let User_ID = $("#User_ID").val();
    let Hos_OrthancID = $("#Hospital").val();

    var act = 'SRAD_MSG_HOS_LINK';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        HosLink_ID: ''
        , User_ID: User_ID
        , Hos_OrthancID: Hos_OrthancID
        , SQL_ACTION: 'INS'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            var vResult = data.data[0].Result;
            var vMsg = data.data[0].Msg;
            if (vResponse == 'success') {
                if (vResult != 'Success') {
                    ShowNoti(vMsg, 'warning');
                }
                else {
                    ShowNoti(vMsg, 'success');
                }

                gridHospital(User_ID);
                ClearText();
            } else {
                ShowNoti(vMsg, "warning");
            }
        }
    });
}

function SRAD_MSG_HOS_LINK_DEL(HosLink_ID) {

    let User_ID = $("#User_ID").val();
    let Hos_OrthancID = $("#Hospital").val();

    var act = 'SRAD_MSG_HOS_LINK';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        HosLink_ID: HosLink_ID
        , User_ID: ''
        , Hos_OrthancID: ''
        , SQL_ACTION: 'DEL'
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            var vResponse = data.Response;
            var vResult = data.data[0].Result;
            var vMsg = data.data[0].Msg;
            if (vResponse == 'success') {
                if (vResult != 'Success') {
                    ShowNoti(vMsg, 'warning');
                }
                else {
                    ShowNoti(vMsg, 'success');
                }

                gridHospital(User_ID);
                ClearText();
            } else {
                ShowNoti(vMsg, "warning");
            }
        }
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function ClearText() {
    $("#User_FirstName").val("");
    $("#Password").val("");
    $("#ReTryPassword").val("");
    $("#FirstNameEng").val("");
    $("#LastNameEng").val("");
    $("#FirstNameThai").val("");
    $("#vLastNameThai").val("");
    $("#Email").val("");
    $("#Phone").val("");
    $("#LineID").val("");
    $("#LineCode").val("");
    $("#Type").val("1");
    $("#HospitalType").val("1");
    $("#Validation_UserName").text("")

    $("#User_FirstName").css("border","1px solid #d1d3e2")
    $("#Password").css("border","1px solid #d1d3e2")
    $("#ReTryPassword").css("border","1px solid #d1d3e2")
    $("#FirstNameEng").css("border","1px solid #d1d3e2")
    $("#LastNameEng").css("border","1px solid #d1d3e2")
    $("#FirstNameThai").css("border","1px solid #d1d3e2")
    $("#vLastNameThai").css("border","1px solid #d1d3e2")
    $("#Email").css("border","1px solid #d1d3e2")
    $("#Phone").css("border","1px solid #d1d3e2")
    $("#LineID").css("border","1px solid #d1d3e2")
    $("#LineCode").css("border","1px solid #d1d3e2")
}

function UserTypeAPI() {
    let function_name = 'UserTypeAPI';
    let getUserTypeAPI = "https://localhost:4443/api/usertypes/options";
    let output_data = [];
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = getUserTypeAPI;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });

        $.get(url, params, function (data) {
            //resolve(data);
            console.log(data);
            const output = [];
            //const data = JSON.stringify(data.types[0].UserType_Name);
            const len = data.Options.length;
            console.log("length = " + len);

            for (i = 0; i < len; i++) {
                var nametype = JSON.stringify(data.Options[i].DisplayText).replaceAll('"', '');
                //output_data.push(JSON.stringify(data.types[i].UserType_Name));
                ///// Add Type in select option
                $("#Type").append(new Option(nametype, i + 1));
            }
            console.log("Success in " + function_name);

        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function ListHospital() {
    let function_name = 'ListHospital';
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
                var hospitalName = JSON.stringify(data["Options"][i].DisplayText).replaceAll('"', '');
                $("#HospitalType").append(new Option(hospitalName, i + 1));
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}
