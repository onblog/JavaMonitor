function mc(data) {
    var myChart = echarts.init(document.getElementById('mc'));
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
                    name: "MC",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.mc;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "MU",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.mu;
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}