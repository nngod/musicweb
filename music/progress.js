(function (window) {
  function Progress(
    $progress_contentinfo,
    $progress_contentinfo_line,
    $progress_dot
  ) {
    return new Progress.prototype.init(
      $progress_contentinfo,
      $progress_contentinfo_line,
      $progress_dot
    );
  }
  Progress.prototype = {
    constructor: Progress,
    isMove: false,
    init: function (
      $progress_contentinfo,
      $progress_contentinfo_line,
      $progress_dot
    ) {
      this.$progress_contentinfo = $progress_contentinfo;
      this.$progress_contentinfo_line = $progress_contentinfo_line;
      this.$progress_dot = $progress_dot;
    },

    progressClick: function (callback) {
      var $this = this;
      //监听背景点击
      this.$progress_contentinfo.click(function (event) {
        //获取背景距离窗口默认位置
        var normalLeft = $(this).offset().left;
        //获取点击位置距离窗口的位置
        var clickLeft = event.pageX;
        //设置进度条前景的宽度和小圆点的位置
        $this.$progress_contentinfo_line.css("width", clickLeft - normalLeft);
        $this.$progress_dot.css("left", clickLeft - normalLeft);
        let value = (clickLeft - normalLeft) / $(this).width();
        callback(value);
      });
    },

    progressMove: function (callback) {
      let $this = this;
      //获取背景距离窗口默认位置
      var normalLeft = this.$progress_contentinfo.offset().left;
      var Left;
      //监听鼠标的按下事件
      this.$progress_contentinfo.mousedown(function () {
        $this.isMove = true;
        //监听鼠标的移动事件
        $(document).mousemove(function (event) {
          //获取当前位置距离窗口的位置
          Left = event.pageX;
          var currentLocation = Left - normalLeft;

          if (currentLocation <= 0) {
            currentLocation = 0;
          } else if (currentLocation > 586) {
            currentLocation = 586;
          }

          //设置进度条前景的宽度和小圆点的位置
          $this.$progress_contentinfo_line.css("width", currentLocation);
          $this.$progress_dot.css("left", currentLocation);
        });

        //监听鼠标的抬起事件
        $(document).mouseup(function () {
          $(document).off("mousemove");
          var value = (Left - normalLeft) / $this.$progress_contentinfo.width();
          $this.isMove = false;
          callback(value);
        });
      });
    },

    //进度条随着歌曲的播放而更改
    setProgress: function (value, btn_next) {
      if (this.isMove) return;
      var $this = this;
      var $value = value;
      var next = $value + "%";
      $this.$progress_contentinfo_line.css({ width: next });
      $this.$progress_dot.css({ left: $value + "%" });
      if (next == "100%") {
        btn_next.trigger("click");
      }
    },
  };
  Progress.prototype.init.prototype = Progress.prototype;
  window.Progress = Progress;
})(window);
