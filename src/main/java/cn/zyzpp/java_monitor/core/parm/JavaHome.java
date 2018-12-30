package cn.zyzpp.java_monitor.core.parm;

import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import java.io.File;

/**
 * 已废弃
 * #java.home.bin=D:\Java\jdk1.8.0\bin\
 * Create by yster@foxmail.com 2018/12/30 0030 15:27
 */
//@Component
//@ConfigurationProperties(prefix="java.home")
public class JavaHome {
    private String bin;

    private final static String path_default = System.getenv("JAVA_HOME")+File.separator +"bin"+File.separator;

    public String getBin() {
        // 先判断是否是Null对象，再判断是否是空字符串
        if (bin ==null|| bin.trim().isEmpty()){
            return path_default;
        }
        // 是否以分隔符结尾
        if (bin.lastIndexOf(File.separator)!=bin.length()-1){
            bin += File.separator;
        }
        return bin;
    }

    public void setBin(String bin) {
        this.bin = bin;
    }

    public static String getPath(){
        WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
        JavaHome javaHome = (JavaHome) wac.getBean("javaHome");
        return javaHome.getBin();
    }
}
