var number_to_bignum, bignum_to_number, string_to_bignum, bignum_to_string, bignum_abs, bignum_neg, bignum_positive_p, bignum_negative_p, bignum_zero_p, bignum_even_p, bignum_odd_p, bignum_eq, bignum_lt, RADIX;

RADIX = 1000;

number_to_bignum = function (num) {
  var bignum = [1];
  var not_done = true;
  var sign = 1;
  
  if (num === 0) {
    bignum = [0];
    return bignum;
  } else if (num < 0) {
    sign = -1;
  }

  var place = 1;
  while (not_done) {

    var rem = num % RADIX;
    bignum[place] = rem;
    num = (num - rem) / RADIX;
    place = place + 1;
    if (num === 0) {
      not_done = false;
    } else {
      bignum[0] = bignum[0] + 1;
    };
  };
  
  if (sign === -1) {
    bignum[0] = -1 * bignum[0];
  }
  
  return bignum;
}

bignum_to_number = function (bignum) {
  var num = 0;
  
  if (bignum[0] === 0) {
    return num;
  }
  
  for (var i = 0, digits = Math.abs(bignum[0]); i < digits; i++) {
    num = num + (Math.pow(RADIX, i) * bignum[i+1]);
  }
  
  if (bignum[0] < 0) {
    num = -1 * num;
  };
  
  return num;
}

string_to_bignum = function (str) {
  return 0;
}

bignum_to_string = function (bignum) {
  return 0;
}

bignum_abs = function (bignum) {
  bignum[0] = Math.abs(bignum[0]);
  return bignum;
}

bignum_neg = function (bignum) {
  bignum[0] = -1 * bignum[0];
  return bignum;
}

bignum_positive_p = function (bignum) {
  return (bignum[0] > 0);
}

bignum_negative_p = function (bignum) {
  return (bignum[0] < 0);
}

bignum_zero_p = function (bignum) {
  return (bignum[0] === 0);
}

bignum_even_p = function (bignum) {
  if (bignum[0] === 0) {
    return true;
  } else if (RADIX % 2 === 0) {
    return (bignum[1] % 2 === 0);
  } else {
    var parity = 0;
    for (var i = 0, digits = Math.abs(bignum[0]); i < digits; i++) {
      var exp = Math.pow(RADIX, i);
      if (exp % 2 !== 0) {
        if (bignum[i+1] % 2 !== 0) {
          if (parity === 0) {
            parity = 1;
          } else {
            parity = 0;
          }
        }
      }
    };
    return (parity === 0);
  }
}

bignum_odd_p = function (bignum) {
  return (! bignum_even_p(bignum));
}

bignum_eq = function (bignum1, bignum2) {
  if ((len = bignum1.length) !== bignum2.length) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    if (bignum1[i] !== bignum2[i]) {
      return false;
    }
  }
  return true;
}

bignum_lt = function (bignum1, bignum2) {
  if (bignum_negative_p(bignum1) && bignum_positive_p(bignum2)) {
    return true;
  } else if (bignum_positive_p(bignum1) && bignum_negative_p(bignum2)) {
    return false;
  } else if (Math.abs(bignum1[0]) < Math.abs(bignum2[0])) {
    return (bignum1[0] >= 0);
  } else if (Math.abs(bignum1[0]) > Math.abs(bignum2[0])) {
    return (bignum1[0] < 0);
  } else {
    for (var i = bignum1.length; i > 0; i--) {
      if (bignum1[i] < bignum2[i]) {
        return true;
      } else if (bignum1[i] > bignum2[i]) {
        return false;
      }
    }
    
    return false;
  }
}