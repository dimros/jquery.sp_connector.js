jQuery(function($){
    // Server's socket.io
    var server = 'http://'+location.host+'/';
    var web_socket = io.connect(server);

    // Client's(or another Client) socket.io's name
    var host = "localhost";
    var port = 3030;
    var socket_name = 'serialport0'; // sp-socket's socket_name + socket_num
    var list = "#list";

    var sp_host = 'http://'+ host + ':' + port + '/' + socket_name;
    var sp_connect = io.connect(sp_host, {
        'connect_timeout': 5000,
        'reconnect': true,
        'reconnection delay': 500,
        'max reconnection attempts': 3
    });

    // Receive sp-socket's port list
    sp_connect.on('port', function(ports){
        // index.jade's #serialport0 <= socket_name
        $('#serialport0').sp_connector(ports, sp_connect);
    });

    sp_connect.on('connect', function(){
        $(list).prepend($('<div/>').text("connect :" + sp_host));
    });

    sp_connect.on('reconnect', function(){
        $(list).prepend($('<div/>').text("reconnect"));
    });

    sp_connect.on('error', function(){
        $(list).prepend($('<div/>').text("Error: Can not connect to " + sp_host));
    });

    sp_connect.on('disconnect', function(){
        $(list).prepend($('<div/>').text("disconnect"));
    });

    sp_connect.on('open',function(){
        $(list).prepend($('<div/>').text("SerialPort Connect."));
    });

    // sp-socket's serialport error
    sp_connect.on('err', function(data){
        $(list).prepend($('<div/>').text(data));
    });

    // close or disconnect or timeover
    sp_connect.on('close', function(){
        $(list).prepend($('<div/>').text('Close serialport'));
    });

    // Receive sp-socket's serialport read data
    sp_connect.on('read', function(data){
        $(list).prepend($('<div/>').text(data));
        clear_timer();
    });

    comsend = function(command){
        // Send sp-socket's serialport write data
        sp_connect.emit('write', {command: command});
        set_timer();
    };

    $('#close').click(function(){
        // Send sp-socket's serialport Close
        sp_connect.emit('close');
    });

    $('#command').click(function(){
        var command = [0x02,  0x00, 0x4E, 0x07, 0x00, 0x00, 0x00, 0x08, 0x01, 0x00, 0x05, 0x03, 0x68, 0x0D];
        comsend(command);
    });
    $('#continuing').click(function(){
        var command = [0x02,  0x00, 0x4E, 0x07, 0x00, 0x50, 0x00, 0x08, 0x01, 0x00, 0x05, 0x03, 0xB8, 0x0D];
        comsend(command);
    });

    // Receive Loss Check
    var set_timer = function(){
        timeout = setTimeout(function(){
            $(list).prepend($('<div/>').text("Timeout"));
        },5000);
    };
    var clear_timer = function(){
        clearTimeout(timeout);
    };

});

