var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
// データセット
var dataSet = {
	children : [
		{ value : 10 },
		{ value : 8 },
		{ value : 2 }
	]
}
// ツリーマップレイアウト
var treemap = d3.layout.treemap()
	.size([svgWidth, svgHeight])	// SVG要素の幅に合わせる
// ツリーマップを描画する
var tmap = d3.select("#myGraph")
	.selectAll("rect")	// rect要素を指定
	.data(treemap.nodes(dataSet))	// ノードを対象に処理
// 分割マップ領域を追加
tmap.enter()
	.append("rect")	// rect要素を追加
	.attr("class", "block")	// CSSクラスを追加
	.attr("x", function(d, i) {	// X座標を設定
		return d.x;
	}) 
	.attr("y", function(d, i) {	// Y座標を設定
		return d.y;
	})
	.attr("width", function(d, i) {	// 横幅を設定
		return d.dx;
	})
	.attr("height", function(d, i) {	// 縦幅を設定
		return d.dy;
	})