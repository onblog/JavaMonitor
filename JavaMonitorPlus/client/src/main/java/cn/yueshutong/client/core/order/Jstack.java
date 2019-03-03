package cn.yueshutong.client.core.order;

import cn.yueshutong.client.core.cmd.ExecuteCmd;
import cn.yueshutong.client.core.entity.JstackEntity;
import cn.yueshutong.client.core.util.ArrayUtil;
import cn.yueshutong.client.core.util.PathUtil;
import cn.yueshutong.client.dump.exception.DumpException;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;

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

    /**
     * 导出线程快照
     * @param id
     * @return
     */
    public static String dump(String id) throws IOException {
        //判断NULL
        if (id==null||"".equals(id)){
            throw new NullPointerException("参数id为NULL");
        }
        String path = PathUtil.getRootPath("dump/"+id+"_thread.txt");
        String s = ExecuteCmd.execute(new String[]{"jstack", id});
        //是否正常生成快照文件
        if (s.isEmpty()){
            throw new DumpException(id);
        }
        File file = new File(path);
        FileUtils.write(file,s,Charset.forName("UTF-8"));
        return path;
    }
}
