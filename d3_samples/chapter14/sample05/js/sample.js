(function(){
	// SVG要素の幅と高さを求める
	var svgEle = document.getElementById("myGraph");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
	svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
	var blockSize = 20;	// ブロックのサイズ
	var heatMap;	// ヒートマップオブジェクトを格納する変数
	var color;	// ヒートマップの色を処理する関数を入れる変数
	var maxValue;	// データの最大値
	var dataSet = [ ];	// データセット
	// データを読み込む
	d3.text("mydata.txt", function(error, plainText){
		var temp = plainText.split(",");	// カンマで分割し代入
		for(var i=0; i<temp.length; i++){
			dataSet[i] = parseInt(temp[i]);	// 正数にして代入
		}
		drawHeatMap();
		// ヒートマップを定期的に更新
		setInterval(function(){
			for(var i=0; i<dataSet.length; i++){
				var n = ((Math.random() * 3.5) | 0) - 2;	// 乱数値
				dataSet[i] = dataSet[i] + n;	// 加算
				if (dataSet[i] < 0){ dataSet[i] = 0; }	// 負数にならないように調整
				if (dataSet[i] > maxValue ){ dataSet[i] = maxValue; }	// 最大値を超えないように調整
			}
			heatMap.data(dataSet)
				.style("fill", function(d, i){	// 色を表示
					return color(d/maxValue);
				})
		}, 1000);
	})
	// ヒートマップを表示する関数
	function drawHeatMap(){
		// ヒートマップに表示するカラーを自動計算
		color = d3.interpolateHsl("blue", "yellow");	// 青色から黄色に補間
		maxValue = d3.max(dataSet);	// 最大値を求める
		// ヒートマップの準備
		heatMap = d3.select("#myGraph")
			.selectAll("rect")   // rect要素を指定
			.data(dataSet)    // データを設定
		// ヒートマップを表示
		heatMap.enter()
			.append("rect")  // rect要素を追加
			.attr("class", "block")	// CSSクラスを追加
			.attr("x", function(d, i) { // X座標を設定
				return (i % 8) * blockSize;
			}) 
			.attr("y", function(d, i) { // Y座標を設定
				return Math.floor(i/8)*blockSize;
			})
			.attr("width", function(d, i) {	// 横幅を設定
				return blockSize;
			})
			.attr("height", function(d, i) {	// 縦幅を設定
				return blockSize;
			})
			.style("fill", function(d, i){	// 色を表示
				return color(d/maxValue);
			})
	}
})();

