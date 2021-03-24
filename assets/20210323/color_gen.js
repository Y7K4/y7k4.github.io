function GetRGBA(n) {
  const h = GetH(n);
  const s = 0.25;
  const v = 0.95;
  const { r, g, b } = HSVtoRGB(h, s, v);
  return `rgba(${r},${g},${b},1)`;
}

// 0, 0.5, 0.25, 0.75, 0.125, 0.625, 0.375, 0.875, 0.0625, ...
function GetH(n) {
  let exp = 1;
  let h = 0;
  while (n) {
    exp /= 2;
    h += (n & 1) * exp;
    n >>= 1;
  }
  return h;
}

// See https://stackoverflow.com/questions/17242144/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}
