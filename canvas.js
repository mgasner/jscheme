(function () {
  var canvas_fillrect = function (id, x, y, w, h) {
    var ctx = document.getElementById(id).getContext("2d");
    ctx.fillRect(x, y, w, h);
  }
  update(0, {
    "canvas/fillrect": canvas_fillrect
  });
})();