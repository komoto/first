// データを格納する配列を用意する
var dataSet = [ ];
// CSVファイルを読み込んでグラフを描画する
d3.csv("mydata.csv", function(error, data){
	for(var i=0; i<data.length; i++){	// データの行数分だけ繰り返す
		dataSet.push(data[i].item1);	// item1のラベルのデータだけ抽出する
	}
	// データにもとづいて描画する
	d3.select("#myGraph")	// SVG要素を指定
		.selectAll("rect")	// SVGでの四角形を示す要素を指定
		.data(dataSet)	// データを設定
		.enter()	// データの数に応じてrect要素を生成
		.append("rect")	// SVGの四角形を生成
		.attr("x", 10)	// 目盛りに対応させるため10pxにX座標を設定
		.attr("y", function(d,i){	// Y座標を配列の順序に応じて計算
			return i * 25;	// 棒グラフのY座標を25px単位で計算
		})
		.on("click", function(){
			d3.select(this)	// クリックされた要素を指定
				.style("fill", "cyan")	// 塗りのスタイルを水色にする
		})
		.attr("height", "20px")	// 棒グラフの高さを20pxで指定
		.attr("width", "0px")	// 最初、棒グラフの横幅を0pxに指定
		.transition()	// グラフ出現時にアニメーションさせる
		.delay(function(d, i){
			return i * 500;	// 0.5秒ごとに描画するように待ち時間を設定
		})
		.duration(2500)	// 2.5秒かけてアニメーションする
		.attr("width", function(d, i){	// 横幅を配列の内容に応じて計算
			return d +"px";	// データの値をそのまま横幅とする
		})
	// 目盛りを表示するためにリニアスケールを設定
	var xScale = d3.scale.linear()  // リニアスケールを設定
		.domain([0, 300])   // 元のデータ範囲
		.range([0, 300]);  // 実際の出力サイズ
	// 目盛りを設定し表示する
	d3.select("#myGraph")
		.append("g")	// グループ化する
		.attr("class", "axis")	// スタイルシートクラスを設定
		.attr("transform", "translate(10, "+((1+dataSet.length) * 20+5)+")")	// 表示位置を調整する
		.call(d3.svg.axis()	// call()で目盛りを表示する関数を呼び出す
			.scale(xScale)  //スケールを適用する
			.orient("bottom")   //目盛りの表示位置を下側に指定
		)
});
// ボタンクリック時の処理
d3.select("#updateButton").on("click", function(){
	for(var i=0; i<dataSet.length; i++){
		dataSet[i] = Math.floor(Math.random() * 320);	// 0〜320未満の値を生成
	}
	d3.select("#myGraph")	// SVG要素を指定
		.selectAll("rect")	// SVGでの四角形を示す要素を指定
		.data(dataSet)	// データを設定
		.transition()	// 切り替えて表示する
		.attr("width", function(d, i){	// 横幅を配列の内容に応じて計算
			return d +"px";	// データの値をそのまま横幅とする
		})
})
