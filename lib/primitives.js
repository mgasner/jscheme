var nil = {};

var primitive_add = function () {
  var i = arguments[0];
  for (var j = 1, len = arguments.length; j < len; j++) {
    i = i + arguments[j];
  };
  return i;
}

var primitive_sub = function () {
  if (arguments.length > 1) {
    var i = arguments[0];
    for (var j = 1, len = arguments.length; j < len; j++) {
      i = i - arguments[j];
    };
    return i;
  } else {
    return -arguments[0];
  }
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
  if (isSymbol(x) && isSymbol(y)) {
    return (x.name === y.name);
  } else return (x === y);
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

var primitive_quotient = function (x, y) {
  return Math.floor(x / y);
}

var primitive_remainder = function (x, y) {
  return x % y;
}

var primitive_not = function (x) {
  return (! x);
}

var pi = function () {
  return Math.PI;
}

var bind_primitives = function(env) {
  env.update({
   "+":           primitive_add,
   "-":           primitive_sub,
   "*":           primitive_mult,
   "/":           primitive_div,
   ">":           primitive_gt,
   "<":           primitive_lt,
   "cons":        primitive_cons,
   "car":         primitive_car,
   "cdr":         primitive_cdr,
   "pi":          pi,
   "eq":          primitive_eq,
   "quotient":    primitive_quotient,
   "remainder":   primitive_remainder,
   "not":         primitive_not,
   "#f":          false,
   "#t":          true,
   "nil":         nil
  });
  
  evaluate(read_from(tokenize("(define zero? (lambda (x) (eq x 0)))")), env);
  evaluate(read_from(tokenize("(define positive? (lambda (x) (> x 0)))")), env);
  evaluate(read_from(tokenize("(define negative? (lambda (x) (< x 0)))")), env);
  evaluate(read_from(tokenize("(define >= (lambda (x y) (or (> x y) (eq x y))))")), env)
}