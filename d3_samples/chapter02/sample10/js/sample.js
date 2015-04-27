// CSVファイルを読み込んでグラフを描画する
d3.csv("mydata.csv", function(error, data){
	var dataSet = [ ];	// データを格納する配列を用意する
	for(var i=0; i<data.length; i++){	// データの行数分だけ繰り返す
		dataSet.push(data[i].item1);	// item1のラベルのデータだけ抽出する
	}
	// データにもとづいて描画する
	d3.select("#myGraph")	// SVG要素を指定
		.selectAll("rect")	// SVGでの四角形を示す要素を指定
		.data(dataSet)	// データを設定
		.enter()	// データの数に応じてrect要素を生成
		.append("rect")	// SVGの四角形を生成
		.attr("x", 10)	// 横棒グラフなのでX座標を10に調整する
		.attr("y", function(d,i){	// Y座標を配列の順序に応じて計算
			return i * 25;	// 棒グラフのY座標を25px単位で計算
		})
		.attr("height", "20px")	// 棒グラフの高さを20pxで指定
		.attr("width", function(d, i){	// 棒グラフの横幅を配列の内容に応じて計算
			return d +"px";	// データの値をそのまま横幅とする
		})
		// 目盛りを表示するためにリニアスケールを設定
		var xScale = d3.scale.linear()  // リニアスケールを設定
			.domain([0, 300])   // 元のデータ範囲
			.range([0, 300])  // 実際の出力サイズ
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