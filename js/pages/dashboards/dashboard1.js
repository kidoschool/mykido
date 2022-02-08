/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/

$(function () {
    "use strict";
    // ============================================================== 
    // Newsletter
    // ============================================================== 
    //ct-visits
    new Chartist.Line('#ct-visits', {
        labels: ['24 jan', '25 jan', '26 jan', '27 jan', '28 jan', '29 jan', '30 jan'],
        series: [
            [4, 2, 4, 6, 4, 3, 4, 2]
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
                return (value) + 'inc';
            }
        },
        showArea: true
    });


    var chart = [chart];

    // var sparklineLogin = function () {
    //     $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
    //         type: 'bar',
    //         height: '30',
    //         barWidth: '4',
    //         resize: true,
    //         barSpacing: '5',
    //         barColor: '#7ace4c'
    //     });
    //     $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
    //         type: 'bar',
    //         height: '30',
    //         barWidth: '4',
    //         resize: true,
    //         barSpacing: '5',
    //         barColor: '#7460ee'
    //     });
    //     $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
    //         type: 'bar',
    //         height: '30',
    //         barWidth: '4',
    //         resize: true,
    //         barSpacing: '5',
    //         barColor: '#11a0f8'
    //     });
    //     $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
    //         type: 'bar',
    //         height: '30',
    //         barWidth: '4',
    //         resize: true,
    //         barSpacing: '5',
    //         barColor: '#f33155'
    //     });
    // }
    var sparkResize;
    $(window).on("resize", function (e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});


