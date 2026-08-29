function combyte(data) {
    var myChart = echarts.init(document.getElementById('combyte'));//（1）
        myChart.setOption(option = {
            backgroundColor: background_color,
            title: {
                subtext: '单位/KB',
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
                    color: white,
                    symbolSize: [0, 5]
                }
            }],
            series: [
                {
                    name: "Loaded",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.bytes1;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "Unloaded",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.bytes2
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}