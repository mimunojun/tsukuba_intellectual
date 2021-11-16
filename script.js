
//
// function imageJustSize() {
//   var title = document.getElementById('title');
//   var winH = window.innerHeight;
//   title.style.height = winH + 'px';
// }


let images = new Array();
let slideImg = new Array("img/00.jpg","img/02.jpeg","img/03.jpeg","img/06.jpg","img/07.jpg","img/08.jpg",);
window.onload = function(){

    // 画像プリロード
    for (i = 0; i < images.length; i++){
        let img = document.createElement('img');
        img.src = slideImg[i];
    }

}




// imageJustSize();


// window.addEventListener('resize', imageJustSize);

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

  if(loadProgress === 100){
    setTimeout(() =>{
      $("#load-div").fadeOut("slow");
      if($(window).width() >= 600){
        $("#nav_bar").fadeIn();
        let hSize = $(window).height();
        $('.cover').height(hSize); // アドレスバーを除いたサイズを付与
      }else{
        $('#title').height($(window).height());
        $('.scroll_message').hide();

      }
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

let slideShow = $("#sshow");
let slidePointDiv = $("#points")
let slidePoint = $(".slide-point");
let modalOverlay = $('<div id="modal-overlay" href="javascript:" onclick="bgClicked();"></div>').appendTo("body");
let picTriggers = [];
let dbPicRefs = [];
let slidePoints = [];
let slideCount = getParam('sc');
let mainPic;
let picDiv;
let picRef;
let picSizeRatio;
let counter = 0;
let counterP;

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
//   let slidePointClone = slidePoint.clone().appendTo("#points");
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
  if(slideCount === -1) slideCount = 10;
  slideShow.attr("src", slideImg[slideCount]);
  slidePoints[slideCount].css("background-color","white");
}

function slideRight(){
  slidePoints[slideCount].css("background-color","gray");
  slideCount += 1;
  if(slideCount === 11) slideCount = 0;
  slideShow.attr("src", slideImg[slideCount]);
  slidePoints[slideCount].css("background-color","white");
}

function slideClicked(){
  picDiv = $('<div id="real-pic-div"></div').appendTo("body");
  mainPic = $('<img id="main-pic" onclick="pictureClicked();">').appendTo(picDiv);
  let image = new Image();
  image.src = slideImg[slideCount];
  let picAspRatio = image.width/image.height;
  mainPic.fadeIn("fast").queue(function(){
    if($(window).width() < 600){
      picSizeRatio = $("#main-pic").css("height").replace("px","") / image.height;
      // console.log(picSizeRatio);
      makePicDiv(picAspRatio);
      loadTrigger(picSizeRatio);
      showTrigger(picSizeRatio);
    }

  });
  if($(window).width() >= 600){
    picSizeRatio = $("#main-pic").css("height").replace("px","") / image.height;
  }


  image.onload = function(){
    setTimeout(() =>{
      picSizeRatio = $("#main-pic").css("height").replace("px","") / image.height;

      mainPic.attr("src", slideImg[slideCount]);

      modalOverlay.fadeIn("slow");
      picDiv.fadeIn();

      if($(window).width() >= 1200){
        let closeButton = $('<img class="close-button close-button-right" src=img/times-white.png>').appendTo($("#real-pic-div"));
        closeButton.on('mousedown', function(){
          bgClicked();
        });
      }else{
        let closeButton = $('<img class="close-button" src=img/times.png>').appendTo($("#real-pic-div"));
        closeButton.on('mousedown', function(){
          bgClicked();
        });
      }

      let miscButton = $('<img class="misc-button" src=img/misc-icon.png>').appendTo($("#real-pic-div"));
      miscButton.on('mousedown', function(){
        miscButtonClicked();
      });

      let credit = "撮影: " + dbPicRefs["p" + slideCount]['misc']['credit'];
      let creditP = $('<p class="pic-credit"></p>').html(credit).appendTo($("#real-pic-div"));

      let counterDiv = $('<div class="counter-box"></div>').appendTo($("#real-pic-div"));
      let trigerNum = Object.keys(dbPicRefs['p'+slideCount]).length - 1;
      counterP = $('<p class="white"></p>').html('見つけた視点: ' + counter+'/'+trigerNum).appendTo(counterDiv);
      counterDiv.fadeIn();

      let bottomDiv = $('<div class="bottom-div"></div>').appendTo($("#real-pic-div"));

      makePicDiv(picAspRatio);
      loadTrigger(picSizeRatio);
      showTrigger(picSizeRatio);

      $("body").addClass("no-vscroll");
    }, 0);
  }

}

function counterUpdate(){
  let trigerNum = Object.keys(dbPicRefs['p'+slideCount]).length - 1;
  counter += 1;
  counterP.html('見つけた視点: ' + counter+'/'+trigerNum);
}

$(window).resize(function(){
  let image = new Image();
  image.src = slideImg[slideCount];
  picSizeRatio = $("#main-pic").css("height").replace("px","") / image.height;
  reposTrigger(picSizeRatio);
  makePicDiv(image.width/image.height);
});

function bgClicked(){

  $("#comment-box").fadeOut().queue(function(){
    this.remove();

  });

  modalOverlay.fadeOut("slow");
  $(".pic-credit").fadeOut().queue(function(){
    this.remove();
  });
  mainPic.fadeOut();
  picDiv.fadeOut().queue();

  $("body").removeClass("no-vscroll");
  removeTrigger();
  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });

  counter = 0;

  $("#real-pic-div").fadeOut().queue(function(){
    this.remove();
  });

}

function loadTrigger(picSizeRatio){
  for(let i=0; dbPicRefs["p" + slideCount]["trig"+i]!=null; i++){


    let x1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[0];
    let y1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[1];
    let x2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[2];
    let y2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[3];

    let cssTop = y1 * picSizeRatio;
    let cssLeft = x1 * picSizeRatio;
    let cssWidth = (x2-x1) * picSizeRatio;
    let cssHeight = (y2-y1) * picSizeRatio;

    let newTrigger = $('<div href="javascript:" onclick="triggerClicked(event);" class="pic-trigger" clicked="false"></div>');
    newTrigger.css('top',cssTop);
    newTrigger.css('left',cssLeft);
    newTrigger.css('width',cssWidth);
    newTrigger.css('height',cssHeight);

    $("#real-pic-div").append(newTrigger); //htmlへの組み込み
    picTriggers.push(newTrigger);     //jsで扱う配列への組み込み

    newTrigger.attr('js-id',String(i));
    // console.log(String(slideCount).padStart(2,'0') + String(i));
  }
}

function reposTrigger(picSizeRatio){
  for(let i=0; i<picTriggers.length; i++){

    let x1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[0];
    let y1 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[1];
    let x2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[2];
    let y2 = dbPicRefs["p" + slideCount]["trig"+i].trigpos.split(',')[3];

    let cssTop = y1 * picSizeRatio;
    let cssLeft = x1 * picSizeRatio;
    let cssWidth = (x2-x1) * picSizeRatio;
    let cssHeight = (y2-y1) * picSizeRatio;

    picTriggers[i].css('top',cssTop);
    picTriggers[i].css('left',cssLeft);
    picTriggers[i].css('width',cssWidth);
    picTriggers[i].css('height',cssHeight);

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

  let height = $("#main-pic").css("height").replace("px","");
  let width = picAspRatio * height;

  picDiv.css("width", width+'px');
  picDiv.css("height", height+'px');

}

function pictureClicked(){
  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });

}

function triggerClicked(e){

  $(".comment-box").remove();


  let obj = $(event.target);
  let id = obj.attr('js-id');
  let div = $('<div class="comment-box"></div>');
  div.attr('trig-id', id);
  //div.on('mousedown.commentBox', mainCommentBoxClicked);
  let trigname = dbPicRefs["p" + slideCount]["trig" + id]["trigname"];
  let trignameDiv = $('<div class="comment-trigname"></div>').appendTo(div);
  let trignameP =  $('<p></p>').html(trigname).appendTo(trignameDiv);
  $("body").append(div);
  div.fadeIn();
  mousePos = [e.clientX, e.clientY];

  if($(window).width() >= 600){
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
  }else{
    div.css('top', '50%');
    div.css('left', '50%');
    div.css('transform','translate(-50%, -50%)');

    let closeButton = $('<img class="phone-close" src="img/times-white.png">').appendTo(div);
    closeButton.on('mousedown', function(){
      pictureClicked();
    });

  }

  for(let i=0; dbPicRefs["p" + slideCount]["trig" + id]["com"+i]!=null; i++){
    let newdiv = $('<div class="comment-div"></div>').appendTo(div);
    newdiv.attr("js-com-id",String(i));
    newdiv.attr("js-trig-id",String(id));
    newdiv.attr("com-from","intellectual");
    let title = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["title"];
    let text = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["text"];
    let speciality = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["speciality"];
    let name = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["name"];
    let like = dbPicRefs["p" + slideCount]["trig" + id]["com"+i]["like"];

    let specialityP = $('<p class="comment-speciality"></p>').html(speciality).appendTo(newdiv);
    let nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);

    let titleP = $('<p class="comment-title"></p>').html(title).appendTo(newdiv);
    let textP = $('<p class="comment-text"></p>').html(text).appendTo(newdiv);

    let likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    likeButton.on('mousedown', likeClicked);
    let likeCount =  $('<span class ="comment-like-count"></span>').html("  "+like).appendTo(newdiv);
  }

  for(let i=0; dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]!=null; i++){
    let newdiv = $('<div class="comment-div"></div>').appendTo(div);
    newdiv.attr("js-com-id",String(i));
    newdiv.attr("js-trig-id",String(id));
    newdiv.attr("com-from","user");
    let title = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["title"];
    let text = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["text"];
    let speciality = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["speciality"];
    let name = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["name"];
    let like = dbPicRefs["p" + slideCount]["trig" + id]["usercom"+i]["like"];

    let specialityP = $('<p class="comment-speciality com-from-user"></p>').html(speciality).appendTo(newdiv);
    let nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);

    let titleP = $('<p class="comment-title com-from-user"></p>').html(title).appendTo(newdiv);
    let textP = $('<p class="comment-text"></p>').html(text).appendTo(newdiv);

    let likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    likeButton.on('mousedown', likeClicked);
    let likeCount =  $('<span class ="comment-like-count"></span>').html("  "+like).appendTo(newdiv);
  }

  if(obj.attr('clicked')==='false'){
    counterUpdate();
    obj.attr('clicked', 'true');
  }



  // let newComButton = $('<button class="new-com-button">新たな視点を投稿する</button>').appendTo(div);
  // newComButton.on('mousedown', newComButtonClicked);

}

function miscButtonClicked(){

    $(".comment-box").remove();


    let obj = $(event.target);
    let div = $('<div class="comment-box misc-box"></div>').appendTo("#real-pic-div");
    //div.on('mousedown.commentBox', mainCommentBoxClicked);
    let credit = dbPicRefs["p" + slideCount]['misc']['credit'];
    let date = dbPicRefs["p" + slideCount]['misc']['date'];
    let place =  dbPicRefs["p" + slideCount]['misc']['place'];
    let triggerNum = Object.keys(dbPicRefs['p'+slideCount]).length - 1;


    let creditP = $('<p class="white misc-text"></p>').html("撮影: " +  credit).appendTo(div);
    let dateP = $('<p class="white misc-text"></p>').html("撮影日: " + date).appendTo(div);
    let placeP = $('<p class="white misc-text"></p>').html("場所: " + place).appendTo(div);
    let shareButton = $('<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>').appendTo(div);
    shareButton.attr('data-url', 'https://nuink.github.io/TisikijinWEB/'+'?sc='+slideCount);
    shareButton.attr('data-text', '筑波大学の「'+place+'」の景色を見ています。専門家の視点を'+triggerNum+'個中'+counter+'個発見しました！')
    div.fadeIn();
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
        //console.log(dbPicRefs);

        //console.log(trig1);
    });
}

function likeClicked(){
  let target = $(event.target);
  let div = target.parent();
  let comId = div.attr("js-com-id");
  let trigId = div.attr("js-trig-id");
  let liked = target.attr("liked");
  let like;

  if(div.attr("com-from") === "intellectual"){
    like = dbPicRefs["p" + slideCount]["trig" + trigId]["com"+comId]["like"];
  }else{
    like = dbPicRefs["p" + slideCount]["trig" + trigId]["usercom"+comId]["like"];
  }

  if(liked === "false"){
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




  if(div.attr("com-from") === "intellectual"){
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
  let trigId = $(event.target).parent().attr('trig-id');
  let trigname = dbPicRefs["p" + slideCount]["trig" + trigId]["trigname"];
  let description_text = "あなたならこの"+trigname+"にどのような視点を与えますか。<b>あなたならではの視点</b>を書いてみてください。";
  let caution_text = [
    "<b>以下のいずれかにあてはまるコメントは禁止されています。</b>",
    "・第三者を攻撃するようなもの",
    "・公序良俗に反するもの",
    "・明らかに内容に意味が無いもの",
    "・その他不適切だと判断されるもの"
  ]
  if($('.new-com-div').length === 0){
    let div = $('<div class="comment-box new-com-div"></div>').appendTo("body");
    div.attr('trig-id', trigId);
    let title = $('<p class="new-com-title"></p>').html("新たな視点の投稿").appendTo(".new-com-div");
    let description = $('<p class="new-com-description"></p>').html(description_text).appendTo(".new-com-div");
    let cautionDiv = $('<div class="new-com-caution-div"></div>').appendTo(".new-com-div");
    for(let i=0; i<caution_text.length; i++){
      let caution = $('<p class="new-com-caution"></p>').html(caution_text[i]).appendTo(cautionDiv);
    }
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_speciality" type="text"/><label class="nice-label" >あなたを一言で表すと</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_name" type="text"/><label class="nice-label" >あなたのニックネーム</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><input class="nice-textbox" id="tb_title" type="text"/><label class="nice-label" >視点のタイトル</label></div>').appendTo(".new-com-div");
    $('<div class="nice-wrap"><textarea rows=5 class="nice-textbox" id="tb_comment" type="text"/><label class="nice-label" >どんな視点？</label></div>').appendTo(".new-com-div");

    let tb_speciality = $("#tb_speciality");
    let tb_name = $("#tb_name");
    let tb_title = $("#tb_title");
    let tb_comment = $("#tb_comment");

    $('.nice-textbox').blur(function() {

        if($(this).val().length === 0){
          $(this).parent().find(".nice-label").removeClass("focus");
        }
        else {  }
      })
      .focusin(function(e) {
        $(":focus").parent().find(".nice-label").addClass("focus");
      });

    $('label').on('mousedown', function(){
      $(this).parent().find(".nice-label").addClass("focus");
    });

    if($(window).width() < 600){
      let closeButton = $('<img class="phone-close" src="img/times-white.png">').appendTo(div);
      closeButton.on('mousedown', function(){
        pictureClicked();
      });
    }

    let submitButton = $('<button type="button" class="new-com-button new-com-submit">投稿<button>').appendTo(".new-com-div");

    submitButton.click(function(){
      if(tb_speciality.val().length * tb_name.val().length * tb_title.val().length * tb_comment.val().length != 0){
        let specialityTextFix = tb_speciality.val().replace(/</g, '＜').replace(/>/g, '＞').replace(/\r?\n/g, ' ');
        let nameTextFix = tb_name.val().replace(/</g, '＜').replace(/>/g, '＞').replace(/\r?\n/g, ' ');
        let titleTextFix = tb_title.val().replace(/</g, '＜').replace(/>/g, '＞').replace(/\r?\n/g, ' ');
        let commentTextFix = tb_comment.val().replace(/</g, '＜').replace(/>/g, '＞').replace(/\r?\n/g, '<br>');
        preSubmitButtonClicked(specialityTextFix, nameTextFix, titleTextFix, commentTextFix);
      }else{
        if(tb_speciality.val().length === 0){
          tb_speciality.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_speciality.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_name.val().length === 0){
          tb_name.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_name.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_title.val().length === 0){
          tb_title.css('background-color', 'var(--caution)');
          $(function(){
            setTimeout(function(){
              tb_title.css('background-color', '#fff');
            },500);
          });
        }
        if(tb_comment.val().length === 0){
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
    let confirmDiv = $('<div class="comment-box new-presubmitted-div"></div>').appendTo("body");
    let confirmTextP = $('<p class="new-com-description"></p>').html("あなたの視点は以下のように表示され、公開されます。").appendTo(confirmDiv);

    let newdiv = $('<div class="comment-div"></div>').appendTo(confirmDiv);
    let specialityP = $('<p class="comment-speciality com-from-user"></p>').html(speciality).appendTo(newdiv);
    let nameP = $('<p class="comment-name"></p>').html(name).appendTo(newdiv);
    let titleP = $('<p class="comment-title com-from-user"></p>').html(title).appendTo(newdiv);
    let textP = $('<p class="comment-text"></p>').html(comment).appendTo(newdiv);

    let likeButton =  $('<i class="fas fa-thumbs-up comment-like-button" href="javascript:" liked="false"></i>').appendTo(newdiv);
    let likeCount =  $('<span class ="comment-like-count"></span>').html(" 0").appendTo(newdiv);

    let confirmButton = $('<button class="new-com-button new-com-presubmit">確認</button>').appendTo(confirmDiv);
    let cancelButton = $('<p class="new-com-presubmit-cancel">キャンセル</p>').appendTo(confirmDiv);

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


}

function submitButtonClicked(speciality, name, title, comment){
  let picId = slideCount;
  let trigId = $(".new-com-div").attr('trig-id');
  let userComNum = dbPicRefs["p" + slideCount]["trig" + trigId]["userComNum"];


  $(".comment-box").fadeOut().queue(function(){
    this.remove();
  });
  let div = $('<div class="comment-box new-submitted-div"></div>').appendTo("body");
  let text = $('<p class="new-submitted-text"></p>').html("投稿されました。").appendTo(".new-submitted-div");

  $(function(){
    setTimeout(function(){
      $(".comment-box").fadeOut().queue(function(){
        this.remove();
      });
    },2000);
  });
  // let commentNum = Object.keys(dbPicRefs["p" + slideCount]["trig" + trigId]).length - 3;


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
  let conceptDiv = $("#concept");
  let divHeight = conceptDiv.outerHeight(true);
  let howtoInputhere = $(".howto-inputhere");
  let button = $(event.target);

  if($(".howto-container").length === 0){
    button.html("歩き方を閉じる");
    let howtoContainer = $('<div class="container howto-container"></div>').appendTo(".howto-inputhere");
    let howtoContainer_1 = $('<div class="howto-container howto-container-1"></div>').appendTo(".howto-inputhere");
    let htc_0 = $('<div class="container"></div>').appendTo(howtoContainer_1);
    let htc_1 = $('<div class="container"></div>').appendTo(howtoContainer_1);
    let htc_2 = $('<div class="container"></div>').appendTo(howtoContainer_1);
    $('<h2 class="howto-title">歩き方</h2>').appendTo(howtoContainer);
    $('<p class="howto-h2">Step1　写真を選ぶ</p>').appendTo(htc_0);
    $('<p>全6枚の筑波大学構内の写真から、視点をみたいものを選んでください。</p>').appendTo(htc_0);
    $('<p>中には昔の筑波大学の様子を写したレアな写真も…？</p>').appendTo(htc_0);
    $('<p>撮影場所等の詳細情報は右下のボタンからチェックできます。</p>').appendTo(htc_0);
    $('<p class="howto-h2">Step2　知識人の視点を見る</p>').appendTo(htc_1);
    $('<p>様々な知識人の視点が写真のいたるところに隠されています。</p>').appendTo(htc_1);
    $('<p>クリックして個性豊かな視点を探してみてください。</p>').appendTo(htc_1);
    $('<p class="howto-h2">Step3　面白い視点には「いいね」を押そう</p>').appendTo(htc_2);
    $('<p>面白い視点を見つけたら、ぜひいいねボタンを押してください。</p>').appendTo(htc_2);
    // $('<p>知識人の着眼点に対する"あなたならでは"の視点も募集中！</p>').appendTo(htc_2);
    // $('<p>紫色が知識人の視点、オレンジ色がみなさんの視点になっています。</p>').appendTo(htc_2);


    let containerHeight = howtoContainer.outerHeight(true) + howtoContainer_1.outerHeight(true);

    howtoInputhere.css("height", "0");
    howtoContainer.fadeIn("slow");
    howtoInputhere.animate({height: containerHeight});
  }else{
    button.html("歩き方を見る");
    let howtoContainer = $(".howto-container");
    howtoContainer.fadeOut("slow").queue(function(){

    });;
    howtoInputhere.animate({height: 0}, function(){
      howtoContainer.remove();
    });
  }

}

function prepImages(){
  for(let i=0; i<slideImg.length; i++){
    let newImg = $('<img class="sshow" src="'+slideImg[i]+'">');
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
    initialIndex: getParam('sc'),
  }).data('flickity');

  addFlickity();
});

function prepSlideshow(){

  slideDiv = $("#sshow_div");
  let slideWidth = $(window).width()*0.75;
  let picCenterDiv = $('<div class="pic-div" id="pic-center"></div>').appendTo(slideDiv);
  let picRightDiv = $('<div class="pic-div" id="pic-right"></div>').appendTo(slideDiv);
  let picLeftDiv = $('<div class="pic-div" id="pic-left"></div>').appendTo(slideDiv);
  let picCenter = images[0].appendTo(picCenterDiv);
  let picRight = images[1].appendTo(picRightDiv);
  let picLeft = images[10].appendTo(picLeftDiv);


  let rightButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);
  let leftButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);

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
    let picNewDiv =  $('<div class="pic-div" id="pic-new"></div>').appendTo(slideDiv);
    let picNew = images[slideCountNormalize(slideCount+1)].appendTo(picNewDiv);
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

  // let centerWidth, leftWidth, rightWidth;
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
  //   let picNew = $('<img class="sshow">').appendTo(slideDiv);
  //   picNew.css("left", centerWidth + 30 + rightWidth + 30 + "px");
  //   picNew.attr("src", '');
  //   picNew.on('load', function(){
  //     centerWidth = $("#pic-center").width();
  //     leftWidth = $("#pic-left").width();
  //     rightWidth = $("#pic-right").width();
  //     console.log("rightWidth: ", rightWidth);
  //   });
  //   picNew.attr("src", slideImg[slideCountPlus]);
  //   let leftPosTarget = -(leftWidth+30+centerWidth)+"px";
  //   let centerPosTarget =  -(30+centerWidth)+"px";
  //   let rightPosTarget = "0px";
  //   let newPosTarget = centerWidth+30+"px";
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
  let rightButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);
  let leftButton = $('<div class="sshow-button"></div>').appendTo(slideDiv);


  rightButton.css("left", '79vw');
  leftButton.css("left", '-49vw');


  $(window).resize(function(){
    windowWidth = $(window).width();
    rightButton.css("left", '79vw');
    leftButton.css("left", '-49vw');

  });

  $(".pic-div").on({
    'mouseenter': function(){
      $($(".sshow")[flickityData.selectedIndex]).css("opacity","0.8");
    },
    'mouseleave': function(){
      $($(".sshow")[flickityData.selectedIndex]).css("opacity","1.0");
    },
    'mousedown': function(){
      $($(".sshow")[flickityData.selectedIndex]).css("opacity","1.0");
    }
  });

  rightButton.on({
    'mouseenter': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex + 1)]).css("opacity","0.8");
    },
    'mouseleave': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex + 1)]).css("opacity","1.0");
    },
    'mousedown': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex + 1)]).css("opacity","1.0");
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex + 2)]).css("opacity","0.8");
      $('.sshow_div').flickity( 'next');
    }
  });

  leftButton.on({
    'mouseenter': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex - 1)]).css("opacity","0.8");
    },
    'mouseleave': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex - 1)]).css("opacity","1.0");
    },
    'mousedown': function(){
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex - 1)]).css("opacity","1.0");
      $($(".sshow")[slideCountNormalize(flickityData.selectedIndex - 2)]).css("opacity","0.8");
      $('.sshow_div').flickity( 'previous');
    }
  });


  $('.sshow_div').on( 'staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
    slideCount = flickityData.selectedIndex;
    slideClicked();
  });
}

// let isStatic = 0 ;
// let picCenters = document.getElementsByClassName("pic-div");
//
// for (let i=0; i < picCenters.length; i++) {
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

let easeInOutQuad = new SmoothScroll('[data-easing="easeInOutQuad"]', {easing: 'easeInOutQuad'});

//responsive
$(window).on('load resize', function(){
  if($(window).width() >= 600){
    $("#nav_bar").show();
    $(".name_txt p").html("知識人と歩く筑波大学");
    $(".scroll_message").show();
  }else{
    $("#nav_bar").hide();
    $(".name_txt p").html("知識人と歩く<br>筑波大学");
    $(".scroll_message").show();
    let hamButton = $('<img class="ham-button" src=img/misc-icon.png>').appendTo($("#title"));
    hamButton.on('mousedown', function(){
      hamButtonClicked();
    });
  }
});

function hamButtonClicked(){
  let overlay = $('.ham-overlay');
  let closeButton = $('.phone-close.ham-close');
  overlay.fadeIn('slow');
  $('.ham-button').fadeOut('slow');
  $(".ham-menu").fadeIn('slow');

  closeButton.on('mousedown', function(){
    hamButtonClose();
  });

  $("body").addClass("no-vscroll");
}

function hamButtonClose(){
  $('.ham-overlay').fadeOut();
  $("body").removeClass("no-vscroll");
  $('.ham-button').fadeIn('slow');
  $(".ham-menu").fadeOut('slow');
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
