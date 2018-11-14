package cn.zyzpp.java_monitor.core.command;

import cn.zyzpp.java_monitor.core.entity.JstackEntity;
import cn.zyzpp.java_monitor.core.cmd.ExecuteCmd;
import cn.zyzpp.java_monitor.core.util.ArrayUtil;

/**
 * Create by yster@foxmail.com 2018/11/10 0010 17:59
 */
public class Jstack {
    private final static String prefix = "java.lang.Thread.State: ";
    /**
     * 该进程的线程信息
     * X轴为时间，Y轴为值的变化
     * @param id
     * @return
     */
    public static JstackEntity jstack(String id) {
        String s = ExecuteCmd.execute(new String[]{"jstack", id});
        int total= ArrayUtil.appearNumber(s, "nid=");
        int RUNNABLE = ArrayUtil.appearNumber(s, prefix+"RUNNABLE");
        int TIMED_WAITING = ArrayUtil.appearNumber(s,prefix+"TIMED_WAITING");
        int WAITING = ArrayUtil.appearNumber(s,prefix+"WAITING");
        return new JstackEntity(id,total,RUNNABLE,TIMED_WAITING,WAITING);
    }
}
