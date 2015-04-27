var svgWidth = 640;	// SVG要素の横幅
var svgHeight = 640;	// SVG要素の高さ
var path = d3.geo.path()	// 地形のパスを生成
	.projection(
		d3.geo.mercator()   // 投影方法をメルカトル図法に設定
		.translate([svgWidth/2, svgHeight/2])	// 画面での表示位置を調整
		.scale(100)	// スケールを指定
	)
// 世界地図のデータを読み込む
d3.json("data/world.json", function(error, world) {
	d3.select("#myGraph")
		.selectAll("path")	// path要素を指定
		.data(world.features)	// データをセット
		.enter()
		.append("path")	// pathを追加
		.attr("d", path)	// 地形のデータを設定
		.style("fill", function(d, i){
			if (d.properties.name == "Antarctica"){	// 南極の場合の処理
				return "#fff";
			}
			if (d.properties.name == "Japan"){	// 日本の場合の処理
				return "red";
			}
			return "#eee";	// 日本以外は灰色に
		})
})
