package com.github.onblog.java_monitor.h2.service;

import com.github.onblog.java_monitor.core.entity.KVEntity;
import com.github.onblog.java_monitor.h2.dao.ClassLoadRespository;
import com.github.onblog.java_monitor.h2.entity.ClassLoadEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:55
 */
@Service
public class ClassService {
    @Autowired
    private ClassLoadRespository classLoadRespository;

    public List<ClassLoadEntity> findAllByName(String name) {
        return classLoadRespository.findAllByName(name);
    }


    public void write(String name, String date, List<KVEntity> jstatClass) {
        ClassLoadEntity entity = new ClassLoadEntity();
        entity.setName(name);
        entity.setDate(date);
        entity.setLoaded(jstatClass.get(0).getValue());
        entity.setBytes1(jstatClass.get(1).getValue());
        entity.setUnloaded(jstatClass.get(2).getValue());
        entity.setBytes2(jstatClass.get(3).getValue());
        entity.setTime1(jstatClass.get(4).getValue());
        entity.setCompiled(jstatClass.get(5).getValue());
        entity.setFailed(jstatClass.get(6).getValue());
        entity.setInvalid(jstatClass.get(7).getValue());
        entity.setTime2(jstatClass.get(8).getValue());
        classLoadRespository.save(entity);
    }

    public void clearAll() {
        classLoadRespository.deleteAll();
    }
}
