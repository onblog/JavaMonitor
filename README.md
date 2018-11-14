# Java应用监控系统（WY）

## 1.应用简介

WY（Java应用监控系统）是一款``基于JDK8制作，适用于Java应用，集成堆内存监控、方法区监控、GC监控、类加载监控、类编译监控与线程监控于一身的在线监控系统。

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
## 6.技术栈

- Spring Boot 2.0
- Spring data jpa
- spring boot websocket
- H2 (DataBase)
- lombok
- Thymeleaf
- ECharts 3

## 7.关于作者

*博客：[https://yueshutong.cnblogs.com/](https://yueshutong.cnblogs.com/)*

*Github：[https://github.com/yueshutong](https://github.com/yueshutong)*

*Gitee：[https://gitee.com/zyzpp](https://gitee.com/zyzpp)*