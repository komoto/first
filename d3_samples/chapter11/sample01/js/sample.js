var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var barWidth = svgWidth / 11;	// 棒の横幅
// データセット
var dataSet = [
		50, 95, 60, 44, 60, 50, 35, 20, 10, 8,
		56, 70, 65, 42, 22, 33, 40, 53, 52, 89,
		90, 55, 50, 55, 65, 72, 45, 35, 15, 45
];
// ヒストグラムを設定
var histogram = d3.layout.histogram()
	.range([0, 100])
	.bins([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
// ヒストグラムを描画
var barElements = d3.select("#myGraph")
	.selectAll("rect")	// rect要素でヒストグラムを表示
	.data(histogram(dataSet))	// データを対応付け
	.enter()
	.append("rect")	// rect要素を追加
	.attr("class", "bar")	// CSSクラスを追加
	.attr("x", function(d, i){	// X座標を設定
		return i * barWidth;
	})
	.attr("y", function(d, i){	// Y座標を設定
		return svgHeight - d.y;
	})
	.attr("width", barWidth)	// 横幅を設定
	.attr("height", function(d, i){	// 縦幅を設定
		return d.y;
	})