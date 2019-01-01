package cn.yueshutong.server.core.entity;

import lombok.Data;

/**
 * Create by yster@foxmail.com 2018/11/10 0010 17:54
 */
@Data
public class JstackEntity {
    private String id;
    private int total;
    private int RUNNABLE;
    private int TIMED_WAITING;
    private int WAITING;

    public JstackEntity(){

    }

    public JstackEntity(String id, int total, int RUNNABLE, int TIMED_WAITING, int WAITING) {
        this.id = id;
        this.total = total;
        this.RUNNABLE = RUNNABLE;
        this.TIMED_WAITING = TIMED_WAITING;
        this.WAITING = WAITING;
    }
}
