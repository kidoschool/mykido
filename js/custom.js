// let form_id = null;
var server = ((document.location.host).indexOf("localhost") !== -1) ? "http://localhost/kido-audit-api/api.php" : 'https://shop.kidovillage.com/kido-audit-api/api.php';
var dwnld_url = ((document.location.host).indexOf("localhost") !== -1) ? "http://localhost/kido-audit-api/" : 'https://shop.kidovillage.com/kido-audit-api/';

var teamTypes = {
    "kido" : 1,
    "kidovillage" : 2
}

var country = {
    1 : "India",
    2 : "UK",
    3 : "Dubai",
    4 : "USA",
    5 : "Hongkong",
    6 : "China"
}

var teamTypesRev = {
    1 : "kido",
    2 : "kidovillage" 
}

var scheduleType = {
    1 : "once",
    2 : "daily",
    3 : "weekly",
    4 : "fortnight",
    5 : "monthly",
    6 : "half-yearly",
    7 : "yearly"
}

var userLevels = {
    1 : "admin",
    2 : "country-admin", 
    3 : "cluster-admin", 
    4 : "teachers"
}
//-------------------------------COMMON FUNCTIONS----------------------

function local_get(var_name) {
    try {
        var out = JSON.parse(localStorage.getItem(var_name));
    } catch (e) {
        return localStorage.getItem(var_name);
    }
    return out;
}

function local_set(var_name, value) { localStorage.setItem(var_name, JSON.stringify(value)); }

var access_portals_list = [
    {
        "name": "Gmail",
        "link": "https://gmail.com",
        "logo": "images/gm_logo.png",
        "desc": "Gmail is a free email service provided by Google. A user typically accesses Gmail in a web browser or the official mobile app.",
    },
    {
        "name": "HubSpot",
        "link": "https://app.hubspot.com/login",
        "logo": "images/hs_logo.svg",
        "desc": "HubSpot is an American developer and marketer of software products for inbound marketing, sales, and customer service.",
    },
    {
        "name": "GoogleDrive",
        "link": "https://drive.google.com/",
        "logo": "images/gd.png",
        "desc": "Google Drive is a file storage and synchronization service developed by Google.",
    },
    {
        "name": "Manula",
        "link": "https://admin.manula.com/login.php?action=login_google",
        "logo": "images/manula-icon.png",
        "desc": "Manula is super-easy to use manual creation software, for writing, formatting and publishing online instruction manuals.",
    },
    {
        "name": "LeadSquared",
        "link": "https://login.leadsquared.com",
        "logo": "images/lsq_logo.png",
        "desc": "CRM software for businesses. Organize your lead capture, lead management, sales management & analytics in one platform.",
    },
    {
        "name": "Cipher",
        "link": "https://kido.myciphr247.com/",
        "logo": "images/kido_logo.png",
        "desc": "Manage nursery details and upload images, video & documents. Easy & flexible to use.",
    },
    {
        "name": "Facebook",
        "link": "https://www.facebook.com/",
        "logo": "images/fb.png",
        "desc": "Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.",
    },
    {
        "name": "Instagram",
        "link": "https://www.instagram.com/accounts/login/",
        "logo": "images/instagram.png",
        "desc": "Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.",
    },
    {
        "name": "Webmail",
        "link": "http://webmail.kidovillage.in/",
        "logo": "images/webmail.png",
        "desc": "Enterprise Email Solutions Redefined.",
    },
    {
        "name": "KidovillageBOT",
        "link": "https://kidovillage.gyde.ai/user/login/login",
        "logo": "images/kv.png",
        "desc": "The Perfect Training Platform for your hybrid workforce across software.",
    },
    {
        "name": "Iauditor",
        "link": "https://app.safetyculture.com/login.html?lang=en-US",
        "logo": "images/iauditor.png",
        "desc": "iAuditor is an inspection app used to empower your workers in the field.",
    },
    {
        "name": "School Diary",
        "link": "https://kido.schooldiary.me/Login",
        "logo": "images/kv.png",
        "desc": "iAuditor is an inspection app used to empower your workers in the field.",
    }    
];

$(function() {
    "use strict";

    $(".preloader").fadeOut();
    // this is for close icon when navigation open in mobile view
    $(".nav-toggler").on('click', function() {
        $("#main-wrapper").toggleClass("show-sidebar");
        $(".nav-toggler i").toggleClass("ti-menu");
    });
    $(".search-box a, .search-box .app-search .srh-btn").on('click', function() {
        $(".app-search").toggle(200);
        $(".app-search input").focus();
    });

    // ============================================================== 
    // Resize all elements
    // ============================================================== 
    $("body, .page-wrapper").trigger("resize");
    $(".page-wrapper").delay(20).show();
    
    //****************************
    /* This is for the mini-sidebar if width is less then 1170*/
    //**************************** 
    var setsidebartype = function() {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        if (width < 1170) {
            $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
        } else {
            $("#main-wrapper").attr("data-sidebartype", "full");
        }
    };
    $(window).ready(setsidebartype);
    $(window).on("resize", setsidebartype);

    $(document).on('click','#edit-form .save-template',function(){
        // var formBuilder = $('#edit-form').formBuilder();
        // var fbEditor = document.getElementById('edit-form');
        // var formBuilder = $(fbEditor).formBuilder();
        var title = $("#inspect_title").val();
        var err = "";
        (title.length == 0) ? err += " Title cannot be empty. " : false;
        JSON.parse(fbuilder.formData).length == 0 ? err += " No fields added. " : false;
        if(err.length){
            alert(err);
        }else{
            var due_date = $( "#due_date" ).val().substring(0,10);
            var inspect_schedule = $("#inspect_schedule").val();
            var allow_after_dd = $('#allow_after_dd').is(":checked") ? 1 : 0;
            var team = teamTypes[$("#user_team").text()];
            var data = {'api':'save_inspect','content':fbuilder.formData,"title":title,"due_date":due_date,"submit_after_due_date":allow_after_dd,"schedule":inspect_schedule,"team":team};
            if($("#inspect_title").attr("form_id")){
                data["id"] = $("#inspect_title").attr("form_id");
            }
            requester(server,"POST",data);
            $("#modal_btn").trigger("click");
        }
    });

    $(document).on('click','#assign_users',function(){
        var users = [];
        var form_id = $("#inspect_title").attr("form_id");
        $("#user_trs").find("input:checked").each(function() {
            users.push($(this).val());
        });
        // $( ".mail_chip" ).each(function() {
        //     users.push($(this).text());
        // });
        // console.log(users);
        var inspects = requester(server,"POST",{'api':'assign_users','users':users,'form_id':form_id});
        if(parseInt(inspects)){
            alert("Saved");
            $(".modal-content button.close").trigger("click");
            // cust_navigate("basic-table");
        }else{
            alert("Not saved.");
        }
    });


    $(document).on('click','#fb-editor .save-template',function(){
        // var formBuilder = $('#fb-editor').formBuilder();
        // var fbEditor = document.getElementById('fb-editor');
        // var formBuilder = $(fbEditor).formBuilder();
        var title = $("#inspect_title").val();
        var due_date = format_date(format_date2($( "#due_date" ).val()));
        var allow_after_dd = $('#allow_after_dd').is(":checked") ? 1 : 0;
        var schedule = $("#inspect_schedule").val();
        var team = teamTypes[$("#user_team").text()];
        var err = "";
        (title.length == 0) ? err += " Title cannot be empty. " : false;
        JSON.parse(fbuilder.formData).length == 0 ? err += " No fields added. " : false;
        if(err.length){
            alert(err);
        }else{
            var data = {'api':'save_inspect','content':fbuilder.formData,"title":title,"due_date":due_date,"submit_after_due_date":allow_after_dd,"schedule":schedule,"team":team,};
            if($("#inspect_title").attr("form_id")){
                data["id"] = $("#inspect_title").attr("form_id");
            }
            var insp_id = requester(server,"POST",data);
            if(parseInt(insp_id)){
                $("#inspect_title").attr("form_id",insp_id);
                $("#modal_btn").trigger("click");
            }else{
                alert("Form has errors.");
            }
        }
    });

    $(document).on('click','.sel_all',function(){

        $(this).closest("table").find("input[type=checkbox]").prop('checked', $(this).prop('checked'));

    });

});

function format_date(dt_obj) {
    var month = '' + (dt_obj.getMonth() + 1),
        day = '' + dt_obj.getDate(),
        year = dt_obj.getFullYear();
    (month.length < 2) ? month = '0' + month: false;
    (day.length < 2) ? day = '0' + day: false;
    return [year, month, day].join('-');
}

function format_date2(str) {
    var dateParts = str.split("-");
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject;
}

function requester(end_point, req_type, params) {
    // var authToken = 'Bearer ' + local_get('access_token');
    return $.ajax({
        url: end_point,
        // beforeSend: function(req) { req.setRequestHeader("Authorization", authToken); },
        type: req_type,
        async: false,
        cache: false,
        timeout: 3000,
        data: params,
        success: function(resp) {},
        error: function(x,t,m){
            if(t==="timeout") {
                requester(end_point, req_type, params);
            }
        }        
    }).responseText;
}

function valid_email(tstr) {

    var err = false;
    var spcl_chrs = /[ `!#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    var atToLast = (tstr.substring(tstr.indexOf("@"),tstr.length));
    if(tstr.length){
        ((tstr.split(".").length - 1) < 1  || (tstr.split(".").length - 1) > 2 ) ? err = true : false; //---- . COUNT ONLY 1 OR 2
        ((tstr.split("@").length - 1) !== 1 ) ? err = true : false;
        (tstr[0] == "@") ? err = true : false;
        (tstr[0] == ".") ? err = true : false;
        (tstr.length < 7 ) ? err = true : false;
        tstr.indexOf("@") > (tstr.length - 6) ? err = true : false;
        ((tstr.split(".").length - 1) == 2) && tstr.indexOf("@") > (tstr.length - 9) ? err = true : false; // ---IF STRING HAVE 2 . THEN POSITION OF @
        tstr.lastIndexOf(".") > (tstr.length - 2) ? err = true : false; //----CHECK NOT ENDING WITH .
        tstr.indexOf("..") > -1 ? err = true : false;  //----CHECK IF ..
        (atToLast.indexOf(".") - atToLast.indexOf("@")) < 3 ? err = true : false;    //----GAP BETWEEN @ & .
        spcl_chrs.test(tstr) ? err = true : false;   //----SPECIAL CHAR
        (/^\d+$/.test(tstr.substring(0, tstr.indexOf("@")))) ? err = true : false;   //----ALL NUMERIC BEFORE @
    }else{
        err = true;
    }
    return (err ? false : true )
}

function updt_usr_tbl() {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"team":user.team});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.id+'" >No</td><td><input type="checkbox" value="'+v.id+'"></td></tr>';
    });
    $("#user_trs").append(trs);
    $('#user_list').DataTable();
}



function updt_usr_list_tbl(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        var team = (v.team).replaceAll("-"," ");
        var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr uid="'+v.id+'" class="user_list_tr"><td class="name">'+v.name+'</td> <td class="email">'+v.email+'</td><td>'+status+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}

function usr_tbl_clus_admin(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country,"level":3});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        var team = (v.team).replaceAll("-"," ");
        var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr uid="'+v.id+'" class="user_list_tr"><td class="name">'+v.name+'</td> <td class="email">'+v.email+'</td><td>'+status+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}




function updt_nrsy_list_tbl(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_nursery','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        // var team = (v.team).replaceAll("-"," ");
        var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr uid="'+v.id+'" class="user_list_tr"><td class="name">'+v.name+'</td><td>'+status+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}


function updt_nursy_access_list_tbl(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_nursery','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        // var team = (v.team).replaceAll("-"," ");
        // var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr nursyid="'+v.id+'" class="nursy_list_tr"><td class="name">'+v.name+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
        nusy_ids.push(v.id);
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}

function updt_clust_access_list_tbl(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_cluster','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        // var team = (v.team).replaceAll("-"," ");
        // var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr clusid="'+v.id+'" class="clus_list_tr"><td class="name">'+v.name+'</td> <td class="email">'+country[v.country]+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
        clus_ids.push(v.id);
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}

function updt_clust_list_tbl(tabl_id) {
    var user = local_get('logged_user');
    var filter = JSON.stringify({"country":user.country});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_cluster','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        // var team = (v.team).replaceAll("-"," ");
        // var status = v.status == 1 ? '<span class="text-success">Active</span>' : '<span class="text-danger">InActive</span>';
        trs += '<tr uid="'+v.id+'" class="user_list_tr"><td class="name">'+v.name+'</td> <td class="email">'+country[v.country]+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
        // console.log(v)
        clus_ids.push(v.id);
    });
    var tbody = $('#'+tabl_id).find("tbody");
    tbody.append(trs);
    $('#'+tabl_id).DataTable();
}

function updt_insp_tbl() {
    var user = local_get('logged_user');
    console.log(teamTypes[user.team]);
    var filter = JSON.stringify({"team": teamTypes[user.team]});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_inspect','filter':filter}));
    $("#inspect_trs").empty();
    var i = 1;
    var trs = "";
    $.each(inspects, function (k, v) {
        var stat = new Date(v.due_date) < new Date() ? "Missed" : "Active";
        var sch = scheduleType[v.schedule] || "Not set";
        trs += '<tr><td>'+i+'</td> <td>'+v.title+'</td> <td>'+v.due_date+'</td> <td>'+v.assigned_to+'</td> <td>'+stat+'</td><td>'+sch+'</td><td> <a href="#edit_form" onclick="function hi(){form_id='+v.id+'};hi()" >  view </a></td> </tr>';
        i++;
    });
    $("#inspect_trs").append(trs);
}

function structured_accordian(obj,div_id,end_arrow_show) {
    var out = '';var j = 0;
    var mnul_vals = {};
    var arw = end_arrow_show ? ">" : "";
    $.each(obj, function (k, v) {
        var i = 1;j++;
        out += "<div ind="+j+" class='ls"+i+"'>"+k+'  '+arw+' </div>';
        if(v instanceof Object){
            x = 0;
            $.each(v, function (k1, v1) {
                i = 2;x++;
                out += "<div ind="+j+"."+x+" class='ls"+i+"'>"+k1+'  '+arw+' </div>';
                if(v1 instanceof Object){
                    y = 0;
                    $.each(v1, function (k2, v2) {
                        i = 3;y++;
                        out += "<div ind="+j+"."+x+"."+y+" class='ls"+i+"'>"+k2+'  '+arw+' </div>';
                        if(v2 instanceof Object){
                            z = 0;
                            $.each(v2, function (k3, v3) {
                                i = 4;z++;                            
                                out += "<div ind="+j+"."+x+"."+y+"."+z+" class='ls"+i+"'>"+k3+'  '+arw+' </div>';
                                    if(v3 instanceof Object){
                                        a = 0;
                                        $.each(v3, function (k4, v4) {
                                            i = 5;a++;
                                            out += "<div ind="+j+"."+x+"."+y+"."+z+"."+a+" class='ls"+i+"'>"+k4+'  '+arw+' </div>';
                                            mnul_vals[""+j+"."+x+"."+y+"."+z+"."+a] = {"value":v4,"keys":[k,k1,k2,k3,k4]};
                                        });
                                    }else{
                                        mnul_vals[""+j+"."+x+"."+y+"."+z] = {"value":v3,"keys":[k,k1,k2,k3]};
                                    }
                            });
                        }else{
                            mnul_vals[""+j+"."+x+"."+y] = {"value":v2,"keys":[k,k1,k2]};
                        }
                    });
                }else{
                    mnul_vals[""+j+"."+x] = {"value":v1,"keys":[k,k1]};
                }
            });
        }else{
            mnul_vals[""+j] = {"value":v,"keys":[k]};
        }
    });
    document.getElementById(div_id).innerHTML = out;
    return mnul_vals;
}


$(document).on('click','#manuals .ls1',function(){
    $("#manuals").find(".ls2,.ls3,.ls4,.ls5").css("display","none");
    if($(this).hasClass("active")){
        $(this).nextUntil(".ls1").filter(".ls2").css("display","none");
        $(".ls1.active").removeClass("active");
    }else{
        $(".ls1.active").removeClass("active");
        $(this).addClass("active");
        $(this).nextUntil(".ls1").filter(".ls2").css("display","block");
    }
});


$(document).on('click','#user_inspect_submit',function(){

    // console.log("formRenderInstance");
    // // console.log(formRenderInstance);
    // // form_id
    // console.log(formRenderInstance.userData);
    // var filter = JSON.stringify({"id":form_id});
    // var inspects = JSON.parse(requester(server,"POST",{'api':'get_inspect','filter':filter}));
    // $res = save_batch('inspection_assign',$cols,$data);2021-11-15 13:18:38
    // var someDate = new Date().toISOString();
    // var team = (v.team).replaceAll("-"," ");
    // document.writeln();
    var obj = formRenderInstance.userData;
    $.each(obj, function (k, v) {
        if(v.type == "file"){
            obj[k]["url"] = $("#"+v.name).attr("url");
        }
        if(v.type == "checkbox-group"){
            $.each(v.values, function (k1, v1) {
                console.log(((v.userData).indexOf(v1.value) == -1));
                v.values[k1]['selected'] = ((v.userData).indexOf(v1.value) == -1) ? false : true;
            });
        }
    });

    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var cols = JSON.stringify(["inspection_id","user_id","status","submission","submitted_on","updated_on"]);
    var submission = JSON.stringify(obj);
    var data = [];
    data.push([form_id,user.id,"1",submission,timestamp,timestamp]);
    // console.log(submission);
    var inspects = requester(server,"POST",{'api':'save_tab',"tbl_name":"inspection_assign",'cols':cols,'data':JSON.stringify(data)});
    // console.log(inspects);
    if (parseInt(inspects)) {
        alert("Submitted.");
    }else{
        alert("Not Submitted.");
    }
    // console.log(formRenderInstance.userData);
});

$(document).on('click','#user_view_prev_submitted',function(){
    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);
    // var form_id = url.searchParams.get("form_id");
    var filter = JSON.stringify({"inspection_id":form_id,"user_id":user.id});
    var out = JSON.parse(requester(server,"POST",{'api':'submitted_get_users','filter':filter,'limit':0}));
    var sub_prev = false;

    var inspects = {}, last_sub_dt = "", date_selector = "<select id='user_sub_dates'><option>Previous submission</option>";
    $.each(out, function (k, v) {
        inspects[v.submitted_on] =  v;
        last_sub_dt = v.submitted_on;
        date_selector += "<option value='"+v.submitted_on+"'>"+v.submitted_on+"</option>";
        (v.submission) ? sub_prev = true : false;
    });
    date_selector += "</select>";
    user_submitted = inspects;

    if(sub_prev){
        var subs = JSON.parse(inspects[last_sub_dt]['submission']);
        $('#form_div').empty();
        // console.log(subs);
        var formRenderInstance = $('#form_div').formRender({dataType: 'json',formData: subs});
        $.each(subs, function (k, v) {
            if(v.type == "file"){
                if(v.url){
                    var fil_url = encodeURI(dwnld_url+v.url);
                  $("#"+v.name).parent().append("<a href="+fil_url+" download target='_blank'>Download</a>");
                }else{
                  $("#"+v.name).parent().append("<a href='#' >File Not Uploaded.</a>");
                }
                $("#"+v.name).remove();
            }
        });
        $('#form_div').before(date_selector);
        $('#form_div').before("<span id='selected_date'>&emsp;&emsp;Submitted on : "+last_sub_dt+"</span>");
        // console.log(date_selector);
        $("#user_inspect_submit").remove();
        $("#user_view_prev_submitted").remove();
    }else{
        alert("Not yet submitted.");
    }
});


$(document).on('change','#user_sub_dates',function(){

    // alert($(this).val());

    // console.log(user_submitted[$(this).val()]);

    var sub_obj = user_submitted[$(this).val()];
    $('#form_div').empty();

    if(sub_obj["submission"]){
        var subs = JSON.parse(sub_obj["submission"]);
        // console.log(subs);
        var formRenderInstance = $('#form_div').formRender({dataType: 'json',formData: subs});
        $.each(subs, function (k, v) {
            if(v.type == "file"){
                if(v.url){
                  $("#"+v.name).parent().append("<a href="+dwnld_url+v.url+" download>Download</a>");
                }else{
                  $("#"+v.name).parent().append("<a href='#' >File Not Uploaded.</a>");
                }
                $("#"+v.name).remove();
            }
        });
        $('#selected_date').html("&emsp;&emsp;Submitted on : "+$(this).val());
        // $('#form_div').before("<span>&emsp;&emsp;Submitted on : "+last_sub_dt+"</span>");
        // console.log(date_selector);
    }else{
        $('#form_div').html("<h3>Not submitted on :"+$(this).val()+".</h3>");
    }
});


$(document).on('click','#manuals .ls2',function(){
    $("#manuals").find(".ls3,.ls4,.ls5").css("display","none");
    if($(this).hasClass("active")){
        $(".ls2.active").removeClass("active");
        $(this).nextUntil(".ls2").filter(".ls3").css("display","none");
    }else{
        $(".ls2.active").removeClass("active");
        $(this).nextUntil(".ls2").filter(".ls3").css("display","block");
        $(this).addClass("active");
    }
});

$(document).on('click','#manuals .ls3',function(){
    $("#manuals").find(".ls4,.ls5").css("display","none");
    if($(this).hasClass("active")){
        $(".ls3.active").removeClass("active");
        $(this).nextUntil(".ls3").filter(".ls4").css("display","none");
    }else{
        $(".ls3.active").removeClass("active");
        $(this).nextUntil(".ls3").filter(".ls4").css("display","block");
        $(this).addClass("active");
    }
});




$(document).on('click','.ls_val',function(){
    var out_obj = {};
    $("input.ls_val:checked").each(function() {
        var ind  = $(this).attr("ind");
        var sel_obj = struc_obj[ind]["keys"];
        $.each(sel_obj, function (k, v) {

            var fin_val = {};
            if (k == (sel_obj.length - 1)) {
                fin_val = struc_obj[ind]["value"];
            }

            if(k == 0){ !(out_obj[v]) ? out_obj[v] = fin_val : true};

            if(k == 1){
                !(out_obj[sel_obj[0]][v]) ? out_obj[sel_obj[0]][v] = fin_val : true
            }
            if(k == 2){
                !(out_obj[sel_obj[0]][sel_obj[1]][v]) ? out_obj[sel_obj[0]][sel_obj[1]][v] = fin_val : true
            }
            if(k == 3){
                !(out_obj[sel_obj[0]][sel_obj[1]][sel_obj[2]][v]) ? out_obj[sel_obj[0]][sel_obj[1]][sel_obj[2]][v] = fin_val : true
            }
        });
    });
    structured_accordian(out_obj,"added_manuals",false);
    local_set("user_manula_links",out_obj);
    // console.log(out_obj);
});


$(document).on('click','#user_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    var filter = JSON.stringify({"user_id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_users_access','filter':filter}));
    // console.log(access_cards);
    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        console.log(v1);
        $("tr[access_tr="+v1.access_name+"]").find(".access_uname").val(v1.username);
        $("tr[access_tr="+v1.access_name+"]").find(".access_upass").val(v1.password);
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});

$(document).on('click','#created_clusadmin_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    var filter = JSON.stringify({"id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    // console.log(access_cards);

    var email = access_cards[0].email;
    var name = access_cards[0].name;
    var team = access_cards[0].team;
    // var password = access_cards[0].password;
    var manula_links = access_cards[0].manula_links;
    var country = access_cards[0].country;
    var level = access_cards[0].level;
    var status = access_cards[0].status;

    $("#name").val(name);
    $("#email").val(email);
    $("#team").val(team);
    // $("#password").val(password);
    $("#manula_link").val(manula_links);
    $("#country").val(country);
    $("#level").val(level);
    $("#status").val(status);

    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});

$(document).on('click','#created_user_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    var filter = JSON.stringify({"id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    // console.log(access_cards);

    var email = access_cards[0].email;
    var name = access_cards[0].name;
    var team = access_cards[0].team;
    // var nursery_name = access_cards[0].nursery_name;
    var manula_links = access_cards[0].manula_links;
    var country = access_cards[0].country;
    var level = access_cards[0].level;
    var status = access_cards[0].status;

    $("#name").val(name);
    $("#email").val(email);
    $("#team").val(team);
    // $("#nursery_name").val(nursery_name);
    $("#manula_link").val(manula_links);
    $("#country").val(country);
    $("#level").val(level);
    $("#status").val(status);

    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});

$(document).on('click','#created_nursary_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    var filter = JSON.stringify({"id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_nursery','filter':filter}));
    // console.log(access_cards);

    var name = access_cards[0].name;
    var cluster = access_cards[0].cluster_id;
    // var state = access_cards[0].state;
    // var city = access_cards[0].city;
    var pincode = access_cards[0].pincode;
    var lat = access_cards[0].lat;
    var long = access_cards[0].long;
    var status = access_cards[0].status;

    $("#name").val(name);
    $("#cluster").val(cluster);
    // $("#state").val(state);
    // $("#city").val(city);
    $("#pincode").val(pincode);
    $("#lat").val(lat);
    $("#long").val(long);
    $("#status").val(status);

    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});

$(document).on('click','#created_cluster_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    var filter = JSON.stringify({"id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_cluster','filter':filter}));
    // console.log(access_cards);

    var name = access_cards[0].name;
    var country = access_cards[0].country;
    var state = access_cards[0].state;
    var city = access_cards[0].city;
    var status = access_cards[0].status;

    $("#name").val(name);
    $("#country").val(country);
    $("#state").val(state);
    $("#city").val(city);
    $("#status").val(status);

    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});

$(document).on('click','#manula_user_trs .user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);

    // $("#manuals input[type='" + v.value + "']").prop('checked', false);
    $('#manuals input[type=checkbox]').prop('checked', false);

    $("#added_manuals").empty();

    var filter = JSON.stringify({"id":uid});
    var user_det = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    var mnulnks = JSON.parse(user_det[0]["manula_links"]);

    var mnul_vals =  structured_accordian(mnulnks,"added_manuals",false);
    $.each(mnul_vals, function (k, v) {
        $("#manuals input[lnk='" + v.value + "']").prop('checked', true);
    });
});

$(document).on('click','#user_submission_trs .user_list_tr',function(){
    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("user_id",uid);
    // var form_id = url.searchParams.get("form_id");
    var filter = JSON.stringify({"inspection_id":form_id,"user_id":uid});
    var out = JSON.parse(requester(server,"POST",{'api':'submitted_get_users','filter':filter,'limit':0}));
    var sub_prev = false;

    var inspects = {}, last_sub_dt = "", date_selector = "<select id='user_sub_dates'><option>Previous submission</option>";
    $.each(out, function (k, v) {
        inspects[v.submitted_on] =  v;
        last_sub_dt = v.submitted_on;
        date_selector += "<option value='"+v.submitted_on+"'>"+v.submitted_on+"</option>";
        (v.submission) ? sub_prev = true : false;
    });
    date_selector += "</select>";
    user_submitted = inspects;

    if(sub_prev){
        var subs = JSON.parse(inspects[last_sub_dt]['submission']);
        $('#form_div').empty();
        // console.log(subs);
        var formRenderInstance = $('#form_div').formRender({dataType: 'json',formData: subs});
        $.each(subs, function (k, v) {
            if(v.type == "file"){
                if(v.url){
                  $("#"+v.name).parent().append("<a href="+dwnld_url+v.url+" download>Download</a>");
                }else{
                  $("#"+v.name).parent().append("<a href='#' >File Not Uploaded.</a>");
                }
                $("#"+v.name).remove();
            }
        });
        $('#form_div').before(date_selector);
        $('#form_div').before("<span id='selected_date'>&emsp;&emsp;Submitted on : "+last_sub_dt+"</span>");
        // console.log(date_selector);
        $("#user_inspect_submit").remove();
        $("#user_view_prev_submitted").remove();
    }else{
        // $('#form_div').empty();
        $('#form_div').html("<h3>Not yet submitted.</h3>");
        // alert("Not yet submitted.");
    }

});






$(document).on('click','#save_profile',function(){

    var user = local_get("logged_user");
    var name = $(".first-name").text();
    var email = $(".user-email").text();
    var pass = $("#user_password").val();
    // var team = $(".user_team").text();
    var err = "";

    valid_email(email) ? true : err += " Please privde valid email. " ;
    name.length ? true : err += " Please privde valid name. " ;
    pass.length > 2 ? true : err += " Please privde password. " ;

    if(!err.length){
        var data = JSON.stringify({"id":user.id,"name":name,"email":email,"password":pass});
        var user_det = JSON.parse(requester(server,"POST",{'api':'update_password','data':data}));
        // console.log(user_det);
        if(parseInt(user_det)){
            alert("Profile Updated.");
        }
    }else{
        alert(err);
    }
});

$(document).on('click','#create_new_clusadmin',function(){

    var user = local_get("logged_user");
    var name = $("#name").val();
    var email = $("#email").val();
    var is_admin = 0;
    var team = $("#team").val();
    var country = $("#country").val();
    var level = $("#level").val();
    var status = $("#status").val();
    var err = "";

    valid_email(email) ? true : err += " Please privde valid email. " ;
    name.length ? true : err += " Please privde valid name. " ;
    // password.length > 2 ? true : err += " Please privde password. " ;
    country.length ? true : err += " Please select country. " ;
    level.length ? true : err += " Please privde level. " ;
    status.length ? true : err += " Please select status. " ;

    if(!err.length){

        var data = {"name":name,"email":email,"is_admin":is_admin,"team":team,"country":country,"level":level,"status":status};
        var cols = ["name","email","is_admin","team","country","level","status"];

        if($("#created_clusadmin_trs .user_list_tr.active").length){
            data["id"] = $("#created_clusadmin_trs .user_list_tr.active").attr("uid");
            cols.push("id");
        }else{
            data["password"] = "123";
            cols.push("password");
        }

        // var data = JSON.stringify({"id":user.id,"name":name,"email":email,"is_admin":is_admin,"team":team,"status":status});
        // var cols = JSON.stringify(["id","name","email","is_admin","team","status"]);
        var user_det = JSON.parse(requester(server,"POST",{'api':'create_new_user','data':JSON.stringify(data),'cols':JSON.stringify(cols)}));
        console.log(user_det);
        if(parseInt(user_det)){
            alert("Cluster Admin Details Save.");
            window.location.reload();
        }
    }else{
        alert(err);
    }
});

$(document).on('click','#create_new_user',function(){

    var user = local_get("logged_user");
    var name = $("#name").val();
    var email = $("#email").val();
    var is_admin = 0;
    var team = "kidovillage";
    // var nursery_name = $("#nursery_name").val();
    // var country = $("#country").val();
    var country = user.country;
    var level = "4";
    var status = $("#status").val();
    var err = "";

    valid_email(email) ? true : err += " Please privde valid email. " ;
    name.length ? true : err += " Please privde valid name. " ;
    nursery_name.length > 2 ? true : err += " Please privde nursery_name. " ;
    country.length ? true : err += " Please select country. " ;
    level.length ? true : err += " Please privde level. " ;
    status.length ? true : err += " Please select status. " ;

    if(!err.length){

        var data = {"name":name,"email":email,"is_admin":is_admin,"team":team,"country":country,"level":level,"status":status};
        var cols = ["name","email","is_admin","team","country","level","status"];

        if($("#created_user_trs .user_list_tr.active").length){
            data["id"] = $("#created_user_trs .user_list_tr.active").attr("uid");
            cols.push("id");
        }else{
            data["password"] = "123";
            cols.push("password");
        }

        // var data = JSON.stringify({"id":user.id,"name":name,"email":email,"is_admin":is_admin,"team":team,"status":status});
        // var cols = JSON.stringify(["id","name","email","is_admin","team","status"]);
        var user_det = JSON.parse(requester(server,"POST",{'api':'create_new_user','data':JSON.stringify(data),'cols':JSON.stringify(cols)}));
        console.log(user_det);
        if(parseInt(user_det)){
            alert("New User Details Save.");
            window.location.reload();
        }
    }else{
        alert(err);
    }
});


$(document).on('click','#create_new_nursery',function(){

    var user = local_get("logged_user");
    var name = $("#name").val();
    var cluster = $("#cluster").val();
    // var state = $("#state").val();
    // var city = $("#city").val();
    var pincode = $("#pincode").val();
    var status = $("#status").val();
    var lat = $("#lat").val();
    var long = $("#long").val();
    var err = "";

    // valid_email(email) ? true : err += " Please privde valid email. " ;
    name.length ? true : err += " Please privde valid name. " ;
    cluster.length ? true : err += " Please select cluster. " ;
    // state.length > 2 ? true : err += " Please privde state. " ;
    // city.length ? true : err += " Please privde city. " ;
    pincode.length ? true : err += " Please privde pincode. " ;
    status.length ? true : err += " Please select status. " ;
    lat.length ? true : err += " Please select lat. " ;
    long.length ? true : err += " Please select long. " ;


    if(!err.length){

        var data = {"name":name,"cluster_id":cluster,"pincode":pincode,"lat":lat,"long":long,"status":status};
        var cols = ["name","cluster_id","pincode","lat","long","status"];

        if($("#created_nursary_trs .user_list_tr.active").length){
            data["id"] = $("#created_nursary_trs .user_list_tr.active").attr("uid");
            cols.push("id");
        }else{
            // data["password"] = "123";
            // cols.push("password");
        }

        var user_det = JSON.parse(requester(server,"POST",{'api':'create_new_nursery','data':JSON.stringify(data),'cols':JSON.stringify(cols)}));
        console.log(user_det);
        if(parseInt(user_det)){
            // alert("New Nursary Created.");
            // window.location.reload();
        }
    }else{
        alert(err);
    }
});

$(document).on('click','#create_new_cluster',function(){

    var user = local_get("logged_user");
    var name = $("#name").val();
    var country = $("#country").val();
    var state = $("#state").val();
    var city = $("#city").val();
    var status = $("#status").val();
    var err = "";

    // valid_email(email) ? true : err += " Please privde valid email. " ;
    name.length ? true : err += " Please privde valid name. " ;
    country.length ? true : err += " Please privde valid country. " ;
    state.length > 2 ? true : err += " Please privde state. " ;
    city.length ? true : err += " Please privde city. " ;
    status.length ? true : err += " Please select status. " ;


    if(!err.length){

        var data = {"name":name,"country":country,"state":state,"city":city,"status":status};
        var cols = ["name","country","state","city","status"];

        if($("#created_cluster_trs .user_list_tr.active").length){
            data["id"] = $("#created_cluster_trs .user_list_tr.active").attr("uid");
            cols.push("id");
        }else{
            // data["password"] = "123";
            // cols.push("password");
        }

        var user_det = JSON.parse(requester(server,"POST",{'api':'create_new_cluster','data':JSON.stringify(data),'cols':JSON.stringify(cols)}));
        console.log(user_det);
        if(parseInt(user_det)){
            alert("New Cluster Created.");
            window.location.reload();
        }
    }else{
        alert(err);
    }
});


$(document).on('click','#save_user_access',function(){

    var uid = $(this).attr("uid");
    var data = [];

    // $('input.access_cb[type=checkbox]').each(function () {

    $("input.access_cb").each(function () {
        var mymanageusertr = $(this).closest("tr");

        var userName = mymanageusertr.find(".username").val();
        var password = mymanageusertr.find(".password").val();
        var aces_sts = ($(this).prop('checked')) ? 1 : 0;
        var acces_det = access_portals_list[$(this).attr("obj_ind")];
        data.push([uid,acces_det.name,acces_det.link,aces_sts,userName,password]);

    });

    // console.log(JSON.stringify(data));

    if(data.length){
        // var filter = JSON.stringify(data);
        var access_cards = JSON.parse(requester(server,"POST",{'api':'save_users_access','user_access':JSON.stringify(data)}));
        alert("Saved");
    }

});


// $(document).on('click','.clus_list_tr',function(){
//     $(".clus_list_tr.active").removeClass("active");
//     $(this).addClass("active");
// });

$(document).on('click','#cluster_trs .clus_list_tr',function(){

    var clusid = $(this).attr("clusid");
    $(".clus_list_tr.active").removeClass("active");
    $(this).addClass("active");
    // $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("cluster_id",clusid);

    var filter = JSON.stringify({"cluster_id":clusid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_user_cluster','filter':filter}));
    // console.log(access_cards);
    $(".access_cb").prop('checked', false);

    $("#save_cluster_access").attr("clusid",clusid);

    $.each(access_cards, function (k1, v1) {
        $("input[uid="+v1.user_id+"]").prop('checked', true);
    });

    // window.location.reload();
});

$(document).on('click','#save_cluster_access',function(){

    var clusid = $("tr.clus_list_tr.active").attr("clusid");    
    var data = [];

    $("input.access_cb").each(function () {
        if($(this).prop('checked')){
            var uid = $(this).attr("uid");
            data.push([uid,clusid,1]);
        }
    });

    // console.log((data));

    // if(data.length || !data.length){
        // var filter = JSON.stringify(data);
        var access_cards = JSON.parse(requester(server,"POST",{'api':'save_cluster_access','cluster_id':clusid,'user_cluster':JSON.stringify(data)}));
        alert("Saved");
        window.location.reload();
    // }

});

$(document).on('click','#nursery_trs .nursy_list_tr',function(){

    var nursyid = $(this).attr("nursyid");
    $(".nursy_list_tr.active").removeClass("active");
    $(this).addClass("active");
    // $("#selected_user").text($(this).find(".name").text());
    $("#selected_user").attr("nursery_id",nursyid);

    var filter = JSON.stringify({"nursery_id":nursyid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_user_nursery','filter':filter}));
    // console.log(access_cards);
    $(".access_cb").prop('checked', false);

    $("#save_nursery_access").attr("nursyid",nursyid);

    $.each(access_cards, function (k1, v1) {
        console.log(v1);
        $("input[uid="+v1.user_id+"]").prop('checked', true);
    });

});

$(document).on('click','#save_nursery_access',function(){

    var nursyid = $("tr.nursy_list_tr.active").attr("nursyid");    
    var data = [];

    $("input.access_cb").each(function () {
        if($(this).prop('checked')){
            var uid = $(this).attr("uid");
            data.push([uid,nursyid,1]);
        }
    });

    // console.log((data));

    // if(data.length || !data.length){
        // var filter = JSON.stringify(data);
        var access_cards = JSON.parse(requester(server,"POST",{'api':'save_nursery_access','nursery_id':nursyid,'user_nursery':JSON.stringify(data)}));
        alert("Saved");
        window.location.reload();
    // }

});

$(document).on('click','.save_user_detail',function(){
    var userId = local_get("logged_user");
    var data = [];
    var mytr = $(this).closest("tr");
    // $('input.access_cb[type=checkbox]').each(function () {

    // $("tr.access_card").each(function () {
        var userName = mytr.find(".username").val();
        var password = mytr.find(".password").val();
        var name = mytr.find(".access_name").text();
        var link = mytr.find(".access_link").attr("href");
        if(userName === "" || password === ""){
            alert("plz enter username and password");
        }else{
            data.push([userId.id,name,link,userName,password]);
        };

    // });

    // console.log(JSON.stringify(data));

    if(data.length){
        // var filter = JSON.stringify(data);
        var access_cards = JSON.parse(requester(server,"POST",{'api':'save_users_creds','user_access':JSON.stringify(data)}));
        alert("Saved");
        window.location.reload();
    }

});

$(document).on('click','#save_user_manula_links',function(){
    var user_manula_links =  local_get("user_manula_links");
    var user_id = $("#selected_user").attr("user_id");
    var errs = "";
    !(user_id) ? errs += " Please select User. " : true;
    if(!errs.length){
        var data = {"manula_links":user_manula_links,"id":user_id};
        // var filter = {"id":user.id};
        var user_det = JSON.parse(requester(server,"POST",{'api':'update_user_manula_links','data':JSON.stringify(data)}));
        // alert(parseInt(user_det));
        if(parseInt(user_det)){
            alert(" Links assigned. ");
        }
        // console.log(user_det);
        // var ifrm = $("#enquireModal").find("iframe").contents();

    }else{
        alert(errs);
    }
});



$(document).on('change','input.form-control[type=file]',function(){

    // console.log($(this));
    // console.log();
    var elem = $(this);
    var upld = $("<span>Uploading File...</span>");
    elem.after(upld);
    var form = new FormData();
    form.append("api", "upload_file");
    // $("#upload_image")[0].files.length ? form.append("image", $(this).files[0]) : false;
    // $(this)
    form.append("file", elem[0].files[0]);
    var user = local_get('logged_user');
    form.append("user_id", user.id);
    var settings = {
        "url": server,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        success: function (response) {
            // console.log(response);
            elem.attr("url",response);
            console.log(formRenderInstance.userData);
            upld.text("File Uploaded.");
        }
    };

    $.ajax(settings);

});


$(document).on('click','.check_link',function(){

    var lnk = $(this).attr("lnk");

    // var temp = $("#target_out").contents().find(".navbar navbar-fixed-top").html();
    // $('#target_out').contents().find('html').html("<h1 style='text-align: center;'>This IS an iframe</h1>");
    $("#target_out").empty();

    // console.log($('#target_out').contents().find('html').length);

    // $('#link_content').load('https://quarkz.co/key-additional-explorer-day-projects');

    $("#target_out").attr("src",lnk);

    // var ifrm = $("#target_out").contents();

    // console.log(ifrm.find("div").length);

    // $.get(lnk).success(function(data){

        // console.log(data);

        // $('#target_out').html(data);

    // });

});

function cust_navigate(view_name) {
    clearInterval();
    $.ajax({
        url:view_name+".html",
        type:'GET',
        cache:false,
    }).done(function(data) {
        $('#main_container').empty().html(data);
        document.location.hash = view_name;
    });
}

function navto(page) {
    $('#main_container').empty().html('<center> <img src="images/loading.gif" alt="Loading" /></center>');
    document.location.hash = page;
}

$(document).on('click','.navigate',function(){

    var curr_pg = (document.location.hash).replace(/#/g,"");
    
    $(this).attr("link") != curr_pg  ? navto($(this).attr("link")) : false; 

});

window.onhashchange = function() {
    var link = (document.location.hash).replace(/#/g,"");
    (link != "") ? cust_navigate(link) : false;
}
    
