var svgWidth = 580;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var dataSet = [10, 47, 65, 8, 64, 99, 75, 22, 63, 80];	// データセット
var margin = svgWidth/(dataSet.length - 1);	// 折れ線グラフの間隔を算出
// 折れ線グラフの座標値を計算するメソッド
var line = d3.svg.line()	// svgのライン
	.x(function(d, i){
		return i * margin;	// X座標は出現順番×間隔
	})
	.y(function(d, i){
		return svgHeight - d;	// データからY座標を減算
	})
// 折れ線グラフを描画
var lineElements = d3.select("#myGraph")
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "line")	// CSSクラスを指定
	.attr("d", line(dataSet))	//連続線を指定