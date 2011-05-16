var primitive_add = function () {
  var i = arguments[0];
  for (var j = 1, len = arguments.length; j < len; j++) {
    i = i + arguments[j];
  };
  return i;
}

var primitive_sub = function () {
  var i = arguments[0];
  for (var j = 1, len = arguments.length; j < len; j++) {
    i = i - arguments[j];
  };
  return i;
}

var primitive_mult = function () {
  var i = arguments[0];
  for (var j = 1, len = arguments.length; j < len; j++) {
    i = i * arguments[j];
  };
  return i;
}

var primitive_div = function () {
  var i = arguments[0];
  for (var j = 1, len = arguments.length; j < len; j++) {
    i = i / arguments[j];
  };
  return i;
}

var primitive_gt = function (x, y) {
  return (x > y);
}

var primitive_lt = function (x, y) {
  return (x < y);
}

var primitive_eq = function (x, y) {
  return (x === y);
}

var primitive_cons = function (x, y) {
  return function (z) { if (z) return x; else return y; };
}

var primitive_car = function (x) {
  return x(true);
}

var primitive_cdr = function (x) {
  return x(false);
}

var pi = function () {
  return Math.PI;
}

var bind_primitives = function() {
  update(0, {
   "+": primitive_add,
   "-": primitive_sub,
   "*": primitive_mult,
   "/": primitive_div,
   ">": primitive_gt,
   "<": primitive_lt,
   "cons": primitive_cons,
   "car": primitive_car,
   "cdr": primitive_cdr,
   "pi": pi,
   "eq": primitive_eq
  });
}
