d3.selectAll(".bar")	// CSSクラス名barを指定
	.style("fill", function(d,i){	// 2番目のパラメーターに関数を指定する
		if(i == 2){	// 出現順番を調べる
			return "red";	// 3番目の場合のみ赤色を示す文字を返す
		}	
	})
