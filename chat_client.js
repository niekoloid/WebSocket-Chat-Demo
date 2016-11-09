// Connect to WebSocket server
// It must be run by
var ws = new WebSocket('ws://localhost:8888/');

// Error Handling
ws.onerror = function(e){
  $('#chat-area').empty()
    .addClass('alert alert-error')
    .append('<button type="button" class="close" data-dismiss="alert">×</button>',
      $('<i/>').addClass('icon-warning-sign'),
      'Failed to connect the server.'
    );
}

// Assign random username - 1 to 100
var userName = 'Guest #' + Math.floor(Math.random() * 100);

// Show user name before chat messages.
$('#user-name').append(userName);

// Connected to the server
ws.onopen = function() {
  $('#textbox').focus();

  ws.send(JSON.stringify({
    type: 'join',
    user: userName
  }));
};

ws.onmessage = function(event) {
  // Reconstruct the received message
  var data = JSON.parse(event.data);
  var item = $('<li/>').append(
    $('<div/>').append(
      $('<i/>').addClass('icon-user'),
      $('<small/>').addClass('meta chat-time').append(data.time))
  );

  // pushされたメッセージを解釈し、要素を生成する
  if (data.type === 'join') {
    item.addClass('alert alert-info')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + ' has joined the chat room.');
  } else if (data.type === 'chat') {
    item.addClass('well well-small')
    .append($('<div/>').text(data.text))
    .children('div').children('i').after(data.user);
  } else if (data.type === 'left') {
    item.addClass('alert')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + ' left the chat room.');
  } else {
    item.addClass('alert alert-error')
    .children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
      .after('Received a bad request.');
  }
  $('#chat-history').prepend(item).hide().fadeIn(500);
};

// When user send text
textbox.onkeydown = function(event) {
  // Message will be sent when [Enter] key is pressed.
  if (event.keyCode === 13 && textbox.value.length > 0) {
    ws.send(JSON.stringify({
      type: 'chat',
      user: userName,
      text: textbox.value
    }));
    textbox.value = '';
  }
};

// Exit the chat room - when user close the browser
window.onbeforeunload = function () {
  ws.send(JSON.stringify({
    type: 'left',
    user: userName,
  }));
};
