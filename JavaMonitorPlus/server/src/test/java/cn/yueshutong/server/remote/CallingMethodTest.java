package cn.yueshutong.server.remote;

import cn.yueshutong.server.core.entity.JinfoEntity;
import cn.yueshutong.server.core.entity.JpsEntity;
import cn.yueshutong.server.core.entity.JstackEntity;
import cn.yueshutong.server.core.entity.KVEntity;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class CallingMethodTest {

    @Test
    public void getJps() throws IOException {
        Map<String, JpsEntity> jps = CallingMethod.getJps("http://116.85.23.6:8081");
        System.out.println(jps);
        Assert.assertNotNull(jps);
    }

    @Test
    public void getJstatClass() throws Exception {
        List<KVEntity> jstatClass = CallingMethod.getJstatClass("http://116.85.23.6:8081", "29462");
        System.out.println(jstatClass);
        Assert.assertNotNull(jstatClass);
    }

    @Test
    public void getVersion() throws IOException {
        String version = CallingMethod.getVersion("http://116.85.23.6:8081");
        System.out.println(version);
        Assert.assertNotNull(version);
    }

    @Test
    public void getInfo() throws IOException {
        JinfoEntity info = CallingMethod.getInfo("http://116.85.23.6:8081","29462");
        System.out.println(info);
        Assert.assertNotNull(info);
    }

    @Test
    public void getJstack() throws IOException {
        JstackEntity entity = CallingMethod.getJstack("http://116.85.23.6:8081","29462");
        System.out.println(entity);
        Assert.assertNotNull(entity);
    }

    @Test
    public void getJstatGc() throws Exception {
        List<KVEntity> jstatGc = CallingMethod.getJstatGc("http://116.85.23.6:8081", "29462");
        System.out.println(jstatGc);
        Assert.assertNotNull(jstatGc);
    }

    @Test
    public void getJstatUtil() throws Exception {
        List<KVEntity> jstatUtil = CallingMethod.getJstatUtil("http://116.85.23.6:8081", "29462");
        System.out.println(jstatUtil);
        Assert.assertNotNull(jstatUtil   );
    }
}