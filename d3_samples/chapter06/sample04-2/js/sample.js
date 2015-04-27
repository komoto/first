// CSVファイルを読み込む
d3.csv("mydata.csv", function(error, data){
	var dataSet = [ ];	// データを格納する配列を用意する
	for(var i=0; i<data.length; i++){	// データの行数分だけ繰り返す
		dataSet.push(data[i]["商品A"]);	// 商品Aのラベルのデータだけ抽出する
	}
	// 要素のデータを読み出してコンソールに出力する
	d3.select("#myGraph")
		.selectAll("rect")	// rect要素を指定
		.data(dataSet)	// データを要素に連結
		.enter()	// データ数だけ繰り返す
		.append("rect")	// データの数だけrect要素が追加される
		.call(function(elements){	// 自作関数を呼び出して使用できる
			elements.each(function(d, i){	// 要素の数だけ繰り返す
				console.log(i+" = "+d);	// データと要素順を表示する
			})
		})
})