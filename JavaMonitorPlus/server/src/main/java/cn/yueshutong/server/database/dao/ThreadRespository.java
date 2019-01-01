package cn.yueshutong.server.database.dao;

import cn.yueshutong.server.database.entity.ThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 21:38
 */
@Repository
public interface ThreadRespository extends JpaRepository<ThreadEntity, Integer> {
    List<ThreadEntity> findAllByAddressAndName(String address, String name);
}
