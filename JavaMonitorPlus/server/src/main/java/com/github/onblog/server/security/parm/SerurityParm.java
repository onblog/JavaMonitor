package com.github.onblog.server.security.parm;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Create by Martin 2018/12/31 0031 20:39
 */
@Component
@ConfigurationProperties(prefix="monitor")
@Data
public class SerurityParm {
    private boolean open;
    private String username;
    private String password;
}
