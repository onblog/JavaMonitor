package cn.zyzpp.java_monitor.timer.config;

import cn.zyzpp.java_monitor.timer.job.ClearJob;
import cn.zyzpp.java_monitor.timer.job.UpdataJob;
import cn.zyzpp.java_monitor.timer.parm.CronParm;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 21:05
 */
@Configuration
public class QuartzConfig {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());

    @Autowired
    private CronParm cronParm;

    @Bean
    public JobDetail clearQuartzDetail(){
        return JobBuilder.newJob(ClearJob.class).withIdentity("clearJob").storeDurably().build();
    }

    @Bean
    public Trigger clearQuartzTrigger(){
        logger.warn("已加载 monitor.cron: "+cronParm.getCron());
        return TriggerBuilder.newTrigger().forJob(clearQuartzDetail())
                .withIdentity("clearTrigger") // 定义name/group
                .startNow()
                .withSchedule(
                        //Cron表达式：[秒][分][时][日][月][周][年] (周日1-周六7，年可不写)   *每 ?不关心 -至 #第 /递增 ,和 L最后 W最近工作日
                        CronScheduleBuilder.cronSchedule(cronParm.getCron())
                )
                .build();
    }

    @Bean
    public JobDetail updataQuartzDetail(){
        return JobBuilder.newJob(UpdataJob.class).withIdentity("updataJob").storeDurably().build();
    }

    @Bean
    public Trigger updataQuartzTrigger(){
        logger.warn("已加载 monitor.rate: "+cronParm.getRate());
        return TriggerBuilder.newTrigger().forJob(updataQuartzDetail())
                .withIdentity("updataTrigger")
                .startNow()
                .withSchedule(
                        SimpleScheduleBuilder.simpleSchedule()
                                .withIntervalInSeconds(cronParm.getRate())
                                .repeatForever()
                )
                .build();
    }
    
}
