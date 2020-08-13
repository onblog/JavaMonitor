package com.github.onblog.client.core.order;


import com.github.onblog.client.core.cmd.ExecuteCmd;
import com.github.onblog.client.core.entity.JinfoEntity;
import com.github.onblog.client.core.util.ArrayUtil;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Create by yster@foxmail.com 2018/11/15 0015 13:54
 */
public class Jinfo {


    /**
     * JVM默认参数与指定参数
     * @param id
     * @return
     */
    public static JinfoEntity info(String id){
        String s = ExecuteCmd.execute(new String[]{"jinfo","-flags", id});
        if (!s.contains("successfully")){
            return null;
        }
        String flags = "flags:";
        String command = "Command line:";
        //默认参数
        String[] noedefault = ArrayUtil.trim(s.substring(s.indexOf(flags)+flags.length(),s.indexOf(command)).split("\\s+"));
        String[] commandLine = null;
        s = s.substring(s.indexOf(command));
        if (!s.equals(command)){
            commandLine = s.substring(command.length()).split("\\s+");
        }
        commandLine = ArrayUtil.trim(commandLine);
        return new JinfoEntity(Arrays.stream(noedefault).collect(Collectors.toList()), Arrays.stream(commandLine).collect(Collectors.toList()) );
    }

}
