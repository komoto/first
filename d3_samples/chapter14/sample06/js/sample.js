// WebGL関連処理
var webGLWidth = 320;	// Canvas(WebGL)要素の横幅
var webGLHeight = 320;	// Canvas(WebGL)要素の高さ
// 描画領域、カメラ、ライトの設定
renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( webGLWidth, webGLHeight );	// サイズを指定
renderer.setClearColor(0xffffaf);	// 背景色を指定
document.body.appendChild( renderer.domElement );	// ページ末尾に追加
var camera = new THREE.PerspectiveCamera( 70, 1.0, 1, 1000 );	// カメラ画角などの設定
camera.position.set(0, 0, 70);	// カメラ位置の設定
var scene = new THREE.Scene();	// シーンの生成
var cube = [ ];	// 立方体を入れるための配列
var light = new THREE.DirectionalLight(0xffffff, 1.25);	// ライトを生成
light.position.set(70, 120, 2000);	// ライトの位置を設定
scene.add(light);	// ライトを追加
// 以下はD3.jsの処理
var blockSize = 20;	// ブロックのサイズ
// データセット
var dataSet = [
	0, 1, 2, 3, 3, 4, 5, 4,
	0, 0, 0, 3, 4, 4, 5, 3,
	1, 0, 0, 0, 0, 0, 0, 0,
	2, 6, 8, 7, 0, 0, 0, 2,
	4, 8, 9, 8, 0, 0, 1, 0,
	2, 6, 8, 6, 4, 0, 0, 0,
	2, 5, 3, 0, 2, 0, 0, 0,
	1, 2, 0, 0, 0, 0, 0, 0,
	1, 0, 0, 0, 0, 7, 8, 9,
	0, 0, 0, 0, 7, 9, 9, 9,
	0, 0, 0, 7, 8, 8, 9, 7,
	0, 0, 0, 6, 6, 7, 6, 5
];
// ヒートマップに表示するカラーを自動計算
var color = d3.interpolateHsl("blue", "yellow");	// 青色から黄色に補間
var maxValue = d3.max(dataSet);	// 最大値を求める
// ヒートマップの準備
var heatMap = d3.select("#myGraph")
	.selectAll("div")   // divに表示するボックスを割り当てる
	.data(dataSet)    // データを設定
// ヒートマップを表示
heatMap.enter()
	.call(function(d){	// データの数だけ立方体を生成
		var count = 0;
		for(var y=0; y<12; y++){	// 縦の生成数
			for(var x =0; x<8; x++){	// 横の生成数
				cube[count] = new THREE.Mesh(	// 立方体のマテリアル等を指定
					new THREE.BoxGeometry( 5, 5, 5 ),	// 立方体のサイズ
					new THREE.MeshLambertMaterial( { color : 0x00ff00 } )	// Lambertで色を指定
				);
				cube[count].position.x = x * 8 - 25;	// X座標を設定
				cube[count].position.y = y * 8 - 45;	// y座標を設定
				scene.add(cube[count]);	// シーンに追加
				count = count + 1;
			}
		}
	})
// ヒートマップを定期的に更新
setInterval(function(){
	for(var i=0; i<dataSet.length; i++){
		var n = ((Math.random() * 3.5) | 0) - 2;	// 乱数値
		dataSet[i] = dataSet[i] + n;	// 加算
		if (dataSet[i] < 0){ dataSet[i] = 0; }	// 負数にならないように調整
		if (dataSet[i] > maxValue ){ dataSet[i] = maxValue; }	// 最大値を超えないように調整
	}
	heatMap.data(dataSet);	// データを設定
	// データの数だけ立方体の色を変更
	for(var i=0; i<dataSet.length; i++){
		cube[i].material.color = new THREE.Color(color(dataSet[i]/maxValue));	// マテリアルカラーを設定
	}
}, 1000);
// 立方体の回転は別アニメーションで処理
cubeAnime();
function cubeAnime(){
	requestAnimationFrame(cubeAnime);	// 描画タイミングにあわせて関数を呼び出す
	for(var i=0; i<cube.length; i++){
		cube[i].rotation.x = cube[i].rotation.x - 0.01;	// X軸の回転角度
		cube[i].rotation.y = cube[i].rotation.y + 0.01;	// Y軸の回転角度
		cube[i].rotation.z = cube[i].rotation.z + 0.02;	// Z軸の回転角度
	}
	camera.rotation.z = camera.rotation.z + 0.01;	// カメラのZ軸の回転角度
	renderer.render( scene, camera );	// シーンを描画
}
