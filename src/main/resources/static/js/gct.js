function gct(data) {
    var myChart = echarts.init(document.getElementById('gct'));
        myChart.setOption(option = {
            title: {
                subtext: '秒',
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
                    name: "YGCT",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ygct;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "FGCT",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.fgct
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                },
                {
                    name: "GCT",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.gct
                    }),
                    lineStyle: {
                        color: colors[2]
                    }
                }]
        });
}