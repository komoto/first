// 棒グラフのデータ（データセット）
var dataSet = [300, 130, 5, 60, 240];
// データにもとづいて描画する
d3.select("#myGraph")	// SVG要素を指定
	.append("rect")	// SVGの四角形を生成
	.attr("x", 0)	// 横棒グラフなのでX座標を0にする
	.attr("y", 0)	// Y座標を0にする
	.attr("width", dataSet[0])	// 最初のデータに基づいて横幅を設定
	.attr("height", "20px")	// 棒グラフの高さを20pxで指定
