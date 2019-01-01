package cn.yueshutong.server.database.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:32
 */
@Data
@Entity
@Table(name = "thread_table")
public class ThreadEntity {
    @Id
    @GeneratedValue
    private Integer id;
    private String address; //进程所在主机
    private String name; //进程ID
    private String date; //x：时间
    private int total;
    private int RUNNABLE;
    private int TIMED_WAITING;
    private int WAITING;
}
