/*
  Utility functions
                   */

// zips 2 arrays of keys and values into a single new object                   
var zip = function (keys, values) {
  if (keys.length !== values.length) throw new Error("Zip called with unequal numbers of keys and values.");
  
  zipped = {};
  for (var i = 0, len = keys.length; i < len; i++) {
    zipped[keys[i]] = values[i];
  }
  
  return zipped;
}

// formats an array as an S-expression
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


/*
  Global environment
                    */

// contains reference to parent, symbol table, lookup, update, extend
var global_env = {
  parent: -1,
  symbols: {
  },
  lookup: function (sym) {
    if (! (typeof this.symbols[sym] === "undefined")) {
      return this;
    } else if (this.parent === -1) {
      throw new Error ("Symbol not found:" + sym);
    } else {
      return this.parent.lookup(sym);
    };
  },
  update: function () {
    if (arguments.length === 1) {
      var pairs = arguments[0];
      for (var i in pairs) {
        if (pairs.hasOwnProperty(i)) {
          this.symbols[i] = pairs[i];
        }
      }
    } else if (arguments.length === 2) {
      var keys = arguments[0];
      var values = arguments[1];
      for (var i = 0, len = keys.length; i < len; i++) {
        this.symbols[keys[i]] = values[i];
      }
    } else {
      throw new Error ("Wrong number of arguments to env.update:" + arguments);
    }
  },
  extend: function () {
    return {
      parent: this,
      symbols: {
      },
      lookup: this.lookup,
      update: this.update,
      extend: this.extend
    }
  }
}


/*
  Predicates
            */

var isAutoQuoting = function (x) {
  return (isSymbol(x) || isNumber(x) || isBoolean(x));
}

var isSymbol = function (x) {
  return x.hasOwnProperty("symbol");
}

var isNumber = function (x) {
  return (! isNaN(parseFloat(x)));
}

var isInteger = function (x) {
  return (parseInt(x) === parseFloat(x));
}

var isBoolean = function (x) {
  return (x === true || x === false);
}

var isString = function (x) {
  return ((typeof x !== undefined) && x.toUpperCase);
}

var isQuote = function (x) {
  return (x[0].name === "quote");
}

var isIf = function (x) {
  return (x[0].name === "if");
}

var isSet = function (x) {
  return (x[0].name === "set!");
}

var isDef = function (x) {
  return (x[0].name === "define");
}

var isLambda = function (x) {
  return (x[0].name === "lambda");
}

var isBegin = function (x) {
  return (x[0].name === "begin");
}

var isCond = function (x) {
  return (x[0].name === "cond");
}

var isLet = function (x) {
  return (x[0].name === "let");
}

var isLetStar = function (x) {
  return (x[0].name === "let*");
}


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


/*
  Eval
      */

var evaluate = function (x, env) {
    if (env === undefined) {
      env = global_env;
    }

    if (isSymbol(x)) {
        return env.lookup(x.name).symbols[x.name];
    } else if (! (x instanceof Array)) {
        return x;
    } else if (isQuote(x)) {
        if (x[1].symbol === true) {
          return x[1].name;
        } else {
          return x[1];
        };
    } else if (isIf(x)) {
        var test = x[1];
        var conseq = x[2];
        var alt = x[3];
        var val = evaluate((evaluate(test, env)) ? conseq : alt, env);
        return val;
    } else if (isSet(x)) {
        var variable = x[1];
        val = evaluate(x[2], env)
        env.lookup(variable.name).symbols[variable.name] = val;
        return val;
    } else if (isDef(x)) {
        if (! (x[1] instanceof Array)) {
          var variable = x[1];
          var val = evaluate(x[2], env);
          env.update([variable.name], [val]);
          return val;
        } else {
          var variable = x[1].shift()
          var expr = [Symbol("lambda"), x[1], x[2]]
          var val = evaluate(expr, env);
          env.update([variable.name], [val]);
          return val;
        }
    } else if (isLambda(x)) {
        var vars = x[1];
        var expr = x[2];
        for (var i = 0, len = vars.length; i < len; i++) {
          vars[i] = vars[i].name;
        };
        return function () {
          env.update(vars, arguments);
          var val = evaluate(expr, env);
          return val;
        };
    } else if (isBegin(x)) {
        for (var i = 1, len = x.length; i < x.length; i++) {
            var val = evaluate(x[i], env);
        };
        return val;
    } else if (isCond(x)) {
        if (x[2][0].name === "else") {
          var expr = [Symbol("if"), x[1][0], x[1][1], x[2][1]];
          return evaluate(expr, env);
        } else {
          var expr = [Symbol("if"), x[1][0], x[1][1], evaluate([Symbol("cond"), x.slice(2)])];
          return evaluate(expr, env);
        }
    } else if (isLetStar(x)) {
        if (x[1].length === 1) {
          var expr = [[Symbol("lambda"), [x[1][0][0]], x[2]], x[1][0][1]];
          return evaluate(expr, env);
        } else {
          var expr = [[Symbol("lambda"), [ x[1][0][0] ], [Symbol("let"), x[1].slice(1), x[2]]], x[1][0][1]];
          return evaluate(expr, env);
        }    
    } else if (isLet(x)) {
        if (! (x[1] instanceof Array)) {
          var expr = [Symbol("begin"), [], [x[1]]];
          var defn = [Symbol("define"), x[1], [Symbol("lambda"), [], x[3]]];
          var vars = [];
          for (var i = 0, len = x[2].length; i < len; i++) {
            vars[i] = x[2][i][0];
            expr[2].push(x[2][i][1]);
          }
          defn[2][1] = vars;
          expr[1] = defn;
        } else {
          var variables = [];
          var expr = [[Symbol("lambda"), [], x[2]]];
          for (var i = 0, len = x[1].length; i < len; i++) {
            variables[i] = x[1][i][0];
            expr.push(x[1][i][1]);
          }
          expr[0][1] = variables;
        }
        return evaluate(expr, env);
    } else {
        var exps = [];
        for (var i = 0, len = x.length; i < len; i++) {
            exps[i] = evaluate(x[i], env);
        };
        var proc = exps[0];
        var val = proc.apply(this, exps.slice(1));
        return val;
    };
};

bind_primitives(global_env);