// データセットがプログラム内の配列で用意されている場合
var dataSet = [ 50, 10, 120, 200, 90 ];
// グラフを描画
d3.select("#myGraph")
	.selectAll("rect")	// rect要素を指定
	.data(dataSet)	// データを要素に連結
	.enter()	// データ数だけ繰り返す
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
