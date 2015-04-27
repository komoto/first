// 棒グラフのデータ（データセット）
var dataSet = [300, 130, 5, 60, 240];
// データにもとづいて描画する
d3.select("#myGraph")	// SVG要素を指定
	.selectAll("rect")	// SVGでの四角形を示す要素を指定
	.data(dataSet)	// データを設定
	.enter()	// データの数に応じてrect要素を生成
	.append("rect")	// SVGの四角形を生成
	.attr("x", 0)	// 横棒グラフなのでX座標を0にする
	.attr("y", function(d,i){	// Y座標を配列の順序に応じて計算
		return i * 25;	// 棒グラフの高さを25px単位で計算
	})
	.attr("height", "20px")	// 棒グラフの高さを20pxで指定
	.attr("width", "0px")	// 最初棒グラフの横幅を0pxに指定
	.transition()	// グラフ出現時にアニメーションさせる
	.delay(function(d, i){
		return i * 500;	// 0.5秒ごとに描画するように待ち時間を設定
	})
	.duration(2500)	// 2.5秒かけてアニメーションする
	.attr("width", function(d, i){	// 横幅を配列の内容に応じて計算
		return d +"px";	// データの数をそのまま横幅とする
	})
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