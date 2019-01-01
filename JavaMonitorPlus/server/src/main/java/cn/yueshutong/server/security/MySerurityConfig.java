package cn.yueshutong.server.security;

import cn.yueshutong.server.security.encode.MyPasswordEncoder;
import cn.yueshutong.server.security.parm.SerurityParm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import java.util.Optional;

/**
 * Create by yster@foxmail.com 2018/12/31 0031 19:45
 */
@EnableWebSecurity
public class MySerurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private SerurityParm serurityParm;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().sameOrigin(); //解决不加载iframe
        //是否开启认证
        if (!serurityParm.isOpen()) {
            return;
        }
        http.authorizeRequests()
                .anyRequest().authenticated() //其他所有资源都需要认证，登陆后访问
                .and()
                .formLogin()//开启自动配置的授权功能
                .and()
                .logout()//开启自动注销
                .and()
                ;
    }

    /*定义认证规则*/
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        String username = Optional.of(serurityParm).map(SerurityParm::getUsername).orElse("admin");
        String password = Optional.of(serurityParm).map(SerurityParm::getPassword).orElse("admin");
        auth.inMemoryAuthentication()
                .passwordEncoder(new MyPasswordEncoder()) //2.0后必须实现该接口
                .withUser(username).password(password).roles("ADMIN"); //必须设置角色

    }

    /*忽略静态资源*/
    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/resources/static/**");
    }

}
