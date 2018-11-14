function comn(data) {
    var myChart = echarts.init(document.getElementById('comn'));//（1）
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
                    color: white,
                    symbolSize: [0, 5]
                }
            }],
            series: [
                {
                    name: "Compiled",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.compiled;
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
                    //         yAxis: data[0].compiled
                    //     }]
                    // }
                },
                {
                    name: "Failed",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.failed
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
                    //         yAxis: data[0].failed
                    //     }]
                    // }
                }]
        });
}