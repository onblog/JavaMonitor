package cn.yueshutong.server.remote;

import cn.yueshutong.server.core.entity.JinfoEntity;
import cn.yueshutong.server.core.entity.JpsEntity;
import cn.yueshutong.server.core.entity.JstackEntity;
import cn.yueshutong.server.core.entity.KVEntity;
import cn.yueshutong.server.remote.util.HttpUtil;
import com.alibaba.fastjson.JSON;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Create by yster@foxmail.com 2018/12/30 0030 19:45
 */
public class CallingMethod {

    public static String getSystem(String address) throws IOException {
        return HttpUtil.connect(address+"/system").execute().getBody();
    }

    public static String getVersion(String address) throws IOException {
        return HttpUtil.connect(address+"/version").execute().getBody();
    }

    public static JinfoEntity getInfo(String address, String id) throws IOException {
        String body = HttpUtil.connect(address + "/info"+"?id=" + id).execute().getBody();
        return JSON.parseObject(body,JinfoEntity.class);
    }

    public static JstackEntity getJstack(String address, String id) throws IOException {
        String body = HttpUtil.connect(address + "/jstack"+"?id=" + id).execute().getBody();
        return JSON.parseObject(body,JstackEntity.class);
    }

    public static Map<String, JpsEntity> getJps(String address) throws IOException {
        String body = HttpUtil.connect(address + "/jps").execute().getBody();
        return JSON.parseObject(body,Map.class);
    }

    public static List<KVEntity> getJstatClass(String address, String id) throws Exception {
        String body = HttpUtil.connect(address + "/jstatclass"+"?id=" + id).execute().getBody();
        return JSON.parseArray(body,KVEntity.class);
    }

    public static List<KVEntity> getJstatGc(String address, String id) throws Exception {
        String body = HttpUtil.connect(address + "/jstatgc"+"?id=" + id).execute().getBody();
        return JSON.parseArray(body,KVEntity.class);
    }

    public static List<KVEntity> getJstatUtil(String address, String id) throws Exception {
        String body = HttpUtil.connect(address + "/jstatutil"+"?id=" + id).execute().getBody();
        return JSON.parseArray(body,KVEntity.class);
    }
}
