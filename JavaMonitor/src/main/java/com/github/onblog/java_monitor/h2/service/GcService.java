package com.github.onblog.java_monitor.h2.service;

import com.github.onblog.java_monitor.core.entity.KVEntity;
import com.github.onblog.java_monitor.h2.dao.GcRespository;
import com.github.onblog.java_monitor.h2.entity.GcEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:54
 */
@Service
public class GcService {
    @Autowired
    private GcRespository gcRespository;

    public void write(String name, String date, List<KVEntity> kvEntities) {
        GcEntity entity = new GcEntity();
        entity.setName(name);
        entity.setDate(date);
        entity.setS0C(kvEntities.get(0).getValue());
        entity.setS1C(kvEntities.get(1).getValue());
        entity.setS0U(kvEntities.get(2).getValue());
        entity.setS1U(kvEntities.get(3).getValue());
        entity.setEC(kvEntities.get(4).getValue());
        entity.setEU(kvEntities.get(5).getValue());
        entity.setOC(kvEntities.get(6).getValue());
        entity.setOU(kvEntities.get(7).getValue());
        entity.setMC(kvEntities.get(8).getValue());
        entity.setMU(kvEntities.get(9).getValue());
        entity.setCCSC(kvEntities.get(10).getValue());
        entity.setCCSU(kvEntities.get(11).getValue());
        entity.setYGC(kvEntities.get(12).getValue());
        entity.setYGCT(kvEntities.get(13).getValue());
        entity.setFGC(kvEntities.get(14).getValue());
        entity.setFGCT(kvEntities.get(15).getValue());
        entity.setGCT(kvEntities.get(16).getValue());
        gcRespository.save(entity);
    }

    public List<GcEntity> findAllByName(String name) {
        return gcRespository.findAllByName(name);
    }

    public void clearAll() {
        gcRespository.deleteAll();
    }
}
