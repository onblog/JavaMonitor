package cn.yueshutong.client.core.order;


import cn.yueshutong.client.core.cmd.ExecuteCmd;
import cn.yueshutong.client.core.entity.JinfoEntity;
import cn.yueshutong.client.core.entity.JpsEntity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Create by yster@foxmail.com 2018/10/22 20:22
 */
public class Jps {

    /**
     * Jps 命令结果
     * key：进程Id
     * @return map
     */
    public static Map<String, JpsEntity> jps() {
        Map<String, JpsEntity> map = new HashMap<>();
        String s = ExecuteCmd.execute(new String[]{"jps", "-l", "-v"});
        String[] line = s != null ? s.split("\n") : new String[0];
        for (String aLine : line) {
            String[] one = aLine.split("\\s+");
            //排除sun.tools进程
            if (one[1].contains("sun.tools")){
                continue;
            }
            //格式化控制台输出
            if (!one[1].substring(0, 1).equals("-")) {
                String smallName = one[1].contains(".") ? one[1].substring(one[1].lastIndexOf(".")+1) : one[1];
                smallName = smallName.equalsIgnoreCase("jar")? one[1] : smallName;
                map.put(one[0], new JpsEntity(one[1], smallName, Arrays.stream(one).skip(2).collect(Collectors.toList())));
            } else {
                map.put(one[0], new JpsEntity("NULL","NULL", Arrays.stream(one).skip(1).collect(Collectors.toList())));
            }
        }
        return map;
    }

}
