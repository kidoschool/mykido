// let form_id = null;
var server = ((document.location.host).indexOf("localhost") !== -1) ? "http://localhost/kido-audit-api/api.php" : 'https://shop.kidovillage.com/kido-audit-api/api.php';

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
                out += "<div ind="+j+x+" class='ls"+i+"'>"+k1+'  '+arw+' </div>';
                if(v1 instanceof Object){
                    y = 0;
                    $.each(v1, function (k2, v2) {
                        i = 3;y++;
                        out += "<div ind="+j+x+y+" class='ls"+i+"'>"+k2+'  '+arw+' </div>';
                        if(v2 instanceof Object){
                            $.each(v2, function (k3, v3) {
                                i = 4;z++;                            
                                out += "<div ind="+j+x+y+z+" class='ls"+i+"'>"+v3+'  '+arw+' </div>';
                                mnul_vals[""+j+x+y+z] = {"value":v3,"keys":[k,k1,k2,k3]};
                            });
                        }else{
                            mnul_vals[""+j+x+y] = {"value":v2,"keys":[k,k1,k2]};
                        }
                    });
                }else{
                    mnul_vals[""+j+x] = {"value":v1,"keys":[k,k1]};
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


$(document).on('click','.user_list_tr',function(){

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
        // console.log();
        $("input[name="+v1.access_name+"]").prop('checked', true);
    });

});



$(document).on('click','#save_profile',function(){

    var user = local_get("logged_user");
    var name = $(".first_name").val();
    var email = $(".user_email").val();
    var pass = $("#user_password").val();
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

$(document).on('click','#save_user_manula_links',function(){
    var user_manula_links =  local_get("user_manula_links");
    var user_id = $("#selected_user").attr("user_id");
    var errs = "";
    !(user_id) ? errs += " Please select User. " : true;
    if(errs.length){
        var data = {"manula_links":user_manula_links,"id":user_id};
        // var filter = {"id":user.id};
        var user_det = JSON.parse(requester(server,"POST",{'api':'update_user_manula_links','data':JSON.stringify(data)}));
        console.log(user_det);
    }else{
        alert(errs);
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
    
