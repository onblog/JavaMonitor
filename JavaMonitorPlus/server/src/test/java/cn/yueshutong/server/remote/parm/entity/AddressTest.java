package cn.yueshutong.server.remote.parm.entity;

import com.sun.jndi.toolkit.url.Uri;
import org.junit.Test;

import java.net.MalformedURLException;

public class AddressTest {

    @Test
    public void getName() throws MalformedURLException {
        Uri uri = new Uri("http://123.206.46.157:8081");
        System.out.println(uri.getHost());
        System.out.println(uri.getPort());
        System.out.println(uri.getPath());
    }
}