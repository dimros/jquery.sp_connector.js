jquery.sp_connector.js
======================
It is easy to connect to [sp-socket](https://github.com/dimros/sp-socket).

# install
Please download.

# How to use ( use express )
## Start up socket.io in app.js.
<pre>
    var server = http.createServer(app);
    server.listen(app.get('port'),function(){
      console.log("Express server listening on port " + app.get('port'));
    });

    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket){
      console.log('Connect');
    });

</pre>

## layout.jade
<pre>
    script(src='/socket.io/socket.io.js')
    script(src='http://code.jquery.com/jquery-1.9.1.js')
    script(src='http://code.jquery.com/ui/1.10.3/jquery-ui.js')
    link(rel='stylesheet', href='http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css')
    script(src='javascripts/jquery.sp_connector.js')
    script(src='javascripts/your_file.js')
</pre>

## index.jade
<pre>
    #serialport0 //sp-socket's socket_name + 0
    #serialport1 //sp-socket's socket_name + 1
    ...
    #serialport5 //sp-socket's socket_name + 5
</pre>

## your_file.js
### Setting socket.io
<pre>
    var socket_name = 'serialport0'; // sp-socket's socket_name + socket_num
    var sp_host = 'http://'+ host + ':' + port + '/' + socket_name;
    var sp_connect = io.connect(sp_host);
</pre>
### Receive sp-socket's port list ( use ,jquery.sp_connector.js )
<pre>
    sp_connect.on('port', function(ports){
        $('#serialport0').sp_connector(ports, sp_connect, options);
    });
</pre>
### Serialport Open signal
<pre>
    sp_connect.on('open',function(){
        alert("serialport open");
    });
</pre>
### Serialport Error signal
<pre>
    sp_connect.on('err', function(data){
        alert('err : ' + data);
    });
</pre>
### Serialport Close signal
<pre>
    sp_connect.on('close', function(){
        alert('Serialport Closed');
    });
</pre>
### Serialport Receive Data
<pre>
    sp_connect.on('read', function(data){
        alert(data);
    });
</pre>
### Serialport Transmit Data
<pre>
    var command = 'led on';
    sp_connect.emit('write', {command: command});
</pre>
### Serialport Close
<pre>
    sp_connect.emit('close');
</pre>


## Options ( serialport's options )
<pre>
var options = {
    buffersize_val : 255, // read data buffer
    parser_val : '', // '' is raw data. parser readline. example '\n' or '\r' or '&'.
    encoding_val : 'hex'
};
</pre>
* buffersize & parser : pleaser refer to [serialport](https://github.com/voodootikigod/node-serialport)
* encoding_val : Initial value 'hex', other ( 'ascii', 'utf-8', ...)

