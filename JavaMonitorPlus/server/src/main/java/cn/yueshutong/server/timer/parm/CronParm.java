package cn.yueshutong.server.timer.parm;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 21:18
 */
@Component
@ConfigurationProperties(prefix="monitor")
@Data
public class CronParm {
    private String cron;
    private Integer rate;
}
