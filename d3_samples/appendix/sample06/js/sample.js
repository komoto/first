var svgWidth = 320;	// SVG要素の横幅
var svgHeight = 320;	// SVG要素の高さ
// データセット
var dataSet = {
	name : "全国", value : 128057352,
	children : [
		{ name : "東京都", value : 13159388 },
		{ name : "大阪府", value : 8865245 },
		{ name : "愛知県", value : 7410719 },
		{ name : "長野県", value : 2152449,
			children : [
				{ name : "長野市", value : 381511 },
				{ name : "松本市", value : 243037 },
				{ name : "塩尻市", value : 67670 }
			]
		}
	]
}
// カラーを準備
var color = d3.scale.category10();  // 10色を指定
// パックレイアウト
var bubble = d3.layout.pack()
	.size([320, 320])	// 表示サイズを指定
// パックレイアウトで使用するグループを作成
var pack = d3.select("#myGraph")
	.selectAll("g")
	.data(bubble.nodes(dataSet))	// データセットを要素に設定
	.enter()
	.append("g")
	.attr("transform", function(d, i){
		return "translate(" + d.x + "," + d.y + ")";	// X,Y座標を設定
	})
// 円を生成
var circle = pack.append("circle")	// circle要素を追加
	.attr("r", function(d){	// 半径を指定
		return d.r;
	})
	.style("fill", function(d, i){
		return color(i);
	})
// 円に表示する文字を生成
pack.append("text")
	.style("opacity", 1.0)	// 不透明にする
	.text(function(d, i){
		if (d.depth == 1){	// 第1階層（都道府県レベル）のみ対象
			return d.name;	// nameプロパティの内容を返す
		}
		return null;	// 第1階層以外は表示しない
	})
// フィッシュアイを設定
var fisheye = d3.fisheye.circular()
	.radius(100)
	.distortion(3)
// マウス移動で効果を施すようにする
d3.select("#myGraph").on("mousemove", function(){
	fisheye.focus(d3.mouse(this));	// マウス座標をズームの中心に設定
	circle.each(function(d, i){	// ズーム対象の要素に対して処理
		d.fisheye = fisheye(d);	//　計算した結果をfisheyeオブジェクトのx,y,zプロパティに代入
		d.r = d.r;	// 計算の都合上、元々の半径をrプロパティに代入
	})
	.attr("r", function(d) { return d.fisheye.z * d.r; })	// 拡大率と半径を乗算し新たな半径にする
})
