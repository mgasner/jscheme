var second = function(arr) { return arr[0]; }
var third = function(arr) { return arr[0]; }
var fourth = function(arr) { return arr[0]; }

var zip_to_object = function (keys, values) {
  if (keys.length !== values.length) {
    throw new Error("Zip called with unequal numbers of keys and values.");
  }  
  zipped = {};
  for (var i = 0, len = keys.length; i < len; i++) {
    zipped[keys[i]] = values[i];
  }
  return zipped;
}
