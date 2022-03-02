(function (window) {
  function Lyric(path) {
    return new Lyric.prototype.init(path);
  }
  Lyric.prototype = {
    constructor: Lyric,
    times: [],
    lyrics: [],
    index: 0,
    init: function (path) {
      this.path = path;
    },
    loadLyric: function (callback) {
      var $this = this;
      $.ajax({
        url: $this.path,
        datatype: "lrc",
        success: function (data) {
          $this.parseLyric(data);
          callback();
        },
      });
    },

    parseLyric: function (data) {
      var $this = this;
      //清空上一首的歌词
      $this.times = [];
      $this.lyrics = [];
      let array = data.split("\n");
      //遍历取出每一条歌词
      //[00:42.658]
      var timeReg = /\[(\d*:\d*\.\d*)\]/;
      $.each(array, function (index, ele) {
        var res = timeReg.exec(ele);
        if (res == null) return true;
        var timeStr = res[1];
        var res2 = timeStr.split(":");
        var min = parseInt(res2[0] * 60);
        var sec = parseFloat(res2[1]);
        var time = parseFloat(Number(min + sec).toFixed(3));
        $this.times.push(time);

        //歌词
        var lyric = ele.split("]")[1];
        if (lyric == "") return true;
        $this.lyrics.push(lyric);
      });
    },

    //获取歌词总长度
    lyricLength: function () {
      return this.times.length;
    },

    currentTime: function (time) {
      // if (time >= this.times[0]) {
      //   this.index++;
      //   this.times.shift();
      // }

      // return this.index;
      $this = this;
      var j;
      var len = $this.times.length;

      for (j = 0; j < len; j++) {
        if (time < $this.times[j + 1] && time > $this.times[j]) {
          $this.index = j;
        }
      }
      if (time > $this.times[len - 1]) {
        $this.index = len - 1;
      }

      return $this.index;
    },
  };

  Lyric.prototype.init.prototype = Lyric.prototype;
  window.Lyric = Lyric;
})(window);
