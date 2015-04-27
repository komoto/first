// CSVファイルを読み込みヒストグラムを表示
d3.csv("mydata.csv", function(error, data){
	// SVG要素の幅と高さを求める
	var svgEle = document.getElementById("myGraph");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
	svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
	var yAxisHeight = svgHeight - 30;	// 横の軸の幅
	var xAxisWidth = svgWidth - 40;	// 縦の軸の幅
	var offsetX = 30;	// 横のオフセット
	var offsetY = 10;	// 縦のオフセット
	var stepX = 10;	// 棒グラフの数。10間隔。
	var xScale;	// 横のスケール
	var yScale;	// 縦のスケール
	// データセットの読み込み
	var dataSet = [ ];
	data.forEach(function(d, i){
		dataSet.push(d.g1);	// 1学年のデータを入れる
	})
	// ヒストグラムを設定
	var histogram = d3.layout.histogram()
		.range([0, 100])
		.bins(d3.range(0, 100.1, stepX))	// ●範囲を計算で求める
	// データセットからスケールを計算
	function calcScale(){
		// データセットから最大値を求める
		var maxValue = d3.max(histogram(dataSet), function(d, i){
				return d.y;	// データそのものではなく最大個数を返す
			})
		// 縦のスケールを設定
		yScale = d3.scale.linear()
			.domain([0, maxValue])
			.range([yAxisHeight, 0])
		// 横のスケールを設定
		xScale = d3.scale.linear()
			.domain([0, 100])
			.range([0, xAxisWidth ])
	}
	// 目盛りを表示
	function drawScale(){
		// 縦の目盛りを表示
		d3.select("#myGraph")	// SVG要素を指定
				.append("g")	// g要素を追加。これが目盛りを表示する要素になる
				.attr("class", "axis")	// CSSクラスを指定
				.attr("transform", "translate("+offsetX+", "+offsetY+")")
				.call(
					d3.svg.axis()
					.scale(yScale)  //スケールを適用する
					.orient("left") //目盛りの表示位置を左側に指定
				)
		// 横の目盛りを表示
		d3.select("#myGraph")	// SVG要素を指定
				.append("g")	// g要素を追加。これが目盛りを表示する要素になる
				.attr("class", "axis")	// CSSクラスを指定
				.attr("transform", "translate("+offsetX+", "+(yAxisHeight + offsetY)+")")
				.call(
					d3.svg.axis()
					.scale(xScale)  //スケールを適用する
					.orient("bottom") //目盛りの表示位置を下側に指定
				)
	}
	// ヒストグラムの要素を設定
	function drawHistgram(){
		var barElements = d3.select("#myGraph")
			.selectAll("image")	// image要素でヒストグラムを表示
			.data(histogram(dataSet))	// データを対応付け
			.enter()
			.append("image")	// image要素を追加
			.attr("class", "bar")	// CSSクラスを追加
			.attr("xlink:href", "images/man.png")			
			.attr("width", function(d, i){	// 横幅を設定
				return xScale(d.dx);
			})
			.attr("x", function(d, i){	// X座標を設定
				return i * xScale(d.dx) + offsetX;
			})
			.attr("y", function(d, i){	// Y座標を設定
				return yScale(d.y) + offsetY;
			})
			.attr("y", yAxisHeight + offsetY)
			.attr("height", 32)
			.transition()
			.duration(1000)
			.attr("y", function(d, i){	// Y座標を設定
				return yScale(d.y) + offsetY;
			})
			.attr("height", function(d, i){	// 縦幅を設定
				return yAxisHeight - yScale(d.y);
			})
	}
	// 間隔が変更されたらヒストグラムを更新
	d3.select("#step").on("change", function(){
		stepX = this.value; 
		histogram
			.bins(d3.range(0, 100.1, stepX))
		// ヒストグラムを再描画
		d3.select("#myGraph").selectAll("*").remove();	// 要素を消去
		calcScale();
		drawHistgram();
		drawScale();
	})
	// 最初のヒストグラムの表示処理
	calcScale();
	drawHistgram();
	drawScale();
	// イベントを設定
	d3.select("#dataSelect").selectAll("input[type='button']")
		.on("click", function(){
			var grader = d3.select(this).attr("data-grader");	// 学年データ (g1〜g6)
			// データを設定
			dataSet = [ ];
			data.forEach(function(d, i){
				dataSet.push(d[grader]);	// クリックされた学年のデータを入れる
			})
			// ヒストグラムを更新
			d3.select("#myGraph").selectAll("*").remove();	// 要素を消去
			calcScale();
			drawHistgram();
			drawScale();
		});
})

