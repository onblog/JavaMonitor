var interval_time = 60000;
// Socket
function gc() {
    var socket = new SockJS('/websocket');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/gc', function (d) {
            var data = JSON.parse(d.body)
            s0(data)
            s1(data)
            eden(data)
            old(data)
            mc(data)
            ccsc(data)
            gcn(data)
            gct(data)
            setTimeout(function () {
                stompClient.send("/app/gc", {}, GetQueryString("pid"));
            }, interval_time);
        });
        stompClient.send("/app/gc", {}, GetQueryString("pid"));
    });
}

function cl() {
    var socket = new SockJS('/websocket');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/cl', function (d) {
            var data = JSON.parse(d.body)
            classn(data)
            classt(data)
            comn(data)
            comt(data)
            setTimeout(function () {
                stompClient.send("/app/cl", {}, GetQueryString("pid"));
            }, interval_time);
        });
        stompClient.send("/app/cl", {}, GetQueryString("pid"));
    });
}

function thread() {
    var socket = new SockJS('/websocket');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/thread', function (d) {
            var data = JSON.parse(d.body)
            thread(data);
            setTimeout(function () {
                stompClient.send("/app/thread", {}, GetQueryString("pid"));
            }, interval_time);
        });
        stompClient.send("/app/thread", {}, GetQueryString("pid"));
    });
}
//加载层-默认风格
layer.load();

//链接
gc()
cl()
thread()

//此处演示关闭
setTimeout(function(){
    layer.closeAll('loading');
}, 2000);

