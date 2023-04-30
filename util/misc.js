exports.sanitizeString = function(str){
    str = str.replace(/[^a-z0-9áéíóúñü\_-]/gim,"");
    return str.trim();
}

exports.getMedal = function(index){
	var medals = [
		"/images/medals/medal_gold.png",
		"/images/medals/medal_silver.png",
		"/images/medals/medal_bronze.png",
		"/images/medals/medal_pink.png",
		"/images/medals/medal_eliminated.png"
	];
	if (index > 3){
		return medals[3];
	}else{
		return medals[index];
	}
}

function goclone (source){
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof(source)=="object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}


exports.goclone = goclone;