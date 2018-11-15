package cn.zyzpp.java_monitor.core.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Create by yster@foxmail.com 2018/11/10 0010 15:50
 */
public class ArrayUtil {

    /**
     * 去掉数组中空项
     *
     * @param olds
     * @return news
     */
    public static String[] trim(String[] olds) {
        if (olds ==null ||olds.length == 0){
            return olds;
        }
        List<String> list = new ArrayList<>();
        for (String old : olds) {
            if (old != null && !"".equals(old)) {
                list.add(old);
            }
        }
        String[] news = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            news[i] = list.get(i);
        }
        return news;
    }

    /**
     * 匹配字符出现次数
     * @param srcText
     * @param findText
     * @return
     */
    public static int appearNumber(String srcText, String findText) {
        int count = 0;
        Pattern p = Pattern.compile(findText);
        Matcher m = p.matcher(srcText);
        while (m.find()) {
            count++;
        }
        return count;
    }

}
