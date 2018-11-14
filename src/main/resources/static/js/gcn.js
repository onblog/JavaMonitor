function gcn(data) {
    var myChart = echarts.init(document.getElementById('gcn'));//（1）
        myChart.setOption(option = {
            title: {
                subtext: '次数',
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
                    name: "YGC",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.ygc;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                },
                {
                    name: "FGC",//（3）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.fgc
                    }),
                    lineStyle: {
                        color: colors[1]
                    }
                }]
        });
}