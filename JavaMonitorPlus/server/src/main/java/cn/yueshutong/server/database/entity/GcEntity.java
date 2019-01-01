package cn.yueshutong.server.database.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 20:39
 */
@Data
@Entity
@Table(name = "gc_table")
public class GcEntity {
    @Id
    @GeneratedValue
    private Integer id;
    private String address; //进程所在主机
    private String name; //进程ID
    private String date; //x：时间
    private String S0C;
    private String S1C;
    private String S0U;
    private String S1U;
    private String EC;
    private String EU;
    private String OC;
    private String OU;
    private String MC;//PC
    private String MU;//PU
    private String CCSC;
    private String CCSU;
    private String YGC;
    private String YGCT;
    private String FGC;
    private String FGCT;
    private String GCT;

}
