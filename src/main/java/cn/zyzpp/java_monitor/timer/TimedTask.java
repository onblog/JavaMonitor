package cn.zyzpp.java_monitor.timer;

import cn.zyzpp.java_monitor.core.command.Jps;
import cn.zyzpp.java_monitor.core.command.Jstack;
import cn.zyzpp.java_monitor.core.command.Jstat;
import cn.zyzpp.java_monitor.core.entity.JpsEntity;
import cn.zyzpp.java_monitor.core.entity.JstackEntity;
import cn.zyzpp.java_monitor.core.entity.KVEntity;
import cn.zyzpp.java_monitor.h2.service.ClassService;
import cn.zyzpp.java_monitor.h2.service.GcService;
import cn.zyzpp.java_monitor.h2.service.ThreadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Create by yster@foxmail.com 2018/11/11 0011 15:25
 */
@Component
public class TimedTask {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());
    @Autowired
    private GcService gcService;
    @Autowired
    private ClassService classService;
    @Autowired
    private ThreadService threadService;
    /**
     * 每分钟更新一次数据
     */
    @Scheduled(fixedRate = 1000*60)
    public void circulation() {
        logger.info("定时更新数据...");
        String date = time();
        try {
            Map<String, JpsEntity> jps = Jps.jps();
            Object[] s = jps.keySet().toArray();
            for (Object o : s) {
                String name = o.toString();
                JstackEntity jstatk = Jstack.jstack(name);
                List<KVEntity> jstatClass = Jstat.jstatClass(name);
                List<KVEntity> kvEntities = Jstat.jstatGc(name);
                //写入线程信息
                threadService.write(name,date,jstatk);
                //写入类加载信息
                classService.write(name,date,jstatClass);
                //写入堆内存信息
                gcService.write(name,date,kvEntities);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        logger.info("更新数据结束");
    }

    /**
     * 0:00:00点清空数据
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void timing() {
        logger.warn("定时清空所有数据");
        gcService.clearAll();
        classService.clearAll();
        threadService.clearAll();
    }

    /**
     * 现在时间
     * @return
     */
    private String time(){
        SimpleDateFormat format = new SimpleDateFormat("MM/dd hh:mm");
        return format.format(new Date());
    }

}
