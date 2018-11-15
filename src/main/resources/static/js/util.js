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

//下载快照
$("#heap_button").click(function () {
    window.open("/heap?id="+GetQueryString("pid"));
})
$("#thread_button").click(function () {
    window.open("/thread?id="+GetQueryString("pid"));
})