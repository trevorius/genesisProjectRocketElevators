
	//save values into variables of the same name (for navigation simplicity)

	//row1 variables
	var type = $('#type').val();
	var appartements = $("#appartements").val();
	var buisness = $("#buisness").val();
	var companies = $("#companies").val();
	var floors = $('#floors').val();
	
	//row2 variables
	var basements = $('#basements').val();
	var parking = $('#parking').val();
	var occupants = $("#occupants").val();
	var cages = $("#cages").val();
	var activity = $("#activity").val();
	//row3 variables
	var columns = $('#columns').val();
	var shafts = $('#shafts').val();
	var elevators;
	//row4 variables
	var selectedLine ;
	var feePercent;
	var pricePerShaft;
	var standardPrice = 7565 , premiumPrice = 12345 , exceliumPrice = 15400; 
	var standardFee  = 10 , premiumFee = 13 , exceliumFee = 16;
	var instalationPrice , totalMat;
	var fee, ttl;
	

	//global variable for the number of floors before adding a column can be changed if regulations change.
	var floorsPerColumn = 20;
	var stories = floors + basements;

	//changes floors to only floors aboveground
	var chgeFloors = function(){
		parseVar();
		floors = floors - basements;
	};

	//converts a number to a string formated xxx,xxx,xxx (copied from blog.abelotech.com)
	var formatNumber = function(x){
		x = x.toFixed(2);
 		return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	};

	var parseVar = function(){appartements = $("#appartements").val();
		buisness = parseInt(buisness);
		companies = parseInt(companies);
		floors = parseInt(floors);
		//row2 variables
		basements = parseInt(basements);
		parking = parseInt(parking);
		occupants = parseInt(occupants);
		cages = parseInt(cages);
		activity = parseInt(activity);
		//row3 variables
		columns = parseInt(columns);
		shafts = parseInt(shafts);
			
	};
	parseVar();
	
	//logVariables();
	var logVariables = function(){
		console.log("row1 : "+"type "+ type + ", apt " + appartements +", buisnesses "+ buisness + ', companies '+ companies + ', floors '+ floors);
		console.log( "row2 : "+" basements "+ basements + ", parking "+ parking + ", occupants " + occupants + ", cages "+ cages+ ", activity" + activity);
		console.log("row3 : "+"columns "+ columns + ", shafts/cages/elevators "+ shafts + ", temporary elevator value" + elevators);
		console.log("final form : "+ selectedLine+ ", total Material "+ totalMat + ", installation fee" + fee );
		console.log("TOTAL : " + ttl);

		};
	//calculate number of columns
	var numberColumns = function (){
		stories = floors + basements;
		columns = 1 + Math.floor(stories / floorsPerColumn);
	};


	//hide all fields except building type selection
	var hide = function(){
	$(".hidden").hide();
	};
	hide();
	
	//function for the first building type selection	
	var typeSelector = function(){
			if (type === 'residential'){
				$('.residential').show(500);

			}else if(type === "corporate"){
				$('.corporate').show(500);
			}else if (type === "commercial"){
				$('.commercial').show(500);
				comCalc();

			}else if(type === "hybrid"){
				$('.hybrid').show(500);
			}else {
				return;
			}
			//logVariables();
	};
		
	//calculator for a residential building
	var resCalc = function(){
		parseVar();
		//calculate average doors per floor (appartements/floors) 
		var avgDoors = Math.ceil(appartements / floors);
		//calculate number of columns ( 1 + (floors/floorsPerColumn))
		numberColumns();
		//calculate number of shafts 1 for 6 appartments *columns
		shafts = Math.ceil(avgDoors / 6 ) * columns;
		logVariables();
	};
	
	//calculator for corporate and hybrid buildings
	var corpHybCalc = function(){
		$("#elevators-per-column-div").remove();
		$("#elevators-tmp-div").remove();
		parseVar();
		//calculate total number of occupants ((floors+basements)*occupants)
		var totalOccupants = occupants * (floors+basements);
		//number of elevators (totalOccupants/1000)
		var elevators = Math.ceil(totalOccupants / 1000); 
		//number of columns ((floors+basements)/FloorsPerColumn)
			 
		numberColumns();
		//number of elevators per column ([elevators|shafts]/columns)
		var elevatorsPerColumn = Math.ceil(elevators / columns);
		//create a display field to show elevatorsPerColumn and number of elevators(temporary value)
		$('<div class="col-md-4 hidden" id="elevators-per-column-div" class="hidden">')
			.appendTo('#row3')
			.html(	'<label for="elevators-per-column" >number of elevators per column</label><input readonly id="elevators-per-column" type="number" value="" class="form-control">');
		$('#elevators-per-column').val(elevatorsPerColumn);

		$('<div class="col-md-4 hidden" id="elevators-tmp-div" class="hidden unwanted">')
			.appendTo('#row3')
			.html(	'<label for="elevators-tmp" >number of elevators</label><input readonly id="elevators-tmp" type="number" value="" class="form-control">');
		$('#elevators-tmp').val(elevators);


		//calculate total number of elevators (elevatorsPerColumn*columns)
		shafts = elevatorsPerColumn * columns;
		//change text of shaft label to display totalElevators
		$("#shafts-label").text('total number of elevators');
		//logVariables();

	};

	//commercial calculator function
	var comCalc = function(){
		parseVar();
		//display number of cages in shaft field and keep column field hidden
		shafts = cages ;
		$('#columns-div').hide();
		//logVariables();

	};



	//general calculator function calls functions depends on type
	var calculator = function(){

		$('.calculator').show(500);

			if (type === 'residential'){
				//display the appropriate fields : appartments, floors, basements
				$('.residential').show(500);
				resCalc();
		
			}else if(type === "corporate"){
				//display the appropriate fields : companies, floors, basements, parking, occupants

				$('.corporate').show(500);
				corpHybCalc();
				
			}else if (type === "commercial"){
				$('.commercial').show(500);
				$('#columns-div').hide();
				comCalc();

			}else if(type === "hybrid"){
				$('.hybrid').show(500);
				corpHybCalc();
			}else {
				return;
			}
			//display the results in shafts and columns fields
			
			$("#shafts").val(shafts);
			$('#columns').val(columns);
			
				lineSelector();
			
		
			
	};
	
	
	// radio button form displayer
	var lineSelector = function(){
		//display the form if there is a value to quote
		if (shafts > 0){
			$('#row4').show(500);
		}else {
			$("#row4").hide(500);
		}
		feeDisplay();
	};

	//service required by doc
	var feeCalculator =function (){
		//display which line was selected in label
		$('#selected-line').text(selectedLine + ' line');
			//if standard is selected 
			if (selectedLine === "standard"){
				///price is 7565 (maybe use global variable to make it easyer to change later)
				return standardPrice;
			}
			//if premium is selected 
			else if (selectedLine === "premium"){
				//price is 12345 (maybe use global variable to make it easyer to change later)
				return premiumPrice;
			}
			//if excelium is selected
			else if (selectedLine === "excelium"){
			
				//price is 15400 (maybe use global variable to make it easyer to change later)
				return exceliumPrice;
			}else {
				return;
			}
	};
	
	var feeDisplay = function(){
		//display price in the field var 
		if (selectedLine === "standard" ||
			selectedLine === "premium" ||
			selectedLine === "excelium"){
			$('.fee').show(500);
		}else {
			$('.fee').hide();
		}
		if (selectedLine === "standard"){
				//feepercent is 10
				feePercent = standardFee;
			}
			//if premium is selected
		else if (selectedLine === "premium"){
				//feePercent is 13
				feePercent = premiumFee;
			}
			//if excelium is selected
		else if (selectedLine === "excelium"){
				//feePercent is 16
				feePercent = exceliumFee;
		}else {
				return;
		}
		//displays prices
		var pricePerShaftString = formatNumber(pricePerShaft); 
		totalMat = shafts * pricePerShaft;
		var totalMatString = formatNumber(totalMat)

		$('#total-cost').val(totalMatString + ' $');
		$('#price-per-shaft').val(pricePerShaftString + ' $');
		$('#fee-percent').val(feePercent + ' %');
		//not necessary display installation fee percentage 
		//calculate installation fee (feePercent * shafts * priceOfLine)
		fee = Math.round((feePercent/100 * shafts * pricePerShaft) * 100) / 100;
		var feeString = formatNumber(fee);
		$('#fee').val(feeString + ' $');
	calcTotal();
	};	
	
	//Total Estimate field
	var calcTotal = function(){
	//calculate TOTAL ( (shafts * priceOfLine) + installationFee ) and display
		$('.total-div').show();
		ttl = (totalMat) + fee;
		var totalString = formatNumber(ttl);
		$('#total').val(totalString + ' $');
		logVariables();

	};

$(document).ready(function(){
	//changes values as user inputs values to form
	//row1

	$('#type').on('change',function(event){
		type = $('#type').val();
		$('.hidden').hide(500);
		$('.line-selector').prop('checked',false);
		$('.fee').hide(200);
		selectedLine = "";
		//logVariables();
		typeSelector();
	});

	$('#buisness').on('change',function(event){
		buisness = $('#buisness').val();
		if (buisness < 0){
			buisness = 0;
			$('#buisness').val(0);
		}		
		//logVariables();
		calculator();
	});

	$("#appartements").on('change',function(event){
		appartements = $("#appartements").val();
		if (appartements < 0){
		    appartements = 0;
			$('#appartements').val(0);
		}
		//logVariables();
		calculator();
	});

	$('#companies').on('change',function(event){
		companies = $('#companies').val();
		if (companies < 0){
			companies = 0;
			$('#companies').val(0);
		}
		//logVariables();
		calculator();
	});

	$('#floors').on('change',function(event){
		floors = $('#floors').val();
		basements = $('#basements').val();
		chgeFloors();
		if (floors < 0){
			floors = 0;
			$('#floors').val(0);
		}
		//logVariables();
		calculator();
	});
	//row2
	$('#basements').on('change',function(event){
		basements = $('#basements').val();
		floors = $('#floors').val();
		chgeFloors();
		if (basements < 0){
			basements = 0;
			$('#basements').val(0);
		}
		//logVariables();
		calculator();
	});

	$('#parking').on('change',function(event){
		parking = $('#parking').val();
		if (parking < 0){
			parking = 0;
			$('#parking').val(0);
		}
		//logVariables();
		calculator();
	});
	
	$('#occupants').on('change',function(event){
		occupants = $('#occupants').val();
		if (occupants < 0){
			occupants = 0;
			$('#occupants').val(0);
		}
		//logVariables();
		calculator();
	});

	$('#cages').on('change',function(event){
		cages = $('#cages').val();
		if (cages < 0){
			cages = 0;
			$('#cages').val(0);
		}
		//logVariables();
		calculator();
	});
	
	$('#activity').on('change',function(event){
		activity = $('#activity').val();
		if (activity < 0){
			activity = 0;
			$('#activity').val(0);
		}else if (activity > 24){
			activity = 24;
			$('#activity').val(24);
		}
		//logVariables();
		calculator();
	});
	//row4
	//save value into a variable on radio selection
	$('#standard').on('change',function(){
		if ($(this).is(":checked")){
			selectedLine = $(this).val();
		}
		pricePerShaft = feeCalculator();
		feeDisplay();
	});
	$('#premium').on('change',function(){
		if ($(this).is(":checked")){
			selectedLine = $(this).val();
		}
		pricePerShaft = feeCalculator();
		feeDisplay();
	});
	$('#excelium').on('change',function(){
		if ($(this).is(":checked")){
			selectedLine = $(this).val();
		}
		pricePerShaft = feeCalculator();
		feeDisplay();
	});
});

