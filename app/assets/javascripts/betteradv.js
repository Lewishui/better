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
var chart1;
$(function() {
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
                tickPixelInterval: 150,
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
