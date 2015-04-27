var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var dataSet = [50, 30, 12, 5, 3];	// データセット。割合を示している
var color = d3.scale.category10();  // D3.jsが用意した標準の10色を指定
// 円グラフの座標値を計算するメソッド
var pie = d3.layout.pie()	// 円グラフレイアウト
// 円グラフの外径、内径を設定
var arc = d3.svg.arc().innerRadius(0).outerRadius(100)
// 円グラフを描画
pieElements = d3.select("#myGraph")
	.selectAll("path")	// path要素を指定
	.data(pie(dataSet))	// データを要素に連結
// データの追加
pieElements.enter()	// データ数だけ繰り返す
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "pie")	// CSSクラスを指定
	.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 円グラフを中心にする
	.style("fill", function(d, i){
		return color(i);	// 標準の10色の中から色を返す
	})
	.transition()
	.duration(1000)
	.delay(function(d,i){   // 描画する円グラフを時間をずらして表示
		return i*1000;
	})
	.ease("linear")	// 直線的な動きに変更する
	.attrTween("d", function(d, i){	// 補間処理をする
		var interpolate = d3.interpolate(
			{ startAngle : d.startAngle, endAngle : d.startAngle }, // 各部分の開始角度
			{ startAngle : d.startAngle, endAngle : d.endAngle }    // 各部分の終了角度
       	 );
		return function(t){
			return arc(interpolate(t)); // 時間tに応じて処理
		}
	})
