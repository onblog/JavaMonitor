package com.github.onblog.server.timer.job;


import com.github.onblog.server.core.entity.JpsEntity;
import com.github.onblog.server.core.entity.JstackEntity;
import com.github.onblog.server.core.entity.KVEntity;
import com.github.onblog.server.database.service.ClassService;
import com.github.onblog.server.database.service.GcService;
import com.github.onblog.server.database.service.ThreadService;
import com.github.onblog.server.remote.CallingMethod;
import com.github.onblog.server.remote.parm.AddressParm;
import com.github.onblog.server.remote.parm.entity.Address;
import com.github.onblog.server.timer.util.TimerUtil;
import org.quartz.JobExecutionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.util.List;
import java.util.Map;

/**
 * Create by yster@foxmail.com 2018/11/11 0011 15:25
 */
public class UpdataJob extends QuartzJobBean {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());
    @Autowired
    private GcService gcService;
    @Autowired
    private ClassService classService;
    @Autowired
    private ThreadService threadService;
    @Autowired
    private AddressParm address;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext){
        if (address.getServe()==null||address.getServe().size()==0){
            throw new RuntimeException("没有配置要监控的远程主机");
        }
        logger.debug("Regularly updated data...");
        for (Address address : address.getServe()) {
            String addressAddress = address.getAddress();
            try {
                Map<String, JpsEntity> jps = CallingMethod.getJps(addressAddress);
                Object[] s = jps.keySet().toArray();
                for (Object o : s) {
                    String id = o.toString();
                    JstackEntity jstatk = CallingMethod.getJstack(addressAddress,id);
                    List<KVEntity> jstatClass = CallingMethod.getJstatClass(addressAddress,id);
                    List<KVEntity> jstatGc = CallingMethod.getJstatGc(addressAddress,id);
                    String date = TimerUtil.now();
                    //写入线程信息
                    threadService.write(addressAddress,id,date,jstatk);
                    //写入类加载信息
                    classService.write(addressAddress,id,date,jstatClass);
                    //写入堆内存信息
                    gcService.write(addressAddress,id,date,jstatGc);
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
            }
        }
    }
}
