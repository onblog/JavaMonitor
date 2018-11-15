package cn.zyzpp.java_monitor.core.command;

import cn.zyzpp.java_monitor.core.entity.JpsEntity;
import cn.zyzpp.java_monitor.core.entity.JstackEntity;
import cn.zyzpp.java_monitor.core.entity.KVEntity;
import cn.zyzpp.java_monitor.core.util.PathUtil;
import org.apache.commons.io.FileUtils;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class JpsTest {

    @Test
    public void jps() {
        Map<String, JpsEntity> jps = Jps.jps();
        for (Map.Entry entity : jps.entrySet()) {
            System.out.println(entity.getKey() + " " + entity.getValue());
        }
    }

    @Test
    public void jstat() throws Exception {
        Map<String, JpsEntity> jps = Jps.jps();
        for (Map.Entry entity : jps.entrySet()) {
            System.out.println(entity.getKey() + " " + entity.getValue());
        }
        Object[] s = jps.keySet().toArray();
        for (Object value : s) {
            System.out.println("进程ID：" + value.toString());
            List<KVEntity> jstat = Jstat.jstatClass(value.toString());
            jstat.forEach((t) -> System.out.println(t.getKey() + ":" + t.getValue()));
            JstackEntity jstatk = Jstack.jstack(value.toString());
            System.out.println(jstatk);
        }
    }

    @Test
    public void setTest(){
        Map<String,String> map = new HashMap<>();
        map.put("123","123");
        map.put("456","456");
        map.put("789","789");
        Set<String> keySet = map.keySet();
        Iterator<String> iterator = keySet.iterator();
        iterator.forEachRemaining( s -> {
            if (s.equals("456")) {
                iterator.remove();
                System.out.println(s);
            }
        });
        System.out.println(map.toString());
    }

    @Test
    public void test(){
        String path = PathUtil.getRootPath("dump/");
        File file = new File(path);
        if (!file.exists()){
            return;
        }
        try {
            FileUtils.deleteDirectory(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}