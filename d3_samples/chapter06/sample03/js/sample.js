// 要素にデータを連結する
d3.select("#myGraph")
	.selectAll("rect")	// rect要素を指定
	.data([0,0,0,0,0])	// ダミーのデータを要素に連結
	.enter()	// データ数だけ繰り返す
	.append("rect")	// データの数だけrect要素が追加される
	.datum(function(){	// 全ての要素に乱数値を連結
		return Math.random();	// 乱数値を返す
	})
