d3.select("#myBar")	// ID名myBarを指定
	.attr("x", "10px")	// X座標を10pxに設定
	.attr("y", "50px")	// Y座標を50pxに設定
	.attr("width", "200px")	// 横幅を200pxに設定
	.attr("height", "30px")	// 縦幅を30pxに設定
	.transition()	// アニメーションするように設定
	.duration(3000)	// 3秒かけて変化
	.attr("width", "50px")	// 横幅を50pxに設定
