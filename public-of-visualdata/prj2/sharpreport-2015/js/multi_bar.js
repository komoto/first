var multiChart = {
	changeDataset: function(){
		d3.select(".barline-area")
			.on("change", function(){
				multiChart.select_prop = $("input[name=barline]:checked").val();
				multiChart.formatData( function(){
					multiChart.setAxis();
					multiChart.drawMultiBar();

				if(multiChart.select_prop == "sale"){
					$(".chart2 .legend01").text("売上高"); $(".chart2 .legend02").text("営業損益");
				} else {
					$(".chart2 .legend01").text("自己資本"); $(".chart2 .legend02").text("有利子負債");
				}
				});
			})
	},
	formatData: function(success){
		d3.tsv("data/sharp.tsv", function(error, data) {
			if (error) throw error;
			multiChart.select_prop = multiChart.select_prop || "sale";
			if(multiChart.select_prop == "sale"){
				multiChart.data_categories =  ["sale","porfit_or_less"];
				//d3.keys(data[0]).filter(function(key) { return (key !== "year")&&(key!=="owned_capital")&&(key!="interest_bearing")&&(key!="stock"); });
			}else{
				multiChart.data_categories = ["owned_capital","interest_bearing"];
			}
			data.forEach(function(d) {
				d.year = +d.year;
				d.sale = +d.sale;
				d.bottom_line = +d.bottom_line;
				d.owned_capital = +d.owned_capital;
				d.interest_bearing = +d.interest_bearing;
				d.porfit_or_less = +d.porfit_or_less;
				d.stock = +d.stock;
				d.categories = multiChart.data_categories.map(function(name) { return {name: name, value: +d[name]}; });
			});
			multiChart.data = data;
			success();
			// console.dir(multiChart.data);
		});

	},
	setChart: function(){

		// var window_width = $(window).width();
		// if(window_width < 479) {
		// 	multiChart.device_type = "sp";
		// } else if(window_width < 979) {
		// 	multiChart.device_type = "tb";
		// } else {
		// 	multiChart.device_type = "pc";
		// }

		// switch(multiChart.device_type) {
		// case "sp":
		// 	multiChart.width = 320;
		// 	multiChart.height = 420;
		// 	multiChart.margin = {top: 60, right: 40, bottom: 60, left: 40};
		// 	// multiChart.margin = {top: 60, right: 40, bottom: 30, left: 40, middle:0};
		// 	multiChart.bar_padding = 26;
		// 	break;
		// case "tb":
		// 	multiChart.width = 768;
		// 	multiChart.height = 420;
		// 	multiChart.margin = {top: 60, right: 60, bottom: 60, left: 60};
		// 	// multiChart.margin = {top: 80, right: 60, bottom: 30, left: 80, middle:40};
		// 	multiChart.bar_padding = 28;
		// 	break;
		// case "pc": default:
		// 	multiChart.width = 980;
		// 	multiChart.height = 490;
		// 	multiChart.margin = {top: 60, right: 100, bottom: 60, left: 100};
		// 	// multiChart.margin = {top: 80, right: 60, bottom: 30, left: 100, middle:40};
		// 	multiChart.bar_padding = 0;
		// 	break;
		// }
		// console.log(multiChart.device_type);

		// multiChart.width = multiChart.width - multiChart.margin.left - multiChart.margin.right;
		// multiChart.height = multiChart.height - multiChart.margin.top - multiChart.margin.bottom;

		multiChart.baseW = parseInt(d3.select(".graph-area").style("width"));

		if(multiChart.baseW < 480) {
		multiChart.margin = { top: 60, right: 55, bottom: 60, left: 60}; // for SP
		}else{
		multiChart.margin = { top: 60, right: 100, bottom: 60, left: 100}; // for TB,PC
		}
		// console.log(multiChart.baseW);

		// multiChart.margin = { top: 60, right: 60, bottom: 60, left: 60};
		multiChart.width = parseInt(d3.select("#graph-area").style("width")) - multiChart.margin.left - multiChart.margin.right;
		multiChart.height = parseInt(d3.select("#graph-area").style("height")) - multiChart.margin.top - multiChart.margin.bottom;
		// console.log(multiChart.width);
		// console.log(multiChart.height);

		d3.select("#graph-area")
			.attr("width", multiChart.width + multiChart.margin.left + multiChart.margin.right)
			.attr("height", multiChart.height + multiChart.margin.top + multiChart.margin.bottom);

		d3.select("#stock-charts")
			.attr("transform", "translate(" + multiChart.margin.left + "," + multiChart.margin.top + ")");

		d3.select("#sale-charts")
			.attr("transform", "translate(" + multiChart.margin.left + "," + multiChart.margin.top + ")");

		multiChart.svg = d3.select("#sale-charts");

	},
	setAxis: function(){

	multiChart.xScale0 = d3.scale.linear()
		.domain([2006, 2015])
		.range([0, multiChart.width]);

	multiChart.xScale1 = d3.scale.ordinal();

	multiChart.x4groupbar = d3.scale.ordinal()
		.domain(multiChart.data.map(function(d) { return d.year; }))
		.rangeRoundBands([0, multiChart.width], .2);

	multiChart.y4bar = d3.scale.linear().range([multiChart.height, 0]);

	},
	drawLineChart: function(category){
		
		var line_svg;

		multiChart.category = "stock"
		// var data_legend = multiChart.data_label.filter(function(d){return d.prop == multiChart.category})[0];

		// スケール関数の設定
		multiChart.x4line = d3.scale.linear()
			.range([0,multiChart.width])
			.domain([2006, 2015]);
		multiChart.y4line = d3.scale.linear()
			.range([multiChart.height/1.5, 0])
			.domain([0,d3.max(multiChart.data, function(d){ return d[multiChart.category]})] );

		// x軸の設定
		var yAxis = d3.svg.axis().scale(multiChart.y4line)
			.ticks(10)
			// .tickSize(-multiChart.width)
			.tickSize(-8)
			.orient("right");

		var svg = d3.select("#stock-charts");

		//domain
		// multiChart.x.domain([2007,2014]);

		// y軸の生成
		svg.select("#yaxis-line")
			.append("g")
				// .attr("id","yaxis4category")
				.attr("class","y axis")
				.attr("transform", "translate(" + multiChart.width + ", 0)")
				.call(yAxis)
			.selectAll(".tick")
				.data(multiChart.xScale0.ticks(10), function(d){ return d; })
				.exit().classed("minor", true)
 				// .style("stroke-dasharray", "3 ,4")
 				// .style("opacity", .5)
			.selectAll("text")
				.attr("dx", 12)
				.attr("text-anchor", "first");

		// y軸ラベルの生成
		svg.select("#yaxis-line g")
			.append("text")
				.attr("class", "axis_text_label")
				// .attr("x", multiChart.width)
				.attr("y", -23)
				.attr("dx", 52)
				.attr("text-anchor", "end")
				.text("株価（円）");

		// ラインの座標をセット
		var line = d3.svg.line()
			.x(function(d){ return multiChart.x4line(d.year) })
			.y(function(d){ return multiChart.y4line(d[multiChart.category]) });

		// ラインチャートの生成
		line_svg = svg.select("#line")
			.append("g")
				.attr("id", "line_chart")
			.append("path")
				.datum(multiChart.data)
				.attr("fill", "none")
				.attr("stroke-width", "3px")
				.attr("stroke","#dc0014")
				.attr("class", "compared_line")
				.attr("d", line);

	},
	drawMultiBar: function(){

		// var bar_padding = multiChart.bar_padding;
		// var ratio = multiChart.width / (multiChart.data.length+4);
		// console.log(ratio);

		// draw area
		multiChart.xScale1.domain(multiChart.data_categories).rangeRoundBands([0, multiChart.x4groupbar.rangeBand()]);
		// multiChart.xScale1.domain(multiChart.data_categories).rangeRoundBands([0, multiChart.xScale0.range()[1]]);

		if(multiChart.select_prop=="sale"){
			multiChart.y4bar.domain([
				d3.min(multiChart.data, function(d) { return d3.min(d.categories, function(d) { return d.value; }); }),
				d3.max(multiChart.data, function(d) { return d3.max(d.categories, function(d) { return d.value; }); })
			]);
		}else{
			multiChart.y4bar.domain([0,d3.max(multiChart.data, function(d) { return d3.max(d.categories, function(d) { return d.value; }); })]);				
		}

		var color = d3.scale.ordinal()
			.range(["#eab2bb", "#db6170", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		// x軸の設定
		var xAxis = d3.svg.axis()
			.scale(multiChart.xScale0)
			.tickSize(8)
			// .tickSize(-multiChart.height)
 			// .innerTickSize(0)
			// .outerTickSize(0)
			.orient("bottom")
			.tickValues([2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014])
			.tickFormat(function(d){
				// return d + "年度";
				return d + "";
			});

		// y軸の設定
		var yAxis4bar = d3.svg.axis()
			.scale(multiChart.y4bar)
			.ticks(10)
			.tickSize(-multiChart.width)
			.orient("left");
			// .tickPadding(0)
			// .tickPadding(10);

		// x軸の生成
		if(multiChart.svg.select("#xaxis > g")[0][0] === null){
			multiChart.svg.select("#xaxis").append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + multiChart.height + ")")
					.call(xAxis)
				.append("text")
					.attr("x", multiChart.width + 8)
					.attr("dy", 15)
					.attr("text-anchor", "end")
					.text("（年度）");

			multiChart.svg.select("#xaxis").selectAll("text")
				.attr("dy", 16);

				// .selectAll(".tick")
				// .classed("minor", true);
		}

		// 
		if(multiChart.svg.select("#yaxis > g")[0][0] !== null){
			multiChart.svg.select("#yaxis > g").remove();
			// console.log("")
		}

		// y軸の生成
		multiChart.svg.select("#yaxis")
			.append("g")
				.attr("class", "y axis")
				.call(yAxis4bar)
			.selectAll(".tick")
				.data(multiChart.xScale0.ticks(10), function(d){ return d.value; })
				.exit().classed("minor", true);

		// ラベルの生成
		multiChart.svg.select("#yaxis g")
			.append("text")
				.attr("dx", -42)
				.attr("y", -23)
				.attr("text-anchor", "first")
				// .attr("dx", multiChart.width/2)
				// .attr("y", -5)
				// .style("fill", "#333333")
				// .style("font-size", 14)
				.text(function(){
					if(multiChart.select_prop=="sale"){
						return "売上高と営業損益（億円）"
					}else{
						return "自己資本と有利子負債（億円）"
					}
				});



		var state = multiChart.svg.select("#bar").selectAll(".state")
			.data(multiChart.data);

		// ツールチップの生成
		var multiTooltip = d3.select(".content-multi")
			.append("div")
				.attr("class", "multiTooltip");

		var inside_bar;

		if(multiChart.svg.select("#bar > g")[0][0] === null){
			state
					.enter()
				.append("g")
					.attr("class", "state")
					.attr("transform", function(d) { return "translate(" + multiChart.xScale0(d.year) + ", 0)"; })
					.style("opacity", .7);

			inside_bar = state.selectAll("rect")
					.data(function(d) { return d.categories; })
					.enter()
				.append("rect");
		}

		inside_bar = state.selectAll("rect")
				.data(function(d) { return d.categories; });
				// console.log(multiChart.data);

		inside_bar
			.style("fill", function(d) { return color(d.name); })
			.transition()
			.duration(1000)
			.attr("width", multiChart.xScale1.rangeBand()/1.5 )
			// .attr("width", ratio - bar_padding )
			.attr("x", function(d) { return (multiChart.xScale1(d.name) - multiChart.xScale1.rangeBand())/1.5; })
			// .attr("x", function(d) { return multiChart.xScale1(d.name) - ratio + bar_padding ; })
			.attr("y", function(d) { return multiChart.y4bar(Math.max(0, d.value)); })
			.attr("height", function(d) { return Math.abs(multiChart.y4bar(d.value) - multiChart.y4bar(0)); });

	// state
	// 	.on("mouseover", function(d){
	// 		return multiTooltip.style("visibility", "visible");
	// 	})
	// 	.on("mousemove", function(d){

	// 		// var sAmount, uAmount;

	// 		if(d.sale < 10000){
	// 			sale_amount = parseInt(d.sale);
	// 			sale_u = "億円";
	// 		}else{
	// 			sale_amount = parseInt(d.sale)/10000;
	// 			sale_u = "兆円";
	// 		}

	// 		if(d.porfit_or_less < 10000){
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less);
	// 			porfit_or_less_u = "億円";
	// 		}else{
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less)/10000;
	// 			porfit_or_less_u = "兆円";
	// 		}

	// 		if(d.porfit_or_less < 10000){
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less);
	// 			porfit_or_less_u = "億円";
	// 		}else{
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less)/10000;
	// 			porfit_or_less_u = "兆円";
	// 		}

	// 		if(d.porfit_or_less < 10000){
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less);
	// 			porfit_or_less_u = "億円";
	// 		}else{
	// 			porfit_or_less_amount = parseInt(d.porfit_or_less)/10000;
	// 			porfit_or_less_u = "兆円";
	// 		}


	// 		var content = "<div class='tooltip_container'><h4>" + d.year + " 年度</h4><div class='amount_title'>売上高：</div><div class='amount_value'>" + sale_amount + "<span>" + sale_u + "</span></div><div class='amount_title'>営業損益：</div><div class='amount_value'>" + porfit_or_less_amount + "<span>" + porfit_or_less_u + "</span></div></div>";

	// 		return multiTooltip
	// 		.style("left",(d3.event.pageX -93)+"px")
	// 		.style("top", (d3.event.pageY -150)+"px")
	// 		.html(content);
	// 	})
	// 	.on("mouseout", function(){
	// 		multiTooltip.style("visibility", "hidden");
	// 	});





		// legend
		// if(multiChart.svg.selectAll(".legend")[0][0]!==null){
		// 	multiChart.svg.selectAll(".legend > g").remove();
		// }

		// var legend = multiChart.svg.selectAll(".legend")
		// 	.data(multiChart.data_categories.slice().reverse())
		// 	.enter().append("g")
		// 	.attr("class", "legend")
		// 	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// legend.append("rect")
		//   .attr("x", multiChart.width - 18)
		//   .attr("width", 18)
		//   .attr("height", 18)
		//   .style("fill", color);

		// legend.append("text")
		//   .attr("x", multiChart.width - 24)
		//   .attr("y", 9)
		//   .attr("dy", ".35em")
		//   .attr("text-anchor", "end")
		//   .text(function(d) { 
		//   	return d; });

	},
	init: function(){
		multiChart.setChart();
		multiChart.formatData(function(){
			multiChart.setAxis();
			multiChart.drawMultiBar();
			multiChart.drawLineChart();
		});
		multiChart.changeDataset();
	}
};




$(document).ready(function(){
	multiChart.init();
});