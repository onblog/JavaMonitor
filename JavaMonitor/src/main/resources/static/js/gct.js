function gct(data) {
    var myChart = echarts.init(document.getElementById('gct'));
        myChart.setOption(option = {
            backgroundColor: background_color,
            title: {
                subtext: '单位/秒',
                textStyle: {
                    color: '#fff'
                }
            },
            xAxis: {
                axisLine: { lineStyle: { color: '#8392A5' } },
                data: data.map(function (item) {
                    return item.date;
                }),
                nameTextStyle: {
                    color: '#fff'
                }
            },
            yAxis: {
                scale: true,
                axisLine: { lineStyle: { color: '#8392A5' } },
                splitLine: { show: false }
            },
            tooltip: my_tooltip,
            toolbox: my_toolbox,
            dataZoom: [{
                startValue: data[0].date
            }, {
                type: 'inside'
            }],
            visualMap: [{
                show: false,
                inRange: {
                    color: white
                }
            }],
            series: [
                {
                    name: "YGCT",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ygct;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "FGCT",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.fgct
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                },
                {
                    name: "GCT",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.gct
                    }),
                    lineStyle: {
                        color: colors[2]
                    }
                }]
        });
}