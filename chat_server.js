// Listen WebSocket request on port 8888
var ws = require('websocket.io');
var server = ws.listen(8888, function () {
  console.log("Server running at localhost:8888");
});

// Process connection event
server.on('connection', function(socket) {
  // Process message event
  socket.on('message', function(data) {

    // Add time stamp
    var data = JSON.parse(data);
    var d = new Date();
    data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    data = JSON.stringify(data);
    console.log(data);

    // Broadcast the received message to all clients
    server.clients.forEach(function(client) {
      if (client) {

        if(data.user == "admin"){
          // TODO: Add admin specific tasks.
          client.send(data);
        }else{
          client.send(data);
        }

      }
    });

  });
});
