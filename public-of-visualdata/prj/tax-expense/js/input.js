var c = {
	list: ['income','commute','move','training','qualification','travel','books','clothes','bizmeal','allowance'],
	checkInputNum: function(){
		c.eroor_flg = false;
		c.list.map(function(d){
			if(c.eroor_flg) return;
			if($('#'+d).val()==''){
				c.eroor_flg = true
			}
			
		});
		if(c.eroor_flg){
			$('#check-num').show();
		}else{
			$('#check-num').hide();
		}
	},
	firstQ: function(){
		c.checkInputNum();
		if(c.eroor_flg) return;
		var d_income = 0;
		var income = + $('#income').val();
		if(income<=180){
			d_income = income * 0.4
			if(d_income<65){
				d_income = 65;
			}
		}else if(income<=360){
			d_income= income * 0.3 + 18;
		}else if(income<=660){
			d_income= income * 0.2 + 54;
		}else if(income<=1000){
			d_income= income * 0.1 + 120;
		}else if(income<=1500){
			d_income= income * 0.05 + 170;
		}else{
			d_income = 245;
		}
		//特定支出を計算（次のａ～ｈに当てはまる支出）
		var payment = 0;
		var payment_exception = 0;
		payment += + $('#commute').val();
		payment += + $('#move').val();
		payment += + $('#training').val();
		payment += + $('#qualification').val();
		payment += + $('#travel').val();

		payment_exception += + $('#books').val();
		payment_exception += + $('#clothes').val();
		payment_exception += + $('#bizmeal').val();

		//payment_exceptionは65万円までしか認められない
		if(payment_exception>65){
			payment_exception = 65;
		}

		payment += payment_exception;
		payment -= + $('#allowance').val();
		if(d_income/2 <= payment){
			$('#secondquestion').fadeIn('slow');
			c.scrollWindow('secondquestion');
			c.d_sp = payment - d_income/2;
		}else{
			$('#fq').show();
			$('#sq').hide();
			$('#noModal').modal();
		}
	},
	secondQ: function(){
		$('#thirdquestion').fadeIn('slow');
		c.scrollWindow('thirdquestion');
		$('#d-sp').html(c.d_sp+'万円')
	},
	scrollWindow: function(target){
		var ypos = $('#'+target).offset().top-20;
		$('body').animate({scrollTop: ypos}, 1000);
	}
};
$(document).ready(function(){
	$('body').animate({scrollTop: 10}, 100);
});