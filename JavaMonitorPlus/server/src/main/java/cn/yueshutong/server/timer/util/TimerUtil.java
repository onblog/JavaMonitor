package cn.yueshutong.server.timer.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 21:02
 */
public class TimerUtil {
    /**
     * 现在时间
     * @return
     */
    public static String now(){
        SimpleDateFormat format = new SimpleDateFormat("MM/dd HH:mm");
        return format.format(new Date());
    }
}
