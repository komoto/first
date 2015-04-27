d3.csv("mydata.csv", function(error, data){
	var dataSet = [ ];	// データを格納する配列変数
	var labelName = [ ];	// ラベルを入れる配列変数変数
	for(var i in data[0]){	// ラベルを処理する
		labelName.push(i);	// ラベルを入れる
	}
	for(var j=0; j<data.length-1; j++){	// データの数だけ繰り返す
		for(var i in data[j]){	// データを処理する
			dataSet.push(data[j][i]);	// 横一行全てをまとめて入れる
		}
	}
	console.log(dataSet);
	console.log("-----");
	console.log(labelName);
});
