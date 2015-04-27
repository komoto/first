var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
// データセット
var dataSet = [
		[30, 40], [120, 115], [125, 90], [150, 160], [300, 190],
		[60, 40], [140, 145], [165, 110], [200, 170], [250, 190]
	];
// 散布図を描画
var circleElements = d3.select("#myGraph")
	.selectAll("circle")
	.data(dataSet)
	.enter()
	.append("circle")	// データの数だけcircle要素が追加される
	.attr("class", "mark")	// CSSクラスを指定
	.attr("cx", function(d, i){
		return d[0];	// 最初の要素をX座標にする
	})
	.attr("cy", function(d, i){
		return svgHeight-d[1];	// 2番目の要素をY座標にする
	})
	.attr("r", 5)	// 半径を指定する
