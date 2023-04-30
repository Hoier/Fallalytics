var dataContainer = {datasets:[]};
dataContainer.datasets[0] = {data:[], backgroundColor:[], borderColor:[]};
if (dataClean.labels){
	myChart.data.labels = dataClean.labels;
}
function updateChartFilter(i, key, value){
	if(document.getElementById("filter"+(i)+"option"+value).classList.contains("disabled")){
		for (var x = 0; x < dataClean.datasets[0].data.length; x++){
			if(dataClean.datasets[0].data[x][key]==value){
				dataContainer.datasets[0].data.push(dataClean.datasets[0].data[x]);
				dataContainer.datasets[0].backgroundColor.push(dataClean.datasets[0].backgroundColor[x]);
				dataContainer.datasets[0].borderColor.push(dataClean.datasets[0].borderColor[x]);
			}			
		}
		document.getElementById("filter"+(i)+"option"+value).classList.add("enabled");
		document.getElementById("filter"+(i)+"option"+value).classList.remove("disabled");
	}else{
		for (var x = 0; x < dataContainer.datasets[0].data.length; x++){
			if(dataContainer.datasets[0].data[x][key]==value){
				dataContainer.datasets[0].data.splice(x,1);
				dataContainer.datasets[0].backgroundColor.splice(x,1);
				dataContainer.datasets[0].borderColor.splice(x,1);
				x--;
			}
			
		}
		document.getElementById("filter"+(i)+"option"+value).classList.remove("enabled");
		document.getElementById("filter"+(i)+"option"+value).classList.add("disabled");
		document.getElementById("datasetButtonAll").classList.remove("enabled");
		document.getElementById("datasetButtonAll").classList.add("disabled");		
	}
	if(isCustomQuickSorted){
		dataContainer.datasets[0] = quickSort(dataContainer.datasets[0], 0, (dataContainer.datasets[0].data.length-1));
	}
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function enableAll(){
	if(document.getElementById("datasetButtonAll").classList.contains("disabled")){
		for (var x = 0; x < filters.length; x++){
			for (var y = 0; y < filters[x].options.length; y++){
				document.getElementById("filter"+(x)+"option"+filters[x].options[y]).classList.add("enabled");
				document.getElementById("filter"+(x)+"option"+filters[x].options[y]).classList.remove("disabled");
				
			}			
		}
		dataContainer = goclone(dataClean);
		if(isCustomQuickSorted){
			dataContainer.datasets[0] = quickSort(dataContainer.datasets[0], 0, (dataContainer.datasets[0].data.length-1));
		}
		document.getElementById("datasetButtonAll").classList.add("enabled");
		document.getElementById("datasetButtonAll").classList.remove("disabled");
	}else{
		for (var x = 0; x < filters.length; x++){
			for (var y = 0; y < filters[x].options.length; y++){
				document.getElementById("filter"+(x)+"option"+filters[x].options[y]).classList.remove("enabled");
				document.getElementById("filter"+(x)+"option"+filters[x].options[y]).classList.add("disabled");				
			}
		}
		dataContainer.datasets[0] = {data:[], backgroundColor:[], borderColor:[]};
		document.getElementById("datasetButtonAll").classList.remove("enabled");
		document.getElementById("datasetButtonAll").classList.add("disabled");
	}
	myChart.data.datasets = goclone(dataContainer.datasets);
	myChart.update();
}
function swap(items, leftIndex, rightIndex){
	var temp = items[leftIndex];
	items[leftIndex] = items[rightIndex];
	items[rightIndex] = temp;
}
function partition(items, left, right) {
	var pivot   = items.data[Math.floor((right + left) / 2)].y, //middle element
		i       = left, //left pointer
		j       = right; //right pointer
	while (i <= j) {
		while (items.data[i].y > pivot) {
			i++;
		}
		while (items.data[j].y < pivot) {
			j--;
		}
		if (i <= j) {
			swap(items.data, i, j); //sawpping two elements
			swap(items.backgroundColor, i, j);
			swap(items.borderColor, i, j)
			i++;
			j--;
		}
	}
	return i;
}

function quickSort(items, left, right) {
	var index;
	if (items.data.length > 1) {
		index = partition(items, left, right); //index returned from partition
		if (left < index - 1) { //more elements on the left side of the pivot
			quickSort(items, left, index - 1);
		}
		if (index < right) { //more elements on the right side of the pivot
			quickSort(items, index, right);
		}
	}
	return items;
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
enableAll();