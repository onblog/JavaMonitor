package cn.yueshutong.client.dump.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Create by yster@foxmail.com 2019/3/3 0003 13:35
 */
@ControllerAdvice
public class ExceptionHandle {
    /**
     * 捕获异常 封装返回数据
     *
     * @return
     */
    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public String handle(Exception e) {
        if (e instanceof DumpException) {
            DumpException exception = (DumpException) e;
            return exception.getTip();
        }else {
            return e.getMessage();
        }
    }
}
