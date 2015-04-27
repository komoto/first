// データセットはCSVファイル
d3.csv("mydata.csv",
	function(row){	//　前処理を行う
		return {
			vendor : row.vendor,	// ベンダー名はそのまま
			volume : parseInt(row.volume)	// 文字列から数値に変換
		}
	},
	function(error, dataSet){
		var svgWidth = 600;	// SVG要素の横幅
		var svgHeight = 360;	// SVG要素の縦幅
		// グラフで使用する変数
		var offsetX = 30;	// X座標のオフセット（ずれ具合）
		var offsetY = 20;	// Y座標のオフセット（ずれ具合）
		var barElements;	// 棒グラフの棒の要素を格納する変数
		var dataMax = d3.max(	// データの最大値を求める
			dataSet.map(function(d, i){
				return d.volume;
			})
		)
		dataMax = dataMax * 1.2;	// 20%乗算した値を最大値にする
		var barWidth = 25;	// 棒の横幅
		var barMargin = 30;	// 棒の横の間隔
		// 目盛りを表示するためにスケールを設定
		var xScale = d3.scale.ordinal()  // 離散的スケールを設定
			.domain(
				dataSet.map(function(d, i){ return d.vendor; })  // ベンダーを設定
			) 
			.rangeRoundBands([0, svgWidth], 0.5)	// 幅を指定
		// 目盛りを表示するためにスケールを設定
		var yScale = d3.scale.linear()  // スケールを設定
			.domain([0, dataMax])	// 出荷量を設定
			.range([svgHeight, 0]) // 実際の出力サイズ
		// グラフを描画
		barElements = d3.select("#myGraph")
			.selectAll("rect")	// rect要素を指定
			.data(dataSet)	// データを要素に連結
		// データの追加
		barElements.enter()	// データ数だけ繰り返す
			.append("rect")	// データの数だけrect要素が追加される
			.attr("class", "bar")	// CSSクラスを指定
			.attr("width", xScale.rangeBand())	// 横幅を指定
			.attr("height", function(d,i){	// 縦幅を指定。2番目のパラメーターに関数を指定
				return svgHeight - yScale(d.volume);	// スケール計算
			})
			.attr("x", function(d, i){	// X座標を指定する
				return xScale(d.vendor) + offsetX;
			})
			.attr("y", function(d, i){	// Y座標を指定する
				return yScale(d.volume) - offsetY;
			})
		// 横方向の目盛りを設定し表示する
		var xAxisElements = d3.select("#myGraph")
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + offsetX + ", " + (svgHeight - offsetY) + ")")
			.call(
				d3.svg.axis()
				.scale(xScale)  //スケールを適用する
				.orient("bottom") //目盛りの表示位置を左側に指定
			)
		// 縦方向の目盛りを設定し表示する
		var yAxisElements = d3.select("#myGraph")
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + offsetX + ", -" + offsetY + ")")
			.call(
				d3.svg.axis()
				.scale(yScale)  //スケールを適用する
				.orient("left") //目盛りの表示位置を左側に指定
			)
	// チェックボックスをクリックした場合のソート処理
	d3.select("#dataSort").on("change", function(){
		if(this.checked){	// チェックされた場合は昇順、そうでない場合は降順ソート
			var s = dataSet.sort(function(a, b) { return b.volume - a.volume; });
		}else{
			var s = dataSet.sort(function(a, b) { return a.volume - b.volume; });
		}
		var sortResult = s.map(function(d, i){ return d.vendor; });	// ベンダー別に並び替えた配列を返す
		xScale.domain(sortResult);	// 新たなドメイン（ソート後のベンダー名を入れた配列）を設定
		// 横の目盛りを並び替える
		xAxisElements
			.call(
				d3.svg.axis()
				.scale(xScale)  //スケールを適用する
				.orient("bottom") //目盛りの表示位置を左側に指定
			)
		// 縦棒を並び替える
		barElements
			.attr("x", function(d, i){	// X座標を指定する
				return xScale(d.vendor) + offsetX;
			})
	})
})

