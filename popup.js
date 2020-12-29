const socket = io.connect("https://youtubelivechat.herokuapp.com");
var saved_nickname = "";
var videoid = "";
socket.on("connect", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "title and url" },
      function (title) {

        // remove - YouTube from title
        title = title.split('- YouTube')[0]

        $('h5').after(`<h2>${title}</h2>`)

        // remove attributes from url to just get id
        videoid = tabs[0].url.split("=")[1];
        videoid = videoid.split("&")[0];

        socket.emit("joinorcreate", videoid);
      }
    );
  });
});

$(document).ready(function () {
  chrome.storage.sync.get(["nickname"], function (result) {
    console.log("Value currently is " + result.nickname);
    saved_nickname = result.nickname;
    if (result.nickname) {
      $('.nickname').hide(); 
    }
  });
  
  $('#savenickname').click(function() {
    var nickname_input = $('#nicknamevalue').val();
    chrome.storage.sync.set({"nickname": nickname_input}, function () {
      console.log("Value set to " + nickname_input);
      saved_nickname = nickname_input;
      $("#nicknamevalue").val("");
      $('.nickname').hide();
      }
    );
  });

  $("#send").click(function (e) {
    var msg = $("#m").val();
    socket.emit("message", msg, videoid, saved_nickname);
    let time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    $("#messages").append($("<li>").html(`${time}: (<b>${saved_nickname}</b>) ${msg}`));
    $("#m").val("");
  });

  $('#m').keypress(function(event) {
    if (event.keyCode == 13) {
      var msg = $("#m").val();
    socket.emit("message", msg, videoid, saved_nickname);
    let time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    $("#messages").append($("<li>").html(`${time}: (<b>${saved_nickname}</b>) ${msg}`));
    $("#m").val("");
    }
});

  socket.on("message", function (msg, videoid, sender_nickname) {
    let time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    $("#messages").append($("<li>").html(`${time}: (<b>${sender_nickname}</b>) ${msg}`));
  });
});
