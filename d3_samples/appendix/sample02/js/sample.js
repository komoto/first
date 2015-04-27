// 積み上げ棒グラフのデータセット
var dataSet = [
    [{ year : 2010, p : 18 }, { year : 2011, p : 22 }, { year : 2012, p : 30 }, { year : 2013, p : 40 }],
    [{ year : 2010, p : 12 }, { year : 2011, p : 25 }, { year : 2012, p : 45 }, { year : 2013, p : 80 }],
    [{ year : 2010, p : 10 }, { year : 2011, p : 15 }, { year : 2012, p : 20 }, { year : 2013, p : 25 }]
];
// グラフ関係のデータを変数に設定
var svgHeight = 240;	// svg要素の高さ
var barWidth = 50;	// 棒グラフの横幅
var step = 80;	// 棒グラフの横の間隔
var offsetX = 10;	// X座標のオフセット
// カラーを設定
var color = ["red", "pink", "orange"];
// 積み上げ棒グラフのレイアウトの設定
var stack = d3.layout.stack()   // 積み上げ棒グラフ
	.y(function(d){
		return d.p;	// キー名pのデータを使う
	})
// 積み上げ棒グラフはグループにまとめて表示
d3.select("#myGraph")
	.selectAll("g")	// グループを生成
	.data(stack(dataSet))	// データセットを設定
	.enter()
	.append("g")	// g要素を追加
	.attr("fill", function(d, i){   // 棒グラフの色を設定
        return color[i];
    })
	.selectAll("rect")
	.data(function(d, i){
		return d;	// データを1つ読み出す (例：{ year : 2010, p : 18 })
	})
	.enter()
	.append("rect")	// 四角形を追加
	.attr("x", function(d, i){
		return offsetX + i * step;	// 棒グラフのX座標を返す
	})
	.attr("y", function(d, i){
		return svgHeight - d.y0 - d.y;	// 積み上げたY座標を返す
	})
	.attr("width", barWidth)	// 棒グラフの横幅を設定
	.attr("height", function(d, i){
		return d.y;	// 棒グラフの高さを返す
	})
