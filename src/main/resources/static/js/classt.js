function classt(data) {
    var myChart = echarts.init(document.getElementById('classt'));//（1）
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
                    color: [colors[0]]
                }
            }],
            series: [
                {
                    name: "Time",//（2）
                    type: 'line',
                    data: data.map(function (item) {
                        return item.time1;
                    }),
                    lineStyle: {
                        color: colors[0]
                    }
                }]
        });
}