var Chart1 = (function(){
	
var st=1;
var csvData;
var allList;
var expendList=["全て"];
var cityList=["全て"];
var yearList=[];

var data1=[];

var w = 588;
var h = 382;
var svg;
var padding = 20; // グラフの余白
var xAxisPadding = 80; // x軸表示余白
var yAxisPadding = 60; // y軸表示余白

var selectedType="東京都区部";//選択都市
var selectedExpend="全て";//消費項目

var colorList=["#ffffff","#00bfd1","#ffff8f","#e7e800","#ff5c5e","#9bff80","#ff8630","#ffbb78","#84ff47","#4fd6c2","#ff8380","#8c7386","#ffb0e8","#a475ff","#abf2ff","#1381cf","#d8b6f7","#ff82d9","#c4997a","#ad6a5d","#6fb4d9"];
var is1st=true;
var tempAlpha;

(function($) {
  $(document).ready(onReady);
}(jQuery));

function onReady(){	
	xInitD3();
}

function xInitD3(){
	// SVG作成
	svg = d3.select("#result")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	//csv読み込み
	d3.csv("data/pc_data.csv", function(error, data) {
		csvData=data;
		  //項目　year,city,region,expend,amount
		  
		for(var i=0;i<csvData.length;i++){
			var row=csvData[i];
			var year=row['year'];
			var city=row['city'];
			var region=row['region'];
			var expend=row['expend'];
			var amount=row['amount'];
			
			/*** 消費項目リストアップ ***/
			var isMatch=false;
			for(var j=0;j<expendList.length;j++){
				var listedExpend=expendList[j];
				if(listedExpend==expend){
					isMatch=true;
					break;  
				}
			}
			if(isMatch==false){  
				expendList.push(expend);
				$("#chartHolder1 .c"+expendList.length+" .expendName").text(expend);
				$("#chartHolder1 .c"+expendList.length+" .ccolor").css("background-color",colorList[expendList.length-1]);
			}
			 
			/*** 県庁所在地リストアップ ***/
			isMatch=false;
			for(var k=0;k<cityList.length;k++){
				var listedCity=cityList[k];
				if(listedCity==city){
					isMatch=true;
					break;  
				}
			}
			if(isMatch==false){  
				cityList.push(city);
				//$("#chartHolder1 .q"+cityList.length).text(city);
			}
			 
			 /*** 年リストアップ ***/
			isMatch=false;
			for(var k=0;k<yearList.length;k++){
				var listedYear=yearList[k];
				if(listedYear==year){
					isMatch=true;
					break;  
				}
			}
			if(isMatch==false){  
				yearList.push(year);
			}
	
		}
		
		allList=[];
		for(var i=0;i<expendList.length;i++){
			for(var j=0;j<yearList.length;j++){
				var data = csvData.filter(function(row) {
					if(row['expend'] == expendList[i]&&row['year'] == yearList[j]){
						return true;
					}
				})
				var sum=0;
				var len=data.length;
				for(var k=0;k<len;k++){
					sum+=data[k].amount*1;	
				}
				var obj={"city":"全て","expend":expendList[i],"amount":sum,"year":yearList[j]};
				allList.push(obj);
			}
		}
		
		 // イベント設定
		 
		/*** プルダウンナビ設定 ***/
		$("#pc_area_list li a").on("click",onPcAreaClick);
		$("#pc_region_list li a").on("click",onPcRegionClick);
		$("#pc_region_list li a").css("display","none");
		$(".pc_area3").css("display","block");
		
		$("#chartHolder1 .cBtn").hover(
			function () {
					var num=$(this).attr("class").split(" c")[1];
					if($(this).css("opacity")<0.5){
						tempAlpha=0.0;
					}else{
						tempAlpha=1;
					}
					svg.selectAll(".c"+(num-1)+"_line")
					.attr("opacity",1)
					.attr("stroke-width", 3);
			  },
			  function () {			  	
					var num=$(this).attr("class").split(" c")[1];
					svg.selectAll(".c"+(num-1)+"_line")
					.attr("opacity",tempAlpha)
					.attr("stroke-width", 1);
			  }
			);
		  $("#chartHolder1 .cBtn").on("click",onExpendBtnClick);
		  
		for(var i=0;i<expendList.length;i++){
			var expend=expendList[i];
			xChangeGraph(csvData,i);
		 }
		 
		is1st=false;
	});
}

function onExpendBtnClick(){
	var num=$(this).attr("class").split(" c")[1];
	if(num==1){
		//全てON
		for(var i=0;i<expendList.length;i++){
			$("#chartHolder1 .expendList .c"+(i+1)).css("opacity",1);
			svg.selectAll(".c"+i+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
		}
		$("#chartHolder1 .expendList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
			tempAlpha=1;
		return;
	}
	var allOn=true; 
	for(var i=0;i<expendList.length;i++){
		var opa=$("#chartHolder1 .expendList .c"+(i+1)).css("opacity");
		if(opa!=1){
			allOn=false;
			break
		}
	}
	if(allOn){
		//全選択OFF
		for(var i=0;i<expendList.length;i++){
			if(i!=0){
				$("#chartHolder1 .expendList .c"+(i+1)).css("opacity",0.3);
			}
			svg.selectAll(".c"+i+"_line")
			.attr("opacity",0.0)
			.attr("stroke-width", 1);
		}
		$("#chartHolder1 .expendList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
	}else{
		var cur=$("#chartHolder1 .expendList .c"+num).css("opacity");
		if(cur==1){
			$("#chartHolder1 .expendList .c"+num).css("opacity",0.3);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",0.0)
			.attr("stroke-width", 1);
			tempAlpha=0.0;
		}else{
			$("#chartHolder1 .expendList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
			tempAlpha=1;
		}
	}
}

/*** 地域プルダウンクリック ***/
function onPcAreaClick(){
	$("#pc_area_name").text($(this).text());
	
	var tgtArea=$(this).attr("id");
	$("#pc_region_list li a").css("display","none");
	$("."+tgtArea).css("display","block");
	
}

/*** 都市プルダウンクリック ***/
function onPcRegionClick(){
	var tgtRegion=$(this).text();
	$("#pc_region_name").text(tgtRegion);
	selectedType=tgtRegion;
	selectedType=$(this).text();
	
	for(var i=0;i<expendList.length;i++){
		var expend=expendList[i];
		xChangeGraph(csvData,i);
	}
	is1st=false;
}

/*** 地域別データ抽出 ***/
function xGetPcRegionData($region){
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

/*** グラフ描画 ***/
function xChangeGraph(data,$expendNum){
	if(selectedType=="全て"){
		var data = allList.filter(function(row) {
			if(row['city'] == selectedType){
				return true;
			}
		})
	}else{
		var data = csvData.filter(function(row) {
			if(row['city'] == selectedType){
				return true;
			}
		})
	}
	var xScale = d3.time.scale()
	.domain(d3.extent(data, function(d) { return d.year; }))
	.range([xAxisPadding+padding, w - padding]);//表の幅
	
	var yScale = d3.scale.linear()
/*		.domain(d3.extent(data, function(d) {
			 var num=0;
			 if(d.amount){
				 num=d.amount*1;
			 }
			 return num;
		}))*/
		.domain([0,2600000])
		.range([ h - yAxisPadding - padding,padding]);//表の高さ
	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickFormat(d3.format("d"))

	svg.selectAll("#chartHolder1 .axis_x").remove();
	
	svg.append("g")
		.attr("class", "axis_x")
		.attr("transform", "translate(" + 0 + ", " + (h - yAxisPadding) + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("x", 10)
		.attr("y", -5)
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");
	
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.tickFormat(d3.format("d"))
		.ticks(10);//目盛り
		
	svg.selectAll("#chartHolder1 .axis_y").remove();
	
	svg.append("g")
		.attr("class", "axis_y")
		.attr("transform", "translate(" + xAxisPadding + ", 0)")
		.call(yAxis);
		
	d3.select("#chartHolder1 .axis_y")
	  .append("text")
	  .text("支出額/年")
	  .attr("x", 5)
	  .attr("y", 25)
	
	if(selectedType=="全て"){
		var data = allList.filter(function(row) {
			if(row['city'] == selectedType&&row['expend'] == expendList[$expendNum]){
				return true;
			}
		})
	}else{
		var data = csvData.filter(function(row) {
			if(row['city'] == selectedType&&row['expend'] == expendList[$expendNum]){
				return true;
			}
		})
	}
	
	// 折れ線グラフ
	var line = d3.svg.line()
	.x(function(d){ return xScale(d.year) })
	.y(function(d){ return yScale(d.amount*1) })
	
	if(is1st){
		svg.append("path")
			.attr("class", "c"+$expendNum+"_line")
			.attr("d", line(data))
			.attr("stroke", colorList[$expendNum])
			.attr("fill", "none");
	}
	svg.selectAll("#chartHolder1 .c"+$expendNum+"_line")
			.transition()
			.duration(1000)
			.attr("d", line(data));
}

return{
	st:st
}

}());
