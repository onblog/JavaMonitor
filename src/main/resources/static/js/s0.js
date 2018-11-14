function s0(data) {
    var myChart = echarts.init(document.getElementById('s0'));
    myChart.setOption(option = {
        title: {
            subtext: 'KB',
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
                name: "SOC",
                type: 'line',
                data: data.map(function (item) {
                    return item.s0C;
                }),
                lineStyle: {
                    color: colors[0]
                }
                // markLine: {
                //     silent: true,
                //     lineStyle: {
                //         color: colors[0]
                //     },
                //     data: [{
                //         yAxis: data[0].s0C
                //     }]
                // }
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
                // markLine: {
                //     silent: true,
                //     lineStyle: {
                //         color: colors[1]
                //     },
                //     data: [{
                //         yAxis: data[0].s0U
                //     }]
                // }
            }]
    });
}