var stackChart = {
	changeDataset: function(){
		d3.select(".stackline-area")
			.on("change", function(){
				stackChart.select_prop = $("input[name=stackline]:checked").val();
				stackChart.formatData( function(){
					stackChart.setAxis();
					stackChart.drawMultiBar();

				if(stackChart.select_prop == "crystal_price"){
					$(".chart3 .legend01").text("全体売上高"); $(".chart3 .legend02").text("液晶部門売上高");
				} else {
					$(".chart3 .legend01").text("研究開発費"); $(".chart3 .legend02").text("設備投資");
				}
				});
			})
	},
	formatData: function(success){
		d3.tsv("data/stackchart.tsv", function(error, data) {
			if (error) throw error;
			stackChart.select_prop = stackChart.select_prop || "crystal_price";
			if(stackChart.select_prop == "crystal_price"){
				stackChart.data_categories =  ["except_crystal","all_sales"];
				//d3.keys(data[0]).filter(function(key) { return (key !== "year")&&(key!=="except_crystal")&&(key!="research")&&(key!="equip"); });
			}else{
				stackChart.data_categories = ["research","equip"];
			}
			data.forEach(function(d) {
				d.crystal_price = +d.crystal_price;
				d.all_sales = +d.all_sales;
				d.except_crystal = +d.except_crystal;
				d.research = +d.research;
				d.equip = +d.equip;
				d.categories = stackChart.data_categories.map(function(name) { return {name: name, value: +d[name]}; });
			});
			stackChart.data = data;
			success();
			// console.dir(stackChart.data);
		});

	},
	setChart: function(){

		// var window_width = $(window).width();
		// if(window_width < 479) {
		// 	stackChart.device_type = "sp";
		// } else if(window_width < 979) {
		// 	stackChart.device_type = "tb";
		// } else {
		// 	stackChart.device_type = "pc";
		// }

		// switch(stackChart.device_type) {
		// case "sp":
		// 	stackChart.width = 320;
		// 	stackChart.height = 420;
		// 	stackChart.margin = {top: 60, right: 40, bottom: 60, left: 40};
		// 	// stackChart.margin = {top: 60, right: 40, bottom: 30, left: 40, middle:0};
		// 	stackChart.bar_padding = 26;
		// 	break;
		// case "tb":
		// 	stackChart.width = 768;
		// 	stackChart.height = 420;
		// 	stackChart.margin = {top: 60, right: 60, bottom: 60, left: 60};
		// 	// stackChart.margin = {top: 80, right: 60, bottom: 30, left: 80, middle:40};
		// 	stackChart.bar_padding = 28;
		// 	break;
		// case "pc": default:
		// 	stackChart.width = 980;
		// 	stackChart.height = 490;
		// 	stackChart.margin = {top: 60, right: 100, bottom: 60, left: 100};
		// 	// stackChart.margin = {top: 80, right: 60, bottom: 30, left: 100, middle:40};
		// 	stackChart.bar_padding = 0;
		// 	break;
		// }
		// console.log(stackChart.device_type);

		// stackChart.width = stackChart.width - stackChart.margin.left - stackChart.margin.right;
		// stackChart.height = stackChart.height - stackChart.margin.top - stackChart.margin.bottom;

		stackChart.baseW = parseInt(d3.select(".graph-area").style("width"));

		if(stackChart.baseW < 480) {
		stackChart.margin = { top: 60, right: 55, bottom: 60, left: 60}; // for SP
		}else{
		stackChart.margin = { top: 60, right: 100, bottom: 60, left: 100}; // for TB,PC
		}
		// console.log(stackChart.baseW);

		// stackChart.margin = { top: 60, right: 60, bottom: 60, left: 60};
		stackChart.width = parseInt(d3.select("#graph-area").style("width")) - stackChart.margin.left - stackChart.margin.right;
		stackChart.height = parseInt(d3.select("#graph-area").style("height")) - stackChart.margin.top - stackChart.margin.bottom;
		// console.log(stackChart.width);
 		// console.log(stackChart.height);

		d3.select("#stackline-area")
			.attr("width", stackChart.width + stackChart.margin.left + stackChart.margin.right)
			.attr("height", stackChart.height + stackChart.margin.top + stackChart.margin.bottom);

		d3.select("#line-charts")
			.attr("transform", "translate(" + stackChart.margin.left + "," + stackChart.margin.top + ")");

		d3.select("#stack-charts")
			.attr("transform", "translate(" + stackChart.margin.left + "," + stackChart.margin.top + ")");

		stackChart.svg = d3.select("#stack-charts");

	},
	setAxis: function(){

	stackChart.xScale0 = d3.scale.linear()
		.domain([2006, 2015])
		.range([0, stackChart.width]);

	stackChart.xScale1 = d3.scale.ordinal();

	stackChart.x4groupbar = d3.scale.ordinal()
		.domain(stackChart.data.map(function(d) { return d.year; }))
		.rangeRoundBands([0, stackChart.width], .2);

	stackChart.y4bar = d3.scale.linear().range([stackChart.height, 0]);

	},
	// ラインチャート
	drawLineChart: function(category){
		
		var line_svg;

		stackChart.category = "crystal_price"
		// var data_legend = stackChart.data_label.filter(function(d){return d.prop == stackChart.category})[0];

		// スケール関数の設定
		stackChart.x4line = d3.scale.linear()
			.range([0,stackChart.width])
			.domain([2006, 2015]);
		stackChart.y4line = d3.scale.linear()
			.range([stackChart.height/1.5, 0])
			.domain([0,d3.max(stackChart.data, function(d){ return d[stackChart.category]})] );

		// x軸の設定
		var yAxis = d3.svg.axis().scale(stackChart.y4line)
			.ticks(10)
			// .tickSize(-stackChart.width)
			.tickSize(-8)
			.orient("right");

		var svg = d3.select("#line-charts");

		//domain
		// stackChart.x.domain([2007,2014]);

		// y軸の生成
		svg.select("#yaxis-line")
			.append("g")
				// .attr("id","yaxis4category")
				.attr("class","y axis")
				.attr("transform", "translate(" + stackChart.width + ", 0)")
				.call(yAxis)
			.selectAll(".tick")
				.data(stackChart.xScale0.ticks(10), function(d){ return d; })
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
				// .attr("x", stackChart.width)
				.attr("y", -23)
				.attr("dx", 41)
				.attr("text-anchor", "end")
				.text("液晶パネル価格（ドル/1枚）");

		// ラインの座標をセット
		var line = d3.svg.line()
			.x(function(d){ return stackChart.x4line(d.year) })
			.y(function(d){ return stackChart.y4line(d[stackChart.category]) });

		// ラインチャートの生成
		line_svg = svg.select("#line")
			.append("g")
				.attr("id", "line_chart")
			.append("path")
				.datum(stackChart.data)
				.attr("fill", "none")
				.attr("stroke-width", "3px")
				.attr("stroke","#62a0d3")
				.attr("class", "compared_line")
				.attr("d", line);

	},
	// バーチャート
	drawMultiBar: function(){

		// var bar_padding = stackChart.bar_padding;
		// var ratio = stackChart.width / (stackChart.data.length+4);
		// console.log(ratio);

		// draw area
		stackChart.xScale1.domain(stackChart.data_categories).rangeRoundBands([0, stackChart.x4groupbar.rangeBand()]);
		// stackChart.xScale1.domain(stackChart.data_categories).rangeRoundBands([0, stackChart.xScale0.range()[1]]);

		if(stackChart.select_prop=="equip"){
			stackChart.y4bar.domain([
				d3.min(stackChart.data, function(d) { return d3.min(d.categories, function(d) { return d.value; }); }),
				d3.max(stackChart.data, function(d) { return d3.max(d.categories, function(d) { return d.value; }); })
			]);
		}else{
			stackChart.y4bar.domain([0,d3.max(stackChart.data, function(d) { return d3.max(d.categories, function(d) { return d.value; }); })]);				
		}

		var color = d3.scale.ordinal()
			.range(["#95c9c9", "#f2b1c9", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		// x軸の設定
		var xAxis = d3.svg.axis()
			.scale(stackChart.xScale0)
			.tickSize(8)
			// .tickSize(-stackChart.height)
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
			.scale(stackChart.y4bar)
			.ticks(10)
			.tickSize(-stackChart.width)
			.orient("left");
			// .tickPadding(0)
			// .tickPadding(10);

		// x軸の生成
		if(stackChart.svg.select("#xaxis > g")[0][0] === null){
			stackChart.svg.select("#xaxis").append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + stackChart.height + ")")
					.call(xAxis)
				.append("text")
					.attr("x", stackChart.width + 8)
					.attr("dy", 15)
					.attr("text-anchor", "end")
					.text("（年度）");

			stackChart.svg.select("#xaxis").selectAll("text")
				.attr("dy", 16);

			// .selectAll(".tick")
			// 	.exit().classed("minor", true);
		}

		// 
		if(stackChart.svg.select("#yaxis > g")[0][0] !== null){
			stackChart.svg.select("#yaxis > g").remove();
			// console.log("")
		}

		// y軸の生成
		stackChart.svg.select("#yaxis")
			.append("g")
				.attr("class", "y axis")
				.call(yAxis4bar)
			.selectAll(".tick")
				.data(stackChart.xScale0.ticks(10), function(d){ return d.value; })
				.exit().classed("minor", true);

		// ラベルの生成
		stackChart.svg.select("#yaxis g")
			.append("text")
				.attr("dx", -42)
				.attr("y", -23)
				.attr("text-anchor", "first")
				// .attr("dx", multiChart.width/2)
				// .attr("y", -10)
				// .style("fill", "#333333")
				// .style("font-size", 14)
				.text(function(){
					if(stackChart.select_prop=="crystal_price"){
						return "全体の売上高と液晶部門の売上高（億円）"
					}else{
						return "研究開発費と設備投資費（億円）"
					}
				});



		var state = stackChart.svg.select("#bar").selectAll(".state")
			.data(stackChart.data);

		var inside_bar;

		if(stackChart.svg.select("#bar > g")[0][0] === null){
			state
					.enter()
				.append("g")
					.attr("class", "state")
					.attr("transform", function(d) { return "translate(" + stackChart.xScale0(d.year) + ", 0)"; })
					.style("opacity", .7);

			inside_bar = state.selectAll("rect")
					.data(function(d) { return d.categories; })
					.enter()
				.append("rect");
		}

		inside_bar = state.selectAll("rect")
				.data(function(d) { return d.categories; });

		inside_bar
			.style("fill", function(d) { return color(d.name); })
			.transition()
			.duration(1000)
			.attr("width", stackChart.xScale1.rangeBand()/1.5 )
			// .attr("width", ratio - bar_padding )
			.attr("x", function(d) { return (stackChart.xScale1(d.name) - stackChart.xScale1.rangeBand())/1.5; })
			// .attr("x", function(d) { return stackChart.xScale1(d.name) - ratio + bar_padding ; })
			.attr("y", function(d) { return stackChart.y4bar(Math.max(0, d.value)); })
			.attr("height", function(d) { return Math.abs(stackChart.y4bar(d.value) - stackChart.y4bar(0)); });

		// legend
		// if(stackChart.svg.selectAll(".legend")[0][0]!==null){
		// 	stackChart.svg.selectAll(".legend > g").remove();
		// }

		// var legend = stackChart.svg.selectAll(".legend")
		// 	.data(stackChart.data_categories.slice().reverse())
		// 	.enter().append("g")
		// 	.attr("class", "legend")
		// 	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// legend.append("rect")
		//   .attr("x", stackChart.width - 18)
		//   .attr("width", 18)
		//   .attr("height", 18)
		//   .style("fill", color);

		// legend.append("text")
		//   .attr("x", stackChart.width - 24)
		//   .attr("y", 9)
		//   .attr("dy", ".35em")
		//   .attr("text-anchor", "end")
		//   .text(function(d) { 
		//   	return d; });

	},
	init: function(){
		stackChart.setChart();
		stackChart.formatData(function(){
			stackChart.setAxis();
			stackChart.drawMultiBar();
			stackChart.drawLineChart();
		});
		stackChart.changeDataset();
	}
};




$(document).ready(function(){
	stackChart.init();
});