function old(data) {
    var myChart = echarts.init(document.getElementById('old'));
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
                    name: "OC",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.oc;
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
                    //         yAxis: data[0].oc
                    //     }]
                    // }
                },
                {
                    name: "OU",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ou;
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
                    //         yAxis: data[0].ou
                    //     }]
                    // }
                }]
        });
}