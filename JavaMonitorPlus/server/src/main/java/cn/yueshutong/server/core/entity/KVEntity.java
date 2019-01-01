package cn.yueshutong.server.core.entity;

import lombok.Data;

/**
 * Create by yster@foxmail.com 2018/11/10 0010 14:51
 */
@Data
public class KVEntity {
    private String key;
    private String value;

    public KVEntity(){

    }

    public KVEntity(String key, String value) {
        this.key = key;
        this.value = value;
    }
}
