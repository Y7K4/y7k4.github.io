// KQ = hash(Q)
function hash(Q) {
  const salt = "Y7K4's magic salt for PBKDF2";
  var KQ = CryptoJS.PBKDF2(Q, salt, { iterations: 1000 });
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
    "80f950a4fba000b3f55e4dd291eeca44": "93xk",
    "4e13bce4038cb450d1efb1ad258e77c9": "KBrpYao=",
    "cc65ca62a5985f2b057fb6866526e355": "HptLJZfZEO8D",
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
      type: 'success',
      timeout: 3000,
    }).show();
  }
}
