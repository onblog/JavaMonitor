function s1(data) {
    var myChart = echarts.init(document.getElementById('s1'));
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
                    color: white
                }
            }],
            series: [
                {
                    name: "S1C",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.s1C;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "S1U",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.s1U;
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}