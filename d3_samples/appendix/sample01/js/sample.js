// フォースレイアウトのデータセット
var dataSet = {
	nodes : [	// ノードリスト
			{ name : "Apple" },	// 0番
			{ name : "Google" },	// 1番
			{ name : "Amazon" },	// 2番
			{ name : "Microsoft" }	// 3番
	],
	links : [	// ノードとノードを結ぶ線の関係。配列要素の順番をID・参照番号として利用している
			{ source : 0, target : 1 },
			{ source : 1, target : 2 },
			{ source : 2, target : 3 },
			{ source : 3, target : 0 }
	]
}
// フォースレイアウトの設定
var force = d3.layout.force()
	.nodes(dataSet.nodes)	// ノードを指定
	.links(dataSet.links)	// ノードとノードを結ぶリンク線を指定
	.size([320, 320])	// 表示領域のサイズを指定
	.linkDistance(90)	// 距離を指定
	.linkStrength(5)	// 強さを指定
	.gravity(0.0001)	// 重力を指定
	.start()
// ノードとノードを結ぶ線を描画
var link = d3.select("#myGraph")
	.selectAll("line")	// 線を生成
	.data(dataSet.links)	// links配列をデータセットとして設定
	.enter()
	.append("line")	// 線を追加
	.attr("class", "forceLine")	// 線のCSSクラスを指定
// ノードを示す円（●）を描画
var node = d3.select("#myGraph")
	.selectAll("circle")	// 円を生成
	.data(dataSet.nodes)	// nodes配列をデータセットとして設定
	.enter()
	.append("circle")	// circleを追加
	.attr("r", 10)	// 半径を設定
	.call(force.drag)	// ノードをドラッグ可能にする
// 再描画時(tickイベント発生時)に線を描画
force.on("tick", function() {
	link
		.attr("x1", function(d) { return d.source.x; })	// ソースとターゲットの要素座標を指定
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
	node
		.attr("cx", function(d) { return d.x; })	// ノードの座標を指定
		.attr("cy", function(d) { return d.y; })
})
