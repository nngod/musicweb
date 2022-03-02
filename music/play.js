(function (window) {
  function Play($audio) {
    return new Play.prototype.init($audio);
  }
  Play.prototype = {
    constructor: Play,
    music: [],
    init: function ($audio) {
      this.$audio = $audio;
      this.audio = $audio.get(0);
    },
    currentIndex: -1,
    playMusic: function (index, music) {
      // this.$audio.attr("src", music.link_url);
      // this.currentIndex = index;
      // // console.log(this.currentIndex);
      // if (this.$audio.pause()) {
      //   this.$audio.play();
      // } else {
      //   this.$audio.pause();
      // }

      //判断是否是同一首音乐
      if (this.currentIndex == index) {
        //是同一首音乐
        if (this.audio.pause) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      } else {
        this.$audio.attr("src", music.link_url);
        this.currentIndex = index;
      }
    },

    //上一首
    playLast() {
      var index = this.currentIndex;
      index--;
      if (index < 0) {
        index = this.music.length - 1;
      }
      return index;
    },

    //下一首
    playNext() {
      var index = this.currentIndex;
      index++;
      if (index == this.music.length) {
        index = 0;
      }
      return index;
    },

    //音乐播放
    musicTimeUpdate: function (callback) {
      var $this = this;
      this.$audio.on("timeupdate", function () {
        var duration = $this.audio.duration;
        var currentTime = $this.audio.currentTime;
        var time = $this.formatDate(currentTime);
        callback(time, currentTime, duration);
      });
    },

    //定义一个格式化时间的方法
    formatDate(currentTime) {
      var starMin = parseInt(currentTime / 60);
      var starSec = parseInt(currentTime % 60);
      if (starMin < 10) {
        starMin = "0" + starMin;
      }
      if (starSec < 10) {
        starSec = "0" + starSec;
      }
      return starMin + ":" + starSec;
    },

    musicSeekTo: function (value) {
      if (isNaN(value)) return;
      this.audio.currentTime = this.audio.duration * value;
    },
  };
  Play.prototype.init.prototype = Play.prototype;
  window.Play = Play;
})(window);
