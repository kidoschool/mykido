/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/

let monthNames =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

$(function () {
    "use strict";

    make_chart("ct-visits");
    make_chart("ct-sm-visits");
    make_chart("ct-tab-visits");

    function make_chart(div_id) {

        var goBackDays = 7;
        var today = new Date();
        var daysSorted = [];

        for(var i = 0; i < goBackDays; i++) {
            var newDate = new Date(today.setDate(today.getDate() - 1));
            let monthIndex = newDate.getMonth();
            let monthName = monthNames[monthIndex];
            daysSorted.push(newDate.getDate()+" "+monthName);
            }
    
            //ct-visits
            new Chartist.Line('#'+div_id, {
            labels: daysSorted,
            series: [
                [4, 2, 4, 2, 4, 3, 4, 2]
            ]
        }, {
            top: 0,
            low: 1,
            showPoint: true,
            fullWidth: true,
            plugins: [
                Chartist.plugins.tooltip()
            ],
            axisY: {
                labelInterpolationFnc: function (value) {
                    return (value) + 'cnt';
                }
            },
            showArea: true
        });

    }

    // var chart = [chart];
});


