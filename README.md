# Java应用性能监控系统（WY）

## 1.项目简介

WY（Java应用监控系统）是基于Java8制作而成的一款在线监控系统。

WY适用于监控所有Java应用，具有堆内存监控、方法区监控、GC监控、类加载监控、类编译监控与线程监控等，提供堆快照下载，线程快照下载等功能。

WY的使用非常简单，只需要把它扔在你的服务器上执行即可，它会立即检测当前机器上的所有Java应用并进行监控。

## 2.环境说明

基于Java8开发，低于Java8不支持。

## 3.下载使用

下载该 [Jar包](./java_monitor-0.0.1-SNAPSHOT.jar) 直接执行即可

```
java -jar java_monitor-0.0.1-SNAPSHOT.jar
```


启动成功后访问默认端口8888

## 4.运行界面

![](./picture/1000.png)

![](./picture/1001.png)

![](./picture/1002.png)

![](./picture/1003.png)

![](./picture/1004.png)

## 5.自定义端口

在执行jar包时追加参数

```
--server.port=9999
```

## 6.自定义监控周期

默认监控频率为60秒，并且只记录当天产生的监控数据。

如果需要自定义监控频率与监控时长，只需要在jar包所在目录下新建application.properties文件，修改下列字段即可

```
monitor.rate=60 #监控频率/秒
monitor.cron=0 0 0 * * ? #每日的0:00:00时刻清空数据
```

连续监控1个月，示例

```
monitor.cron=0 0 0 1 * ?
```

连续监控1年，示例

```
monitor.cron=0 0 0 1 1 ? *
```

## 7.技术栈

- Spring Boot 2.0
- Spring data jpa
- spring boot websocket
- H2 (DataBase)
- Quartz
- lombok
- Thymeleaf
- ECharts 3

## 8.关于作者

*博客：[https://yueshutong.cnblogs.com/](https://yueshutong.cnblogs.com/)*

*Github：[https://github.com/yueshutong/JavaMonitor](https://github.com/yueshutong/JavaMonitor)*

*Gitee：[https://gitee.com/zyzpp/JavaMonitor](https://gitee.com/zyzpp/JavaMonitor)*