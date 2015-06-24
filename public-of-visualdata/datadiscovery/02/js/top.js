var ddTop = (function(){
if (!('console' in window)) {
    window.console = {};
    window.console.log = function(str){return str;};
}
var st=1;
var icon={"食料":"food","その他の消費支出":"other","住居":"house","教育":"edu","教養娯楽":"amuse","交通・通信":"traffic","保健医療":"health"};

var jsonData;
var singleData;
var familyData;
var isSingle=true;
var incomeType=1;
var regionType=1;

var graph2data;

var isJsonLoaded=false;

var scenesList=["leadImg2","s1MapArea","s1t1info2004","s1t2info2004","s1t3info12004","s2MapArea","s1t1Graph","s1t2Graph","s1t3Graph","s2t1info12005","s2t2info12005","s2t3Circle"];

(function($) {
	$(document).ready(onReady);
	$(window).scroll(onScroll);
	$(window).resize(onResize);
}(jQuery));

function onReady(){	
	xCheckSp();
	/*** JSONロード ***/
	$.getJSON("data/graph.json", onJsonLoaded);
	$.get('data/graph2.csv',onCsvLoaded);
	xSetupMpCode();
}

function xSetupMpCode(){
	$(".mpFadeIn1").css("opacity",0);
	$(".mpFadeIn2").css("opacity",0);
	$(".mpWipeIn2").css({"opacity":0,"top":-100+"%"});
	$(".mpWipeIn2").wrap("<div class='masker'></div>")
}



function xCheckSp(){
	var ua=navigator.userAgent;
	if(ua.indexOf('Android') > 0 || ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
		//SP
		$("#chartHolder1,#chartHolder2").css("display","none");
	}
}

/*** 収入別グラフ用データ ***/
function onJsonLoaded(json){
	isJsonLoaded=true;
	
	jsonData=json;
	
	/*** 収入別 ***/
	singleData=jsonData[0].singleData;
	familyData=jsonData[0].familyData;
	
	var type=1;
	xSetGraph("s05_graph1",singleData,type);
	
	/*** 収入ナビ設定 ***/
	$("#incomeNavi ul li").on("click",onIncomeNaviClick);
	$("#section2").css("border-left","#57c8d4 solid 1px");
	
	/*** 単身・世帯切替え ***/
	$("#s05_graph1 .g1select .type1").on("click",onG1Type1Click);
	$("#s05_graph1 .g1select .type2").on("click",onG1Type2Click);
}

/*** 年収別ナビクリック ***/
function onIncomeNaviClick(){
	incomeType=$(this).attr("id").split("section")[1];
	$("#incomeNavi ul li").removeClass("selected");
	$("#incomeNavi ul li").css({"border-top":"#8f9396 solid 2px","border-bottom":"#8f9396 solid 2px","border-right":"#8f9396 solid 1px","border-left":"#8f9396 solid 1px",});
	$("#incomeNavi ul li:first-child").css({"border-left":"#8f9396 solid 2px"});
	$("#incomeNavi ul li:last-child").css({"border-right":"#8f9396 solid 2px"});
	$(this).addClass("selected");
	if(incomeType==1){
		$("#section2").css("border-left","#57c8d4 solid 1px");
	}else if(incomeType==2){
		$("#section1").css("border-right","#57c8d4 solid 1px");
		$("#section3").css("border-left","#57c8d4 solid 1px");
	}else if(incomeType==3){
		$("#section2").css("border-right","#57c8d4 solid 1px");
		$("#section4").css("border-left","#57c8d4 solid 1px");
	}else if(incomeType==4){
		$("#section3").css("border-right","#57c8d4 solid 1px");
		$("#section5").css("border-left","#57c8d4 solid 1px");
	}else if(incomeType==5){
		$("#section4").css("border-right","#57c8d4 solid 1px");
	}
	if(isSingle){
		xSetGraph("s05_graph1",singleData,incomeType);
	}else{
		xSetGraph("s05_graph1",familyData,incomeType);
	}
}

/*** 年収別 単身クリック ***/
function onG1Type1Click(){
	isSingle=true;
	$("#section1").text("300万円未満");
	$("#section2").text("300万円台");
	$("#section3").text("400万円台");
	$("#section4").text("500万円台");
	$("#section5").text("600万円台");
	xSetGraph("s05_graph1",singleData,incomeType);
	$("#s05_graph1 .g1select .type1").addClass("selected");
	$("#s05_graph1 .g1select .type2").removeClass("selected");
}

/*** 年収別 2人以上世帯クリック ***/
function onG1Type2Click(){
	isSingle=false;
	$("#section1").text("300万円未満");
	$("#section2").text("300-600万円");
	$("#section3").text("600-1000万円");
	$("#section4").text("1000-1500万円");
	$("#section5").text("1500万円以上");
	xSetGraph("s05_graph1",familyData,incomeType);
	$("#s05_graph1 .g1select .type1").removeClass("selected");
	$("#s05_graph1 .g1select .type2").addClass("selected");
}


/*** 横棒グラフをセットします ***/
function xSetGraph($tgtid,$data,$type){
	var nMin=9999999999;
	var nMax=0;
	for(var i=0;i<$data.length;i++){
		var obj=$data[i];
		var v1=obj[1].replace(/,/g,"");
		var v2=obj[2].replace(/,/g,"");
		var v3=obj[3].replace(/,/g,"");
		var v4=obj[4].replace(/,/g,"");
		var v5=obj[5].replace(/,/g,"");
		nMin=Math.min(nMin,v1);
		nMin=Math.min(nMin,v2);
		nMin=Math.min(nMin,v3);
		nMin=Math.min(nMin,v4);
		nMin=Math.min(nMin,v5);
		nMax=Math.max(nMax,v1);
		nMax=Math.max(nMax,v2);
		nMax=Math.max(nMax,v3);
		nMax=Math.max(nMax,v4);
		nMax=Math.max(nMax,v5);
	}
	
	for(var i=1;i<=$data.length;i++){
		var obj=$data[i-1];
		$("#"+$tgtid+" .g"+i+" .name").text(obj[0]);
		$("#"+$tgtid+" .g"+i+" .value").text(obj[$type]);
		$("#"+$tgtid+" .g"+i+" .flag").attr("src","img/icon_"+icon[obj[0]]+".png");
		var point=obj[$type].replace(/,/g,"")-nMin;
		var per=Math.round(point/(nMax-nMin)*100)/100;
		$("#"+$tgtid+" .g"+i+" .plane").stop(false,false).delay(100*i).animate({"left":-75+75*per+"%"},800,"easeInOutExpo");
		if(per>0.5){
			$("#"+$tgtid+" .g"+i+" .value").stop(false,false).delay(100*i).animate({"left":75-(85-70*per)+"%"},800,"easeInOutExpo");
		}else{
			$("#"+$tgtid+" .g"+i+" .value").stop(false,false).delay(100*i).animate({"left":85-(55-75*per)+"%"},800,"easeInOutExpo");
		}
	}
}

/*** 地域別データ ***/
function onCsvLoaded(data){
		//Ajax後の処理
		graph2data=data.split("\r\n");		
		$("#region_list li a").css("display","none");
		$(".area3").css("display","block");
		$("#area_list li a").on("click",onAreaClick);
		$("#region_list li a").on("click",onRegionClick);
		
		xSetGraph2("s05_graph2",xGetRegionData("東京都区部"));
}

function onAreaClick(){
	$("#area_name").text($(this).text());
	var tgtArea=$(this).attr("id");
	$("#region_list li a").css("display","none");
	$("."+tgtArea).css("display","block");
	
}
function onRegionClick(){
	var tgtRegion=$(this).text();
	$("#region_name").text(tgtRegion);
	xSetGraph2("s05_graph2",xGetRegionData(tgtRegion));
}

/*** 地域別データ抽出 ***/
function xGetRegionData($region){
	var tmp=[];
	for(var i=0;i<graph2data.length;i++){
		var line=graph2data[i].split(',');
		if(line[1]==$region){
			var line_1=graph2data[i].split(',"')[0].split(",");
			var line_2=graph2data[i].split(',"')[1].replace('"','');
			line_1.push(line_2);
			tmp.push(line_1);
		}
	}
	return tmp;
}

/*** 横棒グラフをセットします ***/
function xSetGraph2($tgtid,$data){
	var nMin=9999999999;
	var nMax=0;
	for(var i=0;i<$data.length;i++){
		var obj=$data[i];
		var v1=obj[4].replace(/,/g,"");
		nMin=Math.min(nMin,v1);
		nMax=Math.max(nMax,v1);
	}
	
	for(var i=1;i<=$data.length;i++){
		var obj=$data[i-1];
		$("#"+$tgtid+" .g"+i+" .name").text(obj[3]);
		$("#"+$tgtid+" .g"+i+" .value").text(obj[4]);
		$("#"+$tgtid+" .g"+i+" .flag").attr("src","img/icon_"+icon[obj[3]]+".png");
		var point=obj[4].replace(/,/g,"")-nMin;
		var per=Math.round(point/(nMax-nMin)*100)/100;
		$("#"+$tgtid+" .g"+i+" .plane").stop(false,false).delay(100*i).animate({"left":-75+75*per+"%"},800,"easeInOutExpo");
		if(per>0.5){
			$("#"+$tgtid+" .g"+i+" .value").stop(false,false).delay(100*i).animate({"left":75-(85-70*per)+"%"},800,"easeInOutExpo");
		}else{
			$("#"+$tgtid+" .g"+i+" .value").stop(false,false).delay(100*i).animate({"left":85-(55-75*per)+"%"},800,"easeInOutExpo");
		}
	}
}


function onScroll(){
	st = $(window).scrollTop();
	var windowHeight=$(window).height();
	var openY=st+windowHeight*0.5;
	for(var i=0;i<=scenesList.length;i++){
		var tgtArea=$("#"+scenesList[i]);
		if(tgtArea.attr("id")!==undefined){
			var tgtY=tgtArea.offset().top;
			if(tgtY<openY&&tgtArea.css("opacity")=="0"){
				eval("xPlay_"+tgtArea.attr("id"))(tgtArea);
			}
		}
	}

	$(".mpFadeIn1").each(function(i) {
		if($(this).offset().top<openY&&$(this).css("opacity")=="0"){
			$(this).animate({"opacity":1},800,"easeOutExpo");
		}
	});

	$(".mpFadeIn2").each(function(i) {
		if($(this).offset().top<openY&&$(this).css("opacity")=="0"){
			$(this).delay(600).animate({"opacity":1},800,"linear");
		}
	});
	$(".mpWipeIn2").each(function(i) {
		if($(this).offset().top<openY&&$(this).css("opacity")=="0"){
			$(this).css("opacity",1);
			$(this).delay(600).animate({"top":0+"%"},800,"linear");
			$(this).parent().delay(600).animate({"top":0+"%"},800,"linear");
		}
	});
}


function onResize(){
	var wid=$("body").width();
}

return{
	st:st
}

}());
