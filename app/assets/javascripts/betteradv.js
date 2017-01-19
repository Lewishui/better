// var g_quotation_desc = {
//     first_pass: true,
//     symbols: {},
//     fields: {},
//     req_fields: {},
//     symbol_data: [],
//     charts: {}
// };
// function format_intval(v, digits) {
//     var txt = "";
//     if (digits > 0) {
//         var pow = Math.pow(10, digits);
//         if (v < pow && v > -pow) {
//             if (v < 0) { txt = "-0."; v = -v; }
//             else { txt = "0."; }
//             var tmp = "" + v;
//             for (var i = tmp.length; i < digits; i++) txt += "0";
//             txt += tmp;
//             return txt;
//         }
//         txt += v / pow;
//         if (txt.indexOf("e") != -1) return "-";
//         var idx = txt.indexOf(".");
//         if (idx == -1) { txt += "."; idx = txt.length - 1; }
//         for (var i = txt.length - idx - 1; i < digits; i++) txt += "0";
//         return txt;
//     }
//     txt += v;
//     return txt;
// }
// function format_float(val, digits) {
//     var txt = "";
//     if (digits > 0) {
//         var v = Math.round(val * Math.pow(10, digits));
//         return format_intval(v, digits);
//     } else {
//         txt += Math.round(val);
//         return txt;
//     }
// }
// function ConvertIntegerToCorrectRate( symbol, val  )
// {
//     return val/10000;
// }
///////////////////////////////////////
$(function () {
  var chart_symbols = [];
  var symbols = [];
  $(".forex-chart[data-symbol]").each(function(){
    chart_symbols.push( $(this).data('symbol') );
    symbols.push( $(this).data('symbol') );
  });
  $(".b-instrument-last-quote[data-symbol]").each(function(){
    var $this = $(this);
    var symbol = $this.data('symbol');
    //there maybe more than one label
    if( !g_quotation_desc.labels[symbol] )
    {
      g_quotation_desc.labels[symbol] = $(".b-instrument-last-quote[data-symbol='"+symbol+"']");
    }
    if( symbols.indexOf( symbol) == -1)
    {
      symbols.push( symbol );
    }
  });
    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });
    if( symbols.length >0 )
    {
      // var source = new EventSource('http://www.ballmerasia.com/node/sse/'+symbols.join(','));
      var source = new EventSource('http://www.ballmerasia.com:8080/sse/'+symbols.join(','));
      source.addEventListener('message', function(e) {
        var data = JSON.parse(e.data);
        if( g_quotation_desc.first_pass )
        {
          g_quotation_desc.first_pass = false;
          InitializeChart( data );
        }else{
          for( var i = 0; i< symbols.length; i++)
          {
            var symbol = symbols[i];
            var time_price = data[symbol];
            var time = (new Date( parseInt(time_price) )).getTime();
            var price= ConvertIntegerToCorrectRate( symbol, parseInt(time_price.split('_')[1]));
            var formatted_price = format_forex_price( price );
            //console.log("data=%s,%s", time, price);
            if(g_quotation_desc.panels[symbol])
            {
               g_quotation_desc.panels[symbol].update( time, price, 1, 0 );
            }
            if(g_quotation_desc.labels[symbol])
            {
              g_quotation_desc.labels[symbol].html(formatted_price );
            }
            // new point added
            //g_quotation_desc.charts[symbols[i]].yAxis[0].plotLines[0].value = price;
          }
        }
        console.log(e);
      }, false);
    }
});

function InitializeChart(message){

  $(".forex-chart").each(function(){
    var $container = $(this);
    var symbol = $container.data('symbol');
    var panel = new BetterFinancialPanel( symbol );
    panel.drawCharts( message[symbol] );

    //FinancialPanel.drawChart( this.id, symbol, message[symbol]);

    g_quotation_desc.charts[symbol] = panel.lineChart;
    g_quotation_desc.panels[symbol] = panel;
  })
  // Create the chart
}
function BetterFinancialPanel( symbol )
{
  this.urlBaseSecure = 'http://www.ballmerasia.com:8080/';

  this.lineChart = null;
  this.instrumentID = symbol;
  this.lastQuotes= [];
  this.lastTradeID = 0;

  this.currentMinute = Math.floor(this.time / 60000) * 60000;
  Highcharts.setOptions({
      global: {
          useUTC: false
      }
  });
}
BetterFinancialPanel.prototype.renderCharts =function(){
  var data = this.getHistory();
  this.drawCharts( data );
}
BetterFinancialPanel.prototype.getHistory = function(){
  // start, from, symbol
  var url =  this.urlBaseSecure+ "/forex_history/"+this.instrumentID;
  return $.ajax({url:url}).then( function(res) {
    return this.fixData(res);})
}
BetterFinancialPanel.prototype.fixData = function( rawData){
  rawDtata = rawData.sort();
  var data = [];
  for (var i = 0; i < rawDtata.length; i += 1) {
    data.push([
      (new Date( parseInt(rawDtata[i]) )).getTime(),
      this.convertIntegerToCorrectRate( parseInt(rawDtata[i].split('_')[1]))
    ]);
  }
  return data;
}

BetterFinancialPanel.prototype.convertIntegerToCorrectRate = function ( symbol, val  )
{
  if( symbol == "USUSDJPY")
  {
    return val/100;
  }else{
    return val/10000;
  }
}
BetterFinancialPanel.prototype.drawCharts = function(chartData, b) {
      var c = this.instrumentID;
      var f = this.currentMinute;
      var g = new Date();
      var e = [];
      e = charData;

      var seriesType = 'line';
      var lineColor = Registry.chartConfig.financialPanel.colors.line;
      var fillColor = {
                          linearGradient : {
                              x1: 0,
                              y1: 0,
                              x2: 0,
                              y2: 1
                          },
                          stops : [[0, Registry.chartConfig.financialPanel.colors.fillColor.top],
                                   [1, Registry.chartConfig.financialPanel.colors.fillColor.bottom]]
                      };

      var a = new Highcharts.StockChart({
          xAxis: {
              gridLineWidth: 1,
              gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
              lineColor: Registry.chartConfig.financialPanel.colors.axis,
              tickLength: 0,
              ordinal: false,
              labels: {
                  formatter: function() {
                      g.setTime(this.value);
                      var j = "H:i";
                      var h = this.axis.series[0].data;
                      if (h.length && (h[h.length - 1].x - h[0].x < (5 * 60000))) {
                          j = "H:i:s"
                      }
                      return Ext.Date.format(g, j)
                  }
              }
          },
          yAxis: {
              id: "advanced-chart-line-y-axis-" + c,
              gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
          },
          chart: {
              renderTo: "advanced-chart-line-" + c,
              plotBorderWidth: 1,
              plotBorderColor: Registry.chartConfig.financialPanel.colors.plotBorder,
              backgroundColor: 'rgba(255,255,255,0)',
              plotBackgroundColor: Registry.chartConfig.financialPanel.colors.plotBackgroundColor
          },
          rangeSelector: {
              enabled: false
          },
          navigator: {
              enabled: false
          },
          scrollbar: {
              enabled: false
          },
          credits: {
              enabled: false
          },
          series: [{
              id: "advanced-chart-line-series-" + c,
              name: "Price",
              data: e,
              type: seriesType,
              threshold : null,
              fillColor: fillColor
          }],
          plotOptions: {
              line: {
                  lineWidth: 1,
                  lineWidth: Registry.chartConfig.financialPanel.lineWidth,
                  dataGrouping: {
                      enabled: false
                  },
                  marker: {
                      states: {
                          hover: {
                              lineColor: Registry.chartConfig.colors.guide,
                              radius: 2
                          }
                      }
                  },
                  events: {
                      click: function(h) {
                          Trading.app.getController("Game").selectClosestTradePoint(h.point)
                      }
                  },
                  allowPointSelect: false
              },
              series: {
                color: lineColor,
                lineWidth: Registry.chartConfig.financialPanel.lineWidth,
                  states: {
                      hover: {
                          lineWidth: 1
                      }
                  }
              }
          },
          tooltip: {
              headerFormat: "<span>{point.key}</span><br/>",
              xDateFormat: "%H:%M:%S",
              pointFormat: "<span>{point.y}</span>",
              borderWidth: 1,
              crosshairs: [{
                  color: Registry.chartConfig.colors.guide,
                  dashStyle: "longdash"
              }],
              formatter: function() {
                  var o = this.points[0].point;
                  var n = "<span>" + Ext.Date.format(new Date(o.x), "H:i:s") + "</span><br/><span>" + o.y + "</span>";
                  if (o.marker && o.marker.keep) {
                      var m = (o.tooltipData.direction == 1) ? Registry._["label-above"] : Registry._["label-below"];
                      n = '<span class="tooltip-label">' + Registry._["game-label-expiry"] + ":</span><span> " + Ext.Date.format(new Date(o.tooltipData.expiry), "H:i:s") + '</span><br/><span class="tooltip-label">' + m + " " + o.y + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-investment"] + ":</span><span> " + Registry.baseCurrencySymbol + o.tooltipData.stake + '</span><br/><span class="tooltip-label">' + Registry._["trade-info-payout"] + ":</span><span> " + o.tooltipData.payout + '%</span><br/><span class="tooltip-label">' + Registry._["label-rebate"] + ":</span><span> " + o.tooltipData.rebate + "%</span>";
                      n += Ext.isEmpty(o.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-label">' + Registry._["label-return-amount"] + ":</span><span> " + Registry.baseCurrencySymbol + o.tooltipData.returnedAmount + "</span>";
                      if (o.tooltipData.social) {
                          var q = o.tooltipData.social.userID;
                          var h = Registry.socialImageUrlPattern.replace("[[[userID]]]", q) + "?v=" + Math.floor(new Date().getTime() / 10000);
                          var k = o.tooltipData.social.nickname;
                          var l = (o.tooltipData.direction == 1) ? "images/small-green-arrow-up-10x11.png": "images/small-red-arrow-down-10x11.png";
                          var m = (o.tooltipData.direction == 1) ? Registry._["short-text-call"] : Registry._["short-text-put"];
                          var j = Ext.isEmpty(o.tooltipData.returnedAmount) ? Registry._["short-text-opened"] : Registry._["short-text-closed"];
                          var p = Ext.isEmpty(o.tooltipData.returnedAmount) ? "": '<br/><span class="tooltip-gain">' + Registry._["short-text-gain"] + ": " + Registry.baseCurrencySymbol + o.tooltipData.returnedAmount + "</span>";
                          n = '<div id="tooltip-social-container"><div class="social-user-img-container"><img class="social-user-img" src="' + h + '" /><img class="social-user-arrow-img" src="' + l + '">&nbsp;</img></div><div class="advanced-social-trade-info"><span class="tooltip-nickname">' + k + ((Registry.env == "development") ? " (" + o.tooltipData.tradeID + ") ": "") + '</span><br/><span class="tooltip-status">' + j + " " + Registry._["short-text-a-binary"] + " " + m + " option</span>" + p + "</div></div>"
                      }
                  }
                  return '<div class="tooltip-container">' + n + "</div>"
              },
              useHTML: true
          }
      });
      this.lineChart = a;
      //this.candlestickChart = this.drawCandlestickChart(c, "advanced-chart-candlestick-", b, e);
      //this.markTrades(c, Trading.app.getController("User").trades.data.items);
      //this.markSocialTrades(c)
}

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
