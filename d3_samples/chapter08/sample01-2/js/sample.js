var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var dataSet = [50, 30, 12, 5, 3];	// データセット。割合を示している
// 円グラフの座標値を計算するメソッド
var pie = d3.layout.pie()	// 円グラフレイアウト
	.value(function(d, i){ return d; })	// データセットのデータを返す
// 円グラフの外径、内径を設定
var arc = d3.svg.arc().innerRadius(0).outerRadius(100);
// 円グラフを描画
var pieElements = d3.select("#myGraph")
	.selectAll("path")	// path要素を指定
	.data(pie(dataSet))	// データを要素に連結
// データの追加
pieElements.enter()	// データ数だけ繰り返す
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "pie")	// CSSクラスを指定
	.attr("d", arc)	// 扇形を指定
	.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 円グラフを中心にする
