package cn.zyzpp.java_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 基于Java8开发，低于Java8不支持。
 */
@SpringBootApplication
@EnableScheduling   //开启定时任务
public class JavaMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaMonitorApplication.class, args);
    }
}
