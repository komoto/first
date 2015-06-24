var Chart1 = (function(){
	
var st=1;
var csvData;
var allList;
var countryList=["全て"];
var qualificationList=["全て"];
var yearList=[];

var data1=[];

var w = 588;
var h = 382;
var svg;
var padding = 20; // グラフの余白
var xAxisPadding = 60; // x軸表示余白
var yAxisPadding = 60; // x軸表示余白

var selectedType="全て";
var selectedCountry="中国";
var colorList=["#ffffff","#00bfd1","#ffff8f","#e7e800","#ff5c5e","#9bff80","#ff8630","#ffbb78","#84ff47","#4fd6c2","#ff8380","#8c7386","#ffb0e8","#a475ff","#abf2ff","#1381cf","#d8b6f7","#ff82d9","#c4997a","#ad6a5d","#6fb4d9"];
var is1st=true;
var tempAlpha;
(function($) {
  $(document).ready(onReady);
}(jQuery));

function onReady(){	
	console.log("onReady start! chart1");
	xInitD3();
}

function xInitD3(){
	// SVG作成
	svg = d3.select("#result")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
	//csv読み込み
  d3.csv("data/g1.csv", function(error, data) {
	  csvData=data;
	  
	  for(var i=0;i<csvData.length;i++){
	  	var row=csvData[i];
		var country=row['country'];
		var qualification=row['qualification'];
		var year=row['year'];
		
		var isMatch=false;
		 for(var j=0;j<countryList.length;j++){
			var listedCountry=countryList[j];
			  if(listedCountry==country){
				  isMatch=true;
				  break;  
			  }
		  }
		  if(isMatch==false){  
			countryList.push(country);
			$("#chartHolder1 .c"+countryList.length+" .countryName").text(country);
			$("#chartHolder1 .c"+countryList.length+" .ccolor").css("background-color",colorList[countryList.length-1]);
		  }
		  
		isMatch=false;
		 for(var k=0;k<qualificationList.length;k++){
			var listedQualification=qualificationList[k];
			  if(listedQualification==qualification){
				  isMatch=true;
				  break;  
			  }
		  }
		  if(isMatch==false){  
			qualificationList.push(qualification);
			$("#chartHolder1 .q"+qualificationList.length).text(qualification);
		  }
		  
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
	  //console.log("csv loaded");
	  
		allList=[];
		for(var i=0;i<countryList.length;i++){
			for(var j=0;j<yearList.length;j++){
				var data = csvData.filter(function(row) {
					if(row['country'] == countryList[i]&&row['year'] == yearList[j]){
						return true;
					}
				})
				var sum=0;
				var len=data.length;
				for(var k=0;k<len;k++){
					sum+=data[k].people*1;	
				}
				var obj={"qualification":"全て","country":countryList[i],"people":sum,"year":yearList[j]};
				allList.push(obj);
			}
		}

	  // イベント設定
	  $("#chartHolder1 .qBtn").on("click",onQualificationBtnClick);
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
	  $("#chartHolder1 .cBtn").on("click",onCountryBtnClick);
	  
	   for(var i=0;i<countryList.length;i++){
		var country=countryList[i];
		xChangeGraph(csvData,i);
	
	 }
	 
		is1st=false;
	  
  });
}

function onCountryBtnClick(){
	var num=$(this).attr("class").split(" c")[1];
	//console.log(num);//1-21
	if(num==1){
		//全てON
		for(var i=0;i<countryList.length;i++){
			$("#chartHolder1 .countryList .c"+(i+1)).css("opacity",1);
			svg.selectAll(".c"+i+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
		}
		$("#chartHolder1 .countryList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
			tempAlpha=1;
		return;
	}
	var allOn=true; 
	for(var i=0;i<countryList.length;i++){
		var opa=$("#chartHolder1 .countryList .c"+(i+1)).css("opacity");
		if(opa!=1){
			allOn=false;
			break
		}
	//	console.log("opa:"+opa);
	}
	if(allOn){
		//全選択OFF
		for(var i=0;i<countryList.length;i++){
			if(i!=0){
				$("#chartHolder1 .countryList .c"+(i+1)).css("opacity",0.3);
			}
			svg.selectAll(".c"+i+"_line")
			.attr("opacity",0.0)
			.attr("stroke-width", 1);
		}
		$("#chartHolder1 .countryList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
	}else{
		var cur=$("#chartHolder1 .countryList .c"+num).css("opacity");
		if(cur==1){
			$("#chartHolder1 .countryList .c"+num).css("opacity",0.3);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",0.0)
			.attr("stroke-width", 1);
			tempAlpha=0.0;
		}else{
			$("#chartHolder1 .countryList .c"+num).css("opacity",1);
			svg.selectAll(".c"+(num-1)+"_line")
			.attr("opacity",1)
			.attr("stroke-width", 1);
			tempAlpha=1;
		}
	}
}

function onQualificationBtnClick(){
	selectedType=$(this).text();
	$("#chartHolder1 li").removeClass("selected");
	var num=$(this).attr("class").split(" q")[1];
	$("#chartHolder1 li .q"+num).parent().addClass("selected");
	
	 for(var i=0;i<countryList.length;i++){
		var country=countryList[i];
		xChangeGraph(csvData,i);
	 }
	 is1st=false;
}

/*** ナビクリック ***/
function xChangeGraph(data,$countryNum){
	if(selectedType=="全て"){
		var data = allList.filter(function(row) {
			if(row['qualification'] == selectedType){
				return true;
			}
		})
	}else{
		var data = csvData.filter(function(row) {
			if(row['qualification'] == selectedType){
				return true;
			}
		})
	}
	var xScale = d3.time.scale()
	.domain(d3.extent(data, function(d) { return d.year; }))
	.range([xAxisPadding+padding, w - padding]);//表の幅
	
	var yScale = d3.scale.linear()
		.domain(d3.extent(data, function(d) {
			 var num=0;
			 if(d.people){
				 num=d.people*1;
			 }
			 return num;
		}))
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
	  .text("人")
	  .attr("x", 5)
	  .attr("y", 25)
	
	if(selectedType=="全て"){
		var data = allList.filter(function(row) {
			if(row['qualification'] == selectedType&&row['country'] == countryList[$countryNum]){
				return true;
			}
		})
	}else{
		var data = csvData.filter(function(row) {
			if(row['qualification'] == selectedType&&row['country'] == countryList[$countryNum]){
				return true;
			}
		})
	}
	
	// 折れ線グラフ
	var line = d3.svg.line()
	.x(function(d){ return xScale(d.year) })
	.y(function(d){ return yScale(d.people*1) })
	
	if(is1st){
		svg.append("path")
			.attr("class", "c"+$countryNum+"_line")
			.attr("d", line(data))
			.attr("stroke", colorList[$countryNum])
			.attr("fill", "none");
	}
	svg.selectAll("#chartHolder1 .c"+$countryNum+"_line")
			.transition()
			.duration(1000)
			.attr("d", line(data));
}

return{
	st:st
}

}());
