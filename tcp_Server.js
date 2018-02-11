/*
* 使用net.server API 制作一个基于TCP的聊天程序
* createServer 回调函数会接收到一个对象，该对象是stream ，在本例中接收到的是net.stream
* net.stream是既可以读也可以写
* 其中当socket关闭时，node中有两个关于连接终止的事件:
* 1.end:表示当关闭客服端显示关闭TCP连接是触发，当关闭telnet会发送一个FIN包，意味着结束连接
* 2.close：当发生error，或者关闭客户端，都会触发本事件
* 3.从telnet客服端中进行换行，在服务端进行判断的》》if(data=="\r\n")
* */
var net = require("net");
var info = "";
var totalConnections = 0, users = {};
var server = net.createServer(function (conn) {
    var nickname;
    conn.setEncoding("utf-8");
    console.log(" \033[90m new connection!\033[39m");
    conn.write("\033[92m > welcome to node-chat\033[39m \r\n"
        + " > "
        + totalConnections
        + ' other people are connected at this time\r\n'
        + " > please write your name and press enter:");
    totalConnections++;
    conn.on("close", function () {
        console.log("\033[93mclient offline!!!\033[39m");
        if (totalConnections > 0) { totalConnections--; }
        console.log("当前有" + totalConnections + "在线");
    });
    conn.on("error", function (error) {
        conn.emit('close');
    });
    conn.on("data", function (data) {
        console.log("data = " + data + " and data's length = " + data.length);
        var overFlag = data.toString().slice(-2);
        data = data.toString().slice(0, -2);
        info = data;
        // if (!nickname) {
        //     if (users[data]) {
        //         conn.write("\033[93m> nickname already in use. try again:\033[39m");
        //         return;
        //     } else {
        //         nickname = info;
        //         users[nickname] = conn;
        //         for (var i in users) {
        //             users[i].write(" \033[90m>" + nickname + " joined the room\033[39m\r\n");
        //         }
        //     }
        // } else {
        //     console.log(nickname);
        //     for (var i in users) {
        //         users[i].write("\033[96m> " + nickname + " :\033[39m " + info + "\r\n");
        //     }
        // }



        if(!nickname){
            console.log("************");
            if(users[data]){
                conn.write("\033[90m nickname already in use. try again:\033[39m");
            }else {
                nickname = data;
                users[nickname] = conn;
                for(var i in users){
                    users[i].write("\033[90m"+nickname+" joined the room\033[39m\r\n");
                }
            }
        }else {
            for(var i in users){
                if(i != nickname){
                    console.log("i = "+i+" , nickname = "+nickname);
                    users[i].write("\033[90m>"+nickname+" : "+data+"\033[39m");
                }
            }
        }
        info = "";
    });
});
server.listen(3333, "192.168.85.1", function () {
    console.log("\033[96m  server listening on : *3000\033[39m");
});
/**
 * 问题 ...为什么会重复 发送两遍
 * 原因是没有理解到 node 是关于事件驱动、非阻塞式 I/O 的一个js框架
 * 不能将客户端的从屏幕上输入的代码放入 data 事件中，这样并不能做到时刻想理想中
 * 的聊天系统，因此将process.stdin.on（'data'）.在主代码的外面。这样就可以做到
 * 时刻监听是否有文字输入并且是否需要发送
 */