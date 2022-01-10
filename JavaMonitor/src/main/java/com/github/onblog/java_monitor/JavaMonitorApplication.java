package com.github.onblog.java_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JavaMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaMonitorApplication.class, args);
    }
}
