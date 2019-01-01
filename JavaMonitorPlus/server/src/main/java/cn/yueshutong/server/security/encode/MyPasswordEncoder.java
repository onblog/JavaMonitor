package cn.yueshutong.server.security.encode;

import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Create by yster@foxmail.com 2018/12/31 0031 20:22
 */
public class MyPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence charSequence) {
        return charSequence.toString();
    }

    @Override
    public boolean matches(CharSequence charSequence, String s) {
        return s.equals(charSequence.toString());
    }
}
