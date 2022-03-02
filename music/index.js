$(function () {
  //自定义滚动条
  $(".content_in_left_li ").mCustomScrollbar({
    theme: "light",
  });
  var $audio = $(".music_play");
  var playMusic = new Play($audio);

  var mmplay = $("#play");
  var btn_next = $(".btn_next");

  var lyric;

  //进度条的操作
  var $progress_contentinfo = $(".progress_contentinfo");
  var $progress_contentinfo_line = $(".progress_contentinfo_line");
  var $progress_dot = $(".progress_dot");
  var progress = new Progress(
    $progress_contentinfo,
    $progress_contentinfo_line,
    $progress_dot
  );

  //加载歌曲
  getPlayerList();
  function getPlayerList() {
    $.ajax({
      url: "./muscinfo/music.json",
      datatype: "json",
      success: function (data) {
        //遍历每一条数据，创建每一条音乐
        playMusic.music = data;
        $.each(data, function (index, e) {
          var $item = createMusic(index, e);
          var $music = $(".music");
          $music.append($item);
        });

        initMusicInfo(data[0]);

        //初始化歌词信息
        initMusicLyric(data[0]);
      },
    });
  }

  //定义一个方法创建音乐
  function createMusic(index, music) {
    var $item = $(
      `  <li class="li_content">
    <div class="li_content_check">
      <i></i>
      <span class="li_content_span">
        <img src="./img/wave.gif" alt="" class="li_content_img" />
        
        <span class="li_content_num">` +
        (index + 1) +
        `</span> 
        
      </span>
    </div>
    <div class="li_content_sing">
      ` +
        music.name +
        `
      <div class="li_content_menu">
        <a href="javascript:;"  id="music_play"></a>
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
      </div>
    </div>

    <div class="li_content_singer">` +
        music.singer +
        `</div>

    <div class="li_content_time">
      <span class="time">` +
        music.time +
        `</span>
      <div class="li_content_del">
        <a href="javascript:;"></a>
      </div>
    </div>
  </li>`
    );

    $item.get(0).index = index;
    $item.get(0).music = music;

    return $item;
  }

  //初始化歌曲信息
  function initMusicInfo(music) {
    //初始化歌曲图片
    var $songs_info = $(".right_song .songs_info");
    //初始化歌曲名字
    var $songs_name = $(".songs_name a");
    //初始化歌曲歌手名
    var $songser = $(".songser a");
    //初始化歌曲专辑名
    var $songs_zhuanji = $(".songs_zhuanji a");
    //初始化背景
    var $mask_bg = $(".mask_bg");

    //初始化进度条信息
    var $js_song = $(".js_song");
    var $js_singer = $(".js_singer");
    var $tine_end = $(".tine_end");

    $songs_info.css("background-image", "url('" + music.sing_img + "')");
    $songs_name.text(music.name);
    $songser.text(music.singer);
    $js_song.text(music.name);
    $js_singer.text(music.singer);
    $songs_zhuanji.text(music.sing_zhuanji);
    $tine_end.text(music.time);
    $mask_bg.css("background-image", "url('" + music.sing_img + "')");
  }

  //初始化歌词信息

  function initMusicLyric(music) {
    lyric = new Lyric(music.lyric);
    var songs_lyric = $(".songs_lyric");
    songs_lyric.html("");
    lyric.loadLyric(function () {
      //创建歌词
      $.each(lyric.lyrics, function (index, ele) {
        var $lyric = $("<li>" + ele + "</li>");
        songs_lyric.append($lyric);
      });
    });
  }

  //监听音乐播放的进度
  playMusic.musicTimeUpdate(function (time, currentTime, duration) {
    $(".time_start").text(time);
    var btn_next = $(".btn_next");
    //监听进度条的操作
    var value = (currentTime / duration) * 100;
    progress.setProgress(value, btn_next);

    //当前歌词时间
    var index = lyric.currentTime(currentTime);
    var $index = $(".songs_lyric li").eq(index);
    $index.addClass("select");
    $index.siblings().removeClass("select");

    //获取歌词长度
    var leng = lyric.lyricLength();
    if (index > leng - 1) return;
    if (index > leng - 5) {
      $(".songs_lyric").css({
        // marginTop: -index * 30,
        transform: "translateY(" + -(leng - 5) * 30 + "px)",
      });
    } else {
      $(".songs_lyric").css({
        // marginTop: -index * 30,
        transform: "translateY(" + -index * 30 + "px)",
      });
    }

    // $(".songs_lyric").style.transform = "translateY(" + index * 30 + "px)"; //整体向上滚动一行高度
  });

  //监听用户鼠标移入移出歌曲操作

  $(".content").delegate(".li_content", "mouseenter", function () {
    //显示子菜单
    $(this).find(".li_content_menu").stop().fadeIn(100);
    $(this).find(".li_content_del").stop().fadeIn(100);

    //隐藏时长
    $(this).find(".time").stop().fadeOut(100);
  });

  $(".content").delegate(".li_content", "mouseleave", function () {
    //隐藏子菜单
    $(this).find(".li_content_menu").stop().fadeOut(100);
    $(this).find(".li_content_del").stop().fadeOut(100);

    //显示时长
    $(this).find(".time").stop().fadeIn(100);
  });

  //监听用户点击选中框
  $(".content").delegate(".li_content_check", "click", function () {
    $(this).toggleClass("checked");
  });

  //监听用户点击播放按钮
  var $footer_play = $(".suspend");

  $(".content").delegate("#music_play", "click", function () {
    //切换播放按钮
    $(this).toggleClass("li_content_menu_play");

    var $li = $(this).parents(".li_content");
    // console.log($li.get(0).index);
    // console.log($li.get(0).music);
    //复原其他类的播放按钮
    $(this)
      .parents(".li_content")
      .siblings()
      .find("#music_play")
      .removeClass("li_content_menu_play");

    //播放音乐
    playMusic.playMusic($li.get(0).index, $li.get(0).music);

    //切换歌曲信息
    initMusicInfo($li.get(0).music);
    //切换歌词信息
    initMusicLyric($li.get(0).music);

    //同步音乐播放按钮
    //indexOf 没有找到指定字符串返回-1

    if ($(this).attr("class").indexOf("li_content_menu_play") != -1) {
      //说明当前为播放状态

      $footer_play.addClass("switch");

      btn_next = btn_next;
      progress.progressClick(function (clickValue, btn_next) {
        btn_next = btn_next;
        playMusic.musicSeekTo(clickValue, btn_next);
      });

      progress.progressMove(function (moveValue, btn_next) {
        btn_next = btn_next;
        playMusic.musicSeekTo(moveValue, btn_next);
      });

      //播放
      $(".music_play")[0].play();
      //让文字高亮

      $(this).parents(".li_content").css("color", "#ffffff");

      //当前列数字隐藏，小图片显示

      $(this).parents(".li_content").find(".li_conten_num").hide();
      $(this).parents(".li_content").find(".li_content_img").show();

      //让其他元素的数字显示，小图片隐藏

      $(this).parents(".li_content").siblings().find(".li_conten_num").show();
      $(this).parents(".li_content").siblings().find(".li_content_img").hide();
      $(this)
        .parents(".li_content")
        .siblings()
        .css("color", "rgba(255, 255, 255, 0.4)");
    } else {
      //说明当前为暂停状态

      $footer_play.removeClass("switch");

      //暂停
      $(".music_play")[0].pause();
      //让文字不高亮

      $(this).parents(".li_content").css("color", " rgba(255, 255, 255, 0.4)");
      $(this).parents(".li_content").find(".li_conten_num").show();
      $(this).parents(".li_content").find(".li_content_img").hide();
    }
  });

  //监听底部播放按钮
  $("#play").click(function () {
    //判断没有播放音乐;
    if (playMusic.currentIndex == -1) {
      //没有播放音乐
      $(".li_content").eq(0).find("#music_play").trigger("click");
    } else {
      //播放过音乐了
      $(".li_content")
        .eq(playMusic.currentIndex)
        .find("#music_play")
        .trigger("click");
    }
  });

  //监听底部上一首按钮
  $(".btn_last").click(function () {
    if (playMusic.currentIndex != -1) {
      $(".li_content")
        .eq(playMusic.playLast())
        .find("#music_play")
        .trigger("click");
    }
  });

  //监听底部下一首按钮
  $(".btn_next").click(function () {
    if (playMusic.currentIndex != -1) {
      $(".li_content")
        .eq(playMusic.playNext())
        .find("#music_play")
        .trigger("click");
    }
  });
});
