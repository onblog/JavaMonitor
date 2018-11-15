//获取URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//折线颜色
var colors = ['#cc0033', '#ff5722', '#2196f3', '#4caf50'];
//点
var white = null;
//背景色
var background_color = '#21202D';

var my_tooltip = {
        trigger: 'axis',
        axisPointer: {
            animation: false,
            type: 'cross',
            lineStyle: {
                color: '#376df4',
                width: 2,
                opacity: 1
            }
        }
    };
var my_toolbox ={
    left: 'center',
    feature: {
        dataZoom: {
            yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {},
        magicType: {
            type: []
        }
    }
};
//下载快照
$("#heap_button").click(function () {
    window.open("/heap?id="+GetQueryString("pid"));
});
$("#thread_button").click(function () {
    window.open("/thread?id="+GetQueryString("pid"));
});