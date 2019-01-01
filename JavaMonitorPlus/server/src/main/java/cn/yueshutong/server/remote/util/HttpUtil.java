package cn.yueshutong.server.remote.util;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

/**
 * 封装HttpURLConnection开箱即用
 * Create by yster@foxmail.com 2018/9/10/010 19:17
 */
public class HttpUtil {
    private HttpURLConnection connection;
    private Charset charset = Charset.forName("UTF-8");
    private int readTimeout = 32000;
    private int connectTimeout = 10000;
    private String method = "GET";
    private boolean doInput = true;
    private Map<String, String> headers = null;
    private String data = null;
    private String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36";

    /**
     * 入口
     */
    public static HttpUtil connect(String url) throws IOException {
        return new HttpUtil((HttpURLConnection) new URL(url).openConnection());
    }

    /**
     * 禁止new实例
     */
    private HttpUtil() {
    }

    private HttpUtil(HttpURLConnection connection) {
        this.connection = connection;
    }

    /**
     * 设置读去超时时间/ms
     *
     * @param timeout
     */
    public HttpUtil setReadTimeout(int timeout) {
        this.readTimeout = timeout;
        return this;
    }

    /**
     * 设置链接超时时间/ms
     *
     * @param timeout
     */
    public HttpUtil setConnectTimeout(int timeout) {
        this.connectTimeout = timeout;
        return this;
    }

    /**
     * 设置请求方式
     *
     * @param method
     */
    public HttpUtil setMethod(String method) {
        this.method = method;
        return this;
    }

    /**
     * 添加Headers
     *
     * @param map
     */
    public HttpUtil setHeaders(Map<String, String> map) {
        String cookie = "Cookie";
        if (map.containsKey(cookie)) {
            headers = new HashMap<>();
            headers.put(cookie, map.get(cookie));
        }
        return this;
    }

    /**
     * 是否接受输入流
     * 默认true
     *
     * @param is
     */
    public HttpUtil setDoInput(boolean is) {
        this.doInput = is;
        return this;
    }

    /**
     * 设置请求响应的编码
     */
    public HttpUtil setCharset(String charset) {
        this.charset = Charset.forName(charset);
        return this;
    }

    /**
     * POST请求body,接受Map<key,value>或String字符串<br>
     * 字符创举例：demo=1&name=2
     */
    public HttpUtil setPostData(Object object) {
        if (object == null) {
            return this;
        } else if (object instanceof String) {
            this.data = (String) object;
        } else if (object instanceof Map) {
            Map map = (Map) object;
            StringBuilder builder = new StringBuilder();
            for (Object key : map.keySet()) {
                builder.append(key + "=" + map.get(key) + "&");
            }
            this.data = builder.toString().substring(0, builder.length() > 0 ? builder.length() - 1 : builder.length());
        }
        return this;
    }

    /**
     * 发起请求
     */
    public HttpUtil execute() throws IOException {
        //添加请求头
        if (headers != null) {
            for (String key : headers.keySet()) {
                connection.setRequestProperty(key, headers.get(key));
            }
        }
        //设置读去超时时间为10秒
        connection.setReadTimeout(readTimeout);
        //设置链接超时为10秒
        connection.setConnectTimeout(connectTimeout);
        //设置请求方式,GET,POST
        connection.setRequestMethod(method.toUpperCase());
        //接受输入流
        connection.setDoInput(doInput);
        //不使用缓存
        connection.setUseCaches(false);
        //设置USER-AGENT
        connection.setRequestProperty("User-Agent", userAgent);
        //写入参数
        if (data != null) {
            //自动将GET转为POST
            if (method.toUpperCase().equals("GET")){
                connection.setRequestMethod("POST");
            }
            //启动输出流，当需要传递参数时需要开启
            connection.setDoOutput(true);
            //添加请求参数，注意：如果是GET请求，参数要写在URL中
            OutputStream output = connection.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(output, charset));
            //写入参数 用&分割。
            writer.write(data);
            writer.flush();
            writer.close();
        }
        //发起请求
        connection.connect();
        return this;
    }

    /**
     * 获取HttpURLConnection
     */
    public HttpURLConnection getConnection() {
        return this.connection;
    }


    /**
     * 获取响应字符串
     */
    public String getBody(String... charsets) {
        String charset = "UTF-8";
        if (charsets.length > 0) {
            charset = charsets[0];
        }
        try {
            InputStream inputStream = connection.getInputStream();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, charset));
            String line = bufferedReader.readLine();
            StringBuilder builder = new StringBuilder();
            while (line != null) {
                builder.append(line);
                line = bufferedReader.readLine();
            }
            return builder.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取响应字符串并关闭链接
     */
    public String getBodyDisconnect(String... charsets) {
        String body = getBody(charsets);
        //关闭链接
        connection.disconnect();
        return body;
    }

    public static void main(String[] args) throws IOException {
        String body = HttpUtil.connect("http://www.baidu.com")
                .setMethod("GET")
                .setCharset("UTF-8")
                .execute()
                .getBody();
        System.out.println(body);
    }

}