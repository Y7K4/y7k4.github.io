var i = 0;
loop();

// add 3 to i every 4 seconds, and then publish i
function loop() {
  i = i + 3;
  postMessage(i);
  setTimeout(loop, 4000);
}

// update i when new message is received
onmessage = function (e) {
  i = e.data;
};
