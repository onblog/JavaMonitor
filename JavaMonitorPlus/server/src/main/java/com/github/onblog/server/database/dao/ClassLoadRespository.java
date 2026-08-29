package com.github.onblog.server.database.dao;


import com.github.onblog.server.database.entity.ClassLoadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Create by Martin 2018/11/12 0012 21:38
 */
@Repository
public interface ClassLoadRespository extends JpaRepository<ClassLoadEntity, Integer> {
    List<ClassLoadEntity> findAllByAddressAndName(String address, String name);
}
