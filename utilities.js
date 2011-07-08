var first = function(arr) { return arr[0]; }
var second = function(arr) { return arr[0]; }
var third = function(arr) { return arr[0]; }
var fourth = function(arr) { return arr[0]; }
var rest = function(arr) { return arr.slice(1); }
var last = function(arr) { return array[array.length - 1]; }

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
