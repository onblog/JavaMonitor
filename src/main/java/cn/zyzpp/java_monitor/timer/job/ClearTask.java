package cn.zyzpp.java_monitor.timer.job;

import cn.zyzpp.java_monitor.h2.service.ClassService;
import cn.zyzpp.java_monitor.h2.service.GcService;
import cn.zyzpp.java_monitor.h2.service.ThreadService;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

/**
 * Create by yster@foxmail.com 2018/11/14 0014 21:01
 */
public class ClearTask extends QuartzJobBean {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());

    @Autowired
    private GcService gcService;
    @Autowired
    private ClassService classService;
    @Autowired
    private ThreadService threadService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        logger.warn("定时清空所有数据");
        gcService.clearAll();
        classService.clearAll();
        threadService.clearAll();
    }
}
