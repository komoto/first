// ●は変更箇所（編集用）
var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 240;	// SVG要素の高さ
var dataSet = [50, 30, 12, 5, 3];	// データセット。割合を示している
var color = d3.scale.category10();  // D3.jsが用意した標準の10色を指定
// 円グラフの座標値を計算するメソッド
var pie = d3.layout.pie()	// 円グラフレイアウト
	.value(function(d, i){ return d; })	// データセットのデータを返す
// 円グラフの外径、内径を設定
var arc = d3.svg.arc().innerRadius(30).outerRadius(100)
// 円グラフを描画
var pieElements = d3.select("#myGraph")
	.selectAll("g")	// g要素を指定●
	.data(pie(dataSet))	// データを要素に連結
	.enter()
	.append("g")	// 重心計算のためグループを作成●
	.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 円グラフを中心にする●
// データの追加
pieElements	// データ数だけ繰り返す
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "pie")	// CSSクラスを指定
	.style("fill", function(d, i){
		return color(i);	// 標準の10色の中から色を返す
	})
	.transition()
	.duration(200)
	.delay(function(d,i){   // 描画する円グラフを時間をずらして表示
		return i*200;
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
// 合計の数と文字の表示
var textElements = d3.select("#myGraph")
	.append("text")	// text要素を追加
	.attr("class", "total")	// CSSクラスを指定
	.attr("transform", "translate("+svgWidth/2+", "+(svgHeight/2+5)+")")    // 中心に表示する
	.text("合計:" + d3.sum(dataSet))	// 合計を表示
// 数値を円弧の中に表示●↓
pieElements
	.append("text")	// データの数だけtext要素が追加される
	.attr("class", "pieNum")	// CSSクラスを指定
	.attr("transform", function(d, i){
		return "translate("+arc.centroid(d)+")";    // 円弧の中心にする（重心計算）
	})
	.text(function(d, i){
		return d.value;	// 値を表示
	})
