package cn.yueshutong.server.database.dao;


import cn.yueshutong.server.database.entity.ClassLoadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:38
 */
@Repository
public interface ClassLoadRespository extends JpaRepository<ClassLoadEntity, Integer> {
    List<ClassLoadEntity> findAllByAddressAndName(String address, String name);
}
