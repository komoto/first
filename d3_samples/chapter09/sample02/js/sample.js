var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var offsetX = 30;	// 横のオフセット
var offsetY = 20;	// 縦のオフセット
var scale = 2.0;	// 2倍サイズでグラフを描画
var dataSet = [10, 47, 65, 8, 64, 99, 75, 22, 63, 80];	// データセット
var margin = svgWidth /(dataSet.length - 1);	// 折れ線グラフの間隔を算出
// 折れ線グラフの座標値を計算するメソッド
var line = d3.svg.line()	// svgのライン
	.x(function(d, i){
		return offsetX + i * margin;	// X座標は出現順番×間隔
	})
	.y(function(d, i){
		return svgHeight - (d * scale) - offsetY;	// データからY座標を減算
	})
// 折れ線グラフを描画
var lineElements = d3.select("#myGraph")
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "line")	// CSSクラスを指定
	.attr("d", line(dataSet))	//連続線を指定
// 目盛りを表示するためにスケールを設定
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


