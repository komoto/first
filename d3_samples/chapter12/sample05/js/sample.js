(function(){
	// SVG要素の幅と高さを求める
	var svgEle = document.getElementById("myGraph");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 値は単位付きなので単位を削除する
	svgHeight = parseFloat(svgHeight);	// 値は単位付きなので単位を削除する
	var pack;		// 円をパックするg要素一覧
	var circles;	// circle要素一覧
	var texts;	// text要素一覧
	var bubble;	// パックレイアウトオブジェクト	
	var allData;	// 全データを格納する変数
	var year = "year2000";	// 表示するデータを示す変数。最初は2005年のデータ
	// JSONデータを読み込む処理
	d3.json("data.json", function(error, data){
		allData = data;
		drawPackLayout(data);
	});
	// パックレイアウトを表示
	function drawPackLayout(dataSet){
		// カラーを準備
		var color = d3.scale.category10();  // 10色を指定
		// パックレイアウト
		bubble = d3.layout.pack()
			.size([320, 320])	// 表示サイズを指定
		// パックレイアウトで使用するグループを作成
		pack = d3.select("#myGraph")
			.selectAll("g")
			.data(bubble.value(function(d, i){
				return d[year];	
			}).nodes(dataSet))	// データセットを要素に設定
			.enter()
			.append("g")
		// 円を生成
		circles = pack.append("circle")
			.attr("r", 0)	// 最初、半径は0にする
			.attr("transform", function(d, i){
				return "translate(" + d.x + "," + d.y + ")";	// X,Y座標を設定
			})
			.style("fill", function(d, i){
				return color(i);
			})
		circles.transition()
			.duration(function(d, i){	// 入れ子の深さに応じて待ち時間を設定
				return d.depth * 1000 + 500;	// 深さ×1秒+0.5秒
			})
			.attr("r", function(d){	// 半径を指定
				return d.r;
			})
		// 円に表示する文字を生成
		texts = pack.append("text")
			.attr("transform", function(d, i){
				return "translate(" + d.x + "," + d.y + ")";	// X,Y座標を設定
			})
		texts.style("opacity", 1.0)	// 透明にする
			.transition()
			.duration(3000)	// 3秒かけて表示
			.style("opacity", 1.0)	// 不透明にする
			.text(function(d, i){
				if (d.depth == 1){	// 第1階層（都道府県レベル）のみ対象
					return d.name;	// nameプロパティの内容を返す
				}
				return null;	// 第1階層以外は表示しない
			})
	}
	// ボタンクリックでデータを読み込みアニメーションさせる
	d3.selectAll("input").on("click", function(){
		year = d3.select(this).attr("data-year");
		pack.data(bubble.value(function(d, i){
			return d[year];	
		}).nodes(allData))	// データセットを要素に設定
		circles
			.transition()	// 属性をアニメーションを使って変更
			.duration(500)	// 0.5秒でアニメーション
			.ease("bounce")	// バウンドする動きにする
			.attr("r", function(d, i){	// 円の半径を設定
				return d.r;
			})
			.attr("transform", function(d, i){
				return "translate(" + d.x + "," + d.y + ")";	// X,Y座標を設定
			})
		texts
			.transition()	// 属性をアニメーションを使って変更
			.duration(500)	// 0.5秒でアニメーション
			.ease("bounce")
			.attr("transform", function(d, i){
				return "translate(" + d.x + "," + d.y + ")";	// X,Y座標を設定
			})
	});
})();
