/**
 * map: map object of leaflet, 
 * url: topojson, 
 * required: leaflet and leaflet-omnivore, 
 */
var Layers = function(map) {
	this.map = map;
};
Layers.prototype.addLayer = function(url, customLayerOptions, ready_func){
	var that = this;
	if(!customLayerOptions) customLayerOptions = {};
	if(!customLayerOptions.style) {
		customLayerOptions.style = function(f){
			return {
				weight: 1,
				//opacity: 0.5,
				color: 'white',
				fillOpacity: 0.6,
				fillColor: that.getColor(f.properties),
				lineCap: 'round',
				lineJoin: 'round',
				className: 'c04_polygon'
			};
		};
	}
	if(!customLayerOptions.onEachFeature) {
		customLayerOptions.onEachFeature = function(){
			return that.onEachFeature.apply(that, arguments)
		};
	}

	if(typeof ready_func != 'function') ready_func = function(){};
	var customLayer = L.geoJson(null, customLayerOptions);
	this.Layer = omnivore.topojson(url, null, customLayer)
		.addTo(this.map)
		.on('ready', ready_func.bind(this));

	this.showPopup();

	function getColor(f) {
		//console.dir(f);
		return 'rgb(112, 236, 20)';
	}
	function showLegend() {
		var colors = d3.scale.quantize().domain(domain_arr).range(['255, 255, 255','45, 140, 4']);
	}
};
Layers.prototype.onEachFeature = function(feature, layer) {
	var that = this;
	layer.on({
		mousemove: function(){
			return that.mousemove.apply(that, arguments)
		},
		mouseout: function(){
			return that.mouseout.apply(that, arguments)
		},
		click: function(){
			return that.zoomToFeature.apply(that, arguments)
		},
	});
};
Layers.prototype.showPopup = function(f){
	// console.dir(f);
	this.popup = new L.Popup({ autoPan: false });
};
Layers.prototype.mousemove = function(e){
	var layer = e.target;
	var props = layer.feature.properties;
	//var city_code = layer.feature.properties.id;

	var special_area;
	//var lid = c.statesLayer.getLayerId(layer);


	var html = '';
	//setBaloonHTML
	if(typeof this.setBaloonHTML == 'function') {
		html = this.setBaloonHTML(props);
		if(html === false) return;
	} else {
		var str = '',showing_data_arr = [];
		var data_labels = this.data_labels;
		for(var i=-1,l=data_labels.length,line={};++i<l;) {
			line = data_labels[i];
			showing_data_arr.push(line.label + ': ' + props[line.prop] + (line.unit?line.unit:''));
		}
		str = showing_data_arr.join('<br>');

		//str += '<br>' + $('#menu > select > option[value="'+c.data_prop+'"]').text() + '：' + here[c.data_prop];
		title = props.ADM2NAME + ' ' + props.ADM3NAME;

		html = '<div class="marker-title">' + title + '</div>' 
			//+ 'id: ' + layer.feature.properties.id + '<br>'
			+ str
			//+ (memo?'<hr class="popup_hr">'+memo+'<br>':'')
			;
	}

	this.popup.setLatLng(e.latlng);
	this.popup.setContent(html);

	if (!this.popup._map) this.popup.openOn(this.map);
	window.clearTimeout(this.closeTooltip);

	// highlight feature
	var options = {};
	if(this.mousemove_class) options.className = this.mousemove_class;
	else options = {
		weight: 3,
		opacity: 0.3,
		fillOpacity: 0.9	
	};
	layer.setStyle({
		weight: 3,
		opacity: 0.3,
		fillOpacity: 0.9	
	});

	  if (!L.Browser.ie && !L.Browser.opera) {
	    layer.bringToFront();
	}
};
Layers.prototype.mouseout = function(e){
	var that = this;
	var layer = e.target;
	that.Layer.resetStyle(layer);
	//var lid = c.statesLayer.getLayerId(layer);

	//選択中だったら
	//if(c.selected_layer_id_arr.indexOf(lid) > -1) layer.setStyle(c.selected_options);

	that.closeTooltip = window.setTimeout(function() {
		that.map.closePopup();
	}, 100);
};
Layers.prototype.zoomToFeature = function(e){
	var layer = e.target;
	this.map.fitBounds(layer.getBounds());
};
Layers.prototype.getColor = function(e){
	return 'rgb(112, 236, 20)';
};