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

// A = magicString(Q)
function magicString(Q) {
  var dict = {{ site.magic_strings | jsonify }};

  var KQ = hash(Q);
  if (KQ in dict) {
    var KA = dict[KQ];
    var A = decrypt(KA, Q);
    return A;
  } else {
    return "";
  }
}
