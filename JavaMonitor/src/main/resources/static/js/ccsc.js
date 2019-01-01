function ccsc(data) {
    var myChart = echarts.init(document.getElementById('ccsc'));//（1）
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
                name: "CCSC",//（2）
                type: 'line',
                data: data.map(function (item) {
                    return item.ccsc;
                }),
                lineStyle: {
                    color: colors[0]
                }
            },
            {
                name: "CCSU",//（3）
                type: 'line',
                data: data.map(function (item) {
                    return item.ccsu
                }),
                lineStyle: {
                    color: colors[1]
                }
            }]
    });
}