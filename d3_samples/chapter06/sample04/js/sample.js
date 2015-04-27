// 要素にデータを連結する
d3.select("#myGraph")
	.selectAll("rect")	// rect要素を指定
	.data(["S","B","C","r"])	// データを要素に連結
	.enter()	// データ数だけ繰り返す
	.append("rect")	// データの数だけrect要素が追加される
	.datum(function(d, i){
		console.log(i+" = "+d);	// 順番とデータ内容を出力
		return d;	// 設定するデータを返す
	})
