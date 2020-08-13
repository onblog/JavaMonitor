package com.github.onblog.java_monitor.h2.service;

import com.github.onblog.java_monitor.core.entity.JstackEntity;
import com.github.onblog.java_monitor.h2.dao.ThreadRespository;
import com.github.onblog.java_monitor.h2.entity.ThreadEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:56
 */
@Service
public class ThreadService {
    @Autowired
    private ThreadRespository threadRespository;

    public List<ThreadEntity> findAllByName(String name) {
        return threadRespository.findAllByName(name);
    }

    public void write(String name, String date, JstackEntity jstatk) {
        ThreadEntity entity = new ThreadEntity();
        entity.setName(name);
        entity.setDate(date);
        entity.setTotal(jstatk.getTotal());
        entity.setRUNNABLE(jstatk.getRUNNABLE());
        entity.setTIMED_WAITING(jstatk.getTIMED_WAITING());
        entity.setWAITING(jstatk.getWAITING());
        threadRespository.save(entity);
    }

    public void clear() {

    }

    public void clearAll() {
        threadRespository.deleteAll();
    }
}
