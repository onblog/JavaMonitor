function s1(data) {
    var myChart = echarts.init(document.getElementById('s1'));
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
                    name: "S1C",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.s1C;
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
                    //         yAxis: data[0].s1C
                    //     }]
                    // }
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
                    // markLine: {
                    //     silent: true,
                    //     lineStyle: {
                    //         color: colors[1]
                    //     },
                    //     data: [{
                    //         yAxis: data[0].s1U
                    //     }]
                    // }
                }]
        });
}