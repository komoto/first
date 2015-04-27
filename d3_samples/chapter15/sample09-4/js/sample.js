var svgWidth = 640;	// SVG要素の横幅
var svgHeight = 640;	// SVG要素の高さ
var path = d3.geo.path()
	.projection(d3.geo.mercator()	// 投影方法を指定
		.center([139.021, 37.5459])	// 表示する経度と緯度を指定
		.scale(14000)	// スケールを指定
		.translate([350, 320])	// 表示位置を調整
	);
// 新潟県のデータを読み込む
d3.json("data/niigata.json", function(error, pref) {
	d3.select("#myGraph")
		.selectAll("path")	// path要素を指定
		.data(pref.features)	// データをセット
		.enter()
		.append("path")	// pathを追加
		.attr("d", path)	// 地形のデータを設定
		.style("fill", function(d, i){
			if (d.properties.N03_004.lastIndexOf("市") > -1){
				return "#f99";	// 市なら赤色
			}
			if (d.properties.N03_004.lastIndexOf("町") > -1){
				return "#070";	// 町なら緑色
			}
			if (d.properties.N03_004.lastIndexOf("村") > -1){
				return "#ff8";	// 村なら黄色
			}
			return "white";
		})
})
