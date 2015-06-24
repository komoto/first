// bubble-chart

$(document).ready(function(){

	//ページ表示の初期値
	//rendering("data/bubble2014.tsv");

	//ページ表示の初期値
	d3.tsv('./data/bubble.tsv', function(tsv){
		tsv.forEach(function(d){
			d.years = +d.years;
			d.company;
			d.porfit_or_less = +d.porfit_or_less;
			d.bottom_line = +d.bottom_line;
			d.capital_adequacy_ratio = +d.capital_adequacy_ratio;
			d.amount = +d.amount;
			d.label;
			d.circlecolor;
		});
		tsv_data = tsv;
		rendering(2014);
		// legend();
	});

	// //データの入れ替え（ボタン）
	d3.selectAll(".btn-sample01").on("change", function(){
		redraw(this.value);
		// $("#slider01").slider("setValue", this.value);
			// formatter: function(value) {
			// 	$("#year").text(value);
			// 	return value + " 年度";
			// }
		$("#year").text(this.value);
		return this.value;
	});

	//データの初期値
	$("#slider01").slider({
		tooltip: "always",
		formatter: function(value) {
			$("#year").text(value);
			return value + " 年度";
		}
	});

	//データの入れ替え（スライダー）
	$("#slider01").slider({
		formatter: function(value) {
			redraw(value);
			$("#year").text(value);
			return value + " 年度";
		}
	});

});

var baseW = parseInt(d3.select(".content-bubble").style("width"));

var fmt = d3.format(".1f");

if(baseW < 480) {
var m = { t: 60, r: 20, b: 60, l: 55}; // for SP
}else{
var m = { t: 65, r: 60, b: 65, l: 100}; // for TB,PC
}
// console.log(baseW);
// var m = { t: 65, r: 60, b: 65, l: 100};
var svgEle = document.getElementById("bubbleChart");
var w = parseFloat( window.getComputedStyle(svgEle, null).getPropertyValue("width") ) - m.l - m.r;
var h = parseFloat( window.getComputedStyle(svgEle, null).getPropertyValue("height") ) - m.t - m.b;
var tsv_data;


function rendering(years){

	// 整形データ
	var data = tsv_data.filter(function(d){return d.years==years});
	// console.dir(data);

	// circleの半径Max値を算出
	var maxR = d3.max(data, function(d, i){ return d.amount; }); // R
	// console.log(maxR);

	// スケール関数の定義
	var xScale = d3.scale.linear().domain([0, 45]).range([0, w]); // 調整方法に難あり
	var yScale = d3.scale.linear().domain([-8000, 4000]).range([h, 0]); // 調整方法に難あり
	// var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 48]);

	if(w + m.l + m.r < 480) {
	var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 28.8]); // rSize * 0.6
	}else{
	var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 48]);
	}

	// SVGの指定
	var svg = d3.select("#bubbleChart")
		.append("g")
			.attr("class", "area")
			.attr("transform", "translate("+ m.l + ", "+ m.t +")")

	var clickArea = d3.select(".area")
		.append("g")
			.attr("class", "clickarea")
		.append("rect")
			.attr("width", w)
			.attr("height", h)
			.attr("fill", "#ffffff")
			.attr("opacity", 0);

	clickArea
		.on("mouseout", function(){
			bubbleTooltip.style("visibility", "hidden");
		});

	// yearの設定
	var graphX;
	var graphY;

	if(w + m.l + m.r < 480) {
		graphX = w + 9; graphY = h - 32;
	}else{
		graphX = w + 25; graphY = h - 42;
	}

	var graphYear = svg.append("text")
		.attr("id", "year")
		.attr("class", "slider-year")
		.attr("x", graphX)
		.attr("y", graphY)
		.attr("text-anchor", "end")
		.text("2014");

	// x軸の設定
	var xAxis = d3.svg.axis()
		.scale(xScale)
		// .ticks(20)
		.tickSize(-h, 0, 0)
		.orient("bottom");

	// y軸	の設定
	var yAxis = d3.svg.axis()
		.scale(yScale)
		// .ticks(20)
		.tickSize(-w, 0, 0)
		.orient("left");

	// x軸の生成
	var xAxisLine = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, "+ h +")")
			.call(xAxis)
		.selectAll(".tick")
			.data(yScale.ticks(10), function(d){ return d; })
			.exit().classed("minor", true);

	// x軸テキスト位置の微調整
	d3.selectAll(".x text")
		.attr("y", 8);

	// x軸ラベルの生成
	d3.select(".x.axis")
		.append("text") // x軸ラベル
			.attr("x", w + 8)
			.attr("y", - 8)
			.attr("text-anchor", "end")
			.text("自己資本比率(%)");

	// y軸の生成
	var yAxisLine = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0, 0)")
			.call(yAxis)
		.selectAll(".tick")
			.data(xScale.ticks(10), function(d){ return d; })
			.exit().classed("minor", true);

	// y軸テキスト位置の微調整
	d3.selectAll(".y text")
		.attr("x", - 6);

	// y軸ラベルの生成
	d3.select(".y.axis")
		.append("text") // y軸ラベル
			.attr("x", 6)
			.attr("y", 3)
			.attr("text-anchor", "first")
			.text("最終損益(億円)");

	// ツールチップの生成
	var bubbleTooltip = d3.select(".content-bubble")
		.append("div")
			.attr("class", "bubbleTooltip");

	// circleの指定
	var circleEle = svg.selectAll("circle")
			.data(data);
			// .data(data, filter(function(){  }));

	circleEle
			.enter() // データセットを要素に設定
		.append("circle")
			.attr("class", "mark")
			.attr("r", 0)
			.attr("opacity", 0)
			.transition()
			.duration(1000)
			.attr("cx", function(d, i){ return xScale(d.capital_adequacy_ratio); })
			.attr("cy", function(d, i){ return yScale(d.bottom_line);	})
			.attr("r",function(d, i){ return rScale(d.amount); })
			.attr("opacity", 0.8)
			.attr("class", function(d, i){ return d.circlecolor; }); //属性に合わせてcircleのclassを書き換える

	circleEle
		.on("mouseover", function(d){
			// bubbleTooltip.text(d.bottom_line);
			// d3.select(".bubbleTooltip").text(d.bottom_line);
			// d3.selectAll( "."+d3.select(this.parentNode.appendChild(this)).attr("class") )
			// .style("stroke", "#000000")
			// .style("stroke-width", 1);
			return bubbleTooltip.style("visibility", "visible");
		})
		.on("mousemove", function(d){

			var sAmount, uAmount;

			if(d.amount < 10000){
				sAmount = parseInt(d.amount);
				uAmount = "億円";
			}else{
				sAmount = parseInt(d.amount)/10000;
				uAmount = "兆円";
			}

			var content = "<div class='tooltip_container'><h4>" + d.company + "</h4><div class='amount_title'>最終損益：</div><div class='amount_value'>" + d.bottom_line + "<span>億円</span></div><div class='amount_title'>時価総額：</div><div class='amount_value'>" + sAmount + "<span>" + uAmount + "</span></div><div class='amount_title'>自己資本比率：</div><div class='amount_value'>" + fmt(d.capital_adequacy_ratio) + "<span>％</span></div></div>";
										 //<div><p><span>輸入額：</span>" + fmt(d.value/1000) + "<span>万ドル</span></p></div>;
			return bubbleTooltip
			.style("left",(d3.event.pageX -93)+"px")
			.style("top", (d3.event.pageY -150)+"px")
			.html(content);
		})
		.on("mouseout", function(){
			bubbleTooltip.style("visibility", "hidden");
		});

	// circle textの生成
	d3.select(".area").selectAll("text.name")
			.data(data, function(d){ return d.company; })
			.enter()
		.append("text")
			.attr("opacity", 0)
			.transition()
			.duration(2000)
			.attr("opacity", 1)
			.attr("id", function(d){ return d.for_id;})
			.attr("class",  "bubbleText")
			.attr("x", function(d, i){ return xScale(d.capital_adequacy_ratio); })
			.attr("y", function(d, i){ return yScale(d.bottom_line) + 4; })
			.attr("text-anchor", "middle")
			.attr("opacity", function(d,i){
				if(d.porfit_or_less === 0)
				{ return 0;}
				else {return 1;} })
			.text(function(d) { return d.label; });

	d3.select(".area #sharp")
		.attr("paint-order", "stroke");
		// .attr("stroke-linejoin","round")
		// .attr("stroke-width", 6)
		// .attr("stroke", "#000000")
		// .style("stroke", "#dc0014");
}



function redraw(years){

		// 整形データ
		var data = tsv_data.filter(function(d){return d.years==years});
		// console.dir(data);

		// circleの半径Max値を算出
		var maxR = d3.max(data, function(d, i){ return d.amount; }); // R
		// console.log(maxR);

		// スケール関数の定義
		var xScale = d3.scale.linear().domain([0, 45]).range([0, w]); // 調整方法に難あり
		var yScale = d3.scale.linear().domain([-8000, 4000]).range([h, 0]); // 調整方法に難あり

		if(w + m.l + m.r < 480) {
		var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 28.8]); // rSize * 0.6
		}else{
		var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 48]);
		}

		// circelの更新
		d3.select("#bubbleChart").selectAll("circle")
				.data(data)
				.enter() // データセットを要素に設定
			.append("circle")
				.attr("class", "mark")
				.attr("r", 0)
				.attr("opacity", 0)
				.transition()
				.duration(1000)
				.attr("opacity", 0.8)
				.attr("class", function(d, i){ return d.circlecolor; }) //属性に合わせてcircleのclassを書き換える
				.attr("cx", function(d, i){ return xScale(d.capital_adequacy_ratio); })
				.attr("cy", function(d, i){ return yScale(d.bottom_line);	})
				.attr("r",function(d, i){ return rScale(d.amount); });


		// circelの更新
		d3.select("#bubbleChart").selectAll("circle")
			.data(data, function(d){return d.company; })
				.transition()
				.duration(1000)
				.attr("class", function(d, i){ return d.circlecolor; }) //属性に合わせてcircleのclassを書き換える
				.attr("cx", function(d, i){ return xScale(d.capital_adequacy_ratio); })
				.attr("cy", function(d, i){ return yScale(d.bottom_line);	})
				.attr("r",function(d, i){ return rScale(d.amount); });

		d3.select("#bubbleChart").selectAll("text.bubbleText")
			.data(data, function(d){return d.company ;})
			.transition()
			.duration(1000)
			.attr("opacity", function(d,i){
				if(d.porfit_or_less === 0)
				{ return 0;}
				else {return 1;} })
			.attr("x", function(d, i){ return xScale(d.capital_adequacy_ratio); })
			.attr("y", function(d, i){ return yScale(d.bottom_line) + 4; });

		d3.select("#bubbleChart").selectAll("text.bubbleText")
				.data(data, function(d){return d.company ;})
				.enter()
			.append('text')
				.attr("x", function(d, i){ return xScale(d.capital_adequacy_ratio); })
				.attr("y", function(d, i){ return yScale(d.bottom_line) + 4; })
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.text(function(d) { return d.label; })
				.attr("class",  "bubbleText")
				.transition()
				.duration(1000)
				.attr("x", function(d, i){ return xScale(d.capital_adequacy_ratio); })
				.attr("y", function(d, i){ return yScale(d.bottom_line) + 4; });
}

// function legend(){

// 	var legendMargin = { t: 2, r: 0, b: 2, l: 0};
// 	var legendWidth = 100;
// 	var legendHeight = 100;

// 	var data = [
// 		{label: "4兆円", amount: 40000 },
// 		{label: "1兆円", amount: 10000 },
// 		{label: "4000億円", amount: 4000 }
// 	];

// 	// スケール関数の定義
// 	var maxR = d3.max(data, function(d, i){ return d.amount; }); // R
// 	// console.log(maxR);

// 	var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 48]);
// 	var r_max = rScale(d3.max(data, function(d){ return d.amount; }));

// 	// if(w + m.l + m.r < 480) {
// 	// 	var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 28.8]); // rSize * 0.6
// 	// }else{
// 	// 	var rScale = d3.scale.sqrt().domain([0, maxR]).range([0, 48]);
// 	// }

// 	// 描画領域の生成
// 	var canvas = d3.select(".bubble-legend #legend")
// 			.attr("width", legendWidth)
// 			.attr("height", legendHeight)
// 		.append("g")
// 			.attr("class", "legend-area")
// 			.attr("transform", "translate(" + legendMargin.l + " ," + legendMargin.t + ")");

// 		canvas.selectAll(".legend-area")
// 			.data(data).enter()
// 				.append("circle")
// 					.attr("cx", legendWidth/2 )
// 					// .attr("cy", legendHeight/2 )
// 					// .attr("cx", function(d){
// 					// 	return rScale(d.amount);
// 					// })
// 					.attr("cy", function(d){
// 						return r_max * 2 - rScale(d.amount);
// 					})
// 					.attr("r", function(d){ return rScale(d.amount); })
// 					.style("fill", "#ffffff")
// 					.style("stroke", "#e8e8e8")
// 					.style("stroke-width", 1);

// }