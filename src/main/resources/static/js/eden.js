function eden(data) {
    var myChart = echarts.init(document.getElementById('eden'));
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
                    name: "EC",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ec;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "EU",
                    type: 'line',
                    data: data.map(function (item) {
                        return item.eu;
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}