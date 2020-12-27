const socket = io.connect("https://youtubelivechat.herokuapp.com");
var videoid = "";
socket.on("connect", () => {
  console.log(socket.id);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "title and url" },
      function (title) {
        var h3 = document.createElement("h3");
        var t = document.createTextNode(title);
        h3.appendChild(t);

        var header = document.getElementById("header");
        header.appendChild(h3);
        videoid = tabs[0].url.split("=")[1];
        console.log(videoid);
        socket.emit("joinorcreate", videoid);
      }
    );
  });
});

$(function () {
  $("form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("message", $("#m").val(), videoid);
    $("#m").val("");
    return false;
  });
  socket.on("message", function (msg, videoid) {
    $("#messages").append($("<li>").text(msg));
  });
});
