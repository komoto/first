function setDrawChart() {
	var jsonData = $.ajax({
		url: "js/chapter3.chart.json",
		dataType:"json",
		async: false
		}).responseText;
 	var options = {
		width: '100%',
		height: '100%',
		chartArea: {width: '72%', height: '80%'},
		series: {
		 0: {targetAxisIndex: 0},
		 1: {targetAxisIndex: 1}
		},
		animation:{
	 	duration: 1000,
	 	easing: 'in'
		},
		hAxis: {viewWindow: {min:0, max:190}},
		legend: { position: 'top', alignment: 'end' },
		colors: ['#1887db', '#ef991b'],
		fontSize: [ 12 ],
		interpolateNulls:true,
 	};
	var MAX = 184+131+18;
	var data = new google.visualization.DataTable(jsonData);
	var view = new google.visualization.DataView(data);
 	view.setColumns([0,1,2]);
	var chart = new google.visualization.LineChart($("#chapter3_chart_canvas").get(0));
	var data3Button = document.getElementById('data3');
	var data4Button = document.getElementById('data4');
	var data5Button = document.getElementById('data5');
	var data6Button = document.getElementById('data6');
	var prevButton = document.getElementById('chart1-2-b2');
	var nextButton = document.getElementById('chart1-2-b3');
	// var changeZoomButton = document.getElementById('chart1-2-b4');
	var vButton = document.getElementById('chart1-2-b6');
function drawChart(opt) {
	data3Button.disabled = true;
	data4Button.disabled = true;
	data5Button.disabled = true;
	// changeZoomButton.disabled = true;
	vButton.disabled = true;
	// prevButton.disabled = true;
	// nextButton.disabled = true;
	google.visualization.events.addListener(chart, 'ready',
	function() {
	 data3Button.disabled = false;
	 data4Button.disabled = false;
	 data5Button.disabled = false;
	//  changeZoomButton.disabled = false;
	 vButton.disabled = false;
  //  prevButton.disabled = options.hAxis.viewWindow.min <= 131;
	//  nextButton.disabled = options.hAxis.viewWindow.max >= 184+131;
		});
	chart.draw(view, opt);
 }

 function changeButton(object){
	$('#changeChartData .btn').removeClass("active");
	object.addClass('active');
 }

 data3Button.onclick = function() {
	var object = $(this);
	$("#changabletext").css("opacity",0);
	$("#changabletext").html("<h4>株価と連動　海外勢「株買い・円売り」</h4><p>６月２日の外国為替市場で円相場は一時１ドル＝125円台に下落し、2002年12月以来12年半ぶりの安値をつけた。リーマン危機や東日本大震災の後、11年10月末には一時75円32銭の戦後最高値を記録したが、そこから50円近く切り返した。超円高で苦しんだ輸出は徐々に持ち直し、企業の採算も大きく改善した。足元の円相場は日経平均株価との連動性が高まっており、日経平均も2000年のITバブル期の高値（２万833円）の更新をうかがう。海外投資家による「株買い・円売り」が相場の原動力になっているとの指摘がある。</p>");
	$("#changabletext")
	.animate({ opacity:'1'},1000);
	// delete options.vAxes;
	// $("#changabletext").html("１番めのテキスト");
	// $('#default').hide("normal");
	// $('#1st').show("normal");
	view.setColumns([0, 1, 2]);
	drawChart(options);
	changeButton(object);
};
 data4Button.onclick = function() {
	var object = $(this);
	$("#changabletext").css("opacity",0);
	$("#changabletext").html("<h4>ドル建て株価も堅調　海外資金集める</h4><p>海外投資家はドル建ての日経平均株価を重視する。円安が進むとドル建ての価値が目減りするが、今年に入りドル建ての日経平均株価も上昇。日本株の値動きの良さに着目した海外勢の資金を集めている。</p>")
	$("#changabletext")
	.animate({ opacity:'1'},1000);

	view.setColumns([0, 1,  3]);
	chart.draw(view, options);
	changeButton(object);
};

	 data5Button.onclick = function() {
		var object = $(this);
		// delete options.vAxes;
		// changeZoomButton.style.display="none";
		changeButton(object);

		$("#changabletext").css("opacity",0);
		$("#changabletext").html("<h4>膨張するマネタリーベース</h4><p>日銀は2013年４月に量的・質的金融緩和を導入し、マネタリーベース（資金供給量）を大きく拡大させている。14年10月には追加緩和によって緩和規模をさらに拡大した。外為市場は「金融緩和＝通貨安」と受け止め、日銀の異次元緩和が海外投資家を巻き込み円安を主導してきた。足元の物価上昇率は伸び悩み、海外投資家の間では日銀による追加緩和観測も根強く残っている。</p>")
		$("#changabletext")
		.animate({ opacity:'1'},1000);


		// options_forprediction.hAxis.viewWindow.min = 0;
		// options_forprediction.hAxis.viewWindow.max = 184+131+18;
		view.setColumns([0, 1,4]);
		drawChart(options);

	};
		data6Button.onclick = function() {
		var object = $(this);
		// delete options.vAxes;
		view.setColumns([0, 1, 5]);
		chart.draw(view,options);
		changeButton(object);
		$("#changabletext").css("opacity",0);
		$("#changabletext").html("<h4>期待先行の金利差拡大</h4><p>為替相場は海外との金利差に影響されやすい。米連邦準備理事会（FRB）のイエレン議長が５月に「年内の利上げ」に言及すると、日米の金利差が広がるとの思惑が円売り・ドル買いを促した。ただ、実際には米金利の上昇は限られており、２年債でみた金利差はそれほど広がっていない。金利差拡大は米利上げをにらんだ期待先行の状況といえる。</p>")
		$("#changabletext")
		.animate({ opacity:'1'},1000);




	};

//  prevButton.onclick = function() {
// 	options.hAxis.viewWindow.min -= 63;
// 	options.hAxis.viewWindow.max -= 63;
// 	chart.draw(view,options);
// };
//  nextButton.onclick = function() {
// 	options.hAxis.viewWindow.min += 63;
// 	options.hAxis.viewWindow.max += 63;
// 	chart.draw(view,options);
// };

//  var zoomed = true;
//  changeZoomButton.onclick = function() {
// 	if (zoomed) {
// 	 options.hAxis.viewWindow.min = 131;
// 	 options.hAxis.viewWindow.max = 61+131;
// 	 $(this).removeClass('btn-zoom-in').addClass('btn-zoom-out').text("5年指標に戻る");
//
// 	changeZoomButton.style.display="block";
// 	} else {
// 	 options.hAxis.viewWindow.min = 131;
// 	 options.hAxis.viewWindow.max = MAX;
// 	 $(this).removeClass('btn-zoom-out').addClass('btn-zoom-in').text("5年毎にズーム");
// 	}
// 	zoomed = !zoomed;
// 	chart.draw(view,options);
// 	changeZoomButton.style.display="block";
// };
var vAxis = false;
vButton.onclick = function (){
	if(vAxis){
	options.vAxes = { 0: {	direction: 1 },	 1: {	direction: 1	 }	};
	$(this).text("円高/円安を反転");
	}
	else{{options.vAxes = { 0: {	direction: -1 },	 1: {	direction: 1	 }	};
	}
	$(this).text("円高/円安を反転");}
	vAxis = !vAxis;
	chart.draw(view,options);
};

drawChart(options);
}

google.load('visualization', '1.1', {packages: ['corechart']});
google.setOnLoadCallback(setDrawChart);
