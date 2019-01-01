package cn.yueshutong.server.core.entity;

import lombok.Data;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/15 0015 14:27
 */
@Data
public class JinfoEntity {
    private List<String> noedefault;
    private List<String> commandLine;

    public JinfoEntity(){

    }

    public JinfoEntity(List<String> noedefault, List<String> commandLine) {
        this.noedefault = noedefault;
        this.commandLine = commandLine;
    }
}
