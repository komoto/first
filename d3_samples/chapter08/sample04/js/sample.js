var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var dataSet = [5, 10, 8, 12, 16, 20, 12, 18, 6, 9, 10, 6, 15, 20];	// データセット。割合を示している
var color = d3.scale.category20();  // D3.jsが用意した標準の20色を指定
// 円グラフの座標値を計算するメソッド
var pie = d3.layout.pie()	// 円グラフレイアウト
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
	.style("fill", function(d, i){
		return color(i);	// 標準の20色の中から色を返す
	})
