package com.github.onblog.server.view;


import com.github.onblog.server.remote.parm.AddressParm;
import com.github.onblog.server.remote.parm.entity.Address;
import com.github.onblog.server.view.service.ViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 23:29
 */
@Controller
public class ViewController {
    @Autowired
    private AddressParm addressParm;
    @Autowired
    private ViewService viewService;

    @RequestMapping(value = "/")
    public String index(ModelMap model) throws IOException {
        List<Map<String,Object>> list = new ArrayList<>();
        for (Address address : addressParm.getServe()) {
            list.add(viewService.getIndex(address));
        }
        model.addAttribute("list",list);
        return "index";
    }

    @RequestMapping(value = "/main")
    public String main(ModelMap model) throws IOException {
        List<Map> list = new ArrayList<>();
        for (Address address : addressParm.getServe()) {
            list.add(viewService.getMain(address));
        }
        model.addAttribute("list",list);
        return "main";
    }

    @RequestMapping(value = "/monitor")
    public String monitor(){
        return "monitor";
    }

}
