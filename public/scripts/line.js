//var dataContainer = {datasets:[]};
//dataContainer.datasets[0] = {data:[], backgroundColor:[], borderColor:[]};
//if (dataClean.labels){
//	myChart.data.labels = dataClean.labels;
//}
myChart.data = goclone(dataClean);
top5();
function updateChartFilter(i, key, value){
	disableAll();
	for (var x = 0; x < dataContainer.datasets.length; x++){
		if(dataContainer.datasets[x][key]==value){
			dataContainer.datasets[x].hidden = false;
		}			
	}
	document.getElementById("filterNone").classList.remove("active");
	document.getElementById("filter"+(i)+"option"+value).classList.add("active");
	document.getElementById("currentFilter").innerHTML = key+"-"+value;
	
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function disableAll(){
	for(var y = 0; y < document.getElementsByClassName("dropdown-item").length; y++){
		document.getElementsByClassName("dropdown-item")[y].classList.remove("active")
	}
	document.getElementById("filterNone").classList.add("active");
	document.getElementById("currentFilter").innerHTML = "None";
	dataContainer = goclone(dataClean);	
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function top5(){
	disableAll();
	for (var x = 0; x < dataContainer.datasets.length && x < 5; x++){
			dataContainer.datasets[x].hidden = false;
	}
	document.getElementById("filterNone").classList.remove("active");
	document.getElementById("filterTop5").classList.add("active");
	document.getElementById("currentFilter").innerHTML = "Top 5";
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function bottom5(){
	disableAll();
	for (var x = dataContainer.datasets.length-1; x > dataContainer.datasets.length-6 && x > 0; x--){
			dataContainer.datasets[x].hidden = false;
	}
	document.getElementById("filterNone").classList.remove("active");
	document.getElementById("filterBottom5").classList.add("active");
	document.getElementById("currentFilter").innerHTML = "Bottom 5";
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function enableAll(){
	for(var y = 0; y < document.getElementsByClassName("dropdown-item").length; y++){
		document.getElementsByClassName("dropdown-item")[y].classList.remove("active")
	}
	dataContainer = goclone(dataClean);	
	document.getElementById("filterAll").classList.add("active");
	document.getElementById("currentFilter").innerHTML = "All";
	for (var x = 0; x < dataContainer.datasets.length; x++){
		dataContainer.datasets[x].hidden = false;
	}
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function goclone(source) {
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