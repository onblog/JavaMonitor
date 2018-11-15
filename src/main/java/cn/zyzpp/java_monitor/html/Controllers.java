package cn.zyzpp.java_monitor.html;

import cn.zyzpp.java_monitor.core.command.Javav;
import cn.zyzpp.java_monitor.core.command.Jps;
import cn.zyzpp.java_monitor.core.entity.JpsEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Create by yster@foxmail.com 2018/11/12 0012 23:29
 */
@Controller
public class Controllers {

    @RequestMapping(value = "/")
    public String index(ModelMap model){
        Map<String, JpsEntity> jps = Jps.jps();
        model.addAttribute("jps",jps);
        return "index";
    }

    @RequestMapping(value = "/main")
    public String main(ModelMap model){
        Map<String, JpsEntity> jps = Jps.jps();
        model.addAttribute("jps",jps);
        model.addAttribute("version",Javav.version());
        return "main";
    }

    @RequestMapping(value = "/monitor")
    public String monitor(){
        return "monitor";
    }

}
