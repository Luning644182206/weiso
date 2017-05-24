Template.weChat.events({
    'click .open': function(e) {
        var ws = new WebSocket("ws://192.168.4.1:8787");
        ws.onopen = function()
        {  console.log("open");

          ws.send("KG"+"O");

        };

        ws.onmessage = function(evt)

        {

          console.log(evt.data)

        };

        ws.onclose = function(evt)

        {

          console.log("WebSocketClosed!");

        };

        ws.onerror = function(evt)

        {

          console.log("WebSocketError!");

        };
    }
});