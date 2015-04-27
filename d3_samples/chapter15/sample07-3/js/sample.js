var canvasWidth = 640;	// Canvas要素の横幅
var canvasHeight = 640;	// Canvas要素の高さ
var degree = 0;	// 回転角度
var earthSize = 280;	// 地球のサイズ
var earth = d3.geo.orthographic()   // 投影方法をOrthographicに設定
	.translate([canvasWidth/2, canvasHeight/2])	// 画面での表示位置を調整
	.clipAngle(90)	// クリップ範囲を指定
	.scale(earthSize)	// スケールを指定
	.rotate([degree, -25])	// 回転角度を指定
var path = d3.geo.path()	// パスと投影方法を設定
	.projection(earth)
var context = d3.select("#myGraph").node().getContext("2d");	// コンテキストを取得
// 地球のデータを読み込む
d3.json("data/world.json", function(error, world) {
	d3.timer(function(){
		earth.rotate([degree, -25]);	// 角度を設定
		degree = degree + 2;	// 2度ずつ動かす
		// 以下がCanvasに描画する処理
		context.clearRect(0, 0, canvasWidth, canvasHeight);	// Canvas内を消去
		context.fillStyle = "#22f";	// 塗りの色を指定
		context.beginPath();
		context.arc(canvasWidth/2, canvasHeight/2, earthSize, 0, Math.PI*2, 1);	// 地球（円）を描画
		context.fill();	// 地球を塗り潰す
		context.fillStyle = "#eee";	// 塗りの色を指定
		context.strokeStyle = "black";	// 線の色を指定
		context.lineWidth = 0.5;	// 線の太さ
		context.beginPath();
		path.context(context)(world);	// 地図のパスを生成
		context.fill();	// 地図を塗る
		context.stroke();	// 地図の境界線を描画
	});
})
