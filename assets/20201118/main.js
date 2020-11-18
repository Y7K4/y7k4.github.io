// worker1 setup
const worker1 = new Worker("/assets/20201118/worker1.js");
worker1.onmessage = function (e) {
  const i = e.data;
  document.getElementById("worker1").value =
    "worker1:\n  " + (i - 3) + " + 3 = " + i;
  worker2.postMessage(i);
};

// worker2 setup
const worker2 = new Worker("/assets/20201118/worker2.js");
worker2.onmessage = function (e) {
  const i = e.data;
  document.getElementById("worker2").value =
    "worker2:\n  " + (i + 1) + " - 1 = " + i;
  worker1.postMessage(i);
};
