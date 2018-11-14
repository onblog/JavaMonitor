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
        });
    });
    setInterval(function () {
        stompClient.send("/app/gc", {}, GetQueryString("pid"));
    }, 1000);
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
        });
    });
    setInterval(function () {
        stompClient.send("/app/cl", {}, GetQueryString("pid"));
    }, 1000);
}

function thread() {
    var socket = new SockJS('/websocket');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/thread', function (d) {
            var data = JSON.parse(d.body)
            thread(data);
        });
    });
    setInterval(function () {
        stompClient.send("/app/thread", {}, GetQueryString("pid"));
    }, 1000);
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

