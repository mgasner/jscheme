/*
  Parser
        */

var Symbol = function (name) {
  return { symbol: true, name: name };
}

var pretty_print = function (val) {
  if (typeof val !== "undefined" && (isAutoQuoting(val) || isString(val))) {
    return val;
  } else return "ok";
}
var read = function (s) {
  return read_from(tokenize(s));
};

var parse = read;

var tokenize = function (s) {
  s = s.replace(/[(]/g, " ( ");
  s = s.replace(/[)]/g, " ) ");
  s = s.split(" ");
  r = [];
  for (var i = 0, j = 0, len = s.length; i < len; i++) {
    if (s[i] !== "") {
      r[j] = s[i];
      j++;
    };
  };
  return r;
};

var read_from = function (tokens) {
  if (tokens.length === 0) {
    throw(new Error("Unexpected EOF while reading"));
  }
  token = tokens.shift();
  if (token === "(") {
    var L = [];
    while (tokens[0] !== ")") {
      L.push(read_from(tokens))
    };
    tokens.shift();
    return L;
  } else if (token === ")") {
    throw(new Error("Unexpected )"));
  } else {
    return atom(token);
  }
}

var atom = function (token) {
  if (isNumber(token)) {
    if (isInteger(token)) {
      return parseInt(token);
    } else return parseFloat(token);
  } else if (token[0] === "'") {
    return [Symbol("quote"), Symbol(token.slice(1))];
  } else {
    return Symbol(token);
  }
}
