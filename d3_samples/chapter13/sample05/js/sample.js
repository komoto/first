var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
// データセット
var dataSet = {
	name: "ルート",
	children: [
		{ name: "Dir1", children: [
				{ name: "Dir2", children: [
						{ name: "ファイルA", value: 5000 },
						{ name: "ファイルB", value: 3000 },
						{ name: "Dir3", children: [
								{ name: "ファイルC", value: 2000 },
								{ name: "Dir4", children: [
										{ name: "ファイルD", value: 1000 },
										{ name: "ファイルE", value: 1500 }
									]
								}
							]
						}
					]
				}
			]
		}
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
	.attr("class", "file")	// CSSクラスを追加
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
	.style("opacity", 0)	// 領域を透明から不透明度にする
	.transition()
	.delay(function(d, i){	// 時間差で表示する
		return d.depth * 500;
	})
	.style("opacity", function(d, i){	// 深さに応じて不透明度を設定
		return d.depth / 10;	// 入れ子が深くなると濃くなる
	})
// マップ内に文字を追加
tmap.enter()
	.append("text")	// text要素を追加
	.attr("class", "name")	// CSSクラスを追加
	.attr("transform", function(d, i){	// 位置を計算しXY座標を一括で設定
		var deg = 0;	// 角度は0
		if (d.dx < d.dy){	// もし縦長の領域なら文字を90度回転
			deg = -90;
		}
		return "translate(" + (d.x+d.dx/2) + "," + (d.y+d.dy/2) + ") rotate("+deg+")";	// X,Y座標を設定
	})
	.attr("dy", "0.35em")	// 表示位置を調整
	.text(function(d, i) {	// 文字を表示する
		if ((d.depth == 0) || (d.children)) {	// ルートか子ノードがあるか
			return null;	// ルートと子ノードを持つ場合はnullを返し何も表示しない
		}
		return d.name;	// 領域内に表示する文字を返す
	})
	.style("opacity", 0)	// 文字を透明から不透明度にする
	.transition()
	.delay(function(d, i) {	// 時間差で表示する
		return d.depth * 500;
	})
	.style("opacity", 1.0)
