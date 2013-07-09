;(function($){
    $.fn.sp_connector = function(ports, socket, options){
        var elements = this;

        elements.each(function(){
            var opts = $.extend({}, $.fn.sp_connector.defaults, options);
            var socket_name = $(this).attr('id');
            var socket_ui = {
                name : socket_name,
                button : socket_name + '_button',
                dialog : socket_name + '_dialog'
            };
            var socket_sp = {
                portName : socket_name + '_port',
                baudRate : socket_name + '_rate',
                dataBits : socket_name + '_bits',
                parity : socket_name + '_parity',
                stopBits : socket_name + '_stop',
                flowControl : socket_name + '_flow'
            };
            init_sp($(this), ports, socket_ui, socket_sp);
            sp_dialog(socket_ui, socket_sp, socket, opts);
        });
        return this;
    };

    $.fn.sp_connector.defaults = {
        buffersize_val : 255, // read data buffer
        parser_val : '', // '' is raw data. parser readline. example '\n' or '\r' or '&'.
        encoding_val : 'hex'
    };

    var init_sp = function($obj, ports, socket_ui, socket_sp){
        var dialog_data = '';
        var sel_baudRate = [4800, 9600, 19200, 38400, 57600, 115200, 230400, 500000],
        sel_dataBits = [8,7,6,5],
        sel_parity = ['none', 'even', 'mark', 'odd', 'space'],
        sel_stopBits = [1,2,1.5],
        sel_flowControl = [false, true];

        dialog_data += '<input type="button" id="' + socket_ui.button + '" value="open SerialPort" />';
        dialog_data += '<div id="' + socket_ui.dialog + '" title="Select SerialPort">';
        dialog_data += '<form><table><tr><td>';
        dialog_data += 'COM';
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.portName + '" class="text ui-widget-content ui-corner-all">'
        ports.forEach(function(port){
            dialog_data += '<option value="' + port.comName + '">' + port.comName + '</option>';
        });
        dialog_data += '</select></td></tr><tr><td>';
        dialog_data += 'baudRate';
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.baudRate + '" class="text ui-widget-content ui-corner-all">';
        sel_baudRate.forEach(function(data){
            dialog_data += '<option value="' + data + '">' + data + '</option>';
        });
        dialog_data += '</select></td></tr><tr><td>';
        dialog_data += 'dataBits';
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.dataBits + '" class="text ui-widget-content ui-corner-all">';
        sel_dataBits.forEach(function(data){
            dialog_data += '<option value="' + data + '">' + data + '</option>';
        });
        dialog_data += '</select></td></tr><tr><td>';
        dialog_data += 'parity';
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.parity + '" class="text ui-widget-content ui-corner-all">';
        sel_parity.forEach(function(data){
            dialog_data += '<option value="' + data + '">' + data + '</option>';
        });
        dialog_data += '</select></td></tr><tr><td>';
        dialog_data += 'stopBits'
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.stopBits + '" class="text ui-widget-content ui-corner-all">';
        sel_stopBits.forEach(function(data){
            dialog_data += '<option value="' + data + '">' + data + '</option>';
        });
        dialog_data += '</select></td></tr><tr><td>';
        dialog_data += 'flowControl';
        dialog_data += '</td><td>';
        dialog_data += '<select id="' + socket_sp.flowControl + 'rol" class="text ui-widget-content ui-corner-all">';
        sel_flowControl.forEach(function(data){
            dialog_data +='<option value="' + data + '">' + data + '</option>';
        });
        dialog_data += '</select></td></tr></table></form>';
        dialog_data += '</div>';
        $obj.append(dialog_data);
        $('#' + socket_sp.baudRate).val('19200');
    };

    var sp_dialog = function(socket_ui, socket_sp, socket, opts){
        $( '#' + socket_ui.dialog ).dialog({
            autoOpen: false,
            height: 350,
            width: 350,
            modal: true,
            buttons: {
                "Open": function() {
                    socket.emit('close');
                    var portName_val = $('#' + socket_sp.portName + ' option:selected').val();
                    var baudRate_val = $('#' + socket_sp.baudRate + ' option:selected').val();
                    var dataBits_val = $('#' + socket_sp.dataBits + ' option:selected').val();
                    var parity_val = $('#' + socket_sp.parity + 'option:selected').val();
                    var stopBits_val = $('#' + socket_sp.stopBits + ' option:selected').val();
                    var flowControl_val = $('#' + socket_sp.flowControl + ' option:selected').val();
                    socket.emit('com_open', {
                        portName: portName_val,
                        baudRate: baudRate_val,
                        dataBits: dataBits_val,
                        parity: parity_val,
                        stopBits: stopBits_val,
                        flowControl: flowControl_val,
                        buffersize: opts.buffersize_val,
                        parser: opts.parser_val,
                        encoding: opts.encoding_val
                    });
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            },
            close: function() {
            }
        });
        $( '#' + socket_ui.button ).click(function() {
            $( '#' + socket_ui.dialog ).dialog( "open" );
        });
    };

})(jQuery)
