

function imageJustSize() {
  var title = document.getElementById('title');
  var winH = window.innerHeight;
  title.style.height = winH + 'px';
}


function imageJustSize() {
  var title = document.getElementById('title');
  var winH = window.innerHeight;
  title.style.height = winH + 'px';
}


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
    prepReading();
};

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

picTriggerData = [
  [[[125,635],[651,754],[["量えっぐ", "こんな並んでんの見たこと無い", "並ぶの苦手専門家" , "みむら"],["鉄だ！", "食べて鉄分補給しようや", "鉄分足りてない学", "みむら"]]], [[650,50],[750,750],[["でかーーい！", "でっっっっっか", "小さいマン", "みむら"]]]],
  [[[650,515],[698,528],[["ここにCD入れるん？", "マジか　てかWindows 10やし", "無知専門家" , "みむら"]]], [[22,335],[61,432],[["高ーーーーい！", "背たっっっっっか", "小さいマン", "みむら"]]]],
  [[[490,226],[610,354],[["エー！", "これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！これもしかしてAやん！", "行数テスト", "みむら"]]]],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

//スライド下の点の生成
for(let i=0; i<11; i++){
  var slidePointClone = slidePoint.clone().appendTo("#points");
  slidePointClone.css("background-color", "gray");
  slidePointClone.css("position", "absolute");
  slidePointClone.css("left", 40*i);
  slidePointDiv.css("width",20*21+"px");
  slidePoints.push(slidePointClone);
  slidePoints[0].css("background-color","white");
}
slidePoint.remove();


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

  $("#comment-box").fadeOut().queue(function(){
    this.remove();
  });


}

function triggerClicked(e){

  $("#comment-box").remove();


  var obj = $(event.target);
  var id = obj.attr('js-id');
  var div = $('<div id="comment-box"></div>');
  var trigname = dbPicRefs["p" + slideCount]["trig" + id]["trigname"];
  var trignameDiv = $('<div class="comment-trigname"></div>').appendTo(div);
  var trignameP =  $('<p></p>').html(trigname).appendTo(trignameDiv);
  $("body").append(div);
  div.fadeIn();
  mousePos = [e.clientX, e.clientY];
  if(mousePos[1] > window.innerHeight / 2){
    div.css('top', mousePos[1] - 300);
  }else{
    div.css('top', mousePos[1]);
  }

  if(mousePos[0] > window.innerWidth / 2){
    div.css('left', mousePos[0] - (100 + 500));
  }else{
    div.css('left', mousePos[0] + 100);
  }
  for(let i=0; dbPicRefs["p" + slideCount]["trig" + id]["com"+i]!=null; i++){
    var newdiv = $('<div class="comment-div"></div>').appendTo("#comment-box");
    newdiv.attr("js-com-id",String(i));
    newdiv.attr("js-trig-id",String(id));
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
  var like = dbPicRefs["p" + slideCount]["trig" + trigId]["com"+comId]["like"];

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


  picRef.child("p" + slideCount+"/"+"trig"+trigId+"/com"+comId).update({
    "like": like
  });
  div.find(".comment-like-count").html(like);
  //console.log(dbPicRefs["p" + slideCount]["trig" + trigId]["com"+comId]["like"]);


}
