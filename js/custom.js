// let form_id = null;
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
        "logo": "images/kido_logo.jpg",
        "desc": "Manage nursery details and upload images, video & documents. Easy & flexible to use.",
    },
    {
        "name": "Iauditor",
        "link": "https://app.safetyculture.com/login.html?lang=en-US",
        "logo": "images/iauditor.png",
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
            var allow_after_dd = $('#allow_after_dd').is(":checked") ? 1 : 0;
            var data = {'api':'save_inspect','content':fbuilder.formData,"title":title,"due_date":due_date,"submit_after_due_date":allow_after_dd};
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
    });


    $(document).on('click','#fb-editor .save-template',function(){
        // var formBuilder = $('#fb-editor').formBuilder();
        // var fbEditor = document.getElementById('fb-editor');
        // var formBuilder = $(fbEditor).formBuilder();
        var title = $("#inspect_title").val();
        var due_date = format_date(format_date2($( "#due_date" ).val()));
        var allow_after_dd = $('#allow_after_dd').is(":checked") ? 1 : 0;
        var err = "";
        (title.length == 0) ? err += " Title cannot be empty. " : false;
        JSON.parse(fbuilder.formData).length == 0 ? err += " No fields added. " : false;
        if(err.length){
            alert(err);
        }else{
            var data = {'api':'save_inspect','content':fbuilder.formData,"title":title,"due_date":due_date,"submit_after_due_date":allow_after_dd};
            if($("#inspect_title").attr("form_id")){
                data["id"] = $("#inspect_title").attr("form_id");
            }
            requester(server,"POST",data);
            $("#modal_btn").trigger("click");
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

var server = ((document.location.host).indexOf("localhost") !== -1) ? "http://localhost/kido-audit-api/api.php" : 'https://shop.kidovillage.com/kido-audit-api/api.php';

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
    var filter = JSON.stringify({});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
    });
    $("#user_trs").append(trs);
    $('#user_list').DataTable();
}



function updt_usr_list_tbl() {
    var filter = JSON.stringify({});
    var inspects = JSON.parse(requester(server,"POST",{'api':'get_users','filter':filter}));
    $("#user_trs").empty();
    var trs = "";
    $.each(inspects, function (k, v) {
        // trs += '<tr><td>'+v.name+'</td> <td>'+v.email+'</td><td usr="'+v.email+'" >No</td><td><input type="checkbox" value="'+v.email+'"></td></tr>';
        var team = (v.team).replaceAll("-"," ");
        trs += '<tr uid="'+v.id+'" class="user_list_tr"><td class="name">'+v.name+'</td> <td class="email">'+v.email+'</td><td>'+team+'</td></tr>';
        // trs += '<tr class="user_list_tr"><td>'+v.name+'</td> <td>'+v.email+'</td></tr>';
    });
    $("#user_trs").append(trs);
    $('#user_list').DataTable();

    var lis = "";

    $.each(access_portals_list, function (k1, v1) {

        lis += '<li><input obj_ind="'+k1+'" class="access_cb" name="'+v1.name+'" type="checkbox" value="'+k1+'">&emsp;<span>'+v1.name+'</span></li>';

    });

    $("#access_portals").empty().append(lis);

}


$(document).on('click','.user_list_tr',function(){

    var uid = $(this).attr("uid");
    $(".user_list_tr.active").removeClass("active");
    $(this).addClass("active");
    $("#selected_user").text($(this).find(".name").text());

    var filter = JSON.stringify({"user_id":uid});
    var access_cards = JSON.parse(requester(server,"POST",{'api':'get_users_access','filter':filter}));
    // console.log(access_cards);
    $(".access_cb").prop('checked', false);

    $("#save_user_access").attr("uid",uid);

    $.each(access_cards, function (k1, v1) {
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});


$(document).on('click','#save_user_access',function(){

    var uid = $(this).attr("uid");
    var data = [];

    // $('input.access_cb[type=checkbox]').each(function () {

    $("input.access_cb").each(function () {

        var aces_sts = ($(this).prop('checked')) ? 1 : 0;
        var acces_det = access_portals_list[$(this).attr("obj_ind")];
        data.push([uid,acces_det.name,acces_det.link,acces_det.logo,aces_sts]);

    });

    // console.log(JSON.stringify(data));

    if(data.length){
        // var filter = JSON.stringify(data);
        var access_cards = JSON.parse(requester(server,"POST",{'api':'save_users_access','user_access':JSON.stringify(data)}));
        alert("Saved");
    }

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
    $('#main_container').empty().html('<img style="margin-top:45vh" src="images/loading.gif" alt="Loading" />');   
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
    
