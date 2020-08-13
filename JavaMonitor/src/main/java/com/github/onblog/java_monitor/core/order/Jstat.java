package com.github.onblog.java_monitor.core.order;

import com.github.onblog.java_monitor.core.cmd.ExecuteCmd;
import com.github.onblog.java_monitor.core.entity.KVEntity;
import com.github.onblog.java_monitor.core.util.ArrayUtil;

import java.io.BufferedReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/10 0010 16:28
 */
public class Jstat {

    /**
     * Jstat 模板方法
     *
     * @param strings 命令
     * @return 集合
     */
    private static List<KVEntity> jstat(String[] strings) throws Exception {
        List<KVEntity> list = new ArrayList<>();
        String s = ExecuteCmd.execute(strings);
        assert s != null;
        BufferedReader reader = new BufferedReader(new StringReader(s));
        String[] keys = ArrayUtil.trim(reader.readLine().split("\\s+|\t"));
        String[] values = ArrayUtil.trim(reader.readLine().split("\\s+|\t"));
        // 特殊情况
        if (strings[1].equals("-compiler")) {
            for (int i = 0; i < 4; i++) {
                list.add(new KVEntity(keys[i], values[i]));
            }
            return list;
        }
        // 正常流程
        for (int i = 0; i < keys.length; i++) {
            list.add(new KVEntity(keys[i], values[i]));
        }
        return list;
    }

    /**
     * 类加载信息
     * X轴为时间，Y轴为值的变化
     *
     * @param id
     * @return
     */
    public static List<KVEntity> jstatClass(String id) throws Exception {
        List<KVEntity> jstatClass = jstat(new String[]{"jstat", "-class", id});
        List<KVEntity> jstatCompiler = jstat(new String[]{"jstat", "-compiler", id});
        jstatClass.addAll(jstatCompiler);
        return jstatClass;
    }

    /**
     * 堆内存信息
     * X轴为时间，Y轴为值的变化
     *
     * @param id
     * @return
     */
    public static List<KVEntity> jstatGc(String id) throws Exception {
        return jstat(new String[]{"jstat", "-gc", id});
    }

    /**
     * 堆内存百分比
     * 实时监控
     *
     * @param id
     * @return
     */
    public static List<KVEntity> jstatUtil(String id) throws Exception {
        return jstat(new String[]{"jstat", "-gcutil", id});
    }

}
