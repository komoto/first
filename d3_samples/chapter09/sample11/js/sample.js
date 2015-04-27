// JSONデータを読み込む
d3.json("mydata.json", function(error, data){
	var dataSet = [ ];	// データセット
	// SVG要素の幅と高さを求める
	var svgEle = document.getElementById("myGraph");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth) - 60;	// 値は単位付きなので単位を削除する
	svgHeight = parseFloat(svgHeight) - 60;	// 値は単位付きなので単位を削除する
	var offsetX = 30;	// 横のオフセット
	var offsetY = 20;	// 縦のオフセット
	var scale = 2.0;	// 2倍サイズでグラフを描画
	var rangeYear = 10;	// 10年分を表示
	// 最大値と最小値の年数を求める
	var year = d3.extent(data, function(d){
		return d.year;
	});
	var startYear = year[0];	// 最初の年
	var currentYear = 2000;	// 最初の表示基準年
	var margin = svgWidth /(rangeYear - 1);	// 折れ線グラフの間隔を算出
	// 最初にグラフを表示する
	pickupData(data, currentYear-startYear);	// 表示範囲のデータをセット
	drawGraph(dataSet, "item1", "itemA", "linear");	// item1のデータ
	drawGraph(dataSet, "item2", "itemB", "linear");	// item2のデータ
	drawGraph(dataSet, "item3", "itemC", "linear");	// item3のデータ
	drawScale();	// 目盛りを表示
	// 折れ線グラフを表示するための関数
	function drawGraph(dataSet, itemName, cssClassName, type){
		// 折れ線グラフの座標値を計算するメソッド
		var line = d3.svg.line()	// svgのライン
			.x(function(d, i){
				return offsetX + i * margin;	// X座標は出現順番×間隔
			})
			.y(function(d, i){
				return svgHeight - (d[itemName] * scale) - offsetY;	// データからY座標を減算
			})
			.interpolate(type)	// 折れ線グラフの形状を設定
		// 折れ線グラフを描画
		var lineElements = d3.select("#myGraph")
			.append("path")	// データの数だけpath要素が追加される
			.attr("class", "line "+cssClassName)	// CSSクラスを指定
			.attr("d", line(dataSet))	//連続線を指定
	}
	// グラフの目盛りを表示するための関数
	function drawScale(){
		// 目盛りを表示するためにD3スケールを設定
		var yScale = d3.scale.linear()  // スケールを設定
			.domain([0, 100])   // 元のサイズ
			.range([scale*100, 0]) // 実際の出力サイズ
		// 目盛りを表示
		d3.select("#myGraph")	// SVG要素を指定
				.append("g")	// g要素を追加。これが目盛りを表示する要素になる
				.attr("class", "axis")	// CSSクラスを指定
				.attr("transform", "translate("+offsetX+", "+((100-(scale-1)*100)+offsetY)+")")	// ●変更
				.call(
					d3.svg.axis()
					.scale(yScale)  //スケールを適用する
					.orient("left") //目盛りの表示位置を左側に指定
				)
		// 横の目盛りを表示するためにD3スケールを設定
		var xScale = d3.time.scale()  // スケールを設定
			.domain([new Date(currentYear+"/1/1"), new Date((currentYear + rangeYear - 1)+"/1/1")])	// 表示範囲の年数を指定
			.range([0, svgWidth]) // 出力サイズ
		// 横の目盛りを表示
		d3.select("#myGraph")	// SVG要素を指定
				.append("g")	// g要素を追加。これが目盛りを表示する要素になる
				.attr("class", "axis")	// CSSクラスを指定
				.attr("transform", "translate("+offsetX+", "+(svgHeight - offsetY)+")")
				.call(
					d3.svg.axis()
					.scale(xScale)  //スケールを適用する
					.orient("bottom") //目盛りの表示位置を左側に指定
					.ticks(10)	// 1年ごとの表示にする
					.tickFormat(function(d, i){
						var fmtFunc = d3.time.format("%Y年%m月");	// 変換関数
						return fmtFunc(d);	// 変換した結果を返す
					})
				)
				.selectAll("text")	// 目盛りの文字を対象に処理する
				.attr("transform", "rotate(90)")	// 90度回転
				.attr("dx", "0.7em")	// 位置を調整
				.attr("dy", "-0.4em")	// 位置を調整
				.style("text-anchor", "start")	// 表示位置を指定
	}
	// JSONデータから表示する範囲のデータセットを抽出しSVG要素内を消去
	function pickupData(data, start){
		dataSet = [ ];	// データセットを消去
		for(var i=0; i<rangeYear; i++){	// 表示する範囲をデータをセット
			dataSet[i] = data[start + i];
		}
		d3.select("#myGraph").selectAll("*").remove();	// SVG要素内を消去
	}
	// 「前へ」ボタンにイベントを割り当てる
	d3.select("#prev").on("click", function(){
		if (currentYear > year[0]){	// 最小値（年）より大きい場合は年数を1つ減らす
			currentYear = currentYear - 1;
		}
		// グラフを表示
		pickupData(data, currentYear-startYear);	// 表示範囲のデータをセット
		drawGraph(dataSet, "item1", "itemA", "linear");
		drawGraph(dataSet, "item2", "itemB", "linear");
		drawGraph(dataSet, "item3", "itemC", "linear");
		drawScale();
	})
	// 「次へ」ボタンにイベントを割り当てる
	d3.select("#next").on("click", function(){
		if (currentYear <= year[1]-rangeYear){	// 最大値（年）+範囲より小さい場合は年数を1つ増やす
			currentYear = currentYear + 1;
		}
		// グラフを表示
		pickupData(data, currentYear-startYear);	// 表示範囲のデータをセット
		drawGraph(dataSet, "item1", "itemA", "linear");
		drawGraph(dataSet, "item2", "itemB", "linear");
		drawGraph(dataSet, "item3", "itemC", "linear");
		drawScale();
	})
});
