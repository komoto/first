$(document).ready(function(){


var c = {
  tax_data: [],
  data_exist: true,
  // country_label = [];
  // showHanrei: function(country_label){
  //   var country_label = c.country_path.properties.label;
  //   return country_label;
  // }
  showLineChart: function(country_name){

    var data4line_arr = [];


    //data format 4 linecharts
    var country_data = c.taxdata.filter(function(d){
      return d.countries==country_name

    });
    //if click no data country
    if(country_data[0]==undefined){
      c.data_exist = false;
      return;
    }
    c.data_exist = true;
    ['Corporate', 'Indirect'].map(function(genre){
      var data4line = country_data.map(function(d){
        data4line_arr.push({year: d.year, value: d[genre], label: genre})
        // return {year: d.year, value: d[genre], label: genre}
      });
    });

    //define axis
    w = ($(document).width()>460 ? 500 : 480);
    h = ($(document).width()>460 ? 250 : 200);


    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    chart_width = w - margin.left - margin.right,
    chart_height = h - margin.top - margin.bottom;


    var x = d3.scale.linear()
      .range([0, chart_width]);

    var y = d3.scale.linear()
      .range([chart_height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d){ return d+''; });

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    x.domain(d3.extent(data4line_arr, function(d) { return d.year; }));
    y.domain([0,45]);
    // y.domain([0,d3.max(data4line_arr, function(d) { return d.value; })]);


    //svgを再描画したときになんどもよばれるtodo
    var svg = d3.select("#plot")
      .attr("width", chart_width)
      .attr("height", chart_height)
      ;

    // }
    var svg_hanrei = d3.select("#hanrei")
       .text(country_data[0].namae)
       ;



      //  .on('click', function(country_path){
      //    var country_name = country_path.properties.name;});}



    var line_axis =
      svg.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //todo
    //あとでなおす
    d3.selectAll('.axis').remove();
    d3.selectAll('.values').remove();

    line_axis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart_height + ")")
        .call(xAxis)
        .append("text")
        .text("年")
        .attr({
          x:420
        });


    line_axis.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("％");


    var line = d3.svg.line()

        //.interpolate("cardinal") //smooth
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });




    //todo show line charts

    ['Corporate', 'Indirect'].map(function(genre){
      var linedata = data4line_arr.filter(function(d){
        return d.label == genre;
      })
      line_axis.append("g")
          .attr('class', 'values')
          .append('path')
          .datum(linedata)
          .attr('d', line)
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('stroke', function(d){
              if(genre=='Corporate'){
                return 'steelblue';
              }else{
                return 'red';
              }
            })
            .transition()
            .duration(750);

          ;


    //    .datum(linedata)
    //    .enter()
    //    .append("path")
    //  //.datum(chart_arr)
    //     .attr("class", "line")
    //     .attr("d", function(d) { return line(d.values); })
    //     .style("stroke", "steelblue");
    //     // .style("stroke", function(d) { return color(d.name); });

    });
  },
  showMap: function(){
    d3.json("./topo_world_countries_st.topojson", function(json) {
      var plotsize = 320;　//散布図の縦横サイズ
      var baseColor = "#cccccc"; //地図、circleのベースカラー

      //塗り分けカラーの設定
      var colorList = ["#ce6dbd", "#f7b6d2", "#8ca252", "#ff7f0e", "#de9ed6", "#d62728", "#e377c2", "#e7ba52", "#2ca02c", "#e377c2", "#f7b6d2", "#c7c7c7", "#ffbb78", "#e7cb94", "#dbdb8d", "#8c564b", "#b5cf6b", "#843c39", "#7b4173", "#aec7e8", "#ffbb78", "#8c564b", "#bd9e39", "#dbdb8d", "#c5b0d5", "#7f7f7f", "#9edae5", "#c49c94", "#c49c94", "#393b79", "#9467bd", "#5254a3", "#a55194", "#637939", "#17becf", "#cedb9c", "#1f77b4", "#1f77b4", "#9467bd", "#ff9896", "#ff7f0e", "#9c9ede", "#ad494a", "#ff9896", "#98df8a", "#17becf", "#7f7f7f", "#bcbd22", "#98df8a", "#bcbd22", "#c5b0d5", "#2ca02c", "#8c6d31", "#aec7e8", "#6b6ecf", "#d6616b", "#e7969c", "#c7c7c7", "#d62728", "#9edae5"];

      //カラースケール
      // var colorScale = d3.scale.ordinal().domain([1,47]).range(colorList);

      //dataSetの準備
      var geodata = topojson.feature(json, json.objects.countries).features; //topojosnデータ
      //var geodata = json.features; //geojsonを使う場合はこちら

      //データセットの型変換
      geodata.forEach(function(d) {
          d.properties.jobs_ratio = parseFloat(d.properties.jobs_ratio);
          d.properties.fullness_rate = parseFloat(d.properties.fullness_rate);
      });

      //有効求人倍率の最大値取得
      var jobs_ratioMax = d3.max(geodata, function(d){
          return d.properties.jobs_ratio;
      });

      //充足率の最大値取得
      var fullness_rateMax = d3.max(geodata, function(d){
          return d.properties.fullness_rate;
      });

      //scale関数(正規化)生成
      var xScale = d3.scale.linear().domain([0, fullness_rateMax+1]).range([0, plotsize]);
      var yScale = d3.scale.linear().domain([jobs_ratioMax+0.05,  0]).range([0, plotsize]);

      //axis関数(目盛り)の生成
      var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
      var yAxis = d3.svg.axis().scale(yScale).orient('left');


      //地図投影法設定
      var projection = d3.geo
          .mercator()		//投影法の指定
          .scale(270)	//スケール（ズーム）の指定
          .translate([800,750]) //表示位置調整 x,y
          .center([0, 0]); //中心の座標を指定

      //geoデータ→svg path変換関数生成
      var path = d3.geo.path().projection(projection);

      //表示ステージ
      var svg = d3.select("svg")
                  .call(
                    d3.behavior.zoom()
                      .on("zoom", redraw)
                  );


      function redraw() {
        if(d3.event.scale > 10 || d3.event.scale < .2) {
          return;
        }
        mapGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
      //mapを作成するグループ
      var mapGroup = svg.select('#map'); // <g>
      var Singapore = svg.select('#singapore');



      //map表示
      var map = mapGroup
          .selectAll("path")
          .data(geodata)
          .enter()
          .append("svg:path")
          .attr('class', function(d){ return 'country '+d.properties.name } )
          .attr({
            "d": function(d){return path(d)},
            "fill": function(d){
              var obj = c.tax_data.filter(function(e){return e.Location==d.properties.name})[0];

              if(!obj) {

                return '#cccccc';
                // .classed('country_null', true)
              }

              else if(obj.difference>15) {
                return '#07538c';
                }
              else if(obj.difference>10) {
                return '#4883ae';
              }
              else if(obj.difference>5) {
                return '#8bb1cd';
              }
              else if(obj.difference>1) {
                return '#cedeea';
                }
              else if(obj.difference==0) {
                return '#999';
                }
              else if(obj.difference>-1) {
                return '#ffe5e5';
              }
              else if(obj.difference>-5) {
                return '#ffcccc';
              }
              else if(obj.difference>-10) {
                return '#ff9999';
              }
              else if(obj.difference>-15) {
                return '#ff6666';
              }



              else return '#4883ae';

              //return baseColor
            },
            "fill-opacity": 1,
            "stroke": "black"
          })
          .on('mouseover', function(d){
              d3.selectAll( "."+d3.select(this).attr('class').replace('country ', '') ) //マウスオーバーしたエリアと同じclass名の要素を選択
              //.attr("fill", "red");
              .classed('country_hover', true);
              // d3.select(this).append("text").text{function(a){ return a.properties.name })}

              // .append("text")
              // .text("function(a){ return a.properties.name }")
              // .append("text")
              // .text(function(e){return e.name
              })
              // .html("ok");

          .on('mouseout', function(){
              d3.selectAll(
                "."+d3.select(this).attr('class')
                  .replace('country ', '')
                  .replace(' country_hover', '')
              )
              //.attr("fill", baseColor); //バグあり　あとで直す
              .classed('country_hover', false);
          })
          .on('click', function(country_path){
            var clicked_country_old = d3.select(".country_clicked"); // path
            var clicked_country_new = d3.select(this); // path
            var clicked_color_old = c.clicked_color;
            var clicked_color_new = clicked_country_new.attr("fill"); // set new color

            // c.country_label = country_path.properties.japanese;
            var country_name = country_path.properties.name;
            c.showLineChart(country_name);
            if(!c.data_exist) return;

        		d3.select('#tile > rect')
              .attr('fill', clicked_color_new);

            // d3.select(this).attr("patt","red").attr("stroke-width","bold");
            clicked_country_new.classed('country_clicked', true);
            clicked_country_new.attr('fill','url(#tile)');

            c.clicked_color = clicked_color_new;

            // クリック済み領域がなければreturn
            if(clicked_country_old.size() < 1) return;

            // c.clicked_color set old color
            clicked_country_old
              .classed('country_clicked', false)
              .attr('fill', clicked_color_old)
            ;

            if(clicked_country_old.attr("class") === "city_country"){

              var old_city_id = clicked_country_old.attr("id");

              var city_stwidth;
              if( old_city_id === "singapore")  {city_stwidth = 18;}
              else if( country_name === "hongkong") {city_stwidth = 2;}

              var oldCity = d3.selectAll("[id^="+ old_city_id +"]");


              oldCity.selectAll("rect")
               .style("stroke-width", city_stwidth)
               .style("stroke","#CCCCCC");
               oldCity.selectAll("line")
                .style("stroke-width", 1)
                .style("stroke", "#202020");
            }

          });


          d3.selectAll('.city_country')
            .on('click', function(){

                var clicked_country_old = d3.select(".country_clicked"); // path
                var clicked_country_new = d3.select(this); // path
                var clicked_color_old = c.clicked_color;
                // var clicked_color_new = clicked_country_new.attr("fill"); // set new color
                var country_name, city_country_flg, city_id;
                // console.log(clicked_country_old)
                // console.log(clicked_country_new.attr("class"))
                // var old_data = clicked_country_old.attr("class")
                //
                // var new_data = clicked_country_new.attr("class")

              // Get country_name
                if(typeof country_path == 'undefined') {
                  country_name = clicked_country_new.attr('data-country-name');
                  city_country_flg = 1;
                } else {
                  // c.country_label = country_path.properties.japanese;
                  country_name = country_path.properties.name;
                }
              // end of Get country_name

              var scaleback;
              if( country_name === "Singapore")  {scaleback = .025}
              else if( country_name === "Hong Kong SAR") {scaleback = .3}
               city_id = clicked_country_new.attr("id"); // get id

                var currentCity = d3.selectAll("[id^="+ city_id +"]")

                currentCity.selectAll("rect")
                .transition().duration(200)
                 .style("stroke-width", 2/scaleback)
                 .style("stroke", "#CEDEEA");

                 currentCity.selectAll("line")
                 .transition().duration(200)
                  .style("stroke-width", 2)
                  .style("stroke", "#CEDEEA");


                c.showLineChart(country_name);
                if(!c.data_exist && !city_country_flg) return;



              if( $(this).hasClass("country_clicked") ){

              }else{
              clicked_country_old.classed('country_clicked', false);
              clicked_country_new.classed('country_clicked', true);

              }

                // d3.select('#tile > rect')
                //   .attr('fill', clicked_color_new);



              // tile fulfillment
                // if(city_country_flg) {
                //   //clicked_country_new.selectAll('path').attr('fill','url(#tile)');
                // } else clicked_country_new.attr('fill','url(#tile)');
                //
                // c.clicked_color = clicked_color_new;
              // end of tile fulfillment

                // クリック済み領域がなければreturn
                if(clicked_country_old.size() < 1) return;

                // c.clicked_color set old color

                clicked_country_old.attr('fill', clicked_color_old);

                if(clicked_country_old.attr("class") === "city_country"){

                  var old_city_id = clicked_country_old.attr("id");

                  var city_stwidth;
                  if( old_city_id === "singapore")  {city_stwidth = 18}
                  else if( country_name === "hongkong") {city_stwidth = 2}

                  var oldCity = d3.selectAll("[id^="+ old_city_id +"]")


                  oldCity.selectAll("rect")
                   .style("stroke-width", city_stwidth)
                   .style("stroke","#CCCCCC")
                   oldCity.selectAll("line")
                    .style("stroke-width", 1)
                    .style("stroke", "#202020");



                }


            })
          ;

    });
  },

  init: function(){
    // map
    d3.tsv('taxdifference.tsv', function(tsv){
      tsv.forEach(function(d){
        d.difference = +d.difference;
      });
      c.tax_data = tsv;
      c.showMap();
    });

    // line charts
    d3.tsv('taxdata.tsv', function(data){
      data.forEach(function(d){
        d.Corporate = +d.Corporate;
        d.Indirect  = +d.Indirect;
      });
      c.taxdata = data;
      // c.country_label = '日本';
      c.showLineChart('Japan');
    });
  },
};
c.init();

function d3main(json){
    var plotsize = 320;　//散布図の縦横サイズ
    var baseColor = "#cccccc"; //地図、circleのベースカラー

    //塗り分けカラーの設定
    // var colorList = ["#ce6dbd", "#f7b6d2", "#8ca252", "#ff7f0e", "#de9ed6", "#d62728", "#e377c2", "#e7ba52", "#2ca02c", "#e377c2", "#f7b6d2", "#c7c7c7", "#ffbb78", "#e7cb94", "#dbdb8d", "#8c564b", "#b5cf6b", "#843c39", "#7b4173", "#aec7e8", "#ffbb78", "#8c564b", "#bd9e39", "#dbdb8d", "#c5b0d5", "#7f7f7f", "#9edae5", "#c49c94", "#c49c94", "#393b79", "#9467bd", "#5254a3", "#a55194", "#637939", "#17becf", "#cedb9c", "#1f77b4", "#1f77b4", "#9467bd", "#ff9896", "#ff7f0e", "#9c9ede", "#ad494a", "#ff9896", "#98df8a", "#17becf", "#7f7f7f", "#bcbd22", "#98df8a", "#bcbd22", "#c5b0d5", "#2ca02c", "#8c6d31", "#aec7e8", "#6b6ecf", "#d6616b", "#e7969c", "#c7c7c7", "#d62728", "#9edae5"];

  //カラースケール
    // var colorScale = d3.scale.ordinal().domain([1,47]).range(colorList);

    //dataSetの準備
    var geodata = topojson.feature(json, json.objects.countries).features; //topojosnデータ
    //var geodata = json.features; //geojsonを使う場合はこちら

    //データセットの型変換
    geodata.forEach(function(d) {
        d.properties.jobs_ratio = parseFloat(d.properties.jobs_ratio);
        d.properties.fullness_rate = parseFloat(d.properties.fullness_rate);
    });

    //有効求人倍率の最大値取得
    var jobs_ratioMax = d3.max(geodata, function(d){
        return d.properties.jobs_ratio;
    });

    //充足率の最大値取得
    var fullness_rateMax = d3.max(geodata, function(d){
        return d.properties.fullness_rate;
    });

    //scale関数(正規化)生成
    var xScale = d3.scale.linear().domain([0, fullness_rateMax+1]).range([0, plotsize]);
    var yScale = d3.scale.linear().domain([jobs_ratioMax+0.05,  0]).range([0, plotsize]);

    //axis関数(目盛り)の生成
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');



    //地図投影法設定
    var projection = d3.geo
        .mercator()		//投影法の指定
        .scale(200)	//スケール（ズーム）の指定
        .translate([600,650]) //表示位置調整 x,y
        .center([0, 0]); //中心の座標を指定

    //geoデータ→svg path変換関数生成
    var path = d3.geo.path().projection(projection);

    //表示ステージ
    var svg = d3.select("#mapsvg");


    //mapを作成するグループ
    var mapGroup = svg.select('#map');

    //map表示
    var map = mapGroup.append("svg:g")
        .selectAll("path")
        .data(geodata)
        .enter()
        .append("svg:path")
        .attr('class', function(d){ return d.properties.name } )
        .attr({
          "d": function(d){return path(d)},
          "fill": function(d){
            var obj = c.tax_data.filter(function(e){return e.Location==d.properties.name})[0];

            if(!obj) {
              return '#e0e0e0';
            }

            if(obj.difference>0) return '#ff9999';
            else return '#4883ae';

            //return baseColor
          },
          "fill-opacity": 1,
          "stroke": "black"
        })
        .on('mouseover', function(d){
            d3.selectAll( "."+d3.select(this).attr('class') ) //マウスオーバーしたエリアと同じclass名の要素を選択
            .attr("fill", "red")
            .append("text")
            .text("function(a){ return a.properties.name }")
            ;})
            // d3.select(this).append("text").text{function(a){ return a.properties.name })}

            // .append("text")
            // .text("function(a){ return a.properties.name }")
            // .append("text")
            // .text(function(e){return e.name
            // .html("ok");

        .on('mouseout', function(){
            d3.selectAll( "."+d3.select(this).attr('class') )
            .attr("fill", baseColor); //バグあり　あとで直す
        })
        .on('click', function(country_path){
          var country_name = country_path.properties.name;
        });
    }


});
