function ccsc(data) {
    var myChart = echarts.init(document.getElementById('ccsc'));//（1）
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
                    name: "CCSC",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ccsc;
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
                    //         yAxis: data[0].ccsc
                    //     }]
                    // }
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
                    // markLine: {
                    //     silent: true,
                    //     lineStyle: {
                    //         color: colors[1]
                    //     },
                    //     data: [{
                    //         yAxis: data[0].ccsu
                    //     }]
                    // }
                }]
        });
}