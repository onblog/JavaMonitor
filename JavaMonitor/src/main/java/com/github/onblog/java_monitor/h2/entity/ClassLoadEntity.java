package com.github.onblog.java_monitor.h2.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 20:59
 */
@Data
@Entity
@Table(name = "class_table")
public class ClassLoadEntity {
    @Id
    @GeneratedValue
    private Integer id;
    private String name; //进程ID
    private String date; //x：时间
    private String Loaded;
    private String Bytes1;
    private String Unloaded;
    private String Bytes2;
    private String Time1;
    private String Compiled;
    private String Failed;
    private String Invalid;
    private String Time2;

}
