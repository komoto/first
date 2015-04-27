// 鶏頭図のデータセット
var dataSet = [
	{ location: "校庭", value : 90 },
	{ location: "自宅", value : 35 },
	{ location: "校舎", value : 70 },
	{ location: "田畑など", value : 25 },
	{ location: "その他", value : 60 }
];
// グラフ関係のデータを変数に設定
var svgWidth = 320;	// svg要素の高さ
var svgHeight = 320;	// svg要素の高さ
var iRadius = 50;	// 内円の半径
var oRadius = iRadius + 10;	// 内円+オフセットの半径
var color = d3.scale.category10();	// D3.jsのカラーを使用
// 鶏頭図の1つの扇形の割り当て角度を計算する（360度をデータ数で除算）
for(var i=0; i<dataSet.length; i++){
	dataSet[i].startAngle = (360/dataSet.length)*i * Math.PI / 180;
	dataSet[i].endAngle = (360/dataSet.length)*(i+1) * Math.PI / 180;
}
// 鶏頭図の円のサイズを指定
var arc = d3.svg.arc()
	.innerRadius(iRadius)
	.outerRadius(function(d){ return oRadius + d.value; })	// 半径をデータごとに設定
// 鶏頭図を描画
d3.select("#myGraph")
	.selectAll("path")
	.data(dataSet)	// データをセット
	.enter()
	.append("path") // 円弧はパスで指定
	.attr("class", "pie")	// CSSクラスにpieを指定
	.attr("d", arc)	// 円弧を設定
	.attr("fill", function(d, i){
		return color(i);	// 塗りを設定
	})
	.attr("transform", "translate("+svgWidth/2+", "+svgHeight/2+")")	// グラフを中心に表示
// 文字を描画
d3.select("#myGraph")
	.selectAll("text")
	.data(dataSet)	// データをセット
	.enter()
	.append("text") // 円弧はパスで指定
	.attr("class", "label")	// CSSクラスにpieを指定
	.attr("transform", function(d, i){	// 表示位置を指定
		var c = arc.centroid(d);	// 扇形の重心を求める
		var x = c[0] + svgWidth/2;	// X座標を読み出す
		var y = c[1] + svgHeight/2;	// Y座標を読み出す
		return "translate("+x+", "+y+")";
	})
	.text(function(d, i){	// 文字を表示
		return d.location + "(" + d.value + ")";
	})
