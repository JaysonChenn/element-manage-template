/**
 * @description winWidth为屏幕宽度
 * @description 计算方式为: 屏幕宽度/750 为放大缩小的倍率 *100方便计算(此步骤设置font-size)
 * @description 使用方式为: UI图宽度设置为750 量出来的宽或高/100即为多少rem
 */
function setFontSize() {
  var winWidth = window.innerWidth;
  document.documentElement.style.fontSize = (winWidth / 750) * 100 + 'px';
}

var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
var timer = null;

window.addEventListener(evt, function() {
  clearTimeout(timer);
  timer = setTimeout(setFontSize, 300);
}, false);

window.addEventListener("pageshow", function(e) {
  if (e.persisted) {
    clearTimeout(timer);
    timer = setTimeout(setFontSize, 300);
  }
}, false);

//初始化
setFontSize();