// CSVデータを読み込む
d3.csv("mydata.csv", function(error, data){
	// SVG要素の幅と高さを求める
	var svgEle = document.getElementById("myGraph");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
	svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
	var offsetX = 30;	// X座標のオフセット　●
	var offsetY = 20;	// Y座標のオフセット　●
	var xScale;	// 横軸のスケール　●
	var yScale;	// 縦軸のスケール　●
	var yAxisHeight = svgHeight - 20;	// 横の軸の幅　●
	var xAxisWidth = svgWidth - 40;	// 縦の軸の幅　●
	var svg = d3.select("#myGraph");	// SVG要素を指定
	// データを読み込み設定する
	var dataSet = [ ];	// データを格納する配列変数
	data.forEach(function(d, i){	// 配列データを読み出し
		dataSet.push([d.total/100, d.bug*1, d.time*1]);	// *1として数値に変換
	});
	// 目盛りとグリッドを先に表示する　●
	drawScale();
	// 散布図を描画
	var circleElements = svg
		.selectAll("circle")	// circle要素を追加
		.data(dataSet)	// データセットを要素に設定
	circleElements
		.enter()
		.append("circle")	// データの数だけcircle要素が追加される
		.attr("class", "mark")	// CSSクラスを指定
		.attr("cx", svgWidth / 2 + offsetX)	// X座標を目盛りの中央にする
		.attr("cy", svgHeight/2 - offsetY)	// Y座標を目盛りの中央にする
		.attr("r", 100)	// 半径を100にする
		.attr("opacity", 0)	// 透明にする
		.transition()	// X,Y座標までアニメーション
		.duration(2000)	// 2秒のアニメーションにする
		.ease("bounce")	// バウンドする動きにする
		.attr("cx", function(d, i){
			return xScale(d[0]) + offsetX;	// 最初の要素をX座標にする　●
		})
		.attr("cy", function(d, i){
			return yScale(d[1]);	// 2番目の要素をY座標にする　●
		})
		.attr("r", 5)	// 半径を指定する
		.attr("opacity", 1.0)	// 不透明にする
	// 目盛りの表示
	function drawScale(){
		var maxX = d3.max(dataSet, function(d, i){
			return d[0];	// X座標値
		});
		var maxY = d3.max(dataSet, function(d, i){
			return d[1];	// Y座標値
		});
		// 縦の目盛りを表示するためにD3スケールを設定
		yScale = d3.scale.linear()  // スケールを設定　●
			.domain([0, maxY])   // 元のサイズ
			.range([yAxisHeight, 0]) // 実際の出力サイズ　●
		// 目盛りを表示
		svg.append("g")	// g要素を追加。これが目盛りを表示する要素になる
				.attr("class", "axis")	// CSSクラスを指定
				.attr("transform", "translate("+offsetX+", "+(svgHeight-yAxisHeight-offsetY)+")")	// ●
				.call(
					d3.svg.axis()
					.scale(yScale)  //スケールを適用する
					.orient("left") //目盛りの表示位置を左側に指定
				)
		// 横の目盛りを表示するためにD3スケールを設定
		xScale = d3.scale.linear()  // スケールを設定　●
			.domain([0, maxX])   // 元のサイズ
			.range([0, xAxisWidth]) // 実際の出力サイズ　●
		// 目盛りを表示
		svg.append("g")	// g要素を追加。これが目盛りを表示する要素になる
			.attr("class", "axis")	// CSSクラスを指定
			.attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY)+")")
			.call(
				d3.svg.axis()
				.scale(xScale)  //スケールを適用する
				.orient("bottom") //目盛りの表示位置を左側に指定
			)
		// グリッドの表示
		var grid = svg.append("g");
		// 横方向と縦方向のグリッド間隔を自動生成
		var rangeX = d3.range(50, maxX+50, 50);
		var rangeY = d3.range(20, maxY, 20);
		// 縦方向のグリッドを生成
		grid.selectAll("line.y")	// line要素のyクラスを選択
			.data(rangeY)	// 縦方向の範囲をデータセットとして設定
			.enter()
			.append("line")	// line要素を追加
			.attr("class", "grid")	// CSSクラスのgridを指定
			// (x1,y1)-(x2,y2)の座標値を設定
			.attr("x1", offsetX)
			.attr("y1", function(d, i){
				return svgHeight - yScale(d) - offsetY;	// ●
			})
			.attr("x2", xAxisWidth + offsetX)
			.attr("y2", function(d, i){
				return svgHeight - yScale(d) - offsetY;	// ●
			})
		// 横方向のグリッドを生成
		grid.selectAll("line.x")	// line要素のxクラスを選択
			.data(rangeX)	// 横方向の範囲をデータセットとして設定
			.enter()
			.append("line")	// line要素を追加
			.attr("class", "grid")	// CSSクラスのgridを指定
			// (x1,y1)-(x2,y2)の座標値を設定
			.attr("x1", function(d, i){
				return xScale(d) + offsetX;	//  ●
			})
			.attr("y1", svgHeight - offsetY)
			.attr("x2", function(d, i){
				return xScale(d) + offsetX;	//  ●
			})
			.attr("y2", svgHeight -offsetY - yAxisHeight)	// ●
	}
	// ツールチップを生成
	var tooltip = d3.select("body")
		.append("div")
		.attr("class", "tip")
	// ツールチップに時間を表示
	circleElements
		.on("mouseover", function(d){
			var x = parseInt(xScale(d[0]));	// 円のX座標値  ●
			var y = parseInt(yScale(d[1]));	// 円のY座標値  ●
			var t = parseInt(d[2]);	// 解決に要した時間
			tooltip
				.style("left", offsetX + x+"px")
				.style("top", offsetY + 30 + y+"px")	//　●
				.style("visibility", "visible")	// ツールチップを表示する
				.text(t+"時間")
		})
		.on("mouseout", function(){
			tooltip.style("visibility", "hidden")	// ツールチップを非表示にする
		})
});
