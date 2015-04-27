var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 320;	// SVG要素の高さ
// データセット
var dataSet = {
	value : 40,
	children : [
		{ value : 35 },
		{ value : 10 },
		{ value : 20 },
		{ value : 900,
			children : [
				{ value : 20 },
				{ value : 50 }
			]
		}
	]
}
// パックレイアウト
var bubble = d3.layout.pack()
	.size([320, 320])	// 表示サイズを指定
d3.select("#myGraph")
	.selectAll("circle")	// circle要素を追加
	.data(bubble.nodes(dataSet))	// データセットを要素に設定
	.enter()
	.append("circle")	// データの数だけcircle要素が追加される
	.attr("r", function(d){	// 半径を指定
		return d.r;
	})
	.attr("cx", function(d, i){	// 中心のX座標を指定
		return d.x;	
	})
	.attr("cy", function(d, i){	// 中心のY座標を指定
		return d.y;	
	})

