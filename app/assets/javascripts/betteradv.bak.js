 // A label on the side of chart 2 that points at the last added value
Highcharts.wrap(Highcharts.Series.prototype, 'addPoint',
function(proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));
    // only do this for spline charts
    if (this.type === 'spline') {
        this.yAxis.setSideLabel(this, arguments[1][1].toFixed(2));
    }
});
Highcharts.Axis.prototype.setSideLabel = function(series, value) {
    if (this.sideLabels === undefined) {
        this.sideLabels = [];
    }
    var axis = this,
    label = axis.sideLabels[series._i];
    if (!label) {
        label = this.sideLabels[series._i] = axis.chart.renderer.label(value).attr({
            stroke: series.color,
            strokeWidth: 1,
            zIndex: 8
        }).add();
        axis.chart.renderer.path(['M', -5, 11, 'L', 5, 5, 'L', 30, 5, 'L', 30, 18, 'L', 5, 18, 'Z']).attr({
            stroke: series.color,
            fill: Highcharts.Color(series.color).brighten(0.3).get(),
            strokeWidth: 1
        }).add(label);
    }
    label.attr({
        translateX: axis.left + axis.width + 5,
        translateY: this.top + this.height - axis.translate(value) - 11,
        text: value
    });
}
var chart1=null;
var OldInterval = 150;
//RangeSelector ACTION
var orgHighchartsRangeSelectorPrototypeRender = Highcharts.RangeSelector.prototype.render;
Highcharts.RangeSelector.prototype.render = function (min, max) {
 orgHighchartsRangeSelectorPrototypeRender.apply(this, [min, max]);
 var leftPosition = this.chart.plotLeft,
  topPosition = this.chart.plotTop+5,
  space = 2;
 this.zoomText.attr({
  x: leftPosition,
  y: topPosition + 15
 });
 leftPosition += this.zoomText.getBBox().width;
 for (var i = 0; i < this.buttons.length; i++) {
  this.buttons[i].attr({
   x: leftPosition,
   y: topPosition
  });
  leftPosition += this.buttons[i].width + space;
 }
};

$(function() {
  //indicator
  var adv_options = {
        chart: {
            borderWidth: 5,
            borderColor: '#e8eaeb',
            borderRadius: 0,
            backgroundColor: '#f7f7f7'
        },
        title: {
            style: {
                'fontSize': '1em'
            },
            useHTML: true,
            x: -27,
            y: 8,
            text: '<span class="chart-title">SMA, EMA, ATR, RSI indicators <span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
        },
        indicators: [{
            id: 'AAPL',
            type: 'sma',
            params: {
                period: 14
            }
        }, {
            id: 'AAPL',
            type: 'ema',
            params: {
                period: 14,
                index: 0 //optional parameter for ohlc / candlestick / arearange - index of value
            },
            styles: {
                strokeWidth: 2,
                stroke: 'green',
                dashstyle: 'solid'
            }
        }, {
            id: 'AAPL',
            type: 'atr',
            params: {
                period: 14
            },
            styles: {
                strokeWidth: 2,
                stroke: 'orange',
                dashstyle: 'solid'
            },
            yAxis: {
                lineWidth: 2,
                title: {
                    text: 'ATR'
                }
            }
        }, {
            id: 'AAPL',
            type: 'rsi',
            params: {
                period: 14,
                overbought: 70,
                oversold: 30
            },
            styles: {
                strokeWidth: 2,
                stroke: 'black',
                dashstyle: 'solid'
            },
            yAxis: {
                lineWidth: 2,
                title: {
                    text: 'RSI'
                }
            }
        }],
        yAxis: {
            opposite: false,
            title: {
                text: 'DATA SMA EMA',
                x: -4
            },
            lineWidth: 2,
            labels: {
                x: 22
            }
        },
        rangeSelector: {
            selected: 0
        },
        tooltip: {
            enabledIndicators: true
        },
        series: [{
            cropThreshold: 0,
            id: 'AAPL',
            name: 'AAPL',
            data: [],
            tooltip: {
                valueDecimals: 2
            }
        }]
    };
  //end
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        Highcharts.setOptions({
          lang: {
            resetZoom: "返回",
            resetZoomTitle: "回到初始状态"
            }
            });
        $('#container').highcharts({
            chart: {
              zoomType: 'x',
                //背景颜色
                plotBackgroundColor: '#333333',
                // plotBackgroundColor: '#FFFFFF',
                backgroundColor: 'black',
                type: 'spline',
                type: 'areaspline',
                linecolor: '#910000',
                animation: Highcharts.svg,
                // don't animate in old IE
                //                marginRight: 40,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(),
                            // current time
                            y = Math.random();
                            series.addPoint([x, y], true, true);
                            //d  plotband
                            // chart.xAxis[0].removePlotBand('plot-band-1');
                            // chart.xAxis[0].addPlotBand({
                            //     from: x - 20,
                            //     to: y,
                            //     color: '#434348',
                            //     id: 'plot-band-1'
                            // });
                            //
                            chart.yAxis[0].removePlotLine('plot-line-2');
                            chart.yAxis[0].addPlotLine({
                                value: y,
                                width: 2,
                                dashStyle: 'dash',
                                color: '#808080',
                                id: 'plot-line-2'
                            });
                        },
                        1000);
                    }
                },
            },
            title: {
                text: null
            },
        //     rangeSelector: {
        //       buttons: [{//定义一组buttons,下标从0开始
         //
        //           type: 'min',
         //
        //           count: 1,
         //
        //           text: '放大'
         //
        //           },{
         //
        //           type: 'min',
         //
        //           count: 1,
         //
        //           text: '缩小'
         //
        //           }],
        //       enabled: true,
        //   //   buttonTheme: { // styles for the buttons
        //   //     fill: 'none',
        //   //     stroke: 'none',
        //   //     'stroke-width': 0,
        //   //     r: 8,
        //   //     style: {
        //   //         color: '#039',
        //   //         fontWeight: 'bold'
        //   //     },
        //   // inputEditDateFormat: '%m-%d',
        //   //     states: {
        //   //         hover: {
        //   //         },
        //   //         select: {
        //   //             fill: '#039',
        //   //             style: {
        //   //                 color: 'white'
        //   //             }
        //   //         }
        //   //         // disabled: { ... }
        //   //     }
        //   // },
        //   // inputBoxBorderColor: 'gray',
        //   // inputBoxWidth: 120,
        //   // inputBoxHeight: 18,
        //   // inputStyle: {
        //   //     color: '#039',
        //   //     fontWeight: 'bold'
        //   // },
        //   // labelStyle: {
        //   //     color: 'silver',
        //   //     fontWeight: 'bold'
        //   // },
        //   // selected: 1
        //  },
            xAxis: {
                gridLineDashStyle: 'Solid',
                //横向网格线样式
                gridLineWidth: 0.1,
                //横向网格线宽度
                animation: true,
                startOnTick: true,
                endOnTick: true,
                ordinal: true,
                type: 'datetime',
                tickPixelInterval: OldInterval,
                //波段大小
                // minPadding: 0.1,
                // maxPadding: 0.2,
                // tickLength :210,//主刻度的长度
                plotBands: [{
                    from: 0.5,
                    to: 1,
                    color: 'yellow',
                    label: {
                        text: 'Comfort zone',
                        align: 'center',
                        verticalAlign: 'top',
                        y: 12,
                    }
                }]
            },
            yAxis: [{
                gridLineWidth: 0.1,
                //横向网格线宽度
                title: {
                    text: 'Value'
                },
                opposite: true,
                // plotLines: [{
                //     value: 0.6,
                //     width: 2,
                //     dashStyle: 'dash',
                //     color: '#808080'
                //     //动态添加删除标识线
                //     //chart:yAxis[0].removePlotLine('refline1'),
                //     // chart:yAxis[0].addPlotLine({
                //     //     id:'refline1',
                //     //     value: 1, //y轴水平线位置
                //     //     width: 1,
                //     //     color: '#800'//'#808080'
                //     // })
                // }]
            },
            {
                title: {
                    enabled: false
                },
                gridLineWidth: 1,
                minorGridLineWidth: 1,
                minorTickInterval: 5,
                top: 320,
                height: 65,
                min: 0,
                max: 25,
                plotBands: [{
                    from: 0,
                    to: 25,
                    color: '#FCFFC5'
                }]
            }],
            tooltip: {
                // backgroundColor: 'none',
                //  lineColor:'#FCFFC5',//CCC
                //    backgroundColor: 'FCFFC5',
                crosshairs: [{
                    dashStyle: 'Dash'
                },
                {
                    dashStyle: 'Dash'
                },
                {
                    color: "#ffcbcc"
                },
                {
                    color: "#ffcbcc"
                }],
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                color: '#434348',
                lineColor: '#CCC',
                //CCC
                lineWidth: 0.5,
                name: "",
                data: (function() {
                    // generate an array of random data
                    var data = [],
                    time = (new Date()).getTime(),
                    i;
                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                } ())

            },
          //   {
          //      name: '40-day SMA',
          //      linkedTo: 'primary',
          //      showInLegend: true,
          //      type: 'trendline',
          //      algorithm: 'SMA',
          //      periods: 40
          //  }
            // {
            //     name: 'Area',
            //     type: 'area',
            //     data: [ 25,25],
            //     pointStart: Date.UTC(2015, 5),
            //     pointInterval:  1200 * 4500 *1000,
            //     color: '#434348',//33AA11 绿色
            //     negativeColor: '#f7a35c'
            // },
            ]
        });
        // the button action
        var hasPlotBand = false,
        chart = $('#container').highcharts(),
        $button = $('#gaoyu1');
        $button.click(function() {
            if (!hasPlotBand) {
              var series = chart.series[0];
              setInterval(function() {
           var x = (new Date()).getTime(),
               // current time
               y = Math.random();
          // series.addPoint([x, y + 1], true, true);
          chart.yAxis[0].addPlotBand({
              from: 0.5,
              to: 2.5,
              color: '#C0C0C0',
              id: 'plot-band-1'
              });
            },
                   1000);
                //$button.html('Remove plot band');
            } else {
            //  chart.xAxis[0].removePlotBand('plot-band-1');
              //  $button.html('Add plot band');
            }
            hasPlotBand = !hasPlotBand;
        });
        //diyu
        $button1 = $('#diyu1');
        $button1.click(function() {
            if (!hasPlotBand) {
              var series = chart.series[0];
              setInterval(function() {
           var x = (new Date()).getTime(),
               // current time
               y = Math.random();
          // series.addPoint([x, y + 1], true, true);
          chart.yAxis[0].addPlotBand({
              from: 0.5,
              to: 0,
              color: '#C0C0C0',
              id: 'plot-band-1'
              });
            },
                   1000);
                //$button.html('Remove plot band');
            } else {
            //  chart.xAxis[0].removePlotBand('plot-band-1');
              //  $button.html('Add plot band');
            }
            hasPlotBand = !hasPlotBand;
        });
        //放大
    // var  OldInterval+=OldInterval ;
    //动态修改xAxis的刻度间隔值
      function DynamicChangeTickInterval(interval) {
          chart.xAxis[0].update({
              tickInterval: interval
          });
          }
        $button2 = $('#advfangda');
        $button2.click(function() {
            DynamicChangeTickInterval(150);
          chart.xAxis[0].update({
           tickInterval: 200
       });
        });
        //缩小
        $button2 = $('#advsuoxiao');
        $button2.click(function() {
           alert("resetZoom");
          chart.xAxis[0].update({
           tickInterval: 100
              });
              });
    });
    if($(".forex-wrapper").is('*')){
      $(".forex-wrapper").each(function(){
        var container = $(this);
        // $("select.b-symbols", container).change(function(){
        //   location= location.pathname + '?symbol='+ this.value;
        // })
          //线条图
         $("#advXiantiaotu", container).click(function(){
         {
            alert("线条图");
         }
        // A label on the side of chart 2 that points at the last added value
Highcharts.wrap(Highcharts.Series.prototype, 'addPoint', function(proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));
    // only do this for spline charts
    if (this.type === 'spline') {
        this.yAxis.setSideLabel(this, arguments[1][1].toFixed(2));
    }
});
Highcharts.Axis.prototype.setSideLabel = function(series, value) {
    if (this.sideLabels === undefined) {
        this.sideLabels = [];
    }
    var axis = this,
        label = axis.sideLabels[series._i];
    if (!label) {
        label = this.sideLabels[series._i] = axis.chart.renderer.label(value)
            .attr({
            stroke: series.color,
            strokeWidth: 1,
            zIndex: 8
        })
            .add();
        axis.chart.renderer.path(['M', -5, 11, 'L', 5, 5, 'L', 30, 5, 'L', 30, 18, 'L', 5, 18, 'Z'])
            .attr({
            stroke: series.color,
            fill: Highcharts.Color(series.color).brighten(0.3).get(),
            strokeWidth: 1
        }).add(label);
    }
    label.attr({
        translateX: axis.left + axis.width + 5,
        translateY: this.top + this.height - axis.translate(value) - 11,
        text: value
    });
}

$(function() {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#container').highcharts({
            chart: {
                  zoomType: 'x',
                //背景颜色
                plotBackgroundColor: '#333333',
                // plotBackgroundColor: '#FFFFFF',
                backgroundColor: 'black',
                type: 'spline',
                // type: 'areaspline',
                linecolor: '#910000',
                animation: Highcharts.svg, // don't animate in old IE
                //                marginRight: 40,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                            //d  plotband
                            // chart.xAxis[0].removePlotBand('plot-band-1');
                            // chart.xAxis[0].addPlotBand({
                            //     from: x-20,
                            //     to: y,
                            //     color: '#434348',
                            //     id: 'plot-band-1'
                            // });
                            //
                            chart.yAxis[0].removePlotLine('plot-line-2');
                            chart.yAxis[0].addPlotLine({
                                value:  y  ,
                                width:2,
                                dashStyle: 'dash',
                                color: '#808080',
                                id: 'plot-line-2'
                            });
                        }, 1000);
                    }
                },
            },
            title: {
                text: null
            },
            xAxis: {
                gridLineDashStyle: 'Solid',//横向网格线样式
                gridLineWidth: 0.1,//横向网格线宽度
                animation:true,
                startOnTick:true,
                endOnTick: true,
                ordinal:true,
                type: 'datetime',
                tickPixelInterval: 150,
                //tickInterval:60 * 1000 * 60 *2.5,
                // tickLength :210,//主刻度的长度
                plotBands: [{
                    from: 0.5,
                    to: 1,
                    color: 'yellow',
                    label: {
                        text: 'Comfort zone',
                        align: 'center',
                        verticalAlign: 'top',
                        y: 12,
                    }
                }]
            },
            yAxis: [{
                gridLineWidth: 0.1,//横向网格线宽度
                title: {
                    text: 'Value'
                },
                opposite: true,
                // plotLines: [{
                //     value: 0.6,
                //     width: 2,
                //     dashStyle: 'dash',
                //     color: '#808080'
                //     //动态添加删除标识线
                //     //chart:yAxis[0].removePlotLine('refline1'),
                //     // chart:yAxis[0].addPlotLine({
                //     //     id:'refline1',
                //     //     value: 1, //y轴水平线位置
                //     //     width: 1,
                //     //     color: '#800'//'#808080'
                //     // })
                // }]
            },
                    {
                        title: {
                            enabled: false
                        },
                        gridLineWidth: 1,
                        minorGridLineWidth: 1,
                        minorTickInterval: 5,
                        top: 320,
                        height: 65,
                        min: 0,
                        max: 25,
                        plotBands: [{
                            from: 0,
                            to: 25,
                            color: '#FCFFC5'
                        }]
                    }],
            tooltip: {
                // backgroundColor: 'none',
                //  lineColor:'#FCFFC5',//CCC
                //    backgroundColor: 'FCFFC5',
                crosshairs: [
                    { dashStyle: 'Dash'},
                    { dashStyle: 'Dash'},
                    { color: "#ffcbcc" },
                    { color: "#ffcbcc" }
                ],
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                color: '#434348',
                lineColor:'#CCC',//CCC
                lineWidth: 0.5,
                name: "",
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            },
                     // {
                     //     name: 'Area',
                     //     type: 'area',
                     //     data: [ 25,25],
                     //     pointStart: Date.UTC(2015, 5),
                     //     pointInterval:  1200 * 4500 *1000,
                     //     color: '#434348',//33AA11 绿色
                     //     negativeColor: '#f7a35c'
                     // },
                    ]
        });
        // the button action
        var hasPlotBand = false,
        chart = $('#container').highcharts(),
        $button = $('#gaoyu1');
        $button.click(function() {
            if (!hasPlotBand) {
              var series = chart.series[0];
              setInterval(function() {
           var x = (new Date()).getTime(),
               // current time
               y = Math.random();
          // series.addPoint([x, y + 1], true, true);
          chart.yAxis[0].addPlotBand({
              from: 0.5,
              to: 2.5,
              color: '#FCFFC5',
              id: 'plot-band-1'
              });
            },
                 1000);
                //$button.html('Remove plot band');
            } else {
            //  chart.xAxis[0].removePlotBand('plot-band-1');
              //  $button.html('Add plot band');
            }
            hasPlotBand = !hasPlotBand;
        });
    });
});

        });
          //线条图  结束

      //区域视图
        $("#advquyushitu", container).click(function(){
           alert("区域视图");
     // A label on the side of chart 2 that points at the last added value
         Highcharts.wrap(Highcharts.Series.prototype, 'addPoint', function(proceed) {
             proceed.apply(this, [].slice.call(arguments, 1));
             // only do this for spline charts
             if (this.type === 'spline') {
                 this.yAxis.setSideLabel(this, arguments[1][1].toFixed(2));
             }
         });
         Highcharts.Axis.prototype.setSideLabel = function(series, value) {
             if (this.sideLabels === undefined) {
                 this.sideLabels = [];
             }
             var axis = this,
                 label = axis.sideLabels[series._i];
             if (!label) {
                 label = this.sideLabels[series._i] = axis.chart.renderer.label(value)
                     .attr({
                     stroke: series.color,
                     strokeWidth: 1,
                     zIndex: 8
                 })
                     .add();
                 axis.chart.renderer.path(['M', -5, 11, 'L', 5, 5, 'L', 30, 5, 'L', 30, 18, 'L', 5, 18, 'Z'])
                     .attr({
                     stroke: series.color,
                     fill: Highcharts.Color(series.color).brighten(0.3).get(),
                     strokeWidth: 1
                 }).add(label);
             }
             label.attr({
                 translateX: axis.left + axis.width + 5,
                 translateY: this.top + this.height - axis.translate(value) - 11,
                 text: value
             });
         }
         var chart1;
         $(function() {
             $(document).ready(function() {
                 Highcharts.setOptions({
                     global: {
                         useUTC: false
                     }
                 });
                 $('#container').highcharts({
                     chart: {
                         zoomType: 'x',
                         //背景颜色
                         plotBackgroundColor: '#333333',
                         // plotBackgroundColor: '#FFFFFF',
                         backgroundColor: 'black',
                         type: 'spline',
                          type: 'areaspline',
                         linecolor: '#910000',
                         animation: Highcharts.svg, // don't animate in old IE
                         //                marginRight: 40,
                         events: {
                             load: function() {
                                 // set up the updating of the chart each second
                                 var series = this.series[0];
                                 setInterval(function() {
                                     var x = (new Date()).getTime(), // current time
                                         y = Math.random();
                                     series.addPoint([x, y], true, true);
                                     //d  plotband
                                     // chart.xAxis[0].removePlotBand('plot-band-1');
                                     // chart.xAxis[0].addPlotBand({
                                     //     from: x-20,
                                     //     to: y,
                                     //     color: '#434348',
                                     //     id: 'plot-band-1'
                                     // });
                                     //
                                     chart.yAxis[0].removePlotLine('plot-line-2');
                                     chart.yAxis[0].addPlotLine({
                                         value:  y  ,
                                         width:2,
                                         dashStyle: 'dash',
                                         color: '#808080',
                                         id: 'plot-line-2'
                                     });
                                 }, 1000);
                             }
                         },
                     },
                     title: {
                         text: null
                     },
                     xAxis: {
                         gridLineDashStyle: 'Solid',//横向网格线样式
                         gridLineWidth: 0.1,//横向网格线宽度
                         animation:true,
                         startOnTick:true,
                         endOnTick: true,
                         ordinal:true,
                         type: 'datetime',
                         tickPixelInterval: 150,
                         //tickInterval:60 * 1000 * 60 *2.5,
                         // tickLength :210,//主刻度的长度
                         plotBands: [{
                             from: 0.5,
                             to: 1,
                             color: 'yellow',
                             label: {
                                 text: 'Comfort zone',
                                 align: 'center',
                                 verticalAlign: 'top',
                                 y: 12,
                             }
                         }]
                     },
                     yAxis: [{
                         gridLineWidth: 0.1,//横向网格线宽度
                         title: {
                             text: 'Value'
                         },
                         opposite: true,
                         // plotLines: [{
                         //     value: 0.6,
                         //     width: 2,
                         //     dashStyle: 'dash',
                         //     color: '#808080'
                         //     //动态添加删除标识线
                         //     //chart:yAxis[0].removePlotLine('refline1'),
                         //     // chart:yAxis[0].addPlotLine({
                         //     //     id:'refline1',
                         //     //     value: 1, //y轴水平线位置
                         //     //     width: 1,
                         //     //     color: '#800'//'#808080'
                         //     // })
                         // }]
                     },
                             {
                                 title: {
                                     enabled: false
                                 },
                                 gridLineWidth: 1,
                                 minorGridLineWidth: 1,
                                 minorTickInterval: 5,
                                 top: 320,
                                 height: 65,
                                 min: 0,
                                 max: 25,
                                 plotBands: [{
                                     from: 0,
                                     to: 25,
                                     color: '#FCFFC5'
                                 }]
                             }],
                     tooltip: {
                         // backgroundColor: 'none',
                         //  lineColor:'#FCFFC5',//CCC
                         //    backgroundColor: 'FCFFC5',
                         crosshairs: [
                             { dashStyle: 'Dash'},
                             { dashStyle: 'Dash'},
                             { color: "#ffcbcc" },
                             { color: "#ffcbcc" }
                         ],
                         formatter: function() {
                             return '<b>' + this.series.name + '</b><br/>' +
                                 Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                 Highcharts.numberFormat(this.y, 2);
                         }
                     },
                     legend: {
                         enabled: false
                     },
                     exporting: {
                         enabled: false
                     },
                     series: [{
                         color: '#434348',
                         lineColor:'#CCC',//CCC
                         lineWidth: 0.5,
                         name: "",
                         data: (function() {
                             // generate an array of random data
                             var data = [],
                                 time = (new Date()).getTime(),
                                 i;
                             for (i = -19; i <= 0; i += 1) {
                                 data.push({
                                     x: time + i * 1000,
                                     y: Math.random()
                                 });
                             }
                             return data;
                         }())
                     },
                              // {
                              //     name: 'Area',
                              //     type: 'area',
                              //     data: [ 25,25],
                              //     pointStart: Date.UTC(2015, 5),
                              //     pointInterval:  1200 * 4500 *1000,
                              //     color: '#434348',//33AA11 绿色
                              //     negativeColor: '#f7a35c'
                              // },
                             ]
                 });
                 // the button action
                 var hasPlotBand = false,
                     chart = $('#container').highcharts(),
                     $button = $('#button');
                 $button.click(function () {
                     if (!hasPlotBand) {
                         chart.xAxis[0].addPlotBand({
                             from: 5.5,
                             to: 7.5,
                             color: '#FCFFC5',
                             id: 'plot-band-1'
                         });
                         $button.html('Remove plot band');
                     } else {
                         chart.xAxis[0].removePlotBand('plot-band-1');
                         $button.html('Add plot band');
                     }
                     hasPlotBand = !hasPlotBand;
                 });
             });
         });
           });

      //区域视图 结束

        //K 线图
        $("#advkxiantu", container).click(function(){
        {
           alert("K线图");
        }
        $(function () {
          function resetChartZoom() {
                chart.zoomOut();
                  }

           $.getJSON('//data.jianshukeji.com/jsonp?filename=json/new-intraday.json&callback=?', function (data) {
         // create the chart
         $('#container').highcharts('StockChart', {
             chart: {
                 zoomType: 'xy',
              //   marginRight:200,
                 // marginBottom: 10,
                 // marginLeft: 10,
                 // marginTop: 50,
                 borderWidth: 1,
                  plotBorderWidth: 1,
                    resetZoomButton: {
                        theme: {
                            display: 'none'
                            }
                            },
                              zoomType: 'xy',

                 type: 'spline',
                 animation: Highcharts.svg, // don't animate in old IE
                 //背景颜色
                     backgroundColor: 'black',
                 plotBackgroundColor: '#333333'
             },
             title: {
                 text: ''
             },
             navigator : {
                 enabled : false
             },
             scrollbar : {
            enabled : false
        },
         plotOptions: {
                 candlestick: {//红涨绿跌
                     color: 'green',
                     upColor: 'red'
                 }
             },
         rangeSelector : {
          //  注销zoom按钮功能 例子 selected 开始之后的按钮会注销
      //     allButtonsEnabled: true,

                 buttons : [{
                     type : 'min',
                     count : 1,
                     text : '大'
                 }, {
                     type : 'min',
                     count : 1,
                     text : '小'
                 }, ],
                 selected : 1,
                 inputEnabled : false
             },
         series : [{
                 name : 'AAPL',
                 type: 'candlestick',
                 data : data,
                 tooltip: {
                     valueDecimals: 2
                 }
             }]
            } );

          });
              });
       $('#resetZoom').click(function() {
         alert("resetZoom");
      resetChartZoom();
     });
        //标记上下边的范围高低
          // the button action
         var hasPlotBand = false,
         chart = $('#container').highcharts(),
         $button = $('#gaoyu1');
         $button.click(function() {
             if (!hasPlotBand) {
               var series = chart.series[0];
               setInterval(function() {
            var x = (new Date()).getTime(),
                // current time
                y = Math.random();
           // series.addPoint([x, y + 1], true, true);
           chart.yAxis[0].addPlotBand({
               from: 0.5,
               to: 2.5,
               color: '#FCFFC5',
               id: 'plot-band-1'
               });
             },
                    1000);
                 //$button.html('Remove plot band');
             } else {
             //  chart.xAxis[0].removePlotBand('plot-band-1');
               //  $button.html('Add plot band');
             }
             hasPlotBand = !hasPlotBand;
         });
         //diyu
         $button1 = $('#diyu1');
         $button1.click(function() {
                  alert("K线图");
             if (!hasPlotBand) {
               var series = chart.series[0];
               setInterval(function() {
               var x = (new Date()).getTime(),
                // current time
                y = Math.random();
           // series.addPoint([x, y + 1], true, true);
           chart.yAxis[0].addPlotBand({
               from: 0.5,
               to: 0,
               color: '#FCFFC5',
               id: 'plot-band-1'
               });
             },
                    1000);
                 //$button.html('Remove plot band');
             } else {
             //  chart.xAxis[0].removePlotBand('plot-band-1');
               //  $button.html('Add plot band');
             }
             hasPlotBand = !hasPlotBand;
         });
        });

        //K线图结束
        //sma
          $("#advSMA", container).click(function(){
                alert("SMA123");
//
    //       $(function () {
    //
    //       var adv_options = {
    //           chart: {
    //               borderWidth: 5,
    //               borderColor: '#e8eaeb',
    //               borderRadius: 0,
    //               backgroundColor: '#f7f7f7'
    //           },
    //           title: {
    //               style: {
    //                   'fontSize': '1em'
    //               },
    //               useHTML: true,
    //               x: -27,
    //               y: 8,
    //               text: '<span class="chart-title">SMA, EMA, ATR, RSI indicators <span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
    //           },
    //           indicators: [{
    //               id: 'AAPL',
    //               type: 'sma',
    //               params: {
    //                   period: 14
    //               }
    //           },
    //              {
    //               id: 'AAPL',
    //               type: 'ema',
    //               params: {
    //                   period: 14,
    //                   index: 0 //optional parameter for ohlc / candlestick / arearange - index of value
    //               },
    //               styles: {
    //                   strokeWidth: 2,
    //                   stroke: 'green',
    //                   dashstyle: 'solid'
    //               }
    //           },
    //           {
    //               id: 'AAPL',
    //               type: 'atr',
    //               params: {
    //                   period: 14
    //               },
    //               styles: {
    //                   strokeWidth: 2,
    //                   stroke: 'orange',
    //                   dashstyle: 'solid'
    //               },
    //               yAxis: {
    //                   lineWidth: 2,
    //                   title: {
    //                       text: 'ATR'
    //                   }
    //               }
    //           }, {
    //               id: 'AAPL',
    //               type: 'rsi',
    //               params: {
    //                   period: 14,
    //                   overbought: 70,
    //                   oversold: 30
    //               },
    //               styles: {
    //                   strokeWidth: 2,
    //                   stroke: 'black',
    //                   dashstyle: 'solid'
    //               },
    //               yAxis: {
    //                   lineWidth: 2,
    //                   title: {
    //                       text: 'RSI'
    //                   }
    //               }
    //           }],
    //           yAxis: {
    //               opposite: false,
    //               title: {
    //                   text: 'DATA SMA EMA',
    //                   x: -4
    //               },
    //               lineWidth: 2,
    //               labels: {
    //                   x: 22
    //               }
    //           },
    //           rangeSelector: {
    //               selected: 0
    //           },
    //           tooltip: {
    //               enabledIndicators: true
    //           },
    //           series: [{
    //               cropThreshold: 0,
    //               id: 'AAPL',
    //               name: 'AAPL',
    //               data: [],
    //               tooltip: {
    //                   valueDecimals: 2
    //               }
    //           }]
    //       };
    //     alert("SMA124");
    // $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {
    //
    //     adv_options.series[0].type = 'area';
    //     adv_options.series[0].data = data;
    //
    //     $('#container-advanced').highcharts('StockChart', adv_options);
    // });
    //

});
        //SMA 结束

      });

    }


});
