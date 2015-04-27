// 最初は2008年データを表示しておく
drawPie("mydata2008.csv");
// セレクトメニューが選択された場合の処理
d3.select("#year").on("change", function(){
	d3.select("#myGraph").selectAll("*").remove();	// svg内の要素を全て削除
	drawPie("mydata"+this.value+".csv", this.value);	// 指定された念のデータを読み込んで円グラフで表示
});
function drawPie(filename){
// データセットはCSVファイル
	d3.csv(filename, function(error, data){
		var dataSet = [ ];	// データを格納する配列変数
		for(var i in data[0]){	// 最初のデータだけ処理する
			dataSet.push(data[0][i]);	// 横一行全てをまとめて入れる
		}
		// SVG要素の幅と高さを求める
		var svgEle = document.getElementById("myGraph");
		var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
		var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
		svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
		svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
		// 円グラフの座標値を計算するメソッド
		var pie = d3.layout.pie()	// 円グラフレイアウト
		// 円グラフの外径、内径を設定
		var arc = d3.svg.arc().innerRadius(30).outerRadius(100)
		// 円グラフを描画
		var pieElements = d3.select("#myGraph")
			.selectAll("g")	// g要素を指定
			.data(pie(dataSet))	// データを要素に連結
			.enter()
			.append("g")	// 重心計算のためグループを作成
			.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")    // 円グラフを中心にする
		// データの追加
		pieElements	// データ数だけ繰り返す
			.append("path")	// データの数だけpath要素が追加される
			.attr("class", "pie")	// CSSクラスを指定
			.style("fill", function(d, i){
				return ["#ff3344", "#ff7328", "#d3d4d5", "#dfd"][i];	// キャリアの色を返す
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
			.text("携帯シェア")	// 文字を表示
		// 数値を円弧の中に表示
		pieElements
			.append("text")	// データの数だけtext要素が追加される
			.attr("class", "pieNum")	// CSSクラスを指定
			.attr("transform", function(d, i){
				return "translate("+arc.centroid(d)+")";    // 円弧の中心にする
			})
			.text(function(d, i){
				return d.value;	// 値を表示
			})
	});
}
