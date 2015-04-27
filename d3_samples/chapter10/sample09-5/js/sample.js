var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
// データセット
var dataSet = [
		[30, 40], [120, 115], [125, 90], [150, 160], [300, 190],
		[60, 40], [140, 145], [165, 110], [200, 170], [250, 190]
	];
// 散布図を描画
var circleElements = d3.select("#myGraph")
	.selectAll("path")
	.data(dataSet)
	.enter()
	.append("path")	// データの数だけpath要素が追加される
	.attr("transform", function(d) { return "translate(" + d[0] + "," + d[1] + ")"; })  // 位置を指定
	.attr("d", d3.svg.symbol().type("cross"))	// ▼を指定する
