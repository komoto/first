// ツリーレイアウトのデータセット
var dataSet = {
	name:"本社",
	children:[
		{ name:"経理部" },
		{ name:"業務部" },
		{ 
			name:"開発室",
			children:[
				{ name:"情報課" },
				{ name:"品質課" },
				{ name:"開発課",
					children:[
						{ name:"ウェブ" },
						{ name:"アプリ" },
					]
				}
			]
		}
	]
}
// グラフ関係のデータを変数に設定
var svgWidth = 640;	// svg要素の高さ
var svgHeight = 480;	// svg要素の高さ
var offsetLeft = svgWidth/2-100;	// ルートノードの左からのオフセット
var offsetTop = 50;	// 上からのオフセット
var offsetBottom = 40;	// 下からのオフセット
var nSize = 25;	// ○のサイズ
// ツリーレイアウトを指定
var tree = d3.layout.tree()
	.size([svgWidth, svgHeight-offsetTop - offsetBottom])	// 全体のサイズを設定
	.nodeSize([120, 110])	// ノードツリー全体のサイズを設定
var nodes = tree.nodes(dataSet);	// ツリーノードを設定
// ノード間をつなぐ線を表示
d3.select("#myGraph")
	.selectAll("path")	// path要素を対象にする
	.data(tree.links(nodes))	// ノードをデータセットとして設定
	.enter()
	.append("path") // パスを生成する
	.attr("class", "line")	// スタイルシートを設定
	.attr("d", d3.svg.diagonal())//ノード間をつなぐ
	.attr("transform", "translate(" + offsetLeft+", " + offsetTop+")") // 全体にずらす
// ノードに○を表示
d3.select("#myGraph")
	.selectAll("circle")	// circle要素を対象にする
	.data(nodes)	// データセットを設定
	.enter()
	.append("circle") // circle要素を追加
	.attr("class", "node")	// スタイルシートを設定
	.attr("cx", function(d){ return d.x + offsetLeft })
	.attr("cy", function(d){ return d.y + offsetTop })
	.attr("r", nSize)
// ノードにテキストを表示
d3.select("#myGraph")
	.selectAll("text")	// text要素を対象にする
	.data(nodes)	// データセットを設定
	.enter()
	.append("text") // text要素を追加
	.attr("class", "label")	// スタイルシートを設定
	.attr("x", function(d){ return d.x + offsetLeft })
	.attr("y", function(d){ return d.y + offsetTop })
	.attr("dy", 6)	// 文字の位置を調整する
	.text(function(d){ return d.name }) // nameプロパティを返す
