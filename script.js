

function imageJustSize() {
  var title = document.getElementById('title');
  var winH = window.innerHeight;
  title.style.height = winH + 'px';
}


var images = new Array();
var slideImg = new Array("img/00.jpg","img/01.jpg","img/02.jpeg","img/03.jpeg","img/04.jpg","img/05.jpg","img/06.jpg","img/07.jpg","img/08.jpg","img/09.jpeg","img/10.jpeg",);
window.onload = function(){

    // 画像プリロード
    for (i = 0; i < images.length; i++){
        var img = document.createElement('img');
        img.src = slideImg[i];
    }

}




imageJustSize();


window.addEventListener('resize', imageJustSize);

//読み込み完了時
window.onload = function () {
    prepReading();  //DBreading


};

let loadProgress = 0;

const countUp = () =>{
  $(".load-bar").css("width", loadProgress*1.0 + "%");
  //console.log(loadProgress);

}

const loadIntervalId = setInterval(() =>{
  countUp();

  if(loadProgress == 100){
    setTimeout(() =>{
      $("#load-div").fadeOut("slow");
      $("#nav_bar").fadeIn();
      $("body").removeClass("no-vscroll");
      clearInterval(loadIntervalId);　//intervalIdをclearIntervalで指定している
    },600);
  }

  if(dbPicRefs.length!=0){　
    loadProgress = 100;

  }else{
    if(loadProgress < 80){
      loadProgress += 12;
    }
  }

}, 200);





prepImages();

var slideShow = $("#sshow");
var slidePointDiv = $("#points")
var slidePoint = $(".slide-point");
var modalOverlay = $('<div id="modal-overlay" href="javascript:" onclick="bgClicked();"></div>').appendTo("body");
var picTriggers = [];
var dbPicRefs = [];
var slidePoints = [];
var slideCount = 0;
var picDiv = $('<div id="pic-div"></div>').appendTo("body");
var mainPic = $('<img id="main-pic" onclick="pictureClicked();">').appendTo(picDiv);
var picRef;

//data: [pos1,pos2,[title,comment,speciality,name]]

// picTriggerData = [
//   [[[125,635],[651,754],[["量えっぐ", "こんな並んでんの見たこと無い", "並ぶの苦手専門家" , "みむら"],["鉄だ！", "食べて鉄分補給しようや", "鉄分足りてない学", "みむら"]]], [[650,50],[750,750],[["でかーーい！", "でっっっっっか", "小さいマン", "みむら"]]]],
//   [[[650,515],[698,528],[["ここにCD入れるん？", "マジか　てかWindows 10やし", "無知専門家" , "みむら"]]], [[22,335],[61,432],[["高ーーーーい！", "背たっっっっっか", "小さいマン", "みむら"]]]],
//   [[[490,226],[610,354],[["エー！", "これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！", "行数テスト", "みむら"]]]],
//   [],
//   [],
//   [],
//   [],
//   [],
//   [],
//   [],
//   [],
//   [],
// ];

//スライド下の点の生成
// for(let i=0; i<11; i++){
//   var slidePointClone = slidePoint.clone().appendTo("#points");
//   slidePointClone.css("background-color", "gray");
//   slidePointClone.css("position", "absolute");
//   slidePointClone.css("left", 40*i);
//   slidePointDiv.css("width",20*21+"px");
//   slidePoints.push(slidePointClone);
//   slidePoints[0].css("background-color","white");
// }
// slidePoint.remove();




function slideLeft(){
  slidePoints[slideCount].css("background-color","gray");
  slideCount -= 1;
  if(slideCount == -1) slideCount = 10;
  slideShow.attr("src", slideImg[slideCount]);
  slidePoints[slideCount].css("background-color","white");
}

function slideRight(){
  slidePoints[slideCount].css("background-color","gray");
  slideCount += 1;
  if(slideCount == 11) slideCount = 0;
  slideShow.attr("src", slideImg[slideCount]);
  slidePoints[slideCount].css("background-color","white");
}

function slideClicked(){
  var image = new Image();
  image.src = slideImg[slideCount];
  var picAspRatio = image.width/image.height;
  var picSizeRatio = $(window).height() * 0.8 / image.height;

  mainPic.attr("src", slideImg[slideCount]);

  modalOverlay.fadeIn("slow");

  makePicDiv(picAspRatio);
  picDiv.fadeIn();
  mainPic.fadeIn("slow");



  loadTrigger(picSizeRatio);
  showTrigger(picSizeRatio);




  $("body").addClass("no-vscroll");
}

function bgClicked(){

  $("#comment-box").fadeOut().queue(function(){
    this.remove();
  });

  modalOverlay.fadeOut("slow");

  mainPic.fadeOut();
  picDiv.fadeOut();

  $("body").removeClass("no-vscroll");
  removeTrigger();
  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });

}

function loadTrigger(picSizeRatio){
  for(let i=0; dbPicRefs["p" + slideCount]["trig"+i]!=null; i++){


    var x1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[0];
    var y1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[1];
    var x2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[2];
    var y2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[3];

    var cssTop = y1 * picSizeRatio;
    var cssLeft = x1 * picSizeRatio;
    var cssWidth = (x2-x1) * picSizeRatio;
    var cssHeight = (y2-y1) * picSizeRatio;

    var newTrigger = $('<div href="javascript:" onclick="triggerClicked(event);" class="pic-trigger"></div>');
    newTrigger.css('top',cssTop);
    newTrigger.css('left',cssLeft);
    newTrigger.css('width',cssWidth);
    newTrigger.css('height',cssHeight);

    $("#pic-div").append(newTrigger); //htmlへの組み込み
    picTriggers.push(newTrigger);     //jsで扱う配列への組み込み

    newTrigger.attr('js-id',String(i));
    // console.log(String(slideCount).padStart(2,'0') + String(i));
  }
}

function showTrigger(picSizeRatio){
  for(let i=0; i<picTriggers.length; i++){
    picTriggers[i].fadeIn();
  }
}

function removeTrigger(){
  while (picTriggers.length > 0) {
    picTriggers[0].fadeOut("slow").queue(function(){
      this.remove();
    });
    picTriggers.shift();

  }
}

function makePicDiv(picAspRatio){

  var height = $(window).height() * 0.8;
  var width = picAspRatio * height;

  picDiv.css("width", width);
  picDiv.css("height", height);

}

function pictureClicked(){
  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });
}

function triggerClicked(e){

  $(".comment-box").remove();


  var obj = $(event.target);
  var id = obj.attr('js-id');
  var div = $('<div class="comment-box"></div>');
  div.attr('trig-id', id);
  //div.on('mousedown.commentBox', mainCommentBoxClicked);
  var trigname = dbPicRefs["p" + slideCount]["trig" + id]["trigname"];
  var trignameDiv = $('<div class="comment-trigname"></div>').appendTo(div);
  var trignameP =  $('<p></p>').html(trigname).appendTo(trignameDiv);
  $("body").append(div);
  div.fadeIn();
  mousePos = [e.clientX, e.clientY];
  if(mousePos[1] > window.innerHeight / 2){ //y
    div.css('top', mousePos[1] - 300);
  }else{
    div.css('top', mousePos[1] - 120);
  }

  if(mousePos[0] > window.innerWidth / 2){  //x
    div.css('left', mousePos[0] - (100 + 420));
  }else{
    div.css('left', mousePos[0] + 100);
  }
  for(let i=0; dbPicRefs["p" + slideCount]["trig" + id]["com"+i]!=null; i++){
    var newdiv = $('<div class="comment-div"></div>').appendTo(div);
    newdiv.attr("js-com-id",String(i));
    newdiv.attr("js-trig-id",String(id));
    newdiv.attr("com-from","intellectual");
    var title = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["title"];
    var text = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["text"];
    var speciality = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["speciality"];
    var name = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["name"];
    var like = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["like"];

    var specialityP = $('<p class="comment-speciality"></p>').html(speciality).appendTo(newdiv);
    var nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);

    var titleP = $('<p class="comment-title"></p>').html(title).appendTo(newdiv);
    var textP = $('<p class="comment-text"></p>').html(text).appendTo(newdiv);

    var likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    likeButton.on('mousedown', likeClicked);
    var likeCount =  $('<span class ="comment-like-count"></span>').html("  "+like).appendTo(newdiv);
  }

  for(let i=0; dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]!=null; i++){
    var newdiv = $('<div class="comment-div"></div>').appendTo(div);
    newdiv.attr("js-com-id",String(i));
    newdiv.attr("js-trig-id",String(id));
    newdiv.attr("com-from","user");
    var title = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["title"];
    var text = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["text"];
    var speciality = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["speciality"];
    var name = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["name"];
    var like = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["like"];

    var specialityP = $('<p class="comment-speciality com-from-user"></p>').html(speciality).appendTo(newdiv);
    var nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);

    var titleP = $('<p class="comment-title com-from-user"></p>').html(title).appendTo(newdiv);
    var textP = $('<p class="comment-text"></p>').html(text).appendTo(newdiv);

    var likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    likeButton.on('mousedown', likeClicked);
    var likeCount =  $('<span class ="comment-like-count"></span>').html("  "+like).appendTo(newdiv);
  }



  var newComButton = $('<button class="new-com-button">新たな視点を投稿する</button>').appendTo(div);
  newComButton.on('mousedown', newComButtonClicked);

}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function prepReading(){
    picRef = firebase.database().ref();
    picRef.on('value', (snapshot) => {
        dbPicRefs = snapshot.val();
        console.log(dbPicRefs);

        //console.log(trig1);
    });
}

function likeClicked(){
  var target = $(event.target);
  var div = target.parent();
  var comId = div.attr("js-com-id");
  var trigId = div.attr("js-trig-id");
  var liked = target.attr("liked");
  var like;

  if(div.attr("com-from") == "intellectual"){
    like = dbPicRefs["p" + slideCount]["trig" + trigId]["com"+comId]["like"];
  }else{
    like = dbPicRefs["p" + slideCount]["trig" + trigId]["usercom"+comId]["like"];
  }

  if(liked == "false"){
    target.css("color","var(--accent)");
    target.attr("liked","true");
    like += 1;
    target.hover(
      function(){
        target.css("color","var(--accent)");
      },
      function(){
        target.css("color","var(--accent)");
      }
    );

  }else{
    target.css("color","white");
    target.attr("liked","false");
    like -= 1;
    target.hover(
      function(){
        target.css("color","white");
      },
      function(){
        target.css("color","gray");
      }
    );
  }




  if(div.attr("com-from") == "intellectual"){
    picRef.child("p" + slideCount+"/"+"trig"+trigId+"/com"+comId).update({
      "like": like
    });
  }else{
    picRef.child("p" + slideCount+"/"+"trig"+trigId+"/usercom"+comId).update({
      "like": like
    });
  }

  div.find(".comment-like-count").html(like);
  //console.log(dbPicRefs["p" + slideCount]["trig" + trigId]["com"+comId]["like"]);
}

function newComButtonClicked(){
  var trigId = $(event.target).parent().attr('trig-id');
  var trigname = dbPicRefs["p" + slideCount]["trig" + trigId]["trigname"];
  var description_text = "あなたならこの"+trigname+"にどのような視点を与えますか。<b>あなたならではの視点</b>を書いてみてください。";
  var caution_text = [
    "<b>以下のいずれかにあてはまるコメントは禁止されています。</b>",
    "・第三者を攻撃するようなもの",
    "・公序良俗に反するもの",
    "・明らかに内容に意味が無いもの",
    "・その他不適切だと判断されるもの"
  ]
  if($('.new-com-div').length == 0){
    var div = $('<div class="comment-box new-com-div"></div>').appendTo("body");
    div.attr('trig-id', trigId);
    var title = $('<p class="new-com-title"></p>').html("新たな視点の投稿").appendTo(".new-com-div");
    var description = $('<p class="new-com-description"></p>').html(description_text).appendTo(".new-com-div");
    var cautionDiv = $('<div class="new-com-caution-div"></div>').appendTo(".new-com-div");
    for(var i=0; i<caution_text.length; i++){
      var caution = $('<p class="new-com-caution"></p>').html(caution_text[i]).appendTo(cautionDiv);
    }
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_speciality" type="text"/><label class="nice-label" >あなたを一言で表すと (例: 靴マニア, 建築デザイン好き, など)</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_name" type="text"/><label class="nice-label" >あなたのニックネーム</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_title" type="text"/><label class="nice-label" >視点のタイトル</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><textarea rows=5 class="nice-textbox" id="tb_comment" type="text"/><label class="nice-label" >どんな視点？</label></div>').appendTo(".new-com-div");

    var tb_speciality = $("#tb_speciality");
    var tb_name = $("#tb_name");
    var tb_title = $("#tb_title");
    var tb_comment = $("#tb_comment");

    $('.nice-textbox').blur(function() {
        if($(this).val().length === 0){
          $(this).parent().find(".nice-label").removeClass("focus");
        }
        else {  }
      })
      .focusin(function(e) {
        $(":focus").parent().find(".nice-label").addClass("focus");
      });

    var submitButton = $('<button type="button" class="new-com-button new-com-submit">投稿<button>').appendTo(".new-com-div");

    submitButton.click(function(){
      if(tb_speciality.val().length * tb_name.val().length * tb_title.val().length * tb_comment.val().length != 0){
        preSubmitButtonClicked(tb_speciality.val(), tb_name.val(), tb_title.val(), tb_comment.val());
      }else{
        if(tb_speciality.val().length == 0){
          tb_speciality.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_speciality.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_name.val().length == 0){
          tb_name.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_name.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_title.val().length == 0){
          tb_title.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_title.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_comment.val().length == 0){
          tb_comment.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_comment.css('background-color', '#fff');
            },500);
          });
        }
      }

    });

    div.fadeIn();
  }
}

function mainCommentBoxClicked(){
  if($('.new-com-div').length > 0){
    $(".new-com-div").fadeOut().queue(function(){
      this.remove();
    });
  }
}

function preSubmitButtonClicked(speciality, name, title, comment){
  if($(".new-presubmitted-div").length == 0){
    var confirmDiv = $('<div class="comment-box new-presubmitted-div"></div>').appendTo("body");
    var confirmTextP = $('<p class="new-com-description"></p>').html("あなたの視点は以下のように表示され、公開されます。").appendTo(confirmDiv);

    var newdiv = $('<div class="comment-div"></div>').appendTo(confirmDiv);
    var specialityP = $('<p class="comment-speciality com-from-user"></p>').html(speciality).appendTo(newdiv);
    var nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);
    var titleP = $('<p class="comment-title com-from-user"></p>').html(title).appendTo(newdiv);
    var textP = $('<p class="comment-text"></p>').html(comment).appendTo(newdiv);

    var likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    var likeCount =  $('<span class ="comment-like-count"></span>').html(" 0").appendTo(newdiv);

    var confirmButton = $('<button class="new-com-button new-com-presubmit">確認</button>').appendTo(confirmDiv);
    var cancelButton = $('<p class="new-com-presubmit-cancel">キャンセル</p>').appendTo(confirmDiv);
  }

  confirmButton.click(function(){
    submitButtonClicked(speciality, name, title, comment);
  });
  cancelButton.click(function(){
    confirmDiv.fadeOut().queue(function(){
      this.remove();
    });
  });

  confirmDiv.fadeIn();
}

function submitButtonClicked(speciality, name, title, comment){
  var picId = slideCount;
  var trigId = $(".new-com-div").attr('trig-id');
  var userComNum = dbPicRefs["p" + slideCount]["trig" + trigId]["userComNum"];


  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });
  var div = $('<div class="comment-box new-submitted-div"></div>').appendTo("body");
  var text = $('<p class="new-submitted-text"></p>').html("投稿されました。").appendTo(".new-submitted-div");

  $(function(){
    setTimeout(function(){
      $(".comment-box").fadeOut().queue(function(){
        this.remove();
      });
    },2000);
  });
  // var commentNum = Object.keys(dbPicRefs["p" + slideCount]["trig" + trigId]).length - 3;


  firebase.database().ref("p"+picId+"/trig"+trigId+"/usercom"+userComNum).set({
    like: 0,
    name: name,
    speciality: speciality,
    title: title,
    text: comment
  });

  firebase.database().ref("p"+picId+"/trig"+trigId).update({
    userComNum: userComNum + 1
  });


  div.fadeIn();
}

function howtoClicked(){
  var conceptDiv = $("#concept");
  var divHeight = conceptDiv.outerHeight(true);
  var howtoInputhere = $(".howto-inputhere");
  var button = $(event.target);

  if($(".howto-container").length == 0){
    button.html("歩き方を閉じる");
    var howtoContainer = $('<div class="container howto-container"></div>').appendTo(".howto-inputhere");
    var howtoContainer_1 = $('<div class="container howto-container howto-container-1"></div>').appendTo(".howto-inputhere");
    $('<h2 class="howto-title">歩き方</h2>').appendTo(howtoContainer);
    $('<p>あるきかたのせつめいせつめい</p>').appendTo(howtoContainer_1);
    $('<p>あるきかたのせつめいせつめい</p>').appendTo(howtoContainer_1);
    $('<p>あるきかたのせつめいせつめい</p>').appendTo(howtoContainer_1);
    $('<p>多分もっと長くなる</p>').appendTo(howtoContainer_1);

    var containerHeight = howtoContainer.outerHeight(true) + howtoContainer_1.outerHeight(true);

    howtoInputhere.css("height", "0");
    howtoContainer.fadeIn("slow");
    howtoInputhere.animate({height: containerHeight});
  }else{
    button.html("歩き方を見る");
    var howtoContainer = $(".howto-container");
    howtoContainer.fadeOut("slow").queue(function(){

    });;
    howtoInputhere.animate({height: 0}, function(){
      howtoContainer.remove();
    });
  }

}

function prepImages(){
  for(var i=0; i<slideImg.length; i++){
    var newImg = $('<img class="sshow" src="'+slideImg[i]+'">');
    images.push(newImg);
  }
}



$(window).on('load', function() {
  //prepSlideshow();
  flickityData = $('.sshow_div').flickity({
    // options
    cellAlign: 'center',
    contain: false,
    wrapAround: true,
    prevNextButtons: false,
  }).data('flickity');

  addFlickity();
});

function prepSlideshow(){

  slideDiv = $("#sshow_div");
  var slideWidth = $(window).width()*0.75;
  var picCenterDiv = $('<div class="pic-div" id="pic-center"></div>').appendTo(slideDiv);
  var picRightDiv = $('<div class="pic-div" id="pic-right"></div>').appendTo(slideDiv);
  var picLeftDiv = $('<div class="pic-div" id="pic-left"></div>').appendTo(slideDiv);
  var picCenter = images[0].appendTo(picCenterDiv);
  var picRight = images[1].appendTo(picRightDiv);
  var picLeft = images[10].appendTo(picLeftDiv);


  var rightButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);
  var leftButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);

  picRightDiv.css("left", slideWidth);
  picLeftDiv.css("left", -slideWidth);
  rightButton.css("left", slideWidth);
  leftButton.css("left", -slideWidth);

  $(window).resize(function(){
    slideWidth = $(window).width()*0.75;
    picRightDiv.css("left", slideWidth);
    picLeftDiv.css("left", -slideWidth);
    rightButton.css("left", slideWidth);
    leftButton.css("left", -slideWidth);
  });

  rightButton.on('mousedown', function(){
    slideCount += 1;
    var picNewDiv =  $('<div class="pic-div" id="pic-new"></div>').appendTo(slideDiv);
    var picNew = images[slideCountNormalize(slideCount+1)].appendTo(picNewDiv);
    picNewDiv.css("left", slideWidth * 2);


    picRightDiv.velocity({left: 0});
    picCenterDiv.velocity({left: -slideWidth});
    picLeftDiv.velocity({left: -slideWidth * 2});
    picNewDiv.velocity({left: slideWidth}).queue(function(){
      picNewDiv.remove();
      picLeftDiv.remove();
      picCenterDiv.remove();
      picRightDiv.remove();
      picLeftDiv = $('<div class="pic-div" id="pic-left"></div>').appendTo(slideDiv);
      picLeftDiv.css({left: -slideWidth});
      picLeft = images[slideCountNormalize(slideCount-1)].appendTo(picLeftDiv);

      picCenterDiv = $('<div class="pic-div" id="pic-center"></div>').appendTo(slideDiv);
      picCenterDiv.css({left: 0});
      picCenter = images[slideCountNormalize(slideCount)].appendTo(picCenterDiv);

      picRightDiv = $('<div class="pic-div" id="pic-right"></div>').appendTo(slideDiv);
      picRightDiv.css({left: slideWidth});
      picRightDiv = images[slideCountNormalize(slideCount+1)].appendTo(picRightDiv);
    });

  });

  // var centerWidth, leftWidth, rightWidth;
  //
  // picCenter.bind("load",function(){
  //   centerWidth = picCenter.width();
  //   leftWidth = picLeft.width();
  //   rightWidth = picRight.width();
  //   picRight.css("left",centerWidth+30+"px");
  //   picLeft.css("left",-(leftWidth+30)+"px");
  //   picCenter.css("left","0");
  //   picCenter.on('mousedown', slideClicked);
  // });
  //
  // $(window).resize(function() {
  //   centerWidth = picCenter.width();
  //   leftWidth = picLeft.width();
  //   rightWidth = picRight.width();
  //   picRight.css("left",centerWidth+30+"px");
  //   picLeft.css("left",-(leftWidth+30)+"px");
  //   picCenter.css("left",centerWidth / 2+"px");
  // });
  //
  // $(document).on('click',"#pic-right",function(){
  //
  //   slideCount += 1;
  //   slideCountPlus = slideCount + 1;
  //   if(slideCount > slideImg.length-1){
  //     slideCount -= (slideImg.length);
  //   }
  //   if(slideCountPlus > slideImg.length-1){
  //     slideCountPlus -= (slideImg.length);
  //   }
  //   console.log("centerwidth: "+centerWidth+" leftWidth: "+leftWidth + " rightWidth: "+rightWidth);
  //   var picNew = $('<img class="sshow">').appendTo(slideDiv);
  //   picNew.css("left", centerWidth + 30 + rightWidth + 30 + "px");
  //   picNew.attr("src", '');
  //   picNew.on('load', function(){
  //     centerWidth = $("#pic-center").width();
  //     leftWidth = $("#pic-left").width();
  //     rightWidth = $("#pic-right").width();
  //     console.log("rightWidth: ", rightWidth);
  //   });
  //   picNew.attr("src", slideImg[slideCountPlus]);
  //   var leftPosTarget = -(leftWidth+30+centerWidth)+"px";
  //   var centerPosTarget =  -(30+centerWidth)+"px";
  //   var rightPosTarget = "0px";
  //   var newPosTarget = centerWidth+30+"px";
  //   picLeft.animate({left: leftPosTarget}).queue(function(){
  //     picLeft.remove();
  //     picLeft = picCenter.attr("id","pic-left");
  //     picCenter = picRight.attr("id","pic-center");
  //     picRight = picNew.attr("id","pic-right");
  //     slideDiv.css("width", rightWidth);
  //   });
  //   picCenter.animate({left: centerPosTarget});
  //   picRight.animate({left: rightPosTarget});
  //   picNew.animate({left: newPosTarget});
  //
  // });

}




function slideCountNormalize(v){
  if(v >= slideImg.length){
    v = v - slideImg.length;
  }
  if(v < 0){
    v = v + slideImg.length;
  }
  return v;
}

function addFlickity(){
  slideDiv = $(".sshow_container");
  var rightButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);
  var leftButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);


  rightButton.css("left", '89vw');
  leftButton.css("left", '-59vw');


  $(window).resize(function(){
    windowWidth = $(window).width();
    rightButton.css("left", '89vw');
    leftButton.css("left", '-59vw');

  });

  rightButton.on('mousedown', function(){
    $('.sshow_div').flickity( 'next');
  });

  leftButton.on('mousedown', function(){
    $('.sshow_div').flickity( 'previous');
  });

  $('.sshow_div').on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
    slideCount = flickityData.selectedIndex;
    slideClicked();
  });
}

// var isStatic = 0 ;
// var picCenters = document.getElementsByClassName("pic-div");
//
// for (var i=0; i < picCenters.length; i++) {
//
//   picCenters[i].onmousedown = function () {
//     isStatic = 1;
//     console.log("hi");
//   }
//
//   picCenters[i].onmousemove = function () {
//     isStatic = 0;
//   }
//
//   picCenters[i].onmouseup = function () {
//     if ( isStatic ) {
//       console.log("hi");
//     }
//   }
// }
//
// function picMouseDown(){
//   isStatic = 1;
//
// }
//
// function picMouseMove(){
//   isStatic = 0;
// }
//
// function picMouseUp(){
//   if ( isStatic ) {
//     console.log("hi");
//   }
// }

var easeInOutQuad = new SmoothScroll('[data-easing="easeInOutQuad"]', {easing: 'easeInOutQuad'});
