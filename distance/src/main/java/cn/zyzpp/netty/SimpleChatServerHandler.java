package cn.zyzpp.netty;

import cn.zyzpp.handle.Message;
import cn.zyzpp.handle.MessageHandle;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Create by yster@foxmail.com 2018/11/17 0017 21:44
 */
public class SimpleChatServerHandler extends SimpleChannelInboundHandler<Message> {
    private Logger logger = LoggerFactory.getLogger(getClass().getName());

    /**
     * 每当从服务端收到新的客户端连接时
     */
    @Override
    public void handlerAdded(ChannelHandlerContext ctx)  {
        Channel incoming = ctx.channel();
        logger.debug(incoming.remoteAddress() + "已连接");
    }

    /**
     * 每当从服务端收到客户端断开时
     */
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx)  { // (3)
        Channel incoming = ctx.channel();
        logger.debug(incoming.remoteAddress() + "已断开");
    }

    /**
     * 每当从服务端读到客户端写入信息时，将信息转发给其他客户端的 Channel。
     * 其中如果你使用的是 Netty 5.x 版本时，需要把 channelRead0() 重命名为messageReceived()
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Message s)  { // (4)
        Channel incoming = ctx.channel();
        logger.debug(incoming.remoteAddress() + " : " + s);
        try {
            MessageHandle.handle(ctx, s);
        } catch (Exception e) {
            incoming.writeAndFlush("error");
            e.printStackTrace();
        }
    }

    /**
     * 服务端监听到客户端活动
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx)  { // (5)
        Channel incoming = ctx.channel();
        logger.debug("SimpleChatClient:" + incoming.remoteAddress() + "在线");
    }

    /**
     * 服务端监听到客户端不活动
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx)  { // (6)
        Channel incoming = ctx.channel();
        logger.debug("SimpleChatClient:" + incoming.remoteAddress() + "掉线");
    }

    /**
     * 当出现 Throwable 对象才会被调用
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (7)
        Channel incoming = ctx.channel();
        logger.debug("SimpleChatClient:" + incoming.remoteAddress() + "异常");
        // 当出现异常就关闭连接
        cause.printStackTrace();
        ctx.close();
    }

}
