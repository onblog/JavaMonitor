package com.github.onblog.java_monitor.core.entity;

import lombok.Data;

import java.util.List;

/**
 * Create by Martin 2018/10/22 21:47
 */
@Data
public class JpsEntity {
    private String className; //全名
    private String smallName; //小名
    private List<String> parameters; //参数

    public JpsEntity(String className, String smallName, List<String> parameters) {
        this.className = className;
        this.smallName = smallName;
        this.parameters = parameters;
    }

}
