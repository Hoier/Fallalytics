exports.getColorArray = function (amount){
	result = [];
	result[0] = [];
	result[1] = [];
	var a0 = 0.65;
	var a1 = 1;
	var inverse = true;
	var iterator1 = 0;
	var iterator2 = 0;
	for(var x = 0; x<amount; x++){
		var rBase = 0;
		var gBase = 0;
		var bBase = 0;
		if(inverse){
			inverse=false;
			if(iterator1 == 0){
				rBase = 170;
				iterator1++;
			}else if(iterator1 == 1){
				gBase = 170;
				iterator1++;
			}else{
				bBase = 170;
				iterator1 = 0;
				
			}
		}else{
			inverse=true;
			rBase = 170;
			gBase = 170;
			bBase = 170;
			if(iterator2 == 0){
				rBase = 0;
				iterator2++;
			}else if(iterator2 == 1){
				gBase = 0;
				iterator2++;
			}else{
				bBase = 0;
				iterator2 = 0;
				
			}
		}
		var r = (Math.floor(Math.random() * 86))+rBase;
		var g = (Math.floor(Math.random() * 86))+gBase;
		var b = (Math.floor(Math.random() * 86))+bBase;
		result[0][x] = `rgba(${r},${g},${b},${a0})`;
		result[1][x] = `rgba(${r},${g},${b},${a1})`;
	}
	return result;
}

exports.getColorByType = function(type, a){
	var r = 0;
	var g = 0;
	var b = 0;
	switch (type){
		case "Hunt":
			r = 48;
			g = 101;
			b = 184;
			break;
		case "Team":
			r = 245;
			g = 83;
			b = 3;
			break;
		case "Race":
			r = 5;
			g = 224;
			b = 109;
			break;
		case "Survival":
			r = 182;
			g = 27;
			b = 210;
			break;
		case "Final":
			r = 249;
			g = 197;
			b = 3;
			break;
		case "Logic":
			r = 0;
			g = 153;
			b = 153;
			break;
		case "Invisibeans":
			r = 0;
			g = 0;
			b = 0;
			break;
		default: 
			break;
	}
	result = `rgba(${r},${g},${b},${a})`;
	return result;
}