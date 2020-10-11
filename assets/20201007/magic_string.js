// KQ = hash(Q)
function hash(Q) {
  const salt = "Y7K4's magic salt for PBKDF2";
  var KQ = CryptoJS.enc.Base64.stringify(
    CryptoJS.PBKDF2(Q, salt, { iterations: 1000 })
  );
  return KQ;
}

// KA = encrypt(A, Q)
function encrypt(A, Q) {
  var key = CryptoJS.SHA256(Q);
  var KA = CryptoJS.Rabbit.encrypt(A, key);
  return KA;
}

// A = decrypt(KA, Q)
function decrypt(KA, Q) {
  var key = CryptoJS.SHA256(Q);
  var A = CryptoJS.enc.Utf8.stringify(CryptoJS.Rabbit.decrypt(KA, key));
  return A;
}

// update (KQ, KA) based on (Q, A)
function generateKeys() {
  var Q = $("#Q").val();
  var A = $("#A").val();
  var KQ = hash(Q);
  var KA = encrypt(A, Q);
  $("#KQ").val(KQ);
  $("#KA").val(KA);
}

// validate Q_test, show A if matched
function validate() {
  // (KQ, KA) pairs
  var dict = {
    "gPlQpPugALP1Xk3Ske7KRA==": "93xk",
    "ThO85AOMtFDR77GtJY53yQ==": "KBrpYao=",
    "zGXKYqWYXysFf7aGZSbjVQ==": "HptLJZfZEO8D",
  };
  dict[$("#KQ").val()] = $("#KA").val();

  var Q = $("#Q_test").val();
  var KQ = hash(Q);
  if (KQ in dict) {
    var KA = dict[KQ];
    var A = decrypt(KA, Q);

    // show A in a notification
    new Noty({
      text: A,
      type: "success",
      timeout: 3000,
    }).show();
  }
}

// button to copy KQ & KA in yaml format
var clipboard = new ClipboardJS(".copy_btn", {
  text: function (trigger) {
    return $("#KQ").val() + ": " + $("#KA").val();
  },
});

clipboard.on("success", function (e) {
  $(e.trigger).text("Copied!");
  e.clearSelection();
  setTimeout(function () {
    $(e.trigger).text("Copy KQ: KA");
  }, 1000);
});
