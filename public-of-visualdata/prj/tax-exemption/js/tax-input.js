var vm = new Vue({
	el: '#tax-input',
	data: {
		income: 0,
		d_income: 0,
		d_social: 0,
		d_spouse: 0,
		d_dependents: 0,
		d_spouse4city: 0,
		d_dependents4city: 0,
		taxable: 0,
		tax: 0,
		tax4city: 0,
		sum_tax: 0,
		total: 0,
	},
	methods: {
		confirmCalc: function(){
			vm.checkInputNum();
			vm.calcIncomeDeduction();
			vm.calcSocialDeduction();
			vm.calcSpouseDeduction();
			vm.calcDependentsDeduction();
			vm.calcTaxableIncome();
			vm.calcTaxableIncome4city();
			//format
			vm.formatAmount();
		},
		checkInputNum: function(){
			if($('.form-control').val()){
				$('#check-num').hide();
			}else{
				$('#check-num').show();
			}

		},
		formatAmount: function(){
			//format units
			var d_social4sum = Math.floor(this.d_social);

			var tax4sum = +this.tax;
			var tax4city4sum = +this.tax4city;

			this.d_income = (this.d_income+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.d_social = (d_social4sum+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.d_spouse = (this.d_spouse+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.d_spouse4city = (this.d_spouse4city+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.d_dependents = (this.d_dependents+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.d_dependents4city = (this.d_dependents4city+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.taxable = (this.taxable+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

			this.tax = (this.tax).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			this.tax4city = (this.tax4city).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

			var sum = d_social4sum + tax4city4sum + tax4sum;
			this.sum_tax = (sum+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+'円';
			this.total = ((this.income*10000 - sum)+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+'円';
		},
		calcIncomeDeduction: function(){
			var d_income;
			// 入力値を万円単位に
			var input_income = this.income * 10000;
			if(input_income<=1800000){
				d_income = input_income*0.4;
				if(d_income<650000){
					d_income = 650000;
				}
			}else if(input_income<=3600000){
				d_income = input_income*0.3+180000;
			}else if(input_income<=6600000){
				d_income = input_income*0.2+540000;
			}else if(input_income<=10000000){
				d_income = input_income*0.1+1200000;
			}else if(input_income<=15000000){
				d_income = input_income*0.05+1700000;
			}else{
				d_income = 2450000;
			}

			//給与所得控除
			this.d_income = d_income;
		},
		calcSocialDeduction: function(){
			var d_social;
			// 入力値を万円単位に
			var input_income = this.income * 10000;

			if(this.age_select=='true'){
				//over 40
				if(input_income>=14100000){
					d_social = 838530;
				}else{
					d_social = input_income*0.05775;
				}
			}else{
				//under 40
				if(input_income>=14100000){
					d_social = 723822;
				}else{
					d_social = input_income*0.04985;
				}
			}

			//厚生年金保険料
			if(input_income<7260000){
				d_social += input_income*0.08737;
			}else{
				d_social += 650032;
			}


			if(d_social<0){
				d_social = 0;
			}
			//社会保険料控除
			this.d_social = d_social;
		},
		calcSpouseDeduction: function(){

			this.checked = $('#c1').prop('checked');

			// 配偶者控除
			if(this.checked){
				this.d_spouse = 380000;
			}else{
				this.d_spouse = 0;
			}
			// 配偶者控除（住民税）
			if(this.checked){
				this.d_spouse4city = 330000;
			}else{
				this.d_spouse4city = 0;
			}		
		},
		calcDependentsDeduction: function(){

			var d_dependents = 0;
			var d_dependents4city = 0;
			d_dependents += (+this.child16 + +this.child23) * 380000;
			d_dependents += +this.child19 * 630000;
			d_dependents += +this.gpsame * 580000;
			d_dependents += +this.gpdiff * 480000;

			//扶養控除
			this.d_dependents = d_dependents;

			d_dependents4city += (+this.child16 + +this.child23) * 330000;
			d_dependents4city += +this.child19 * 450000;
			d_dependents4city += +this.gpsame * 450000;
			d_dependents4city += +this.gpdiff * 380000;

			//扶養控除（住民税）
			this.d_dependents4city = d_dependents4city;
		},
		calcTaxableIncome: function(){
			//課税所得金額
			var taxable = this.income*10000 - this.d_income - this.d_social - this.d_spouse - this.d_dependents - 380000;
			//千円未満切り捨て
			taxable = (~~taxable+'').replace(/[0-9]{3}$/, '000');

			//　累進計算
			var tax;
			if(taxable<=1950000){
				tax = taxable * 0.05105;
			}else if(taxable<=3300000){
				tax = taxable * 0.1021 - 99547;
			}else if(taxable<=6950000){
				tax = taxable * 0.2042 - 436477;
			}else if(taxable<=9000000){
				tax = taxable * 0.23483 - 649356;
			}else if(taxable<=18000000){
				tax = taxable * 0.33693 - 1568256;
			}else if(taxable<=40000000){
				tax = taxable * 0.4084 - 2854716;
			}else{
				tax = taxable * 0.45945 - 4896716;
			}

			//課税所得額がマイナスのとき
			if(taxable<=0){
				taxable = 0;
			}
			this.taxable = taxable;

			// 課税額がマイナスのとき
			if(tax<=0){
				tax = 0;
			}
			//百円未満切り捨て
			this.tax = (~~tax+'').replace(/[0-9]{2}$/, '00');
		},
		calcTaxableIncome4city: function(){
			//課税所得金額（住民税）
			var taxable4city = this.income*10000 - this.d_income - this.d_social  - this.d_spouse4city - this.d_dependents4city - 330000;
			var tax4city = taxable4city * 0.1;
			// 課税額がマイナスのとき
			if(tax4city<=0){
				tax4city = 0;
			}
			//百円未満切り捨て
			this.tax4city = (~~tax4city+'').replace(/[0-9]{2}$/, '00');


		}
	}
});

$(document).ready(function(){
	$('#c1').prop('checked',false);
});