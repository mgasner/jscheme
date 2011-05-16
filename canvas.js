// ctx.save()
// ctx.restore()
// ctx.scale(x, y)
// ctx.rotate(theta)
// ctx.translate(x, y)
// ctx.transform(a, b, c, d, e, f)
// ctx.setTransform(a, b, c, d, e, f)
/* these describe a matrix
      a c e
      b d f
      0 0 1                 */
// ctx.globalAlpha
// ctx.globalCompositeOperation
// ctx.strokeStyle
// ctx.fillStyle

(function () {
  
  var getctx(id) = function {
    return document.getElementById(id).getContext("2d");
  }
  
  var canvas_fillrect = function (id, x, y, w, h) {
    var ctx = getctx(id);
    ctx.fillRect(x, y, w, h);
  }
  
  var canvas_save = function (id) {
    var ctx = getctx(id);
    ctx.save();
  }
  
  var canvas_restore = function (id) {
    var ctx = getctx(id);
    ctx.restore();
  }

  
  update(0, {
    "canvas/fillrect": canvas_fillrect,
    "canvas/restore": canvas_restore,
    "canvas/save": canvas_save
  });
})();