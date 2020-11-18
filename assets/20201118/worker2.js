var i = 0;
setTimeout(loop, 1000);

// subtract 1 from i every 2 seconds, and then publish i
function loop() {
  i = i - 1;
  postMessage(i);
  setTimeout(loop, 2000);
}

// update i when new message is received
onmessage = function (e) {
  i = e.data;
};
