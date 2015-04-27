var svgWidth = 800;	// SVG要素の横幅
var svgHeight = 800;	// SVG要素の高さ
// 調べるテキストファイルを読み込む
d3.text("sample.txt", function(error, plainText){
	var count = [ ];	// 文字の種類を入れる変数（ハッシュとして使用）
	for(var i=0; i<plainText.length; i++){	// 全文字数分繰り返す
		var c = plainText.charAt(i);	// 1文字読み出す
		if(!count[c]){	// すでに登録済みの文字か調べる
			count[c] = 1;	// 初めて文字が出現した
		}else{
			count[c] = count[c] + 1;	// カウントを増やす
		}
	}
	var temp = [ ];	// 一時的な配列変数
	for(i in count){	// 文字の種類だけ繰り返す
		temp.push({ name : i, value : count[i] });	// 文字名と出現数を入れる
	}
	// データセットを生成
	var dataSet = {
		children: temp
	};
	drawTreemap(dataSet);	// ツリーマップを表示
})
// ツリーマップを表示する関数
function drawTreemap(dataSet){
	// ツリーマップレイアウト
	var treemap = d3.layout.treemap()
		.size([svgWidth, svgHeight])   // SVG要素の幅に合わせる
		.mode("slice")
	// ツリーマップを描画する
	var tmap = d3.select("#myGraph")
		.selectAll("rect")   // divに表示するボックスを割り当てる
		.data(treemap.nodes(dataSet))    // ノードを対象に処理
	// 分割マップ領域を追加
	tmap.enter()
		.append("rect")  // rect要素を追加
		.attr("class", "block")	// CSSクラスを追加
		.attr("x", function(d, i) { // X座標を設定
			return d.x;
		}) 
		.attr("y", function(d, i) { // Y座標を設定
			return d.y;
		})
		.attr("width", function(d, i) {	// 横幅を設定
			return d.dx;
		})
		.attr("height", function(d, i) {	// 縦幅を設定
			return d.dy;
		})
	// マップ内に文字を追加
	tmap.enter()
		.append("text")	// text要素を追加
		.attr("class", "name")	// CSSクラスを追加
		.attr("transform", function(d, i){	// 位置を計算しXY座標を一括で設定
			return "translate(" + (d.x+d.dx/2) + "," + (d.y+d.dy/2) + ")";	// X,Y座標を設定
		})
		.attr("dy", "0.2em")	// 表示位置を調整
		.text(function(d, i) {  // 文字を表示する
			return d.name;	// 領域内に表示する文字を返す
		})
		.style("font-size", function(d, i){	// 領域のサイズに応じて文字サイズを調整
			return (d.dx * d.dy) / 200;
		})
}
