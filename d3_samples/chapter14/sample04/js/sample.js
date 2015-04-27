var blockSize = 20;	// ブロックのサイズ
// データセット
var dataSet = [
	0, 1, 2, 3, 3, 4, 5, 4,
	0, 0, 0, 3, 4, 4, 5, 3,
	1, 0, 0, 0, 0, 0, 0, 0,
	2, 6, 8, 7, 0, 0, 0, 2,
	4, 8, 9, 8, 0, 0, 1, 0,
	2, 6, 8, 6, 4, 0, 0, 0,
	2, 5, 3, 0, 2, 0, 0, 0,
	1, 2, 0, 0, 0, 0, 0, 0,
	1, 0, 0, 0, 0, 7, 8, 9,
	0, 0, 0, 0, 7, 9, 9, 9,
	0, 0, 0, 7, 8, 8, 9, 7,
	0, 0, 0, 6, 6, 7, 6, 5
];
// ヒートマップに表示するカラーを自動計算
var color = d3.interpolateHsl("blue", "yellow");	// 青色から黄色に補間
var maxValue = d3.max(dataSet);	// 最大値を求める
// ヒートマップの準備
var heatMap = d3.select("#myGraph")
	.selectAll("div")   // divに表示するボックスを割り当てる
	.data(dataSet)    // データを設定
// ヒートマップを表示
heatMap.enter()
	.append("div")  // rect要素を追加
	.attr("class", "block")	// CSSクラスを追加
	.style("left", function(d, i) { // X座標を設定
		return ((i % 8) * blockSize) + "px";
	}) 
	.style("top", function(d, i) { // Y座標を設定
		return (Math.floor(i/8)*blockSize) + "px";
	})
	.style("background-color", function(d, i){	// 色を表示
		return color(d/maxValue);
	})
// ヒートマップを定期的に更新
setInterval(function(){
	for(var i=0; i<dataSet.length; i++){
		var n = ((Math.random() * 3.5) | 0) - 2;	// 乱数値
		dataSet[i] = dataSet[i] + n;	// 加算
		if (dataSet[i] < 0){ dataSet[i] = 0; }	// 負数にならないように調整
		if (dataSet[i] > maxValue ){ dataSet[i] = maxValue; }	// 最大値を超えないように調整
	}
	heatMap.data(dataSet)
		.style("background-color", function(d, i){	// 色を表示
			return color(d/maxValue);
		})
}, 1000);
