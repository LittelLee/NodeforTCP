/**
 * client 使用createConnection 创建连接
 */

var net = require('net');
var buffer = {};
const client = net.createConnection({ port: 3333, host: '192.168.85.1' }, function (error) {
    console.log("connection has successful!!!");
    if (error) {
        console.log('error has happened !!!');
    }
});

client.setEncoding('utf8');
client.on('data', function (data) {
    buffer.message += data;
    console.log(data);
});

client.on("error", function (error) {
    console.log("error has happened : " + error);
});


client.on('end', function () {
    console.log('received has message : ' + buffer.message);
    buffer.message = '';
});
process.stdin.resume();
process.stdin.on('data',function(chunk){
    if(chunk!='quite'){
        client.write(chunk.toString());
    }
});
