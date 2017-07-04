/**************************************************************************************
 * report.js
 * ---------
 * Contains the javascript that does all the rendering on the html page.
 * 
 * © Reto Scheiwiller, 2017 - MIT License
 **************************************************************************************/

/**************************************************************************************
 * GLOBALS
 *************************************************************************************/

//declare with var and do not initialize, this will work when datafiles.js creates
//this variable or not.
var DATA_FILES;

DATA = [];

GLOBAL_COUNTER = 0;

TYPE_STATS = {
	Suite: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Class: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Test: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Step: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Wait: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Assert: { 		All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	MessageInfo: { 	All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	MessageWarn: { 	All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	MessageError: { All: [], Undefined: [], Success: [], Skipped: [], Fail: [] },
	Undefined: 	  { All: [], Undefined: [], Success: [], Skipped: [], Fail: [] }
}

BG_COLORS = [
	 "#d6e9c6",
	 "#faebcc",
	 "#ebccd1",
	 "#ddd"
];

BORDER_COLORS= [
    "#3c763d",
    "#8a6d3b",
    "#a94442",
    "#333"
]
GLOBAL_EXCEPTION_ITEMS = [];

ItemStatus = {
		Success: "Success",
		Skipped: "Skipped",
		Fail: "Fail",
		Undefined: "Undefined",
}

ItemType = {
	Suite: "Suite",
	Class: "Class",
	Test: "Test",
	Step: "Step",
	Wait: "Wait",
	Assert: "Assert",
	MessageInfo: "MessageInfo",
	MessageWarn: "MessageWarn",
	MessageError: "MessageError",
	Undefined: "Undefined"
}

StatusIcon = {
		Success: '<i class="fa fa-check-circle" style="color: green;"></i>&nbsp;',
		Skipped: '<i class="fa fa-chevron-circle-right" style="color: orange;"></i>&nbsp;',
		Fail: '<i class="fa fa-times-circle" style="color: red;"></i>&nbsp;',
		Undefined: '<i class="fa fa-question-circle" style="color: gray;"></i>&nbsp;'
}

TypeIcon = {
		Suite: '<i class="fa fa-folder-open"></i>&nbsp;',
		Class: '<i class="fa fa-copyright"></i>&nbsp;',
		Test: '<i class="fa fa-cogs"></i>&nbsp;',
		Step: '<i class="fa fa-gear"></i>&nbsp;',
		Wait: '<i class="fa fa-clock-o"></i>&nbsp;',
		Assert: '<i class="fa fa-question-circle"></i>&nbsp;',
		MessageInfo: '<i class="fa fa-info-circle" style="color: #007EFF;"></i>&nbsp;',
		MessageWarn: '<i class="fa fa-warning"  style="color: orange;"></i>&nbsp;',
		MessageError: '<i class="fa fa-times-circle"  style="color: red;"></i>&nbsp;',
		Undefined: '<i class="fa fa-question-circle" style="color: gray;"></i>&nbsp;'
	}


/**************************************************************************************
 * The first method called, it starts to load the data from the data files.
 *************************************************************************************/
loadData();

function loadData(){
	
	//if not defined set data.js as default
	if(DATA_FILES == undefined){
		DATA_FILES = ["./data.js"];
	}
	
	//dedup the files so nothing is loaded twice
	DATA_FILES = dedupArray(DATA_FILES);

	loadDataScript(0);
}

/**************************************************************************************
 * Load all javascript files containing data by chaining the method together. 
 * After one file got loaded trigger the method again with "onload" to load the next
 * file defined in the DATA_FILES array. This will prevent concurrency issues.
 * Execute initialize()-method after the last file was loaded.
 * 
 *************************************************************************************/
function loadDataScript(scriptIndex){
	
	if(scriptIndex < DATA_FILES.length){
		
		var head = document.getElementsByTagName('head')[0];
		
		var script = document.createElement('script');
		
		console.log("Load data file >> "+DATA_FILES[scriptIndex]);
		script.src = DATA_FILES[scriptIndex];
		script.type = "text/javascript";
		
		if((scriptIndex+1) == DATA_FILES.length){
			script.onload = function(){
				console.log("all data loaded");
				initialize();
			}
			script.onerror = function(){
				console.log("Could not load file >> "+DATA_FILES[scriptIndex]);
				initialize();
			}
		}else{
			script.onload = function(){
				loadDataScript(scriptIndex+1);
			}
			script.onerror = function(){
				console.log("Could not load file >> "+DATA_FILES[scriptIndex]);
				loadDataScript(scriptIndex+1);
			}
		}
		
		head.appendChild(script);
	}
		

}
/**************************************************************************************
 * After all data was loaded the initialize method is executed. This will go through
 * the whole data structure and does initial tasks like calculating statistics and
 * populating the test dropdown.
 * 
 *************************************************************************************/
function initialize(){
	

	
	for(var i = 0; i < DATA.length; i++){
		initialWalkthrough(null, DATA[i]);
	}
	
	//------------------------------------
	// Calculate Statistics per Type
	for(var type in ItemType){
		
		var all = TYPE_STATS[type].All.length;
		var success = TYPE_STATS[type][ItemStatus.Success].length;
		var skipped = TYPE_STATS[type][ItemStatus.Skipped].length;
		var fail = TYPE_STATS[type][ItemStatus.Fail].length;
		var undef = TYPE_STATS[type][ItemStatus.Undefined].length;
		
		TYPE_STATS[type].percentSuccess = ( (success / all) * 100).toFixed(1);
		TYPE_STATS[type].percentSkipped =( (skipped / all) * 100).toFixed(1);
		TYPE_STATS[type].percentFail = ( (fail / all) * 100).toFixed(1);
		TYPE_STATS[type].percentUndefined = ( (undef / all) * 100).toFixed(1);
					
	}
	
	//-----------------------------
	// Populate Test Dropdown
	testDropdown = $("#testDropdown");
	
	var length = TYPE_STATS.Test.All.length;
	for(var i = 0 ;	 i < length; i++){
		var currentTest = TYPE_STATS.Test.All[i];
		
		var listItem = $('<li>');
		//var link = $('<a href="#" onclick="drawTestView(this)">'+
		var link = $('<a href="#" onclick="draw({view: \'test\', element: this})">'+
				StatusIcon[currentTest.status]+
				currentTest.title+
				'</a>');
		link.data("test", currentTest);
		
		listItem.append(link);
		testDropdown.append(listItem);
	}
	
	draw({view: "overview"});
}

/**************************************************************************************
 * 
 *************************************************************************************/
function initialWalkthrough(parent, currentItem){
	
	//------------------------------------
	// Set item levels and parent
	if(parent == null){
		currentItem.level = 0;
		currentItem.parent = null;
	}else{
		currentItem.level = parent.level + 1;
		currentItem.parent = parent;
	}
	
	//------------------------------------
	// Check values
	
	if(currentItem.type == undefined || currentItem.type == null){
		currentItem.type = ItemType.Undefined;
	}else if(!(currentItem.type in ItemType)){
		console.log("ItemType '"+currentItem.status+"' was not found, using 'Undefined'");
		currentItem.type = ItemType.Undefined;
	}
	
	if(currentItem.status == undefined || currentItem.status == null){
		currentItem.status = ItemStatus.Undefined;
	}else if(!(currentItem.status in ItemStatus)){
		console.log("ItemStatus '"+currentItem.status+"' was not found, using 'Undefined'");
		currentItem.status = ItemStatus.Undefined;
	}
	
	if(currentItem.duration == undefined || currentItem.duration == null){
		currentItem.duration = "-";
	}
	
	if(currentItem.itemNumber == undefined || currentItem.itemNumber == null){
		currentItem.itemNumber = "";
	}
	
	
	//------------------------------------
	// Calculate Statistics per Item
	if(isObjectWithData(currentItem)){
		
		TYPE_STATS[currentItem.type].All.push(currentItem);	
		TYPE_STATS[currentItem.type][currentItem.status].push(currentItem);

		if(currentItem.exceptionMessage != null
		|| currentItem.exceptionStacktrace != null){
			GLOBAL_EXCEPTION_ITEMS.push(currentItem);
		}
		
		currentItem.statusCount = { All: 1, Undefined: 0, Success: 0, Skipped: 0, Fail: 0 };
		currentItem.statusCount[currentItem.status]++;
		
		var children = currentItem.children;
		if(isArrayWithData(children)){
			var childrenCount = currentItem.children.length;
			for(var i = 0; i < childrenCount; i++){
				
				var currentChild = children[i];
				initialWalkthrough(currentItem, currentChild);
				
				currentItem.statusCount.All += currentChild.statusCount.All;
				currentItem.statusCount.Undefined +=currentChild.statusCount.Undefined;
				currentItem.statusCount.Success += currentChild.statusCount.Success;
				currentItem.statusCount.Skipped += currentChild.statusCount.Skipped;
				currentItem.statusCount.Fail += currentChild.statusCount.Fail;
			
			}
		}
		
		currentItem.percentSuccess = ( (currentItem.statusCount.Success / currentItem.statusCount.All) * 100).toFixed(1);
		currentItem.percentSkipped =( (currentItem.statusCount.Skipped / currentItem.statusCount.All) * 100).toFixed(1);
		currentItem.percentFail = ( (currentItem.statusCount.Fail / currentItem.statusCount.All) * 100).toFixed(1);
		currentItem.percentUndefined = ( (currentItem.statusCount.Undefined / currentItem.statusCount.All) * 100).toFixed(1);
			
		//console.log(currentItem.statusCount);
	}
	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function dedupArray(arrayToDedup){
	
	var dedupped = [];
	
	for(var key in arrayToDedup){
		
		if(dedupped.indexOf(arrayToDedup[key]) == -1){
			dedupped.push(arrayToDedup[key]);
		}
	}
	
	return dedupped;
}
/**************************************************************************************
 * 
 *************************************************************************************/
function isArrayWithData(verifyThis){
	if(verifyThis != null
	&& Object.prototype.toString.call(verifyThis) === '[object Array]'
	&& verifyThis.length > 0){
		return true;
	}else{
		return false;
	}
			
}

/**************************************************************************************
 * 
 *************************************************************************************/
function isObjectWithData(verifyThis){

	if(verifyThis != null
	&& Object.prototype.toString.call(verifyThis) === '[object Object]'
	&& Object.keys(verifyThis).length > 0){
		return true;
	}else{
		return false;
	}
			
}



/**************************************************************************************
 * 
 *************************************************************************************/
function cleanup(){
	
	$("#content").html("");
}

/**************************************************************************************
 * 
 *************************************************************************************/
function getItemStyle(item){
	
	var style = {
		colorClass: getStatusStyle(item.status),
		collapsedClass: "panel-collapse collapse",
		expanded: false,
		icon: TypeIcon[item.type]
	}
	
	style.colorClass = getStatusStyle(item.status); 

	
	switch(item.type){
	case "Suite": 	style.collapsedClass = "panel-collapse collapse in"; 
					style.expanded = true; 
					break;
			
	case "Class": 	style.collapsedClass = "panel-collapse collapse in"; 
					style.expanded = true; 
					break;
	}
	
	return style;
					
	
}

/**************************************************************************************
 * Select Element Content
 *************************************************************************************/
function selectElementContent(el) {
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

/**************************************************************************************
 * 
 *************************************************************************************/
function getStatusStyle(status){
	
	switch(status){
		case "Fail": 		return "danger"; 
							break;
				
		case "Skipped": 	return "warning"; 
							break;
						
		case "Success": 	return "success"; 
							break;
						
		case "Undefined": 	return "default"; 
							break;
	
	}
}


/**************************************************************************************
 * 
 *************************************************************************************/
function getFullItemTitle(item){
	
	if(item.type == "Suite" 
	|| item.type == "Class"){
		return item.title;
	}else{
		
		var fixSizeNumber = "";
		for (var i = 0; i < 4 - (item.itemNumber+"").length; i++ ){
			fixSizeNumber = fixSizeNumber + "0";
		}
		fixSizeNumber = fixSizeNumber + item.itemNumber;
		
		return fixSizeNumber +"&nbsp;"+ item.title;
	}
}



/**************************************************************************************
 * 
 *************************************************************************************/
function createItemPanel(item){
	
	GLOBAL_COUNTER++;
	
	var style = getItemStyle(item); 
	
	var panel = $(document.createElement("div"));
	panel.addClass("panel panel-"+style.colorClass);
	
	//----------------------------
	// Create Header
	var panelHeader = $(document.createElement("div"));
	panelHeader.addClass("panel-heading");
	panelHeader.attr("id", "panelHead"+GLOBAL_COUNTER);
	panelHeader.attr("role", "tab");
	panelHeader.append(
		'<span class="panel-title">'+
		style.icon+
		'<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+GLOBAL_COUNTER+'" aria-expanded="'+style.expanded+'" aria-controls="collapse'+GLOBAL_COUNTER+'">'+
		getFullItemTitle(item) + 
		'</a></span>'
	); 
	panelHeader.append(
			'<span style="float: right;">' + item.duration+"&nbsp;ms"+'</span>'
		); 
	
	panel.append(panelHeader);
	
	//----------------------------
	// Create Collapse Container
	var collapseContainer = $(document.createElement("div"));
	collapseContainer.addClass(style.collapsedClass);
	collapseContainer.attr("id", "collapse"+GLOBAL_COUNTER);
	collapseContainer.attr("role", "tabpanel");
	collapseContainer.attr("aria-labelledby", "panelHead"+GLOBAL_COUNTER);
	
	panel.append(collapseContainer);
	
	//----------------------------
	// Create Body
	var panelBody = $(document.createElement("div"));
	panelBody.addClass("panel-body");
	collapseContainer.append(panelBody);
	
	printItemDetails(panelBody, item);
	
	return {
		panel: panel,
		panelHeader: panelHeader,
		panelBody: panelBody
	};
}

/**************************************************************************************
 * getItemDetailsLink
 *************************************************************************************/
function getItemDetailsLink(item, showIndent){
	
	pixelIndent = "";
	if(showIndent){
		pixelIndent = 'style="margin-left: '+15*item.level+'px;"';
	}
	
	var link = $('<a role="button" '+pixelIndent+' href="javascript:void(0)" onclick="showDetailsModal(this)">'+getFullItemTitle(item)+'</a>');

	link.data("item", item);
	
	return link;
}

/**************************************************************************************
 * filterTable
 *************************************************************************************/
function filterTable(searchField){
	
	var table = $(searchField).data("table");
	var input = searchField;
	
	filter = input.value.toUpperCase();
	
	table.find("tbody tr").each(function( index ) {
		  console.log( index + ": " + $(this).text() );
		  
		  if ($(this).html().toUpperCase().indexOf(filter) > -1) {
			  $(this).css("display", "");
		  } else {
			  $(this).css("display", "none");
			}
	});

}

/*******************************************************************************
 * Show Loading Animation
 ******************************************************************************/
function showLoader(isVisible){
	
	if(isVisible){
		$("#loading").css("visibility", "visible");
	}else{
		$("#loading").css("visibility", "hidden");
	}
}
/*******************************************************************************
 * ShowDetailsModal
 ******************************************************************************/
function showDetailsModal(element){
	var item = $(element).data("item");
	
	//------------------------------
	// Clear Modal
	modalBody = $('#detailsModalBody');
	modalBody.html("");
	
	
	//------------------------------
	// Parent Link
	if(item.parent != null){
		var link = getItemDetailsLink(item.parent);
		link.html("Show Parent");
		link.addClass("btn btn-default");
		link.css("float", "right");
		modalBody.append(link);
		modalBody.append("<br />");
	}
	
	//------------------------------
	// Item Details
	modalBody.append('<h3>Details</h3>')
	printItemDetails(modalBody, item);
	
	//------------------------------
	// Root Path
	modalBody.append('<h3>Hierarchy</h3>')
	printRootPath(modalBody, item, null);
	
	//------------------------------
	// Children 
	var children = item.children;
	if(isArrayWithData(children)){
		modalBody.append('<h3>Children Tree</h3>')
		var childrenCount = children.length;
		for(var i = 0; i < childrenCount; i++){
			printPanelTree(children[i], modalBody);
		}
	}
	
	$('#detailsModal').modal('show');
	
	
}



/**************************************************************************************
 * 
 *************************************************************************************/
function appendItemChart(parent, item){

	var chartWrapper = $('<div class="chartWrapper">');
	parent.append(chartWrapper);
	chartWrapper.css('max-width', '500px');
	chartWrapper.css('height', '200px');
	
	var chart = createStatusChart(chartWrapper,
					"doughnut",
					item.statusCount.Success, 
		            item.statusCount.Skipped, 
		            item.statusCount.Fail,
		            item.statusCount.Undefined );

}

/**************************************************************************************
 * 
 *************************************************************************************/
function createStatusChart(parent, type, success, skipped, fail, undef){
	
	var chartCanvas = $('<canvas id="itemChart" width="100%"></canvas>');
	var chartCtx = chartCanvas.get(0).getContext("2d");
	parent.append(chartCanvas);

	
	//------------------------------------
	// Populate Data

		var data = {
			    labels: [
			        "Success",
			        "Skipped",
			        "Fail",
			        "Undefined"
			    ],
			    datasets: [
			        {
			            data: [
		                   success, 
		                   skipped, 
		                   fail,
		                   undef ],
			                   
			            backgroundColor: BG_COLORS,
			            borderColor: BORDER_COLORS
			        }]
			};
		
	
	//------------------------------------
	// Draw Chart
	new Chart(chartCtx, {
	    type: type,
	    data: data,
	    options: {
	    	responsive: true,
	    	maintainAspectRatio: false
	    }
		});
	
	return chartCanvas;
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printItemDetails(parent,item){
	if(item.screenshotPath != null){ 	parent.append('&nbsp;&nbsp;<a target="_blank" href="'+item.screenshotPath+'"><i class="fa fa-image"></i>&nbsp;Screenshot</a>');}
	if(item.sourcePath != null){		parent.append('&nbsp;&nbsp;<a target="_blank" href="'+item.sourcePath+'"><i class="fa fa-code"></i>&nbsp;HTML</a>');}
	
	if(item.title != null){ 			parent.append('<p><strong>Title:&nbsp;</strong>'+item.title+'</p>');}
	if(item.status != null){ 			parent.append('<p><strong>Type:&nbsp;</strong>'+item.type+'</p>');}
	if(item.type != null){ 				parent.append('<p><strong>Status:&nbsp;</strong>'+item.status+'</p>');}
	if(item.description != null){ 		parent.append('<p><strong>Description:&nbsp;</strong>'+item.description+'</p>');}
	if(item.timestamp != null){ 		parent.append('<p><strong>Timestamp:&nbsp;</strong>'+item.timestamp+'</p>');}
	if(item.duration != null){ 			parent.append('<p><strong>Duration:&nbsp;</strong>'+item.duration+' ms</p>');}
	if(item.url != null){ 				parent.append('<p><strong>URL:&nbsp;</strong><a target="_blank" href="'+item.url+'">'+item.url+'</a></p>');}
	if(item.exceptionMessage != null){ 	parent.append('<p><strong>Exception Message:&nbsp;</strong>'+item.exceptionMessage+'</p>');}
	if(item.exceptionStacktrace != null){parent.append('<p><strong>Exception Stacktrace:&nbsp;</strong><br>'+item.exceptionStacktrace+'</p>');}
	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printRootPath(parentElement, item, subElement){
	
	var div = $('<div style="margin-left: 20px;">');
	div.append(getItemDetailsLink(item, false));
	
	if(subElement != null){
		div.append(subElement);
	}
	if(item.parent != null){
		printRootPath(parentElement, item.parent, div);
	}else{
		parentElement.append(div);
	}
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printStatusChart(){
	
	$("#content").append("<h3>Chart: Status by Type</h3>");
	
	var chartCanvas = $('<canvas id="overviewChart">');
	chartCanvas.css('width', '100% !important');
	chartCanvas.css('height', 'auto');
	var chartCtx = chartCanvas.get(0).getContext("2d");
	//chartCtx.canvas.height = "500px";
	
	var chartWrapper = $('<div>');
	$("#content").append(chartWrapper);
	chartWrapper.css('max-width', '800px');
	//chartWrapper.css('max-height', '30%');
	chartWrapper.append(chartCanvas);
	
	
	            
	var data = { labels: [], datasets: [] };
	
	//------------------------------------
	// Populate Labels
	for(type in ItemType){
		data.labels.push(type);
	}
	
	//------------------------------------
	// Populate Data
	for(status in ItemStatus){
			
		if(status == ItemStatus.Success){ bgColor = BG_COLORS[0]; borderColor = BORDER_COLORS[0]; };
		if(status == ItemStatus.Skipped){ bgColor = BG_COLORS[1]; borderColor = BORDER_COLORS[1]; };
		if(status == ItemStatus.Fail){ bgColor = BG_COLORS[2]; borderColor = BORDER_COLORS[2]; };
		if(status == ItemStatus.Undefined){ bgColor = BG_COLORS[3]; borderColor = BORDER_COLORS[3]; };
		
		var dataset = {
				label: status,
				backgroundColor: bgColor,
				borderColor: borderColor,
				data: []
			}; 
		
		for(type in TYPE_STATS){
			var count = TYPE_STATS[type][status].length;
			dataset.data.push(count);	
		}
		
		data.datasets.push(dataset);
		
	}
	
	
	//------------------------------------
	// Draw Chart
	var myChart = new Chart(chartCtx, {
	    type: 'bar',
	    responsive: true,
	    maintainAspectRatio: true,
	    options: {
	        scales:{
	            xAxes: [{
	                stacked: true
	            }],
	            yAxes: [{
	            stacked: true
	            }]
	        }
	    },
	    data: data
		});
	myChart.update();
}

/**************************************************************************************
 * Print Panel Tree
 *************************************************************************************/
function printPanelTree(currentItem, parentDOM){

	if(isObjectWithData(currentItem)){
		
		var panelObject = createItemPanel(currentItem);
		
		if(parentDOM != null){
			parentDOM.append(panelObject.panel);
		}else{
			$("#content").append(panelObject.panel);
		}
		
		var children = currentItem.children;
		if(isArrayWithData(children)){
			var childrenCount = currentItem.children.length;
			for(var i = 0; i < childrenCount; i++){
				printPanelTree(children[i], panelObject.panelBody);
			}
		}
	}
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printCSVRows(parent, currentItem){
	
	var row = 	currentItem.title+';'+
				currentItem.type+';'+
				currentItem.status+';'+
				currentItem.duration+';'+
				
				currentItem.statusCount.All+';'+
				currentItem.statusCount.Success+';'+
				currentItem.statusCount.Skipped+';'+
				currentItem.statusCount.Fail+';'+
				currentItem.statusCount.Undefined+';'+

				currentItem.percentSuccess+';'+
				currentItem.percentSkipped+';'+
				currentItem.percentFail+';'+
				currentItem.percentUndefined+';'+
				
				currentItem.url+
				'</br>';
	
	parent.append(row);
	
	if(isArrayWithData(currentItem.children)){
		var childrenCount = currentItem.children.length;
		for(var i = 0; i < childrenCount; i++){
			printCSVRows(parent, currentItem.children[i]);
		}
	}	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printCountStatistics(parent){
	
	var table = $('<table class="table table-striped">');
	var header = $('<thead>');
	var headerRow = $('<tr>');
	header.append(headerRow);
	table.append(header);
	parent.append(table);

	headerRow.append('<th>Type</td>');
	for(var status in ItemStatus ){
		headerRow.append('<th>'+status+'</td>');
	}
	for(var type in ItemType ){
		
		var row = $('<tr>');
		row.append('<td>'+type+'</td>');
		for(var status in ItemStatus ){
			row.append('<td>'+TYPE_STATS[type][status].length+'</td>'); 
		}
		
		table.append(row);
	}
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printPercentageStatistics(parent){
	
	var table = $('<table class="table table-striped">');
	var header = $('<thead>');
	var headerRow = $('<tr>');
	header.append(headerRow);
	table.append(header);
	parent.append(table);

	headerRow.append('<th>Type</td>');
	headerRow.append('<th>Success%</td>');
	headerRow.append('<th>Skipped%</td>');
	headerRow.append('<th>Fail%</td>');
	headerRow.append('<th>Undefined%</td>');
	for(var type in ItemType ){
		
		var row = $('<tr>');
		
		TYPE_STATS[type].percentSuccess
		TYPE_STATS[type].percentSkipped 
		TYPE_STATS[type].percentFail
		TYPE_STATS[type].percentUndefined
					
		row.append('<td>'+type+'</td>');
		row.append('<td>'+TYPE_STATS[type].percentSuccess+'</td>'); 
		row.append('<td>'+TYPE_STATS[type].percentSkipped+'</td>'); 
		row.append('<td>'+TYPE_STATS[type].percentFail+'</td>'); 
		row.append('<td>'+TYPE_STATS[type].percentUndefined+'</td>'); 
				
		table.append(row);
	}
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printTable(parent, data, withFilter, isResponsive){
	
	
	var table = $('<table class="table table-striped">');
	var header = $('<thead>');
	var headerRow = $('<tr>');
	header.append(headerRow);
	table.append(header);
	
	if(withFilter){
		var filter = $('<input type="text" class="form-control" onkeyup="filterTable(this)" placeholder="Filter Table...">');
		parent.append(filter);
		parent.append('<span style="font-size: xx-small;"><strong>Hint:</strong> The filter searches through the innerHTML of the table rows. Use &quot;&gt;&quot; and &quot;&lt;&quot; to search for the beginning and end of a cell content(e.g. &quot;&gt;Test&lt;&quot; )</span>');
		filter.data("table", table);
	}
	
	parent.append(table);

	for(var key in data.headers){
		headerRow.append('<th>'+data.headers[key]+'</th>');
	}
	
	for(var rowKey in data.rows ){
		
		var row = $('<tr>');
		
		for(var cellKey in data.rows[rowKey]){
			row.append('<td>'+data.rows[rowKey][cellKey]+'</td>');
		}
		table.append(row);
	}
}

/**************************************************************************************
 * Print Screenshots for Test
 *************************************************************************************/
function printScreenshotsForTest(element){
	var test = $(element).data("test");
	
	var container = $('#screenshotContainer');
	container.html("");
	printScreenshotsList(container,test);
	//printScreenshotsGallery(container,test,null,null,null);
}

/**************************************************************************************
 * Print Screenshots List
 *************************************************************************************/
function printScreenshotsList(targetElement, currentItem){
	
	if(currentItem.screenshotPath != null){
		targetElement.append("<h4>"+getFullItemTitle(currentItem)+"</h4>");
		targetElement.append('&nbsp;&nbsp;<a target="_blank" href="'+currentItem.screenshotPath+'"><i class="fa fa-image"></i>&nbsp;Open Screenshot</a>');
	
		if(currentItem.sourcePath != null){
			targetElement.append('&nbsp;&nbsp;<a target="_blank" href="'+currentItem.sourcePath+'"><i class="fa fa-code"></i>&nbsp;HTML</a>');
		}
		
		targetElement.append('<a target="_blank" href="'+currentItem.screenshotPath+'"><img class="screenshot" src='+currentItem.screenshotPath+'></a>');
	}
	
	if(isArrayWithData(currentItem.children)){
		var childrenCount = currentItem.children.length;
		for(var i = 0; i < childrenCount; i++){
			printScreenshotsList(targetElement, currentItem.children[i]);
		}
	}
		
}

/**************************************************************************************
 * Print Screenshots Gallery
 *************************************************************************************/
function printScreenshotsGallery(targetElement, currentItem, galleryDiv, indicatorList, slidesDiv ){
	
	if(galleryDiv == null){
		
		galleryDiv = $('<div id="gallery" class="report-carousel carousel slide" data-ride="carousel">');
		indicatorList = $('<ol class="carousel-indicators">');
		slidesDiv = $('<div class="carousel-inner" role="listbox">');
		
		galleryDiv.append(indicatorList);
		galleryDiv.append(slidesDiv);
		galleryDiv.append(
		  '<!-- Controls -->'+
		  '<a class="left carousel-control" href="#gallery" role="button" data-slide="prev">'+
		    '<span class="fa fa-chevron-left fa-2x" aria-hidden="true"></span>'+
		    '<span class="sr-only">Previous</span>'+
		  '</a>'+
		  '<a class="right carousel-control" href="#gallery" role="button" data-slide="next">'+
		    '<span class="fa fa-chevron-right fa-2x"></span>'+
		    '<span class="sr-only">Next</span>'+
		  '</a>');
		
		galleryDiv.data("slideCount", 0);
		
		targetElement.append(galleryDiv);
	}
	
	if(currentItem.screenshotPath != null){

		//------------------------------------------
		// Handle slide count
		var slideCount = galleryDiv.data("slideCount")+1;
		galleryDiv.data("slideCount", slideCount);
		
		var active = "";
		if(slideCount == 1) { active = "active"};
		
		//------------------------------------------
		// Create Indicator
		var indicator = $('<li data-target="#gallery" data-slide-to="'+(slideCount-1)+'" class="'+active+'">');
		indicatorList.append(indicator);
		
		//------------------------------------------
		// Create Slide
		var slide = $('<div class=" item '+active+'">');
		
		var image = $('<img class="carousel-image" src='+currentItem.screenshotPath+'></a>');
		slide.append(image);
		slidesDiv.append(slide);
		
	}
	
	if(isArrayWithData(currentItem.children)){
		var childrenCount = currentItem.children.length;
		for(var i = 0; i < childrenCount; i++){
			printScreenshotsGallery(targetElement, currentItem.children[i], galleryDiv, indicatorList, slidesDiv);
		}
	}		
}

/**************************************************************************************
 * Draws charts for the given type.
 * 
 * @param the args param has to contain a field "type".
 * 
 *************************************************************************************/
function drawTypeCharts(args){
	
	var itemsArray = TYPE_STATS[args.type]["All"];
	
	var content = $('#content');
	
	content.append("<h3>Charts for type '"+args.type+"'</h3>");
	content.append("<p>The charts show the status of the item and all its sub items. </p>");
	
	var chartContainer = $('<div class="flexWrapContainer">');
	
	content.append(chartContainer);
	
	for( var key in itemsArray){
		
		var currentItem = itemsArray[key];
		var chartDiv = $('<div class="flexChart">');
		
		var title = $("<h4>");
		title.append(StatusIcon[currentItem.status]);
		title.append(getItemDetailsLink(currentItem, false));
		chartDiv.append(title);
		chartContainer.append(chartDiv);
		
		createStatusChart(chartDiv, 
						"doughnut",
						currentItem.statusCount.Success,
						currentItem.statusCount.Skipped,
						currentItem.statusCount.Fail,
						currentItem.statusCount.Undefined);
		
		
	}
}


/**************************************************************************************
 * 
 *************************************************************************************/
function drawOverviewPage(){
	
	var content = $("#content")
	content.append("<h2>Overview</h2>");
	
	var row = $('<div class="row">');
	content.append(row);
	
	printItemOverview(row, ItemType.Suite, 6);
	printItemOverview(row, ItemType.Test, 6);
}

/**************************************************************************************
 * Draw Status Overview
 *************************************************************************************/
function drawStatusOverviewPage(){
	
	var content = $("#content");
	content.append('<h2>Status Overview</h2>');
	
	for(var type in ItemType ){
		
		content.append('<h3 class="underlined">'+type+"</h3>");
		
		var row = $('<div class="row">');
		content.append(row);
		  

		for( var status in ItemStatus ){
			
			var column = $('<div class="col-md-3" style="padding: 2px;">');
			row.append(column);
			
			var panel = $('<div class="panel panel-'+getStatusStyle(status)+'">');
			panel.css("margin", "2px");
			column.append(panel);
			
			var panelHeader = $('<div class="panel-heading">');
			panel.append(panelHeader);
			
			var panelBody = $('<div class="panel-body status-panel">');
			panel.append(panelBody);
			
			panelHeader.append()
			panelHeader.append(status+' ('+TYPE_STATS[type][status].length+')');
			
			for(var i = 0; i < TYPE_STATS[type][status].length; i++){
				var item = TYPE_STATS[type][status][i];
				
				//use paragraph to display each item on its own line
				var paragraph = $("<p>");
				paragraph.append(getItemDetailsLink(item, false));
				panelBody.append(paragraph);
			}
			
		}
		
	}
	
}

/**************************************************************************************
 * drawTestView
 * 
 * @param args should contain an field "element" containing the dom element which has
 * the test item attached 
 *************************************************************************************/
function drawTestView(args){
	var testItem = $(args.element).data("test");
	
	cleanup();
	content = $("#content");
	
	content.append('<h2>Test Details - '+testItem.title+'</h2>');
	
	appendItemChart(content, testItem);
	
	printItemDetails(content, testItem);
	
	drawTable(testItem, false);
	
	var children = testItem.children;
	if(isArrayWithData(children)){
		content.append('<h2>Children Tree</h2>')
		var childrenCount = children.length;
		for(var i = 0; i < childrenCount; i++){
			printPanelTree(children[i], content);
		}
	}	
	
}

/**************************************************************************************
 * Prints an overview for a certain ItemType as a bootstrap column.
 * 
 *************************************************************************************/
function printItemOverview(parentRow, itemType, columnWidth){
	
	var successCount = TYPE_STATS[itemType][ItemStatus.Success].length; 
	var skippedCount = TYPE_STATS[itemType][ItemStatus.Skipped].length; 
	var failedCount = TYPE_STATS[itemType][ItemStatus.Fail].length;
	var undefCount = TYPE_STATS[itemType][ItemStatus.Undefined].length;
	var totalCount = TYPE_STATS[itemType]["All"].length;
	
	var column = $('<div class="col-md-'+columnWidth+'">');
	parentRow.append(column);
		
	column.append('<h3>'+itemType+' Pie Chart</h3>');
	
	var chartWrapper = $('<div class="chartWrapper">');
	column.append(chartWrapper);
	chartWrapper.css('width', '100%');
	chartWrapper.css('height', '300px');
	
	var chart = createStatusChart(chartWrapper,
		"doughnut",
		successCount,
		skippedCount,
		failedCount,
		undefCount);
	
	column.append('<h3>'+itemType+' Statistics</h3>');
	
	var tableData = {
		headers: ["Status", "Count", "Percentage"],
		rows: [
		   [ItemStatus.Success, successCount, TYPE_STATS[itemType].percentSuccess],
		   [ItemStatus.Skipped, skippedCount, TYPE_STATS[itemType].percentSkipped],
		   [ItemStatus.Fail, failedCount, TYPE_STATS[itemType].percentFail],
		   [ItemStatus.Undefined, undefCount, TYPE_STATS[itemType].percentUndefined],
		   ["Total", totalCount, "100.0"]
		]
	};
	
	printTable(column, tableData, false, false );	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function drawPanelTree(){
	
	$("#content").append("<h3>Panel Tree</h3>");
	
	for(var i = 0; i < DATA.length; i++){
		printPanelTree(DATA[i], null);
	}
}


/**************************************************************************************
 * 
 *************************************************************************************/
function drawStatistics(){
	
	var content = $("#content");
	content.append("<h2>Statistics</h2>");

	content.append("<h3>Count by Item Type</h3>");
	printCountStatistics(content);
	
	content.append("<h3>Percentage by Item Type</h3>");
	printPercentageStatistics(content);
}

/**************************************************************************************
 * 
 *************************************************************************************/
function drawCSV(){
	
	$("#content").append("<h2>CSV</h2>");
	
	var pre = $('<pre>');
	$("#content").append(pre);
	
	var code = $('<code>');
	code.attr("onclick", "selectElementContent(this)");
	pre.append(code);
	
	var headerRow = "Title;Type;Status;Duration(ms);#Total;#Success;#Skipped;#Fail;#Undefined;Success(%);Skipped(%);Fail(%);Undefined(%);URL</br>";
	code.append(headerRow);
	
	for(var i = 0; i < DATA.length; i++){
		printCSVRows(code, DATA[i]);
	}
	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function drawJSON(){
	
	$("#content").append("<h2>JSON</h2>");
	
	var pre = $('<pre>');
	$("#content").append(pre);
	
	var code = $('<code>');
	code.attr("onclick", "selectElementContent(this)");
	pre.append(code);
	
	code.text(JSON.stringify(DATA, 
		function(key, value) {
	    if (key == 'parent') {
            // Ignore parent field to prevent circular reference error
            return;
	    }
	    return value;
	},2));
	
}


/**************************************************************************************
 * 
 * @param boolean printDetails print more details 
 *************************************************************************************/
function drawTable(item, printDetails){
	
	$("#content").append("<h2>Table</h2>");
	
	var filter = $('<input type="text" class="form-control" onkeyup="filterTable(this)" placeholder="Filter Table...">');
	$("#content").append(filter);
	$("#content").append('<span style="font-size: xx-small;"><strong>Hint:</strong> The filter searches through the innerHTML of the table rows. Use &quot;&gt;&quot; and &quot;&lt;&quot; to search for the beginning and end of a cell content(e.g. &quot;&gt;Test&lt;&quot; )</span>');
	
	
	var table = $('<table class="table table-striped">');
	$("#content").append(table);
	filter.data("table", table);
	
	var header = $('<thead>');
	table.append(header);
	
	var headerRow = $('<tr>');
	header.append(headerRow);
	headerRow.append('<th>&nbsp;</th>');
	headerRow.append('<th>Report Item</th>');
	headerRow.append('<th>Type</th>');
	headerRow.append('<th>Status</th>');
	headerRow.append('<th>Duration(ms)</th>');
	
	if(printDetails){
		headerRow.append('<th>#Total</th>');
		headerRow.append('<th>#Success</th>');
		headerRow.append('<th>#Skipped</th>');
		headerRow.append('<th>#Fail</th>');
		headerRow.append('<th>#Undefined</th>');
		headerRow.append('<th>Success(%)</th>');
		headerRow.append('<th>Skipped(%)</th>');
		headerRow.append('<th>Fail(%)</th>');
		headerRow.append('<th>Undefined(%)</th>');
	}
	
	headerRow.append('<th><i class="fa fa-image"></i></th>');
	headerRow.append('<th><i class="fa fa-code"></i></th>');
	headerRow.append('<th><i class="fa fa-link"></i></th>');
	
	if(isArrayWithData(item)){
		for(var i = 0; i < item.length; i++){
			printTableRows(table, item[i], printDetails);
		}
	}else{
		printTableRows(table, item, printDetails);
	}
	
}

/**************************************************************************************
 * 
 *************************************************************************************/
function printTableRows(table, currentItem, printDetails){
	
	var row = $('<tr>');
	var itemCell = $('<td>');
	itemCell.append(getItemDetailsLink(currentItem, true));
	
	table.append(row);
	var rowString;
	row.append('<td>'+TypeIcon[currentItem.type]+'</td>');
	row.append(itemCell);
	row.append('<td>'+currentItem.type+'</td>');
	row.append('<td class="'+getStatusStyle(currentItem.status)+'">'+currentItem.status+'</td>');
	row.append('<td>'+currentItem.duration+'</td>');
	
	if(printDetails){
		row.append(
		'<td>'+currentItem.statusCount.All+'</td>'+
		'<td>'+currentItem.statusCount.Success+'</td>'+
		'<td>'+currentItem.statusCount.Skipped+'</td>'+
		'<td>'+currentItem.statusCount.Fail+'</td>'+
		'<td>'+currentItem.statusCount.Undefined+'</td>'+
		'<td>'+currentItem.percentSuccess+'</td>'+
		'<td>'+currentItem.percentSkipped+'</td>'+
		'<td>'+currentItem.percentFail+'</td>'+
		'<td>'+currentItem.percentUndefined+'</td>');
	}
	
	if(currentItem.screenshotPath != null){
		row.append('<td><a target="_blank" href="'+currentItem.screenshotPath+'"><i class="fa fa-image"></i></a></td>');
	}else{
		row.append('<td>&nbsp;</td>');
	}
	
	if(currentItem.sourcePath != null){
		row.append('<td><a target="_blank" href="'+currentItem.sourcePath+'"><i class="fa fa-code"></i></a></td>');
	}else{
		row.append('<td>&nbsp;</td>');
	}
	
	row.append('<td><a target="_blank" href="'+currentItem.url+'"><i class="fa fa-link"></i></a></td>');
	
	
	if(isArrayWithData(currentItem.children)){
		var childrenCount = currentItem.children.length;
		for(var i = 0; i < childrenCount; i++){
			printTableRows(table, currentItem.children[i], printDetails);
		}
	}
	
	
}


/**************************************************************************************
 * Draw Exceptions
 *************************************************************************************/
function drawExceptionsPage(){
	
	$("#content").append("<h2>Exceptions</h2>");
	
	var tableDiv = $('<div class="table-responsive">');
	$("#content").append(tableDiv);
	
	var table = $('<table class="table table-striped">');
	tableDiv.append(table);
	
	var header = $('<thead>');
	table.append(header);
	
	var headerRow = $('<tr>');
	header.append(headerRow);
	headerRow.append('<th>Report Item</th>');
	headerRow.append('<th>Exception Message</th>');
	headerRow.append('<th>Stacktrace</th>');
	

	for(key in GLOBAL_EXCEPTION_ITEMS){
		var item = GLOBAL_EXCEPTION_ITEMS[key];
		
		var row = $('<tr>');
		var itemCell = $('<td>');
		itemCell.append(getItemDetailsLink(item, false));
		
		row.append(itemCell);
		row.append('<td>'+item.exceptionMessage+'</td>');
		row.append('<td>'+item.exceptionStacktrace+'</td>');
		
		table.append(row);
	}
	
	$("#content").append(table);
	
}




/**************************************************************************************
 * Draw Screenshots
 *************************************************************************************/
function drawScreenshots(){
	
	var content = $("#content");
	content.append("<h2>Screenshot Browser</h2>");
	content.append('<p>Choose a test to show the screenshots:<p>');
	var testDropdown = $('<div class="dropdown">');
	testDropdown.html('<button class="btn btn-default" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
    'Choose <span class="caret"></span>  </button>');
	
	var dropdownValues = $('<ul class="dropdown-menu" aria-labelledby="dLabel">');

	for(var i = 0; i < TYPE_STATS.Test.All.length; i++){
		var currentTest = TYPE_STATS.Test.All[i];
		
		var listItem = $('<li>');
		var link = $('<a href="#" onclick="printScreenshotsForTest(this)">'+
				StatusIcon[currentTest.status]+
				currentTest.title+
				'</a>');
		link.data("test", currentTest);
		
		listItem.append(link);
		dropdownValues.append(listItem);
		
	}
	
	testDropdown.append(dropdownValues);
	content.append(testDropdown);
	
	content.append('<div id="screenshotContainer">');
	

	
}

/**************************************************************************************
 * Main Entry method
 *************************************************************************************/
function draw(args){
	
	cleanup();
	
	showLoader(true);
	
	window.setTimeout( 
	function(){
		switch(args.view){
			case "overview": 			drawOverviewPage(); break;
			case "tree": 				drawPanelTree(); break;
			case "status": 				drawStatusOverviewPage(); break;
			
			case "typebarchart": 		printStatusChart(); break;
			case "typeCharts": 			drawTypeCharts(args); break;
			
			case "statsStatusByType": 	drawStatistics(); break;
	
			case "test":		 		drawTestView(args); break;
			case "tableSimple": 		drawTable(DATA, false); break;
			case "tableDetailed": 		drawTable(DATA, true); break;
			case "csv": 				drawCSV(); break;
			case "json": 				drawJSON(); break;
			case "exceptions": 			drawExceptionsPage(); break;
			case "screenshots": 		drawScreenshots(); break;
		}
		
		showLoader(false);
	}, 100);

}

