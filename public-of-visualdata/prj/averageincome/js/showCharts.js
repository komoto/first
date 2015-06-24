var showCharts = function(obj){
	if(!obj) return;
	this.target = obj.target;

	if(typeof obj.init != 'function') return;

	var window_width = $(window).width();
	if(window_width < 569) {
		this.device_type = 'sp';
	} else if(window_width < 768) {
		this.device_type = 'tb';
	} else {
		this.device_type = 'pc';
	}

	//obj.init.bind(this)();
	this.initFunc = obj.init;
};
showCharts.prototype.init = function(){
	this.initFunc.call(this);
};
showCharts.data = [];

/** obj = {
	width: ,
	height: ,
	margin: {top: 20, right: 20, bottom: 30, left: 100},
	data: [obj]
} */
showCharts.prototype.showLineChart = function(obj){
	var that = this;
	var margin = obj.margin,
		width = obj.width - margin.left - margin.right,
		height = obj.height - margin.top - margin.bottom,
		data = obj.data,
		x = obj.x,
		y = obj.y
		axis_showing_flg = obj.axis_showing_flg,
		that.category_arr = obj.category_arr
		;

	that.width = width;
	that.height = height;

	var arr_x = data.map(function(d){return d.xv});
	var svg = d3.select(that.target)
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	this.x = x || d3.scale
		.linear() //.ordinal()
		.range([0, width]) //.rangeBands([0, width], .1)
	this.x.domain(d3.extent(arr_x));

	if(y) {
		this.y = y;
	} else {
		this.y = d3.scale.linear()
			.range([height, 0]);
		this.y.domain(d3.extent(data, function(d){return d.yv}));
	}



	if(axis_showing_flg) {
		var xAxis = d3.svg.axis()
			.scale(this.x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(this.y)
			.innerTickSize(-width)
			.outerTickSize(0)
			.tickPadding(10)
			.orient("left");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			// .attr("transform", "rotate(-90)")
			.attr("x", 800)
			.attr("y", 0)
			.attr("dy", "-1em")
			.style("text-anchor", "end")
			.attr("class", "axis_text_label")
			.text("勤続年数（年）");

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			// .attr("transform", "rotate(-90)")
			.attr("x", 55)
			.attr("y", 10)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.attr("class", "axis_text_label")
			.text("年収 (万円)");
	}


	var line_area = svg.append('g')
		.attr('class', 'line_area');

	line_area.append('rect')
		.attr("width", width)
		.attr("height", height)
		.attr('class', 'line_area_rect')
		.on('mousemove', function(){
			var mouse = d3.mouse(this);
			//console.log('x:%s, y:%s', mouse[0], mouse[1]);
			var nearest_idx = 0;

			// vertical line only at data point
			arr_x.map(function(d, i){
				if(Math.abs(mouse[0]-that.x(d)) < Math.abs(mouse[0]-that.x(arr_x[nearest_idx]))) {
					nearest_idx = i;
				}
			});

			//todo: refactoring
			d3.selectAll('.guide_circle').remove();
			data_4_circles = data.filter(function(d){return d.xv==arr_x[nearest_idx]});
			//console.dir(data_4_circles);

			//show vertical line
			var line_x = (isNaN(Math.floor(that.x(arr_x[nearest_idx])))) ? 0 : Math.floor(that.x(arr_x[nearest_idx]));
			var circles = line_area.selectAll('.guide_circle');
			if(line_area.select('#guide_line').size() > 0) {
				line_area.select('#guide_line').attr('transform', 'translate('+line_x+', 0)');
			} else { // first time
				line_area
					.append('rect')
						.attr('width', '0.5')
						.attr('height', height)
						.attr('id', 'guide_line')
						.attr('transform', 'translate('+line_x+', 0)');
				
			}

			//show balloon near mouse
			if(that.category_arr && d3.select(that.target+'_balloon').size()>0) {
				var swatch_html = '';
				data_4_circles = _.sortBy(data_4_circles, 'yv').reverse();
				data_4_circles.map(function(d, i){
					swatch_html += '<div class="common_swatch_box">'
					+ '<span class="common_swatch" style="background-color:'+(d.color?d.color:that.color(d.zv))+'"></span>'
					+ d.label+' '+(isFinite(d.yv)?d.yv:0)+'人</div>'
				});
				var balloon_left;
				var padding_balloon = 4;
				//if(arr_x.length/2>nearest_idx) balloon_left = 'right:'+(that.width-line_x+margin.right+padding_balloon)+'px;';
				//else balloon_left = 'left:'+(line_x+margin.left+padding_balloon)+'px;';
				d3.select(that.target+'_balloon')
					//.attr('style', 'top:0px;'+balloon_left+'display:block;')
					.html(swatch_html);
			} else if(that.category_arr) {
				d3.selectAll('.'+that.target.substr(1)+'_legend_feagure').text('');
				data_4_circles.map(function(d, i){
					$(that.target+'_legend_feagure_'+d.zv).text((isFinite(d.yv)?d.yv:0));
				});
			}
			//show circles
			circles
				.data(data_4_circles)
				.enter()
				.append('circle')
				.attr('class', 'guide_circle')
				.attr('style', function(d){
					if(!isFinite(d.xv) || !isFinite(d.yv)) return 'display: none';
				})
				.attr('r', '3px')
				.attr('cx', function(d){return that.x(d.xv)})
				.attr('cy', function(d){return that.y(d.yv)});

		})
		.on('click', function(){
			if(that.target!='#c01_chart_company_salary') return;
			if(that.device_type!='sp' && that.device_type!='tb') return;
			$('#c01_line_chart_salary').hide();
		})
	;

	return svg;
};
/**
 * showLineChart***
 * 1. set data for this chart
 * 2. call another function to set outline of line chart
 * 3.
 */
showCharts.prototype.showLineChartByCategory = function(category){
	var that = this;
	that.category = category;
	var data_the_category = that.tsv.filter(function(d){return d.category==category});

	//show layout of charts
	d3.select(that.target+' > g').remove();

	var width, height, margin;
	switch(that.device_type) {
		case 'sp':
			width = 500;
			height = 280;
			margin = {top: 50, right: 20, bottom: 30, left: 40};
			break;
		case 'tb':
			width = 750;
			height = 420;
			margin = {top: 60, right: 20, bottom: 30, left: 40};
			break;
		case 'pc': default:
			width = 860;
			height = 480;
			margin = {top: 20, right: 20, bottom: 30, left: 40};
			break;
	}

	var svg = that.showLineChart({
		width: width,
		height: height,
		margin: margin,
		data: data_the_category.map(function(d){return {xv: d.age, yv: d.salary_index}}),
		axis_showing_flg: 0
	}).select('.line_area');

	// var arr_x_label = _.uniq(data_the_category.map(function(d){return "~"+d.age}));
	var arr_x_label = ["20~25", "~30", "~35", "~40", "~45", "~50", "~55", "~60", "~65"];
	//for x axis
	var x = d3.scale.ordinal().rangePoints([0, that.width]);
	x.domain(arr_x_label);

	
	var y = d3.scale.linear().range([that.height, 0]);
	y.domain(d3.extent(that.tsv,function(d){return d.salary_index}));

	var data = data_the_category.map(function(d){return {xv: d.age, yv: d.salary_index}});
	var arr_x = data.map(function(d){return d.xv});

	var line_area = svg.append('g')
		.attr('class', 'line_area');

	line_area.append('rect')
		.attr("width", width)
		.attr("height", height)
		.attr('fill', 'transparent')
		.on('mousemove', function(){
			var mouse = d3.mouse(this);
			//console.log('x:%s, y:%s', mouse[0], mouse[1]);
			var nearest_idx = 0;

			// vertical line only at data point
			arr_x.map(function(d, i){
				if(Math.abs(mouse[0]-that.x(d)) < Math.abs(mouse[0]-that.x(arr_x[nearest_idx]))) {
					nearest_idx = i;
				}
			});

			//todo: refactoring
			d3.selectAll('.guide_circle').remove();
			data_4_circles = data.filter(function(d){return d.xv==arr_x[nearest_idx]});
			//console.dir(data_4_circles);

			//show vertical line
			var line_x = (isNaN(Math.floor(that.x(arr_x[nearest_idx])))) ? 0 : Math.floor(that.x(arr_x[nearest_idx]));
			var circles = line_area.selectAll('.guide_circle');
			if(line_area.select('#guide_line').size() > 0) {
				line_area.select('#guide_line').attr('transform', 'translate('+line_x+', 0)');
			} else { // first time
				line_area
					.append('rect')
						.attr('width', '0.5')
						.attr('height', that.height)
						.attr('id', 'guide_line')
						.attr('transform', 'translate('+line_x+', 0)');
				
			}

			//show balloon near mouse
			if(that.category_arr && d3.select(that.target+'_balloon').size()>0) {
				var swatch_html = '';
				data_4_circles.map(function(d, i){
					swatch_html += '<div class="common_swatch_box">'
					+ '<span class="common_swatch" style="background-color:'+that.color(d.zv)+'"></span>'
					+ d.label+' '+(isFinite(d.yv)?d.yv:0)+'人</div>'
				});
				var balloon_left;
				var padding_balloon = 4;
				if(arr_x.length/2>nearest_idx) balloon_left = 'right:'+(that.width-line_x+margin.right+padding_balloon)+'px;';
				else balloon_left = 'left:'+(line_x+margin.left+padding_balloon)+'px;';
				d3.select(that.target+'_balloon')
					.attr('style', 'top:0px;'+balloon_left+'display:block;')
					.html(swatch_html);
			} else if(that.category_arr) {
				d3.selectAll('.'+that.target.substr(1)+'_legend_feagure').text('');
				data_4_circles.map(function(d, i){
					$(that.target+'_legend_feagure_'+d.zv).text((isFinite(d.yv)?d.yv:0));
				});
			}
			//show circles
			circles
				.data(data_4_circles)
				.enter()
				.append('circle')
				.attr('class', 'guide_circle')
				.attr('style', function(d){
					if(!isFinite(d.xv) || !isFinite(d.yv)) return 'display: none';
				})
				.attr('r', '3px')
				.attr('cx', function(d){return that.x(d.xv)})
				.attr('cy', function(d){return y(d.yv)});

		})
	;

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.innerTickSize(-that.width)
		.outerTickSize(0)
		.tickPadding(10)
		.orient("left");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + that.height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", that.width)
		.attr("y", 0)
		.attr("dy", "-1em")
		.style("text-anchor", "end")
		.attr("class", "axis_text_label")
		.text("年齢階級（歳）");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("x", 55)
		.attr("y", 8)
		// .attr("dy", ".71em")
		.style("text-anchor", "end")
		.attr("class", "axis_text_label")
		.text("年収 (倍率)");

	//show charts all years by a category
	var year_arr = _.uniq(data_the_category, 'year');
	year_arr.map(function(d, i){
		var year = d.year;
		var data_tmp = data_the_category.filter(function(e){return e.year==year}).map(function(e){return {label:e.age, salary:e.salary_index}});
		svg.append("path")
			.datum(data_tmp)
			.attr("class", "c02_line_category_salary"+" "+"c02_line_category_salary"+year)
			.attr("data-year", year)
			.attr("d", d3.svg.line()
				.x(function(d) { 
					return that.x(d.label); })
				.y(function(d) { 
					return y(d.salary); }))
			.call(that.setEvent2Path(that))
			;
	});

	var year_range = d3.extent(year_arr, function(d){return d.year});
	$('#year_slider').html(year_range[0]+' - '+year_range[1]);
};
showCharts.prototype.setEvent2Path = function(that){
	return function(path){
		//console.log('path: %o, that:%o', path, that);
		path
			.on('mousemove', function(e){
				//d3.select(this).attr('class', 'line line_hover');
				//if(that.timer) clearTimeout(that.timer);
				var mouse = d3.mouse(this);
				$('#c02_balloon_salary').html(d3.select(this).attr('data-year'));
				// $('#c02_balloon_salary').show();
			})
			.on('mouseout', function(e){
				//d3.select(this).attr('class', 'line');
				//that.timer = setTimeout(function(){$('#c02_balloon_salary').hide();}, 200);
			});
}
};
showCharts.prototype.showCategoryList = function(){
	var that = this;
	var category_list = _.uniq(this.tsv, 'category_label');
	var color = d3.scale.category20();
	category_list.map(function(d, i){
		var _category_all_boolean = (d.category_label == "産業計");
		var _category_label = (!_category_all_boolean) ? d.category_label : "全産業平均";
		var _legend_label = $('<label class="legend_label"></label>');
		_legend_label.append(
			'<input type="radio" name="swatch_category" class="swatch_category_check" id="swatch_category_check'+i+'" data-category="'+d.category+'"'
			+ (d.category=='G 情報通信業' ? 'checked': '') + '>'
			+ '<div class="legend_category">'
				// + '<p class="swatch_category" style="background-color:'+color(i)+';"></p>'
				+ _category_label
			+ '</div>'
			);
		if(!_category_all_boolean){
			$('#legends_category').append(_legend_label);
		} else {
			$('#legends_category').prepend(_legend_label);
		}
	});
	$('#legends_category > label > input').on('change', function(){
		that.showLineChartByCategory($(this).data('category'));
	})
};
// not used yet
showCharts.prototype.line = function(that){
	return function(){
		// console.dir(this);
		// console.dir(that);
		return d3.svg.line()
			.x(function(d) { return that.x(d.label); })
			.y(function(d) { return that.y(d.salary); });
	}
};




//var that = lc_salary_curve;

//tsv utl, 数値に変換, データ処理




//for scatter_salary
var closeTooltip;
var nkcode_arr = [
	{nk_type_code:01,market_category:"食品", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:03,market_category:"繊維", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:05,market_category:"パルプ・紙", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:07,market_category:"化学", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:09,market_category:"医薬品", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:11,market_category:"石油", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:13,market_category:"ゴム", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:15,market_category:"窯業", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:17,market_category:"鉄鋼", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:19,market_category:"非鉄金属製品", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:21,market_category:"機械", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:23,market_category:"電気機器", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:25,market_category:"造船", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:27,market_category:"自動車", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:29,market_category:"輸送用機器", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:31,market_category:"精密機器", zaima_category:'製造業', zaima_code:'E'},
	{nk_type_code:33,market_category:"その他製造", zaima_category:'製造業', zaima_code:'E'},
	// {nk_type_code:00,market_category:"非製造業", zaima_category:'', zaima_code:''},
	{nk_type_code:35,market_category:"水産", zaima_category:'水産業', zaima_code:'B'},
	{nk_type_code:37,market_category:"鉱業", zaima_category:'鉱業・採石業', zaima_code:'C'},
	{nk_type_code:41,market_category:"建設", zaima_category:'建設業', zaima_code:'D'},
	{nk_type_code:43,market_category:"商社", zaima_category:'複合サービス事業', zaima_code:'Q'},
	{nk_type_code:45,market_category:"小売業", zaima_category:'卸売業・小売業', zaima_code:'I'},
	{nk_type_code:47,market_category:"銀行", zaima_category:'金融業・保険業', zaima_code:'J'},
	{nk_type_code:49,market_category:"証券", zaima_category:'金融業・保険業', zaima_code:'J'},
	{nk_type_code:51,market_category:"保険", zaima_category:'金融業・保険業', zaima_code:'J'},
	{nk_type_code:52,market_category:"その他金融", zaima_category:'金融業・保険業', zaima_code:'J'},
	{nk_type_code:53,market_category:"不動産", zaima_category:'不動産業・物品賃貸業', zaima_code:'K'},
	{nk_type_code:55,market_category:"鉄道・バス", zaima_category:'運輸業・郵便業', zaima_code:'H'},
	{nk_type_code:57,market_category:"陸運", zaima_category:'運輸業・郵便業', zaima_code:'H'},
	{nk_type_code:59,market_category:"海運", zaima_category:'運輸業・郵便業', zaima_code:'H'},
	{nk_type_code:61,market_category:"空運", zaima_category:'運輸業・郵便業', zaima_code:'H'},
	{nk_type_code:63,market_category:"倉庫", zaima_category:'運輸業・郵便業', zaima_code:'H'},
	{nk_type_code:65,market_category:"通信", zaima_category:'情報通信業', zaima_code:'G'},
	{nk_type_code:67,market_category:"電力", zaima_category:'電気・ガス・水道業', zaima_code:'F'},
	{nk_type_code:69,market_category:"ガス", zaima_category:'電気・ガス・水道業', zaima_code:'F'},
	{nk_type_code:71,market_category:"サービス", zaima_category:'サービス業', zaima_code:'S'}
];
function closePopup() {
	return;
	document.getElementById('popup').style.display = 'none';
}

//$(document).ready(c.init);

var scatter_salary = new showCharts({
	target: '#c01_chart_company_salary',
	init: function(){
		var that = this;
		d3.tsv("data/salary_company.tsv", function(tsv) {
			//if (error) return console.warn(error);
			//console.dir(tsv);
			tsv = tsv.filter(function(d){return d.salary>0});
			tsv.forEach(function(d){
				d.salary = +d.salary;
				d.working_time = +d.ave_working_year;
				d.employees = +d.employees;
				d.nk_type_code = +d.nk_type_code;
				d.consolidated = +d.consolidated;
				d.non_consolidated = +d.non_consolidated;
				d.account = (d.non_consolidated==0)? +d.consolidated : +d.non_consolidated;
			});
			
			that.data = tsv;
			var suggest_list = _.uniq(tsv,"nkcode");
			var data4suggest = [];
			
			suggest_list.map(function(e){
					data4suggest.push({nkcode: e.nkcode, name: e.name, name_en: e.name_en})
			})
			
			//var width_scatter, width_line, height, margin;
			that.x_axis_top_flg = 0;
			switch(that.device_type) {
				case 'sp':
					width_scatter = 300;
					width_line = 200;
					height = 360;
					margin_scatter = {top: 40, right: 0, bottom: 40, left: 40};
					margin_line = {top: 40, right: 50, bottom: 40, left: 0};
					x_axis_height = 0;
					// chnage css
					that.x_axis_top_flg = 1;

					break;
				case 'tb':
					width_scatter = 500;
					width_line = 250;
					height = 420;
					margin_scatter = {top: 40, right: 0, bottom: 40, left: 80};
					margin_line = {top: 40, right: 50, bottom: 40, left: 0};
					x_axis_height = 24;

					that.x_axis_top_flg = 1;
					break;
				case 'pc': default:
					width_scatter = 550;
					width_line = 300;
					height = 460;
					margin_scatter = {top: 40, right: 0, bottom: 40, left: 80};
					margin_line = {top: 40, right: 50, bottom: 40, left: 0};
					x_axis_height = 24;
					break;
			}
			// origin height 550, 460
			// define dimensions of graph
			var margin = margin_scatter; // margins
			that.w = width_scatter - margin.right - margin.left; // width
			that.h = height - margin.top - margin.bottom; // height

			//Create SVG element
			var scatter_g = d3.select('#c01_chart_scatter_salary_svg')
					.attr("width", that.w + margin.right + margin.left)
					.attr("height", that.h + margin.top + margin.bottom)
						.append('g')
							.attr('transform', 'translate('+margin.left+', '+margin.top+')')
				;

			//define x, y & r
			var working_time = tsv.map(function(d){return d.working_time});
			var population = tsv.map(function(d){return d.employees});
			var salary = tsv.map(function(d){return d.salary});
			var account = tsv.map(function(d){return d.account});

			//axis and range
			// var arr_x_label = ["0~", "10~", "20~", "30~", " "];
			// //for x axis
			// var x4label = d3.scale.ordinal().domain(arr_x_label).rangePoints([0, that.w]);

			that.x_working = d3.scale.linear().domain([_.min(working_time), _.max(working_time)]).range([0, that.w]);
			// that.x_working = d3.scale.linear().domain([0,40]).range([0, that.w]);
			that.y = d3.scale.linear().domain([_.min(salary), _.max(salary)]).range([that.h, 0]);
			//that.r = d3.scale.sqrt().domain([_.min(population), _.max(population)]).range([4, 30]);
			that.r = d3.scale.sqrt().domain([_.min(account), _.max(account)]).range([4, 30]);
			that.color = d3.scale.category20();

			//show x axis
			// var xAxis4label = d3.svg.axis().scale(x4label);

			var xAxis = d3.svg.axis().scale(that.x_working).ticks(4);
			var yAxis = d3.svg.axis()
				.scale(that.y)
				.innerTickSize(-that.w)
				.outerTickSize(0)
				.tickPadding(10)
				.orient("left");

			$(that).trigger('onComplete');

			// Add the x-axis.
			scatter_g.append("svg:g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + that.h + ")")
				.call(xAxis)
				.append("text")
				.attr("x", that.w)
				.attr("y", x_axis_height)
				.attr("dy", "-.71em")
				.style("text-anchor", "end")
				.attr("class", "axis_text_label")
				.text("勤続年数（年）");
			
			scatter_g.append("svg:g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				// .attr("transform", "rotate(-90)")
				.attr("x", 70)
				.attr("y", 30)
				.attr("dy", ".91em")
				// .attr("dy", ".71em")
				.style("text-anchor", "end")
				.attr("class", "axis_text_label")
				.text("年収（万円）");

			var circles_g = scatter_g.append("svg:g")
				.attr("class", "circles_g");

			that.scatter_g = scatter_g;
			that.circles_g = circles_g;
			//c.scatterYear();
			that.selectMarketCircle();

			$('#c01_slider_scatter_salary').slider({
				tooltip: 'always',
				formatter: function(value) {
					that.scatterYear(value);
					$("#c01_chart_scatter_salary_year").text(value);
					//console.log(value);
					return value;
				}
			});

			// hightlight default company
			that.showLineChartCompanySalary(that.selected_nkcode);
			that.showCompanyInfo(that.selected_nkcode);

			that.showLegendAmountSales();
			that.suggestCompany(data4suggest);

			$('#c01_unfocus_conmapny').on('click', function(){
				$('#c01_line_chart_salary').hide();
			});

		});
	}
});
scatter_salary.selected_nkcode = '0001353';
scatter_salary.showLegendAmountSales = function(){
	var that = this;
	var width = 120, line_width = 40;
	var data = [
		{label: '5兆円~', value:5000000},
		{label: '1兆円~', value:1000000},
		{label: '1000億円~', value:100000}, //default
		{label: '1億円~', value:100},
	];
	var r_max = that.r(_.max(data, 'value').value);
	var canvas = d3.select('#c01_legend_amount_sales')
		.attr('width', width)
		.attr('height', 60)
		.append('g')
		.attr('transform', 'translate(3, 10)');


	function mousemove_legend_amount_sales() {
		//d3.select(this).attr('class', 'c01_legend_amount_sales_circle c01_legend_amount_sales_circle_on');
		var data_id = d3.select(this).attr('data-id');
		d3.select('#c01_legend_amount_sales_circle_'+data_id).attr('class', 'c01_legend_amount_sales_circle c01_legend_amount_sales_circle_on');
		d3.select('#c01_legend_amount_sales_line_'+data_id).attr('class', 'c01_legend_amount_sales_line c01_legend_amount_sales_line_on');
		d3.select('#c01_legend_amount_sales_text_'+data_id).attr('class', 'c01_legend_amount_sales_text c01_legend_amount_sales_text_on');
	}
	function mouseout_legend_amount_sales() {
		var limit_amount_sales = +d3.select(this).attr('data-value');
		if(limit_amount_sales==that.limit_amount_sales) return;

		d3.select(this).attr('class', 'c01_legend_amount_sales_circle');
		var data_id = d3.select(this).attr('data-id');
		d3.select('#c01_legend_amount_sales_circle_'+data_id).attr('class', 'c01_legend_amount_sales_circle');
		d3.select('#c01_legend_amount_sales_line_'+data_id).attr('class', 'c01_legend_amount_sales_line');
		d3.select('#c01_legend_amount_sales_text_'+data_id).attr('class', 'c01_legend_amount_sales_text');
	}
	function click_legend_amount_sales() {
		var limit_amount_sales = +d3.select(this).attr('data-value');
		if(limit_amount_sales==that.limit_amount_sales) return;

		//console.log('limit_amount_sales:before:%d after:%d', that.limit_amount_sales, limit_amount_sales);
		that.limit_amount_sales = limit_amount_sales;
		that.scatterYear();
		var data_id = d3.select(this).attr('data-id');

		// init
		d3.selectAll('.c01_legend_amount_sales_circle').attr('class', 'c01_legend_amount_sales_circle');
		d3.selectAll('.c01_legend_amount_sales_line').attr('class', 'c01_legend_amount_sales_line');
		d3.selectAll('.c01_legend_amount_sales_text').attr('class', 'c01_legend_amount_sales_text');

		d3.select('#c01_legend_amount_sales_circle_'+data_id).attr('class', 'c01_legend_amount_sales_circle c01_legend_amount_sales_circle_on');
		d3.select('#c01_legend_amount_sales_line_'+data_id).attr('class', 'c01_legend_amount_sales_line c01_legend_amount_sales_line_on');
		d3.select('#c01_legend_amount_sales_text_'+data_id).attr('class', 'c01_legend_amount_sales_text c01_legend_amount_sales_text_on');
	}
	//show circles
	canvas.selectAll('.c01_legend_amount_sales_circle')
		.data(data).enter()
			.append('circle')
			.attr("id", function(d, i) {
				return "c01_legend_amount_sales_circle_"+ i;
			})
			.attr("class", function(d){
				if(d.value == that.limit_amount_sales) return 'c01_legend_amount_sales_circle c01_legend_amount_sales_circle_on';
				return 'c01_legend_amount_sales_circle';
			})
			.attr('data-id', function(d, i){return i})
			.attr('data-value', function(d){return d.value})
			.attr("cx", function(d) {
				return r_max;
			})
			.attr("cy", function(d) {
				return r_max * 2 - that.r(d.value);
			})
			.attr("r", function(d){
				return that.r(d.value);
			})
			.attr("title", function(d){
				return d.label;
			})
			.on('mousemove', mousemove_legend_amount_sales)
			.on('mouseout', mouseout_legend_amount_sales)
			.on('click', click_legend_amount_sales)
		;
	canvas.selectAll('.c01_legend_amount_sales_line')
		.data(data).enter()
			.append('line')
			.attr('class', function(d){
				if(d.value == that.limit_amount_sales) return 'c01_legend_amount_sales_line c01_legend_amount_sales_line_on';
				return 'c01_legend_amount_sales_line';
			})
			.attr('id', function(d, i) {
				return "c01_legend_amount_sales_line_"+ i;
			})
			.attr('x1', r_max)
			.attr('x2', r_max + line_width)
			.attr('y1', function(d) {
				return (r_max - that.r(d.value)) * 2;
			})
			.attr('y2', function(d) {
				return (r_max - that.r(d.value)) * 2;
			});

	canvas.selectAll('.c01_legend_amount_sales_text')
		.data(data).enter()
			.append('text')
			.attr('data-id', function(d, i){return i})
			.attr('data-value', function(d){return d.value})
			.attr('class', function(d){
				if(d.value == that.limit_amount_sales) return 'c01_legend_amount_sales_text c01_legend_amount_sales_text_on';
				return 'c01_legend_amount_sales_text';
			})
			.attr('id', function(d, i) {
				return "c01_legend_amount_sales_text_"+ i;
			})
			.attr('x', r_max + line_width + 2)
			.attr('y', function(d) {
				return (r_max - that.r(d.value)) * 2;
			})
			.attr('dy', function(d, i){
				if(i==3) return 10;
				return 5;
			})
			.text(function(d){return d.label})
			.on('mousemove', mousemove_legend_amount_sales)
			.on('mouseout', mouseout_legend_amount_sales)
			.on('click', click_legend_amount_sales);

};

scatter_salary.suggestCompany = function(list){
	var that = this;
	// var tsv = c.data;
	var list = list;
	// console.dir(list);
	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			matches = [];
			substrRegex = new RegExp(q, 'i');
			$.each(strs, function(i, obj) {
				var str = obj.name;
				if (substrRegex.test(str) || substrRegex.test(obj.name_en)) {
					//value: nk_type_code, name: market_category
					matches.push({ value: obj.nkcode, name: str, name_en: obj.name_en});
				}
				//console.dir(str);
			});
			cb(matches);
		};
	};
	$('#c01_company_search_form').on('submit', function(e){
		e.preventDefault();
		//todo
		var c_name = $('#c01_company_search').val();
		var nkcode = list.filter(function(d){return d.name == c_name})[0].nkcode;
		
		that.selectCompany.call(that, nkcode);
	});
	$('#bloodhound .typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'list',
			displayKey: 'name',

			source: substringMatcher(list),
			templates: {
				empty: [
					'<div class="empty-message">',
					'<span class="glyphicon glyphicon-search"></span>',
					'会社名を入力してください',
					'</div>'
					].join('\n'),
				//suggestion: Handlebars.compile('<p><strong>{{city}}</strong> – {{pref}}</p>')
				//suggestion: _.template('<p><strong><%- city %></strong> – <%- pref %></p>')
				suggestion: _.template('<div><%- name %> - <span class="suggest_results"><%- name_en %></span></div>')
			}
		}
	).on('typeahead:selected', function(d, e){
		var c_name = $('#c01_company_search').val();
		var nkcode = list.filter(function(d){return d.name == c_name})[0].nkcode;
		//c.go2city(e.code);

		//that.selectCompany.call(that, nkcode);
		that.selected_nkcode = nkcode;
		that.scatterYear();
	});
};
//todo: save last selected obj as property
scatter_salary.selectCompany = function(nkcode){
	var obj;

	if(typeof nkcode == 'object') {
		obj = nkcode;
		nkcode = nkcode.data()[0].nkcode;
	} else {
		obj = d3.select("#company_code_"+nkcode);
	}

	if(!nkcode) {
		// console.log('no nkcode');
		if(this.selected_nkcode) {
			this.showLineChartCompanySalary(this.selected_nkcode);
			this.showCompanyInfo(this.selected_nkcode);
		}
		return;
	} else if(nkcode == this.selected_nkcode) {
		this.selected_nkcode = '';
	} else {
		var previous_selected_nkcode = this.selected_nkcode;
		this.selected_nkcode = nkcode;
		d3.selectAll("#company_code_"+previous_selected_nkcode).call(this.position(this));
	}
	d3.selectAll("#company_code_"+nkcode).call(this.position(this));

	this.showLineChartCompanySalary(nkcode);
	this.showCompanyInfo(nkcode);
};
scatter_salary.limit_amount_sales = 100000;
scatter_salary.scatterYear = function(year){
	var that = this;

	if(!year) year = that.year;
	else that.year = year;

	var scatter_g = this.scatter_g;
	var circles_g = this.circles_g;
	//year = parseInt(year) || 2013;
	
	market_category = $('[class="c_input"]:checked').map(function(){
		return +$(this).val();
	});
	year = year+'' || '2014'
	//console.log(year);
	var tsv = this.data;
	// console.dir(tsv);
	var data = tsv.filter(function(d){
		return d.close_year==year&&(d.account>=that.limit_amount_sales||d.nkcode==that.selected_nkcode)
	});
	data = _.sortBy(data, 'salary');

	// console.dir(data);
	var working_time = data.map(function(d){return d.ave_working_year});
	var population = data.map(function(d){return d.employees});
	var salary = data.map(function(d){return d.salary});
	var account = data.map(function(d){return d.account});
	//console.dir(data);
	
	//init todo: s*** code
	circles_g.selectAll(".company_circle").data([]).exit().remove();

	var circles = circles_g.selectAll(".company_circle")
			.data(data);
	circles.enter()
		.append("circle")
		.call(this.position(this))
	;

	//circles.exit().remove();
	circles
		.on('click', function(){
			//that.selectCompany(d3.select(this).data()[0].nkcode);
			that.selectCompany(d3.select(this));
		})
		.on('mousemove', function(d, e, f){
			var mouse = d3.mouse(d3.selectAll("circle").node()).map( function(d) { return parseInt(d); } );
			//this.style.opacity = '.9';
			//this.attr('class', this.attr('class') + ' on');

			that.showCompanyInfo(d);
			// $('.company_info').show()
			that.showLineChartCompanySalary(d.nkcode);

			window.clearTimeout(closeTooltip);
		})
		.on('mouseout', function(d){
			// $('.company_info').hide()
			//this.style.opacity = '.5';
			that.selectCompany();
			//closeTooltip = window.setTimeout(function() {
			//	closePopup();
			//}, 100);
		});

	if(that.selected_nkcode) that.showCompanyInfo(that.selected_nkcode);
};
scatter_salary.showCompanyInfo = function(obj){
	if(typeof obj == 'string') {
		var year = String(this.year);
		obj = this.data.filter(function(d){return d.close_year==year&&d.nkcode==obj})[0];
	}
	if(!obj) return;
	$('#c01_label_company_name').text(obj.name);
	$('#c01_label_salary').html('<span class="label_info">年間給与: </span><span class="number">'+Math.floor(obj.salary)+'</span><span class="unit">万円</span>');
	$('#c01_label_employee').html('<span class="label_info">従業員数: </span><span class="number">'+obj.employees+'</span><span class="unit">人</span>');
	$('#c01_label_working_time').html('<span class="label_info">勤続年数: </span><span class="number">'+obj.working_time+'</span><span class="unit">年</span>');
	// $('#c01_label_stockcode').text(' - '+obj.stockcode+'');
	$('#c01_label_account').html('<span class="label_info">売上高: </span><span class="number">'+Math.round(obj.account*10)/1000+'</span><span class="unit">億円</span>');
	$('#c01_label_close').html('<span class="label_info">決算期: </span><span class="number">'+obj.close_year+'年'+obj.close_month+'月'+'');
};
scatter_salary.position =  function(that){
	return function(dot) {


		dot 
			.attr("id", function(d) {
				//return d.code;
				return "company_code_"+ d.nkcode;
			})
			.attr("class",function(d){
				var zaima_code = nkcode_arr.filter(function(e){return e.nk_type_code==d.nk_type_code})[0].zaima_code;
				var class_name = 'company_circle company_circle_' + zaima_code;

				if(d.nkcode == that.selected_nkcode) class_name += ' company_circle_clicked';

				if($("#c_input_"+zaima_code).prop('checked') || d.nkcode == that.selected_nkcode) return class_name + ' company_circle_on';
				return class_name + ' company_circle_disable';
				//return "company_circle company_circle_"+  d.nk_type_code;
			})
			.attr("cx", function(d) {
				if(d.code == "H44") console.log('salary: %s, wtime: %s', d.salary, d.working_time);
				return that.x_working(d.working_time);
			})
			.attr("cy", function(d) {
				return that.y(d.salary);
			})
			.attr("r", function(d){
				// return Math.abs(that.r(d['労働者数【十人】']));
				return Math.abs(that.r(d.account));
			})
			.sort(function(a, b) {
				return b.employees - a.employees;
			});
	}
};
scatter_salary.showLineChartCompanySalary = function(nkcode){
	var that = this;
	$('#c01_line_chart_salary').css('display', 'inline-block');
	var data = that.data.filter(function(d){return d.nkcode==nkcode}).map(function(d){return {salary: d.salary, year:d.close_year, category: d.category}});
	var category_arr = _.uniq(_.pluck(data, 'category'));
	// console.log('%s, %o, %o', nkcode, category_arr, data);
	var data_by_category = category_arr.map(function(category){return data.filter(function(d){return d.category==category})});
	// console.dir(data_by_category);

	//$('#c01_chart_company_salary').html(''); //not work on ie and safari
	d3.select(that.target+' > g').remove();

	//show layout of charts
	var svg = that.showLineChart({
		width: width_line,
		height: height,
		margin: margin_line,
		data: data.map(function(d){return {xv: d.year, yv: d.salary, zv: category_arr.indexOf(d.category)}}),
		y: that.y,
		axis_showing_flg: 0,
		category_arr: category_arr
	});

	that.x.domain([2001,2014]);

	var xAxis = d3.svg.axis()
		.scale(that.x)
		.tickFormat(d3.format())
		.ticks(5)
		.orient("bottom");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + that.height + ")")
		.call(xAxis);

	var yAxis = d3.svg.axis()
		.scale(that.y)
		.innerTickSize(-that.width)
		.outerTickSize(0)
		.tickPadding(10)
		.orient("right");

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + that.width + ",0)")
		.call(yAxis)
		//.append("text")
		//.attr("transform", "rotate(-90)")
		//.attr("y", 6)
		//.attr("dy", ".71em")
		//.style("text-anchor", "end")
		//.text("年収（万円）")
		;

	var line = d3.svg.line()
		.x(function(d) { return that.x(d.year); })
		.y(function(d) { return that.y(d.salary); });

	$('#c01_legend_company_salary').html('');
	data_by_category.map(function(data_each_category, i){
		// console.dir(data_each_category);
		svg.append("path")
			.datum(data_each_category)
			.attr("stroke", function(d){
				return that.color(i);
			})
			.attr("class", "c01_line_company_salary")
			.attr("d", line);

		//if(data_by_category.length > 1) {
			$('#c01_legend_company_salary').append(
				  '<div class="c01_swatch_box">'
				+ '<span class="c01_swatch" style="background-color:'+that.color(i)+'"></span>'
				+ data_each_category[0].category
				+'<span class="c01_chart_company_salary_legend_feagure" id="c01_chart_company_salary_legend_feagure_'+i+'">-</span>万円'
				+'</div>')
		//}

	});
};
scatter_salary.selectMarketCircle = function(){
	var that = this;
	var zaima_category = _.uniq(nkcode_arr,"zaima_category");

	zaima_category.map(function(d,n,data){
		var cbox = d3.select("#c01_category_list")
				.append("label")
				.attr("class","legend_label label_square_" + d.zaima_code)
			;

		
		var category_checkbox = cbox.append("input")
			.attr("class","swatch_category_check")
			.attr("id","c_input_"+d.zaima_code)
			.attr("type","checkbox")
			// .attr("value",d.nk_type_code)
			.attr("value", d.zaima_code)
			.attr("name", d.zaima_category)
			.attr('checked', ['G','Q','S'].indexOf(d.zaima_code)!=-1 ? true : null)
			.on("change",function(d){
				//console.log("change");
				
				var zaima_code = $(this).val();
				var nk_type_arr = nkcode_arr
					.filter(function(d){return d.zaima_code==zaima_code})
					.map(function(d){return d.nk_type_code})

				nk_type_arr.map(function(nk_type_code){
					d3.selectAll(".company_circle_"+  zaima_code)
					.call(that.position(that));
					;
				});
			})
		;
			
		cbox.append("div")
			.attr("class","legend_category")
			.text(d.zaima_category)
		;
	});

}





var lc_salary_curve = new showCharts({
	target: '#c02_chart_salary_curve',
	init: function(){
		d3.tsv('./data/salary_ages_categories.tsv', function(tsv){
			tsv.forEach(function(d){
				d.annual_income = +d.annual_income;
				d.year = +d.year;
				d.age = +d.age;
				d.salary_index = +d.salary_index;
				d.category_label = d.category.replace(/^[A-Z] /, '');
			});
			// this.tsv = tsv.filter(function(d){return d.employees!='0'});
			this.tsv = tsv.filter(function(d){return d.salary_index!='0'});
			
			$(this).trigger('onComplete');

			this.showLineChartByCategory('G 情報通信業');
			this.showCategoryList();
		}.bind(this));
	}
});






/** Mji curve */
var closeTooltip;
var str;
var data_label = [
	{props:"employed",label_line:"就業率",label_bar:"非正規率",color_line:"#046380",color_bar:"#f4da70"}
	// ,{props:"non_regular",label:"非正規率",color:"#ffe79d",strong_color:"#ff7f0e"}
];

var woman_employee = new showCharts({
	init: function(){
		var that = this;
		d3.tsv("data/all_mcurve.tsv",function(data){
			data.forEach(function(d){
				d.year = +d.year;
				d.age = +d.age;
				d.age4data = +d.age4data;
				d.employed = +d.employed;
				d.non_regular = +d.non_regular;
				return d;
			})
			that.data = data;
			
			var data2013 = _.filter(data,function(d){return d.year == 2013&&d.sex=="F";});
			
			var width, height, margin;
			switch(that.device_type) {
				case 'sp':
					width = 500;
					height = 280;
					margin = {top: 30, right: 10, bottom: 30, left: 30, middle:40};
					break;
				case 'tb':
					width = 750;
					height = 420;
					margin = {top: 30, right: 10, bottom: 30, left: 30, middle:40};
					break;
				case 'pc': default:
					width = 860;
					height = 480;
					margin = {top: 30, right: 10, bottom: 30, left: 30, middle:40};
					break;
			}
			var margin = margin,
			width = width - margin.left - margin.right - margin.middle,
			height = height - margin.top - margin.bottom;

			that.width = width;
			that.height = height;

			d3.select("#c03_m_curve")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.select("#c03_m_curve_line_area")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var svg = d3.select("#c03_m_curve_line_area");
			that.svg = svg;

			//scale
			that.x = d3.scale.linear().range([0,width]);
			that.y = d3.scale.linear().range([height,0]);

			var xAxis = d3.svg.axis().scale(that.x).orient("bottom");
			var yAxis = d3.svg.axis().scale(that.y)
				.innerTickSize(-width)
				.outerTickSize(0)
				.tickPadding(10)
				.orient("left");


			//domain
			that.x.domain([15,75]);
			// that.y.domain([0,d3.max(data2013,function(d){return d.employed})]);
			that.y.domain([0,85]);

			$(that).trigger('onComplete');

			svg.select("#xaxis")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.append("text")
				.attr("x", width)
				.attr("y", 0)
				.attr("dy", "-0.5em")
				.style("text-anchor", "end")
				.attr("class", "axis_text_label")
				.text("年齢階級（歳）");

			svg.select("#yaxis")
				.attr("class","y axis")
				.call(yAxis)
				.append("text")
				// .attr("transform","rotate(-90)")
				.attr("x", 104)
				.attr("y", 19)
				.attr("dy", ".91em")
				.style("text-anchor", "end")
				.attr("class", "axis_text_label")
				.text("就業率・非正規率(%)")
				;

			data_label.map(function(property, i){
				var line_svg = svg.select("#line").append("g").attr("id",property.props);
				//労働力調査のデータが１０年刻みなので、データを５年刻みに揃えるために値のないオブジェクトを削除している
				
				var year = _.uniq(_.pluck(data,"year"));
				year.map(function(datayear){
					var reduced_data = _.filter(data,function(d){if(d[property.props] != '')return d.year == datayear&&d.sex=="F";});
					var line2 = d3.svg.line()
						.x(function(d){return that.x(d.age4data)})
						.y(function(d){return that.y(d[property.props])});
					line_svg.append("path")
						.datum(reduced_data)
						.attr("stroke",property.color)
						/*.attr("stroke-width", 3)
						.attr("opacity",.2)*/
						.attr("class", "c03_Mji_curve_line")
						.attr("id","line_"+property.props+datayear)
						.attr("d", line2)
						.on('mousemove', function(d, e, f){
							var mouse = d3.mouse(d3.selectAll("path").node()).map( function(d) { return parseInt(d); } );

							var year = d[0].year;

				    		that.emphasizeData(year);
				    		that.setBar(year, "bar");
				    		$("#c03_m_curve_year").text(year);
							$("#c03_m_curve_slider").slider('setValue',year);
							d3.select(this).attr('class', 'c03_Mji_curve_line c03_Mji_curve_line_hover');

							// show tooltip
							// var str='';
							// str += year + "年<br>";
							// //this.style.opacity = '.9';
							// //d3.select(this).attr("stroke",property.strong_color);

							// var popup = document.getElementById('popup');
							// d.map(function(f){str +=f.age_label+'就業率:'+f.employed+', 非正規比率:'+f.non_regular+'<br>'});
							// popup.innerHTML = str;
							// popup.style.display = 'block';

							window.clearTimeout(closeTooltip);
						})
						.on('mouseout', function(d){
							//this.style.opacity = '.2';
							//d3.select(this).attr("stroke",property.color);
							d3.select(this).attr('class', 'c03_Mji_curve_line');


							closeTooltip = window.setTimeout(function() {
								// document.getElementById('popup').style.display = 'none';
								$("#c03_m_curve_slider").slider('setValue', that.year);
					    		that.emphasizeData(that.year);
					    		that.setBar(that.year, "bar");
					    		$("#c03_m_curve_year").text(that.year);
							}, 100);
						})
						;
				});

				
				var show_legend_color = d3.select("#c03_m_curve_legend")
					.append("li")
					.attr("class","c03_m_curve_legend"+property.props)
					.append("span").text("■").style({"color": property.color_line})
					.append("span").text(property.label_line).style({"color": "#000"})
				var show_legend_color = d3.select("#c03_m_curve_legend")
					.append("li")
					.attr("class","c03_m_curve_legend"+property.props)
					.append("span").text("■").style({"color": property.color_bar})
					.append("span").text(property.label_bar).style({"color": "#000"})

					;
				// var show_legend = d3.select("#c03_m_curve_legend"+property.props).append("span").text(property.label);
			});

			//comparative barchart
			that.setBar(2013, "basebar");
			//slider
			$("#c03_m_curve_slider").slider({
				formatter: function(value) {
					that.year = value;
		    		that.emphasizeData(value);
		    		that.setBar(value, "bar");
		    		$("#c03_m_curve_year").text(value);
					return value;
				}
			});
		});

	}

});

woman_employee.emphasizeData = function(y_value){
	var that = this;

	d3.select("#employed").selectAll("path").attr("stroke",data_label[0].color);
	// d3.select("#non_regular").selectAll("path").attr("stroke",data_label[1].color);

	//d3.selectAll(".line2").style({opacity:.2});
	d3.selectAll(".c03_Mji_curve_line").attr('class', 'c03_Mji_curve_line');

	d3.select(".c03_Mji_curve_line#line_employed"+y_value).attr('class', 'c03_Mji_curve_line c03_Mji_curve_line_hover');
}

woman_employee.setBar = function (year, targetid) {
	var that = this;
	var year = year+'' || '2013';
	var svg = that.svg;
	var tsv = this.data;
	var data = _.filter(tsv,function(d){return d.year == year&&d.sex=="F";});
	var target = targetid;
	var class_name;
	if(targetid=='basebar') {
		class_name = 'c03_bar c03_basebar' + (year<1988?' c03_bar_disable':'');
	}
	else {
		class_name = 'c03_bar c03_bar' + (year<1988?' c03_bar_disable':'');
		if(year<1988) d3.selectAll('.c03_basebar').attr('class', 'c03_bar c03_basebar c03_bar_disable');
		else d3.selectAll('.c03_basebar').attr('class', 'c03_bar c03_basebar');
	}
	var bar_padding = 12;
	var range = that.width / data.length - bar_padding;

	if(svg.select("#"+target).selectAll("rect").size() > 0) {
		var barcharts = svg.select("#bar").selectAll(".c03_bar")
			.data(data).transition().ease('linear')
			.attr("class", class_name)
			.attr("y", function(d) { return that.y(d.non_regular); })
			.attr("height", function(d){return that.height - that.y(d.non_regular);})
			;
	} else {

		var barcharts = svg.select("#"+target).selectAll(".c03_bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", class_name)
			.attr("id", function(d){return target + d.age})
			.attr("x", function(d) {
				// console.log('%s:%s', d.age4data, that.x4bar(d.age4data));
				return that.x(d.age)+bar_padding; })
			// .attr("width", that.x4bar.rangeBand())
			.attr("width", 2*range)
			.attr("y", function(d) { return that.y(d.non_regular); })
			.attr("height", function(d){return that.height - that.y(d.non_regular);})
			;
	}
}

var tokyo_foreigners = new showCharts({
	target: '#c04_chart_foreginers_pop',
	init: function(){
		var that = this;
		d3.tsv('./data/tokyo_foreigner_pop.tsv', function(tsv){
			//console.dir(tsv);
			//todo loop country_list 
			tsv.forEach(function(d){
				for(var i = 0; tokyo_foreigners.country_list.length > i; i++) {
					d[tokyo_foreigners.country_list[i].props] = (isNaN(d[tokyo_foreigners.country_list[i].props]))? 0 : +d[tokyo_foreigners.country_list[i].props]
				}	
				d.pop_total		 = (isNaN(d.pop_total))? 0 :+d.pop_total;
				d.year 			 = +d.year;
			});
			that.data = tsv;

			$(that).trigger('onComplete');

			// create a map in the "map" div, set the view to a given place and zoom
			var map = L.mapbox.map('map').setView([35.668974, 139.477661], 10);
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
						maxZoom: 18,
						attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
							'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="http://mapbox.com">Mapbox</a>',
						id: 'examples.map-20v6611k'
					}).addTo(map);


			var tokyoLayers = new Layers(map);
			tokyoLayers.mousemove_class = 'c04_polygon_mousemove';

			//decide number of color
			tokyoLayers.getColorNo = function(data){
				// console.log(data.id);
				var obj = that.data.filter(function(d){return d.year==2014&&d.city_code==data.id});
				if(!obj || !obj[0]) return 5;

				var total = obj[0].pop_total;
				if(total > 19999) return 0;
				if(total > 9999) return 1;
				if(total > 4999) return 2;
				if(total > 999) return 3;
				// if(total > 0) return 4;
				// if(data.id = "UNK" ) return 5;
				return 4;
			};
			tokyoLayers.color_arr = [
				{label: '2万人〜', color: '255,77,0'}, //green
				{label: '1万人〜', color: '232,147,12'}, //purple
				{label: '5000人〜', color: '255,213,0'}, //orange
				{label: '1000人〜', color: '185,232,12'},
				{label: '〜999人', color: '112, 236, 20'},
				{label: 'データなし', color: '90,90,90'},
			];
			tokyoLayers.getColor = function(data){
				var color_no = this.getColorNo(data);
				//return 'rgba('+this.color_arr[color_no].color+', .7)';
				return 'rgb('+this.color_arr[color_no].color+')';
			};
			tokyoLayers.setLegend = function(){
				var labels = [], label = '';
				var label_unit = '', legend_memo = '';
				for(var i=-1,l=this.color_arr.length;++i<l;) {
					labels.push(
						'<li><span id="legend_color_'+i+'" class="swatch" style="background:rgba(' + this.color_arr[i].color + ', 0.7)"></span> '
						+ '<span id="legend_label_'+i+'">'+this.color_arr[i].label+'</span>') + '</li>\n';
				}
				var legend_HTML = '<span>凡例'+(label_unit?' ('+label_unit+')':'')+'</span><ul style="list-style-type: none;">' + labels.join('') + legend_memo+'</ul>';
				this.map.legendControl.removeLegend(this.legend_HTML);
				this.legend_HTML = legend_HTML;
				this.legend = this.map.legendControl.addLegend(legend_HTML);
			};
			tokyoLayers.setBaloonHTML = function(props){
				//console.log(props.id);
				var html='';
				if(!props.id) return false;

				var polygon_id = +props.id;
				var obj = that.data.filter(function(d){return d.city_code==polygon_id})[0];
				if(!obj) return false;
				var title = obj.city;
																					
				var str = '';
									
				str += '<div class="c04_map_balloon_pop">総数: <span class="c04_map_balloon_pop_feagure">' + obj.pop_total + '</span>人</div>';
				// set data
				var pop_etc_total = 0, pop_etc_in_raning_flg = 0;
				var pop_data = _.sortBy(
					tokyo_foreigners.country_list.map(function(d){
						return {label:d.label, pop:obj[d.props],props:d.props}
					}), 'pop').reverse();
				//console.dir(pop_data);
				pop_data.map(function(d, i){
					if(    (i<5 && d.props!='pop_etc')
						|| (i==5 && pop_etc_in_raning_flg)
					) {
						str += '<div class="c04_map_balloon_pop">'
							+(pop_etc_in_raning_flg?i:i+1)
							+'位 '+d.label
							+': <span class="c04_map_balloon_pop_feagure">'+d.pop+'</span>'
							+'人</div>';
						return;
					}
					if(d.props == 'pop_etc') {
						pop_etc_in_raning_flg = 1;
					}
					pop_etc_total += d.pop;
				});
				str += '<div class="c04_map_balloon_pop">6位以降: <span class="c04_map_balloon_pop_feagure">' + pop_etc_total + '</span>人</div>';

				html = '<div class="marker-title">' + title + '</div>' 
					//+ 'id: ' + layer.feature.properties.id + '<br>'
					+ str
					;
				return html;
			};

			// should not use "_path" and care about default class name by mapbox
			tokyoLayers.zoomToFeature = function(e){
				var layer = e.target;
				var city_id = layer.feature.properties.id;
				if(city_id == that.selected_city) { //remove
					d3.select(layer._path)
					.attr('class', '');
					that.showLineChartForeignersPop('13000');
					// that.setCommonSwatch2Defalut('13000');
					that.selected_city = '';
					return;
				}
				//remove class already selected 
				d3.selectAll('.c04_polygon_selected')
					.attr('class', '');

				that.selected_city = city_id;
				d3.select(layer._path)
					.attr('class', 'c04_polygon_selected')
					;
				that.showLineChartForeignersPop(city_id);
				// that.setCommonSwatch2Defalut(city_id);
				//this.map.fitBounds(layer.getBounds());

				//c.showBarChart(layer.feature.properties.id);
			};

			tokyoLayers.addLayer('./data/tokyo.topojson', {}, function(e){
				// highlight default cuty: 13118
				d3.select(
					_.filter(
						this.Layer.getLayers()
						, function(e){return e. feature.properties.id == that.selected_city}
					)[0]._path)
					.attr('class', 'c04_polygon_selected');
			});
			tokyoLayers.setLegend();

			// highlight default cuty: 13113
			that.selected_city = '13113';
			that.showLineChartForeignersPop(that.selected_city);

		});
		// resize
		var resizeTimer;
		window.addEventListener('resize', function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function(){

			}, 300);
		}, false);

	}
});
tokyo_foreigners.country_list = [
	{label: "ミャンマー", props:"pop_myanmar", color: '#dc7682'},
	{label: "中国", props:"pop_china", color: '#b94537'},
	{label: "インド", props:"pop_india", color: '#865f99'},
	{label: "インドネシア", props:"pop_indonesia", color: '#86a1a0'},
	{label: "韓国・朝鮮", props:"pop_korea", color: '#88b131'},
	{label: "フィリピン", props:"pop_philippine", color: '#cdbe9d'},
	{label: "タイ", props:"pop_thai", color: '#d97253'},
	{label: "ベトナム", props:"pop_vietnam", color: '#72714b'},
	{label: "フランス", props:"pop_france", color: '#5289bb'},
	{label: "ドイツ", props:"pop_germany", color: '#e3b21c'},
	{label: "イタリア", props:"pop_italy", color: '#24a3a0'},
	{label: "英国", props:"pop_uk", color: '#bf88b5'},
	{label: "カナダ", props:"pop_canada", color: '#ba3395'},
	{label: "米国", props:"pop_us", color: '#525cda'},
	{label: "ブラジル", props:"pop_brazil", color: '#d8911a'},
	{label: "オーストラリア", props:"pop_australia", color: '#71440e'},
	{label: "その他", props:"pop_etc", color: '#464646'}
];
tokyo_foreigners.showLineChartForeignersPop = function(code){
	var that = this;
	code =  +code;

	//区部等の未定義のものをはじく
	if(code == 0)return;

	//show city name as title
	var title = that.data.filter(function(d){return d.city_code==code})[0].city;
	$('#chart_title').text(title);

	
	var data_the_city = this.data.filter(function(d){return d.city_code==code});
	var country_list = that.country_list;
	
	var year_arr = _.uniq(this.data.map(function(d){return d.year}));

	that.color = d3.scale.category20();
	
	//show layout of charts
	//$(that.target).html(''); //not work on ie and safari
	d3.select(that.target+' > g').remove();

	
	var width, height, margin;
	switch(that.device_type) {
		case 'sp': case 'tb':
			width = 300;
			height = 200;
			margin = {top: 10, right: 10, bottom: 20, left: 50};
			break;
		case 'tba':
			width = 400;
			height = 270;
			margin = {top: 10, right: 10, bottom: 20, left: 50};
			break;
		case 'pc': default:
			width = 400;
			height = 270;
			margin = {top: 10, right: 10, bottom: 20, left: 50};
			break;
	}
	var city_data = data_the_city.map(function(d){return country_list.map(function(e){return {xv:d.year,yv:d[e.props], zv:e.props, label:e.label, color:e.color}})}).reduce(function(a,b){if(a)return a.concat(b)});

	var svg = that.showLineChart({
		width: width,
		height: height,
		margin: margin,
		data: city_data,
		axis_showing_flg: 0,
		category_arr: country_list
	});

	var xAxis = d3.svg.axis().scale(that.x)
		.tickFormat(d3.format())
		.orient("bottom");

	var yAxis = d3.svg.axis()
			.scale(that.y)
			.innerTickSize(-that.width)
			.outerTickSize(0)
			.tickPadding(10)
			.orient("left");

	var pop_max = _.max(country_list.map(function(d){return _.max(data_the_city, d.props)[d.props]}));
	//domain
	that.x.domain(d3.extent(year_arr,function(d){return d;}));
	that.y.domain([0,pop_max]);
	//y.domain([0,d3.max(obj_for_axis,function(d){return d.pop_china})]);

	var target_div = '#c04_chart_foreginers_pop';

	//var svg = d3.select(target_div);


	svg.append('g')
		.attr('id', 'xaxis')
		.attr("class", "x axis")
		.attr("transform", "translate(0," + that.height + ")")
		.call(xAxis);

	svg.append('g')
		.attr('id', "yaxis")
		.attr("class","y axis")
		.call(yAxis)
		.append("text")
		// .attr("transform","rotate(-90)")
		.attr("x", 70)
		.attr("y", 5)
		.attr("dy", ".5em")
		.style("text-anchor", "end")
		.attr("class", "axis_text_label")
		.text("外国人人口(人)")
		;

	$('#c04_chart_foreginers_pop_legend').html('');
	country_list.map(function(property, i){
		
		var obj = that.data.filter(function(d){if((isFinite(d[property.props]))) return d.city_code==code});
		//console.log('name: %s, c: %s',property.props,color(property.props));
		if(!d3.select("#"+property.props).size()) {
			var line_svg = svg.append("g")
				.attr("id",property.props)
				;
			//console.log('-------'+property.props+ code +'------')
			var line2 = d3.svg.line()
				.x(function(d){
					//console.log('year: %d, x: %d',d.year,x(d.year));
					return that.x(d.year)})
				.y(function(d){
					//console.log('pop: %d, y: %d', d[property.props],y(d[property.props]));
					return that.y(d[property.props])
					});
			line_svg.append("path")
				.datum(obj)
				.attr("stroke", property.color)
				.attr("stroke-width", 1)
				.attr("class", "c04_chart_foreigners_pop")
				.attr("id","line_"+property.props)
				.attr("d", line2)
				;
		} else {
			var line_svg = svg.select("#"+property.props)
				;

			var line2 = d3.svg.line()
				.x(function(d){
					return that.x(d.year)})
				.y(function(d){
					return that.y(d[property.props])
					});

			line_svg.select("path")
				.datum(obj)
				.attr("d", line2)
				;
		}


		$('#c04_chart_foreginers_pop_legend').append(
			  '<div class="common_swatch_box">'
			+ '<span class="common_swatch" style="background-color:'+that.color(property.props)+'"></span>'
			+ property.label
			+'<span class="c04_chart_foreginers_pop_legend_feagure" id="c04_chart_foreginers_pop_legend_feagure_'+property.props+'"> - </span>人'
			+'</div>')

	});

	that.setCommonSwatch2Defalut(city_data);
		
};
tokyo_foreigners.setPopValue = function(that){
	return function (text) {
		console.dir(text);
		text
			.attr("class", 'bar_pop_value')
			.attr("x", '0') //function(d) { return x(d.label) + x.rangeBand()/2; }
			.attr("y", function(d) { return that.y(d.label); })
				.text(function(d){return d.pop+'人'})
	}
};

tokyo_foreigners.setBar = function(that){
	return function (bar) {
		bar
			.attr("class", "bar")
			.attr("x", '0') //function(d) { return x(d.label); }
			.attr("width", function(d) { return that.x(d.pop); }) //x.rangeBand()
			.attr("y", function(d) { return that.y(d.label); }) //function(d) { return y(d.pop); }
			.attr("height", that.y.rangeBand()) //function(d) { return height - y(d.pop); }
			.attr('fill', function(d){return that.color(d.label)})
			;
	}
};

tokyo_foreigners.setCommonSwatch2Defalut = function(data){
	var that = this;
	var city_data = data;

	// set baloon
	var swatch_html = '';
	var data4legend = city_data.filter(function(d){return d.xv==2014});
	data4legend = _.sortBy(data4legend, 'yv').reverse();
	data4legend.map(function(d, i){
		swatch_html += '<div class="common_swatch_box">'
		+ '<span class="common_swatch" style="background-color:'+(d.color?d.color:that.color(d.zv))+'"></span>'
		+ d.label+' '+(isFinite(d.yv)?d.yv:0)+'人</div>'
	});
	var balloon_left;
	var padding_balloon = 4;
	d3.select('#c04_chart_foreginers_pop_balloon')
		.html(swatch_html);

};

// (function(){
// 	var ua = navigator.userAgent;
// 	//if(typeof console == 'object' && typeof console.log == 'function') 
// 	if(!/MSIE/.test(ua)||/MSIE 1/.test(ua)) console.log('%c\r\n\r\n\r\n\r\n                                                  nike\r\n    Nkieee__                    ______--eeeeKENNNNNNNeeeee\r\n     eIƎ⋊⋊ININNINNNNINƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎKKı    ǝeIƎIƎIƎIƎƎƎƎƎ\r\n     IIIIIINNNKKKKKKKIIINNNNNNNNNNKKKKi         KKKKKNNNNNEEEIie\r\n      I⋊⋊IN⋊⋊IN⋊⋊IN⋊⋊                          NINNNIIIIKKKK\r\n          ǝiINIIIIIINN          ___             eKKKKKKEEEIII\r\n           ǝƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎƎ        IkKKKKKNNNNN\r\n             NNNKKKKKKK                       ⋊⋊⋊⋊⋊⋊⋊⋊⋊⋊\r\n             nikKKKKKKK__         ______eeeKEEEƎƎƎƎƎƎƎƎƎƎ\r\n          eeeKKKKKKKKKKKKKKKNNNNNNNNNNNNNNNNNNIIIIIIIIIII\r\n             IIIƎƎƎƎƎƎƎƎƎƎee               eƎƎƎƎƎƎƎƎƎNNNi\r\n              eeeeeeeeee                             ıǝ\r\n\r\n\r\n\r\n\r\n               _______                           eIIINke\r\n             eIENNNNNNNEe         ________--eeEINNNNNNEke\r\n              NNNNNNNeee____e_         eEEEEEEEEEe\r\n            ekIKE      ekEEEEEK         kNEEEEEEN   NEEEke\r\n     __enniiii     _eiiNNK      e         NEEEEEN   eiiEEEENe\r\n   ekEEEEEEEEEEEEEEEEEEEEk      iIEEkiI     EEEEıǝıǝıǝʞǝe  ıǝ\r\n    eNEEEǝ   ʞEe      ⋊EEEEe     ʞEEEE     EEEEEe\r\n     ʞʞ   __eNE _eekEǝǝǝ ǝǝ          ǝ     eNKEEEEEKe\r\n       eʞEEEEEEǝ        e           _eeeiIIEEEEEEǝǝ\r\n     eikIEǝ   _          ǝʞiike            ⋊IEEEK    _ee_\r\n       .      ⋊IIke                    _⋊⋊iIEEEEEEEEEEEEEEKkee_\r\neIeeeiI          ⋊IieeeeeeeeeeeeeiiIIEEEIIǝ ǝǝǝǝ          ǝǝEEEEe\r\neiEEEEEe                   ǝiʞʞʞʞʞʞʞʞeee\r\n   ʞʞʞʞʞe\r\n\r\n\r\n\r\n           http://www.nikkei.co.jp/saiyo/ \r\n\r\n\r\n%c', 'color:#325082  ','font-size:1.5em');
// })()
