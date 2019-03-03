package cn.yueshutong.client.dump.exception;

/**
 * Create by yster@foxmail.com 2019/3/3 0003 13:33
 */
public class DumpException extends RuntimeException {
    private String pid;

    public DumpException(String pid) {
        this.pid = pid;
    }

    public String getTip() {
        return "生成快照文件失败！进程号："+pid+"<br>"
                +"建议重启应用！" +"<br>"+
                "参考文章http://blog.51cto.com/zhangshaoxiong/1310166";
    }

}
