
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
	var elevators, elevatorsPerColumn;
	//row4 variables
	var selectedLine ;
	var feePercent;
	var pricePerShaft;
	var standardPrice = 7565 , premiumPrice = 12345 , exceliumPrice = 15400; 
	var standardFee  = 10 , premiumFee = 13 , exceliumFee = 16;
	var instalationPrice , totalMat;
	var fee, ttl;
	
/*
	//global variable for the number of floors before adding a column can be changed if regulations change.
	var floorsPerColumn = 20;
	var stories = floors + basements;
	*/

	//logVariables();
	var logVariables = function(){
		console.log("row1 : "+"type "+ type + ", apt " + appartements +", buisnesses "+ buisness + ', companies '+ companies + ', floors '+ floors);
		console.log( "row2 : "+" basements "+ basements + ", parking "+ parking + ", occupants " + occupants + ", cages "+ cages+ ", activity" + activity);
		console.log("row3 : "+"columns "+ columns + ", shafts/cages/elevators "+ shafts + ", temporary elevator value" + elevators);
		console.log("final form : "+ selectedLine+ ", total Material "+ totalMatString + ", installation fee" + feeString );
		console.log("TOTAL : " + totalString);

		};
	
	//hide all fields except building type selection
	var hide = function(){
	$(".hidden").hide();
	};
	hide();
	$('#type-div').hide();
	
	//function for the first building type selection	
	var typeSelector = function(){
		
		
			if (type === 'residential'){
				$('.residential').show(500);

			}else if(type === "corporate"){
				$('.corporate').show(500);
			}else if (type === "commercial"){
				$('.commercial').show(500);
			

			}else if(type === "hybrid"){
				$('.hybrid').show(500);
			}else {
				return;
			}
			$('#type-div').show();
			//logVariables();
	};
		
	//general calculator function calls functions depends on type
	var calculator = function(){		
		//post to node
		$.post('https://evening-forest-73830.herokuapp.com/building-config',{
			//row1 variables
			type : type,
			appartements : appartements,
			buisness : buisness,
			companies : companies,
			floors : floors,
			
			//row2 variables
			basements : basements,
			parking : parking,
			occupants : occupants,
			cages : cages,
			activity : activity,
		
			//row3 variables
			columns : columns,
			shafts : shafts,
			elevators: elevators,
	
			
			},
			//callback results
			function(project){
				shafts = project.shafts;
				columns = project.columns;
				elevatorsPerColumn = project.elevatorsPerColumn;
				elevators = project.elevators;
				//console.log("received : " + "temporary value for elevators : "+ elevators + " ; elevators per column : "+ elevatorsPerColumn);
				displayCalculator();
			}

		)
	};
			
	function displayCalculator(){

			//console.log( "show calculator class")
		$('.calculator').show(500);

			if(type === "hybrid" || type === "corporate"){
				//$('.hybrid').show(500);
				//corpHybCalc();
				$("#elevators-per-column-div").remove();
				$("#elevators-tmp-div").remove();
				
				//create a display field to show elevatorsPerColumn and number of elevators(temporary value)
				$('<div class="col-md-4 hidden" id="elevators-per-column-div" class="hidden">')
				.appendTo('#row3')
				.html(	'<label for="elevators-per-column" >number of elevators per column</label><input readonly id="elevators-per-column" type="number" value="" class="form-control">');
				$('#elevators-per-column').val(elevatorsPerColumn);

				$('<div class="col-md-4 hidden" id="elevators-tmp-div" class="hidden unwanted">')
					.appendTo('#row3')
					.html(	'<label for="elevators-tmp" >number of elevators</label><input readonly id="elevators-tmp" type="number" value="" class="form-control">');
				$('#elevators-tmp').val(elevators);
				//change shafts label
				$("#shafts-label").text('total number of elevators');
			}else if (type === "commercial") {
				$('#columns-div').hide();

			}else if (type === "residential"){ 

			}else { return; }
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
	
	var feeDisplay = function(){
		//display price in the field var 
		if (selectedLine === "standard" ||
			selectedLine === "premium" ||
			selectedLine === "excelium"){
			$('.fee').show(500);
			$('.total-div').show(7000);
		}else {
			$('.fee').hide();
			$('.total-div').hide();

		}
		
		//post radio selection callback values to finish the form
			$.post("https://evening-forest-73830.herokuapp.com/line-selection",{
				shafts: shafts,
				selectedLine: selectedLine,
				},
				function(line){//callback
					pricePerShaftString = line.pricePerShaftString;
					totalMatString = line.totalMatString;
					feePercent = line.feePercent;
					feeString = line.feeString;
					totalString = line.totalString;
					//	console.log("recieved callback for Quote");
					//function te be called after the callback
					displayQuote();
				}
			)
	};

	function displayQuote(){

		//displays prices from callback
		$('#selected-line').text(selectedLine + ' line');
		$('#total-cost').val(totalMatString + ' $');
		$('#price-per-shaft').val(pricePerShaftString + ' $');
		$('#fee-percent').val(feePercent + ' %');
		$('#fee').val(feeString + ' $');

		$('#total').val(totalString + ' $');
		logVariables();
	};

		//not necessary display installation fee percentage 
	function wakeUpHeroku(){
		
		$.post("https://evening-forest-73830.herokuapp.com/wake-up",{state: "wakeyWakey"},
				function(status){//callback
					state = status.state;
					console.log("heroku app just yawned and woke up... status: " + state);
				}
			)
	};

$(document).ready(function(){

	wakeUpHeroku();
	
	$("#wakeup").hide(12000);


	$('#type-div').show(10000);
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
		feeDisplay();
	});
	$('#premium').on('change',function(){
		if ($(this).is(":checked")){
			selectedLine = $(this).val();
		}
		feeDisplay();
	});
	$('#excelium').on('change',function(){
		if ($(this).is(":checked")){
			selectedLine = $(this).val();
		}
		feeDisplay();
	});
});

