// ボタンがクリックされたら該当するCSVファイルを読み込む
d3.selectAll("button").on("click", function(){
	var csvFile = this.getAttribute("data-src");	// data-src属性を読み出す(つまりCSVファイル名)
	var barElements;	// 棒グラフの棒の要素を格納する変数
	// CSVファイルを読み込みグラフを表示
	d3.csv(csvFile, function(error, data){
		var dataSet = [ ];	// データを格納する配列を用意する
		for(var i=0; i<data.length; i++){	// データの行数分だけ繰り返す
			dataSet.push(data[i]["商品A"]);	// 商品Aのラベルのデータだけ抽出する
		}
		// グラフを描画
		barElements = d3.select("#myGraph")
			.selectAll("rect")	// rect要素を指定
			.data(dataSet)	// データを要素に連結
		// データの追加が行われる場合
		barElements.enter()	// データ数だけ繰り返す
			.append("rect")	// データの数だけrect要素が追加される
			.attr("class", "bar")	// CSSクラスを指定
			.attr("width", function(d,i){	// 横幅を指定。2番目のパラメーターに関数を指定
				return d;	// データ値をそのまま横幅として返す
			})
			.attr("height", 20)	// 縦幅を指定
			.attr("x", 0)	// X座標を0にする
			.attr("y", function(d, i){	// Y座標を指定する
				return i * 25	// 出現順序に25を乗算して位置を計算
			})
		// データの更新が行われる場合
		barElements
			.attr("width", function(d,i){	// 横幅を指定。2番目のパラメーターに関数を指定
				return d;	// データ値をそのまま横幅として返す
			})
	})
})
