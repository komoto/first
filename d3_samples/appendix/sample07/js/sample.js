// 変数を設定
svgWidth = 320;	// svg要素の横幅
svgHeight = 240;	// svg要素の縦幅
var dataSet = [20, 20, 20, 20, 20];	// データセットを用意
// 1分ごとにデータを読み出して処理
setInterval("drawPie()", 1000*60);
drawPie();	// 最初だけ読み込んで円グラフを表示しておく
// 円グラフの処理
var pie = d3.layout.pie();	// 円グラフレイアウト
var arc = d3.svg.arc().outerRadius(100);	// 円グラフの外径を設定
// 円グラフを描画
var groupElements = d3.select("#myGraph")
	.selectAll("g")	// g要素を指定
	.data(pie(dataSet))	// データを要素に連結
	.enter()
	.append("g")	// 重心計算のためグループを作成
	.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 円グラフを中心にする
// データの追加
var pieElements = groupElements	// 扇形部分
	.append("path")	// データの数だけpath要素が追加される
	.attr("class", "pie")	// CSSクラスを指定
	.attr("d", arc)	// 扇形を指定
	.style("fill", function(d, i){
		return ["#55f", "red", "black", "green", "#ddd"][i];	// 対応するOSの色を返す
	})
// データを読み込んで円グラフを表示
function drawPie(){
	// データセットはプレーンテキストファイル
	d3.text("log.txt", function(error, plainText){
		// 文字列を検索して簡易シェアを求める
		var win = (plainText.match(/Windows/g) || "").length;
		var mac = (plainText.match(/Macintosh/g) || "").length;
		var iphone = (plainText.match(/ iPhone/g) || "").length;
		var and = (plainText.match(/ Android/g) || "").length;
		var etc = 100 - win - mac - iphone - and;	// その他
		dataSet = [win, mac, iphone, and, etc];	// データセットを用意
		d3.select("#time").text(new Date());	// 日付を表示
		// データの更新
		pieElements
			.data(pie(dataSet))	// データを要素に連結
			.attr("d", arc)	// 扇形を表示
	})
}
