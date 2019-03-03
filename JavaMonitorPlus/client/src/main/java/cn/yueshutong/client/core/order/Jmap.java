package cn.yueshutong.client.core.order;

import cn.yueshutong.client.core.cmd.ExecuteCmd;
import cn.yueshutong.client.core.util.PathUtil;
import cn.yueshutong.client.dump.exception.DumpException;

import java.io.File;
import java.io.IOException;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 22:21
 */
public class Jmap {

    /**
     * 导出堆快照
     * @param id
     * @return
     */
    public static String dump(String id) throws IOException {
        //判断NULL
        if (id==null||"".equals(id)){
            throw new NullPointerException("参数id为NULL");
        }
        //检验dump目录是否存在
        File dump = new File(PathUtil.getRootPath("dump/"));
        if (!dump.exists()){
            dump.mkdirs();
        }
        //若有已经存在的快照文件则删除
        String path = PathUtil.getRootPath("dump/"+id+"_heap.hprof");
        File file = new File(path);
        if (file.exists()){
            file.delete();
        }
        //生成快照文件
        ExecuteCmd.execute(new String[]{"jmap","-dump:format=b,file="+path, id});
        if (!file.exists()){
            throw new DumpException(id);
        }
        return path;
    }

}
