var env = 0,
    verbosity = 0;
var Symbol = function (name) {
  return { symbol: true, name: name };
}

var isSymbol = function (x) {
  return x.hasOwnProperty("symbol");
}

var Environment = [{}];

var update = function (env, pairs) {
  for (i in pairs) {
    if (pairs.hasOwnProperty(i)) {
      Environment[env][i] = pairs[i];
    }
  }
}

var lookup = function (env, symbol) {
  
  if (env < 0) throw new Error("Symbol " + symbol + " not found");

  if (Environment[env].hasOwnProperty(symbol)) {
    return env;
  } else {
    return lookup(env - 1, symbol);
  }
}

var pop_environment = function () {
  Environment[env] = {};
  env--;
}

var push_environment = function () {
  Environment[env + 1] = {};
  env++;
}

var zip = function (keys, values) {
  if (keys.length !== values.length) throw new Error("Zip called with unequal numbers of keys and values.");
  
  zipped = {};
  for (var i = 0, len = keys.length; i < len; i++) {
    zipped[keys[i]] = values[i];
  }
  
  return zipped;
}

bind_primitives();

var to_sexp = function (x) {
  if (! (x instanceof Array)) {
    if (isSymbol(x)) {
      return x.name;
    } else {
      return x;
    }
  } else {
    sexp = "(";
    for (var i = 0, len = x.length; i < len; i++) {
      sexp = sexp + ((i === 0) ? "" : " ") + to_sexp(x[i]);
    }
    sexp = sexp + ")";
    return sexp;
  }
}

var evaluate = function (x) {
    if (env === undefined) {
      env = 0;
    }
    
    if (env === 0) {
      Environment = new Array(Environment[0]);
    }
    
    if (isSymbol(x)) {
        return Environment[lookup(env, x.name)][x.name];
    } else if (! (x instanceof Array)) {
        return x;
    } else if (x[0].name === "quote") {
        if (x[1].symbol === true) {
          return x.name;
        } else {
          return x[1];
        };
    } else if (x[0].name === "if") {
        var test = x[1];
        var conseq = x[2];
        var alt = x[3];
        push_environment();
        var val = evaluate((evaluate(test)) ? conseq : alt);
        pop_environment();
        return val;
    } else if (x[0].name === "set!") {
        var variable = x[1];
        val = evaluate(x[2])
        Environment[lookup(env, variable.name)][variable.name] = val;
        return val;
    } else if (x[0].name === "define") {
        var variable = x[1];
        push_environment();
        val = evaluate(x[2]);
        pop_environment();
        Environment[env][variable.name] = val;
        return val;
    } else if (x[0].name === "lambda") {
        var vars = x[1];
        var expr = x[2]
        return function () {
          push_environment();
          for (var i = 0, len = vars.length; i < len; i++) {
            Environment[env][vars[i].name] = arguments[i];
          }
          var val = evaluate(expr);
          pop_environment();
          return val;
        };
    } else if (x[0].name === "begin") {
        push_environment();
        var i = 1;
        while (i < x.length) {
            var val = evaluate(x[1]);
        };
        pop_environment();
        return val;
    } else {
        var exps = [];
        push_environment();
        for (var i = 0, len = x.length; i < len; i++) {
            exps[i] = evaluate(x[i], env + 1);
        };
        var proc = exps[0];
        var val = proc.apply(this, exps.slice(1));
        pop_environment();
        return val;
    };
};

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
  if (! (isNaN(parseFloat(token)))) {
    return parseFloat(token);
  } else {
    return Symbol(token);
  }
}