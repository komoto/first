var ddTop = (function(){
if (!('console' in window)) {
    window.console = {};
    window.console.log = function(str){return str;};
}
var st=1;
var flag={"中国":"cn","韓国":"kr","ベトナム":"vn","インド":"in","フィリピン":"ph","米国":"us",
"ネパール":"np","タイ":"th","パキスタン":"pk","スリランカ":"lk","インドネシア":"id"};
var g1Data;
var jsonData;
var g1Time=1;
var g2Time=1;
var g3Time=1;
var g1t1Data;
var g1t2Data;
var g2Data;
var g3t1Data;
var g3t2Data;

var isJsonLoaded=false;

var scenesList=["leadMap2","s1MapArea","s1t1info2004","s1t2info2004","s1t3info12004","s2MapArea","s1t1Graph","s1t2Graph","s1t3Graph","s2t1info12005","s2t2info12005","s2t3Circle"];

(function($) {
	$(document).ready(onReady);
	$(window).scroll(onScroll);
	$(window).resize(onResize);
}(jQuery));

function onReady(){	
	console.log("onReady start!");
	xCheckSp();
	/*** JSONロード ***/
	$.getJSON("data/graph.json", onJsonLoaded);
}

function xCheckSp(){
	var ua=navigator.userAgent;
	if(ua.indexOf('Android') > 0 || ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
		//SP
		$("#chartHolder1,#chartHolder2").css("display","none");
	}
}

function onJsonLoaded(json){
	isJsonLoaded=true;
	
	jsonData=json;
	g1t1Data=jsonData[0].g1t1Data;
	g1t2Data=jsonData[0].g1t2Data;
	g2Data=jsonData[0].g2Data;
	g3t1Data=jsonData[0].g3t1Data;
	g3t2Data=jsonData[0].g3t2Data;
	
	$("#s1t1Graph .type1").on("click",onS1t1Type1Click);
	$("#s1t1Graph .type2").on("click",onS1t1Type2Click);
	$("#s1t1Graph .time1").on("click",onS1t1Time1Click);
	$("#s1t1Graph .time2").on("click",onS1t1Time2Click);
	
	$("#s1t2Graph .time1").on("click",onS1t2Time1Click);
	$("#s1t2Graph .time2").on("click",onS1t2Time2Click);
	
	$("#s1t3Graph .type1").on("click",onS1t3Type1Click);
	$("#s1t3Graph .type2").on("click",onS1t3Type2Click);
	$("#s1t3Graph .time1").on("click",onS1t3Time1Click);
	$("#s1t3Graph .time2").on("click",onS1t3Time2Click);
	
	onS1t1Type1Click();
	onS1t2Time1Click()
	onS1t3Type1Click()
}

function onS1t1Type1Click(){
	g1Data=g1t1Data;
	xSetGraph("s1t1Graph",g1Data,g1Time);
	$("#s1t1Graph .type1").addClass("selected");
	$("#s1t1Graph .type2").removeClass("selected");
}
function onS1t1Type2Click(){
	g1Data=g1t2Data;
	xSetGraph("s1t1Graph",g1Data,g1Time);
	$("#s1t1Graph .type1").removeClass("selected");
	$("#s1t1Graph .type2").addClass("selected");
}
function onS1t1Time1Click(){
	g1Time=1;
	xSetGraph("s1t1Graph",g1Data,1);
	$("#s1t1Graph .time1").addClass("selected");
	$("#s1t1Graph .time2").removeClass("selected");
}
function onS1t1Time2Click(){
	g1Time=2;
	xSetGraph("s1t1Graph",g1Data,2);
	$("#s1t1Graph .time1").removeClass("selected");
	$("#s1t1Graph .time2").addClass("selected");
}

function onS1t2Time1Click(){
	g2Time=1;
	xSetGraph("s1t2Graph",g2Data,g2Time);
	$("#s1t2Graph .time1").addClass("selected");
	$("#s1t2Graph .time2").removeClass("selected");
}
function onS1t2Time2Click(){
	g2Time=2;
	xSetGraph("s1t2Graph",g2Data,g2Time);
	$("#s1t2Graph .time1").removeClass("selected");
	$("#s1t2Graph .time2").addClass("selected");
}

function onS1t3Type1Click(){
	g3Data=g3t1Data;
	xSetGraph("s1t3Graph",g3Data,g3Time);
	$("#s1t3Graph .type1").addClass("selected");
	$("#s1t3Graph .type2").removeClass("selected");
	$("#s1t3Graph .time1 span").text("2004年");
}
function onS1t3Type2Click(){
	g3Data=g3t2Data;
	xSetGraph("s1t3Graph",g3Data,g3Time);
	$("#s1t3Graph .type1").removeClass("selected");
	$("#s1t3Graph .type2").addClass("selected");
	$("#s1t3Graph .time1 span").text("2010年");
}
function onS1t3Time1Click(){
	g3Time=1;
	xSetGraph("s1t3Graph",g3Data,g3Time);
	$("#s1t3Graph .time1").addClass("selected");
	$("#s1t3Graph .time2").removeClass("selected");
}
function onS1t3Time2Click(){
	g3Time=2;
	xSetGraph("s1t3Graph",g3Data,g3Time);
	$("#s1t3Graph .time1").removeClass("selected");
	$("#s1t3Graph .time2").addClass("selected");
}

function xSetGraph($tgtid,$data,$type){
	var nMin=9999999999;
	var nMax=0;
	for(var i=0;i<$data.length;i++){
		var obj=$data[i];
		var v1=obj[1].replace(",","");
		var v2=obj[2].replace(",","");
		nMin=Math.min(nMin,v1);
		nMin=Math.min(nMin,v2);
		nMax=Math.max(nMax,v1);
		nMax=Math.max(nMax,v2);
	}
	
	for(var i=1;i<=$data.length;i++){
		var obj=$data[i-1];
		$("#"+$tgtid+" .g"+i+" .name").text(obj[0]);
		$("#"+$tgtid+" .g"+i+" .value").text(obj[$type]);
		$("#"+$tgtid+" .g"+i+" .flag").attr("src","img/flag_"+flag[obj[0]]+".png");
		var point=obj[$type].replace(",","")-nMin;
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
}

function xPlay_leadMap2($tgtArea){
	$tgtArea.animate({"opacity":"1"},800);
}
function xPlay_s1MapArea($tgtArea){
	$tgtArea.animate({"opacity":"1"},400);
	$("#s1Lead").delay(400).animate({"opacity":"1"},800);
	$("#s1GraphMask").delay(800).animate({"left":0+"%"},1000);
	$("#s1Graph").delay(800).animate({"left":0+"%"},1000);
}
function xPlay_s1t1info2004($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s1t1info2014Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s1t1info2014").delay(800).animate({"top":0+"%"},800,"linear");
}
function xPlay_s1t2info2004($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s1t2info2014Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s1t2info2014").delay(800).animate({"top":0+"%"},800,"linear");
}
function xPlay_s1t3info12004($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s1t3info12014Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s1t3info12014").delay(800).animate({"top":0+"%"},800,"linear");
	
	$("#s1t3info22010").animate({"opacity":"1"},600);
	$("#s1t3info22014Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s1t3info22014").delay(800).animate({"top":0+"%"},800,"linear");
}
function xPlay_s2MapArea($tgtArea){
	$tgtArea.animate({"opacity":"1"},400);
	$("#s2Lead").delay(400).animate({"opacity":"1"},800);
	$("#s2GraphMask").delay(800).animate({"left":0+"%"},1000);
	$("#s2Graph").delay(800).animate({"left":0+"%"},1000);
}
function xPlay_s1t1Graph($tgtArea){
	if(isJsonLoaded){
		$tgtArea.animate({"opacity":"1"},600);
		setTimeout("ddTop.onS1t1Time2Click()",800);
	}
}
function xPlay_s1t2Graph($tgtArea){
	if(isJsonLoaded){
		$tgtArea.animate({"opacity":"1"},600);
		setTimeout("ddTop.onS1t2Time2Click()",800);
	}
}
function xPlay_s1t3Graph($tgtArea){
	if(isJsonLoaded){
		$tgtArea.animate({"opacity":"1"},600);
		setTimeout("ddTop.onS1t3Time2Click()",800);
	}
}

function xPlay_s2t1info12005($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s2t1info12013Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t1info12013").delay(800).animate({"top":0+"%"},800,"linear");
	
	$("#s2t1info22005").animate({"opacity":"1"},600);
	$("#s2t1info22013Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t1info22013").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t1info3").delay(2200).animate({"opacity":1},800,"linear");
}

function xPlay_s2t2info12005($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s2t2info12013Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t2info12013").delay(800).animate({"top":0+"%"},800,"linear");
	
	$("#s2t2info22005").animate({"opacity":"1"},600);
	$("#s2t2info22013Mask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t2info22013").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t2info3").delay(2200).animate({"opacity":1},800,"linear");
}

function xPlay_s2t3Circle($tgtArea){
	$tgtArea.animate({"opacity":"1"},600);
	$("#s2t3infoOvSpMask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t3infoOvPcMask").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t3infoOvSp").delay(800).animate({"top":0+"%"},800,"linear");
	$("#s2t3infoOvPc").delay(800).animate({"top":0+"%"},800,"linear");
}

function onResize(){
	var wid=$("body").width();
}

return{
	st:st,
	onS1t1Time2Click:onS1t1Time2Click,
	onS1t2Time2Click:onS1t2Time2Click,
	onS1t3Time2Click:onS1t3Time2Click
}

}());
