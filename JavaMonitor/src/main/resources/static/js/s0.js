function s0(data) {
    var myChart = echarts.init(document.getElementById('s0'));
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
                name: "SOC",
                type: 'line',
                data: data.map(function (item) {
                    return item.s0C;
                }),
                lineStyle: {
                    color: colors[0]
                }
            },
            {
                name: "SOU",
                type: 'line',
                data: data.map(function (item) {
                    return item.s0U;
                }),
                lineStyle: {
                    color: colors[1]
                }
            }]
    });
}