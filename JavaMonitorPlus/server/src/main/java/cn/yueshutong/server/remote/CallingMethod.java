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
        String url = address + "/system";
        return connectHost(url);
    }

    public static String getVersion(String address) throws IOException {
        String url = address + "/version";
        return connectHost(url);
    }

    public static JinfoEntity getInfo(String address, String id) throws IOException {
        String url = address + "/info" + "?id=" + id;
        String body = connectHost(url);
        return JSON.parseObject(body,JinfoEntity.class);
    }

    public static JstackEntity getJstack(String address, String id) throws IOException {
        String url = address + "/jstack" + "?id=" + id;
        String body = connectHost(url);
        return JSON.parseObject(body,JstackEntity.class);
    }

    public static Map<String, JpsEntity> getJps(String address) throws IOException {
        String url = address + "/jps";
        String body = connectHost(url);
        return JSON.parseObject(body, Map.class);
    }

    public static List<KVEntity> getJstatClass(String address, String id) throws Exception {
        String url = address + "/jstatclass" + "?id=" + id;
        String body = connectHost(url);
        return JSON.parseArray(body,KVEntity.class);
    }

    public static List<KVEntity> getJstatGc(String address, String id) throws Exception {
        String url = address + "/jstatgc" + "?id=" + id;
        String body = connectHost(url);
        return JSON.parseArray(body,KVEntity.class);
    }

    public static List<KVEntity> getJstatUtil(String address, String id) throws Exception {
        String url = address + "/jstatutil" + "?id=" + id;
        String body = connectHost(url);
        return JSON.parseArray(body,KVEntity.class);
    }

    /**
     * 统一异常处理
     * @param url
     * @return
     * @throws IOException
     */
    private static String connectHost(String url) throws IOException {
        try {
            return HttpUtil.connect(url).execute().getBody();
        } catch (IOException e) {
            throw new IOException("连接主机异常：" + url, e);
        }
    }
}
