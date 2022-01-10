package com.github.onblog.java_monitor.socket.controller;


import com.github.onblog.java_monitor.h2.entity.ClassLoadEntity;
import com.github.onblog.java_monitor.h2.entity.GcEntity;
import com.github.onblog.java_monitor.h2.entity.ThreadEntity;
import com.github.onblog.java_monitor.h2.service.ClassService;
import com.github.onblog.java_monitor.h2.service.GcService;
import com.github.onblog.java_monitor.h2.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

/**
 * Create by Martin 2018/6/19/019 23:49
 */
@Controller
public class GreetingController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private GcService gcService;
    @Autowired
    private ClassService classService;
    @Autowired
    private ThreadService threadService;

    @MessageMapping("/gc")
    @SendTo("/topic/gc")
    public List<GcEntity> socketGc(String name){
        return gcService.findAllByName(name);
    }

    @MessageMapping("/cl")
    @SendTo("/topic/cl")
    public List<ClassLoadEntity> socketCl(String name){
        return classService.findAllByName(name);
    }

    @MessageMapping("/thread")
    @SendTo("/topic/thread")
    public List<ThreadEntity> socketThread(String name){
        return threadService.findAllByName(name);
    }

}
