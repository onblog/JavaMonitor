function thread(data) {
    var myChart = echarts.init(document.getElementById('thread'));
    myChart.setOption(option = {
        title: {
            subtext: '数量',
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: data.map(function (item) {
                return item.date;
            })
        },
        yAxis: {
            splitLine: {
                show: false
            }
        },
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
                name: "runnable",//（3）
                type: 'line',
                data: data.map(function (item) {
                    return item.runnable
                }),
                lineStyle: {
                    color: colors[2]
                }
            },
            {
                name: "Timed_WAITING",//（3）
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