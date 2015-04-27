var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var offsetX = 30;	// 横のオフセット
var offsetY = 20;	// 縦のオフセット
var scale = 2.0;	// 2倍サイズでグラフを描画
var dataSet = [
	[
		{ year : 2004, value : 10 },
		{ year : 2005, value : 47 },
		{ year : 2006, value : 65 },
		{ year : 2007, value : 8 },
		{ year : 2008, value : 64 },
		{ year : 2009, value : 99 },
		{ year : 2010, value : 75 },
		{ year : 2011, value : 22 },
		{ year : 2012, value : 63 },
		{ year : 2013, value : 80 }
	],
	[
		{ year : 2004, value : 90 },
		{ year : 2005, value : 77 },
		{ year : 2006, value : 55 },
		{ year : 2007, value : 48 },
		{ year : 2008, value : 64 },
		{ year : 2009, value : 90 },
		{ year : 2010, value : 85 },
		{ year : 2011, value : 42 },
		{ year : 2012, value : 13 },
		{ year : 2013, value : 40 }
	],
	[
		{ year : 2004, value : 50 },
		{ year : 2005, value : 27 },
		{ year : 2006, value : 45 },
		{ year : 2007, value : 58 },
		{ year : 2008, value : 84 },
		{ year : 2009, value : 70 },
		{ year : 2010, value : 45 },
		{ year : 2011, value : 22 },
		{ year : 2012, value : 30 },
		{ year : 2013, value : 90 }
	]
];
var margin = svgWidth /(dataSet[0].length - 1);	// 折れ線グラフの間隔を算出
drawGraph(dataSet[0], "itemA", "linear");	// データセット内の最初のデータ
drawGraph(dataSet[1], "itemB", "linear");	// データセット内の2番目のデータ
drawGraph(dataSet[2], "itemC", "linear");	// データセット内の3番目のデータ
drawScale();	// 目盛りを表示
// 折れ線グラフを表示するための関数
function drawGraph(dataSet, cssClassName, type){
	// 折れ線グラフの座標値を計算するメソッド
	var line = d3.svg.line()	// svgのライン
		.x(function(d, i){
			return offsetX + i * margin;	// X座標は出現順番×間隔
		})
		.y(function(d, i){
			return svgHeight - (d.value * scale) - offsetY;	// データからY座標を減算
		})
		.interpolate(type)	// 折れ線グラフの形状を設定
	// 折れ線グラフを描画
	var lineElements = d3.select("#myGraph")
		.append("path")	// データの数だけpath要素が追加される
		.attr("class", "line "+cssClassName)	// CSSクラスを指定
		.attr("d", line(dataSet))	//連続線を指定
}
// グラフの目盛りを表示するための関数
function drawScale(){
	// 目盛りを表示するためにD3スケールを設定
	var yScale = d3.scale.linear()  // スケールを設定
		.domain([0, 100])   // 元のサイズ
		.range([scale*100, 0]) // 実際の出力サイズ
	// 目盛りを表示
	d3.select("#myGraph")	// SVG要素を指定
			.append("g")	// g要素を追加。これが目盛りを表示する要素になる
			.attr("class", "axis")	// CSSクラスを指定
			.attr("transform", "translate("+offsetX+", "+offsetY+")")
			.call(
				d3.svg.axis()
				.scale(yScale)  //スケールを適用する
				.orient("left") //目盛りの表示位置を左側に指定
			)
		// 横方向の線を表示する
		d3.select("#myGraph")
			.append("rect")	// rect要素を追加
			.attr("class", "axis_x")	// CSSクラスを指定
			.attr("width", svgWidth)	// 線の横幅を指定
			.attr("height", 1)	// 線の縦幅を指定
			.attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY-0.5)+")")
}

