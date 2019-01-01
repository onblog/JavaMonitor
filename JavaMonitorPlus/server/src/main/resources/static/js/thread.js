function thread(data) {
    var myChart = echarts.init(document.getElementById('thread'));
    myChart.setOption(option = {
        backgroundColor: background_color,
        title: {
            subtext: '单位/个',
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
                name: "Total",//（2）
                type: 'line',
                data: data.map(function (item) {
                    return item.total;
                }),
                lineStyle: {
                    color: colors[0]
                }
            },
            {
                name: "Waiting",//（3）
                type: 'line',
                data: data.map(function (item) {
                    return item.waiting
                }),
                lineStyle: {
                    color: colors[1]
                }
            },
            {
                name: "Runnable",//（3）
                type: 'line',
                data: data.map(function (item) {
                    return item.runnable
                }),
                lineStyle: {
                    color: colors[2]
                }
            },
            {
                name: "Sleeping",//（3）
                type: 'line',
                data: data.map(function (item) {
                    return item.timed_WAITING
                }),
                lineStyle: {
                    color: colors[3]
                }
            }]
    });
}