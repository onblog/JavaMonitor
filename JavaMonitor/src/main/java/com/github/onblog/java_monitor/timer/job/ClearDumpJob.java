package com.github.onblog.java_monitor.timer.job;

import com.github.onblog.java_monitor.core.util.PathUtil;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

/**
 * Create by Martin 2018/11/15 0015 12:12
 */
@Component
public class ClearDumpJob {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());

    /**
     * 清理快照目录
     */
    @Scheduled(cron="0 0 0 * * ?")
    public void clearDump() {
        String path = PathUtil.getRootPath("dump/");
        File file = new File(path);
        if (!file.exists()){
            return;
        }
        try {
            FileUtils.deleteDirectory(file);
            logger.warn("Delete dump directory successful");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
