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
// カラーを準備
var color = d3.scale.category10();  // 10色を指定
// パックレイアウト
var bubble = d3.layout.pack()
	.size([320, 320])	// 表示サイズを指定
d3.select("#myGraph")
	.selectAll("circle")	// circle要素を追加
	.data(bubble.nodes(dataSet))	// データセットを要素に設定
	.enter()
	.append("circle")	// データの数だけcircle要素が追加される
	.attr("cx", function(d, i){	// 中心のX座標を指定
		return d.x;	
	})
	.attr("cy", function(d, i){	// 中心のY座標を指定
		return d.y;	
	})
	.attr("r", 0)	// 最初、半径は0にする
	.transition()
	.duration(function(d, i){	// 入れ子の深さに応じて待ち時間を設定
		return d.depth * 1000 + 500;	// 深さ×1秒+0.5秒
	})
	.attr("r", function(d){	// 半径を指定
		return d.r;
	})
	.style("fill", function(d, i){
		return color(i);
	})

