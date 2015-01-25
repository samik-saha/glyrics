(function(){
	window.getSchemeColors = function(hue, bg){
		var color={};
		color.headerBackground='#'+hsbToHex({'h':hue, 's':100, 'x':40});
		color.border='#'+hsbToHex({'h':hue, 's':100, 'x':40});

		switch (bg){
			case "white":
				color.bodyBackground="white";
				color.scrollBarBackground="#eeeeee";
				color.scrollBarThumb="#cfcfcf";
				color.bodyText="black";
				color.link='#'+hsbToHex({'h':hue, 's':100, 'x':30});
				color.visitedLink='#'+hsbToHex({'h':hue, 's':100, 'x':30});
				break;
			case "black":
				color.bodyBackground="#121314";
				color.scrollBarBackground="#1c1c1f";
				color.scrollBarThumb="#323438";
				color.bodyText="white";
				color.link='#'+hsbToHex({'h':hue, 's':100, 'x':80});
				color.visitedLink='#'+hsbToHex({'h':hue, 's':100, 'x':80});
				break;
			default:
				color.bodyBackground='#'+hsbToHex({'h':hue, 's':20, 'x':100});
				color.scrollBarBackground='#'+hsbToHex({'h':hue, 's':5, 'x':100});
				color.scrollBarThumb='#'+hsbToHex({'h':hue, 's':30, 'x':80});
				color.bodyText="black";
				color.link='#'+hsbToHex({'h':hue, 's':100, 'x':30});
				color.visitedLink='#'+hsbToHex({'h':hue, 's':100, 'x':30});
				break;
		}
		
		console.log(color);
		return color;
	}
	
	var hsbToRgb = function (hsb) {
		var rgb = {};
		var h = hsb.h;
		var s = hsb.s*255/100;
		var v = hsb.x*255/100;
		if(s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255-s)*v/255;
			var t3 = (t1-t2)*(h%60)/60;
			if(h==360) h = 0;
			if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
			else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
			else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
			else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
			else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
			else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
			else {rgb.r=0; rgb.g=0;	rgb.b=0}
		}
		return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
	};
	
	var rgbToHex = function (rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	
	var hsbToHex = function (hsb) {
		return rgbToHex(hsbToRgb(hsb));
	};
})();
