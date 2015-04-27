var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var offsetX = 30;	// 横のオフセット
var offsetY = 20;	// 縦のオフセット
var scale = 2.0;	// 2倍サイズでグラフを描画
var dataSet = [
	{ year : 2004, item1 : 10, item2 : 90, item3 : 50 },
	{ year : 2005, item1 : 47, item2 : 77, item3 : 27 },
	{ year : 2006, item1 : 65, item2 : 55, item3 : 45 },
	{ year : 2007, item1 : 8, item2 : 48, item3 : 58 },
	{ year : 2008, item1 : 64, item2 : 64, item3 : 84 },
	{ year : 2009, item1 : 99, item2 : 90, item3 : 70 },
	{ year : 2010, item1 : 75, item2 : 85, item3 : 45 },
	{ year : 2011, item1 : 22, item2 : 42, item3 : 22 },
	{ year : 2012, item1 : 63, item2 : 13, item3 : 30 },
	{ year : 2013, item1 : 80, item2 : 40, item3 : 90 }
];
var margin = svgWidth /(dataSet.length - 1);	// 折れ線グラフの間隔を算出
drawGraph(dataSet, "item1", "itemA", "linear");	// item1のデータ
drawGraph(dataSet, "item2", "itemB", "linear");	// item2のデータ
drawGraph(dataSet, "item3", "itemC", "linear");	// item3のデータ
drawScale();	// 目盛りを表示
// 折れ線グラフを表示するための関数
function drawGraph(dataSet, itemName, cssClassName, type){
	// 折れ線グラフの座標値を計算するメソッド
	var line = d3.svg.line()	// svgのライン
		.x(function(d, i){
			return offsetX + i * margin;	// X座標は出現順番×間隔
		})
		.y(function(d, i){
			return svgHeight - (d[itemName] * scale) - offsetY;	// データからY座標を減算
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
	// 横の目盛りを表示するためにD3スケールを設定
	var xScale = d3.time.scale()  // スケールを設定
		.domain([new Date("2004/1/1"), new Date("2013/1/1")])	// 2004年から2013年まで
		.range([0, svgWidth]) // 出力サイズ
	// 横の目盛りを表示
	d3.select("#myGraph")	// SVG要素を指定
			.append("g")	// g要素を追加。これが目盛りを表示する要素になる
			.attr("class", "axis")	// CSSクラスを指定
			.attr("transform", "translate("+offsetX+", "+(svgHeight - offsetY)+")")
			.call(
				d3.svg.axis()
				.scale(xScale)  //スケールを適用する
				.orient("bottom") //目盛りの表示位置を左側に指定
				.ticks(10)	// 1年ごとの表示にする
				.tickFormat(function(d, i){
					var fmtFunc = d3.time.format("%Y年%m月");	// 変換関数
					return fmtFunc(d);	// 変換した結果を返す
				})
			)
			.selectAll("text")	// 目盛りの文字を対象に処理する
			.attr("transform", "rotate(90)")	// 90度回転
			.attr("dx", "0.7em")	// 位置を調整
			.attr("dy", "-0.4em")	// 位置を調整
			.style("text-anchor", "start")	// 表示位置を指定
}

