package cn.zyzpp.java_monitor.timer.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 21:02
 */
public class Util {
    /**
     * 现在时间
     * @return
     */
    public static String time(){
        SimpleDateFormat format = new SimpleDateFormat("MM/dd hh:mm");
        return format.format(new Date());
    }
}
