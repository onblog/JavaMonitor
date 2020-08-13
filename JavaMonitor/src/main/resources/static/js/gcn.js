function gcn(data) {
    var myChart = echarts.init(document.getElementById('gcn'));//（1）
        myChart.setOption(option = {
            backgroundColor: background_color,
            title: {
                subtext: '单位/次',
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
                    name: "YGC",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ygc;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "FGC",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.fgc
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}