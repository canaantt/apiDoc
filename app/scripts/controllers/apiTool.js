'use strict';

/**
 * @ngdoc function
 * @name apiDocApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apiDocApp
 */


angular.module('apiDocApp')
  .controller('ApiToolCtrl', function ($window) {
	var encode = function(v){
			return encodeURIComponent(JSON.stringify(v));
	};

	var decode = function(v){
				return decodeURIComponent(v);
		};

	var castDataType = function(str){
		var result;
		if(str === "false"){
			return false;
		}else if(str === "true"){
			return true;
		}else{
			if(!isNaN(Number(str))){
				result = Number(str);
			}else{
				str = str.replace(/"/g,"");
				result = JSON.stringify(str);
			}
			//return !isNaN(Number(str))? Number(str):JSON.stringify(str);
		}
		return(result);
		
	};

	var operations = (function(){

			return {
				"Sample Queries":[
					{name:"Select All", url:""},
					{name:"Select Fields", url: "http://localhost:3000/api/_field_detail/"},
					{name:"Select Count", url:"/count"}
				]};
		})();

	// jQuery.fn.extend({
	//     disable: function(state) {
	//         return this.each(function() {
	//             var $this = $(this);
	//             if($this.is('input, button, textarea, select'))
	//               this.disabled = state;
	//             else
	//               $this.toggleClass('disabled', state);
	//         });
	//     }
	// });

	function getObjects(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] === 'object') {
	            objects = objects.concat(getObjects(obj[i], key, val));
	        } else if (i === key && obj[key] === val) {
	            objects.push(obj);
	        }
	    }
	    return objects;
	}

	var getAllIndexes = function(arr, val) {
	    var indexes = [], i = -1;
	    while ((i = arr.indexOf(val, i+1)) !== -1){
	        indexes.push(i);
	    }
	    return indexes;
	};

	var i=1;
	var items = [];

	// Get Reference To All Important UI Elements
	var elements = (function($){
		return{
			diseaseBtn: $(".diseaseBtn"),
			diseases: $("#diseaseDropDown"),
			operations: $("#sampleBtn"),
			query: $("#txtQuery"),
			submit: $("#btnSubmit"),
			results: $("#divResults"),
			resultCollpase: $("#resCollpase"),
			userInput:{
					collection: $("#collectionInput"),
					count: $("#btnCount"),
					//countVal: $("#countVal"),
					query: $("#criInput"),
					fields: $("#fieldsInput"),
					limit: $("#limitInput"),
					skip: $("#skipInput"),
					filter: $("#filterInput"),
					submit: $("#cusSubmit"),
					advanceInput:{
									addRow: $("#add_row"),
									delRow: $("#delete_row")
								 }
					}
		};
	})($);

	var service = function(url, fun){
		
		$.ajax({
        	url: url
	    }).error(function (err) {
	    	$window.alert(this.name + " ERROR");
	    	throw err;
	    }).done(function (result) {
	        fun(result);
	    });		   
	};	

	function serviceBusy(str){
		switch (str){
			case true: 
					$("#divResults").html("");
					$(".fa-spin").show();
					break;
						
			case false: 
					$(".fa-spin").hide();
					$("#resCollpase").show();
					break;
		    default: 
    				$("#divResults").html("");
    				$(".fa-spin").hide();
    				$("#resCollpase").hide();	
		}		
		
	}

	var populateDiseases = function(result){
        	var diseaseList = JSON.parse(result)[0].diseases;
        	var disease; 
        	
        	for(var i=0; i<diseaseList.length; i++){
        		disease = diseaseList[i].name;
				elements.diseases.append("<li><a href='#'>" + 
						 disease + "</a><ul class='dropdown-submenu' id=" + disease + "></ul></li>");
				var elemID = '#'+disease;
				var tables = diseaseList[i].tables;
				for(var j=0; j<tables.length; j++){
					$(elemID).append("<li><a href='#'>" + 
						 tables[j].collection + "</a></li>");	
				}
			}
			$(".dropdown-submenu li a").on("click", function(e){
				var str = e.target.innerText;
				elements.diseaseBtn.val(str);
				elements.diseaseBtn.text(str);
		});	
    }; 	  
	
    var diseaseSelectionReverse = function(){
    	var str = "Pick A Disease Table";
    	//elements.diseaseBtn.val(str);
		elements.diseaseBtn.text(str);
    };

    var clearUserQueryPanel = function(){
    	elements.userInput.collection.val("");
    	elements.userInput.count.val("");
    	elements.userInput.query.val("");
    	elements.userInput.fields.val("");
    	elements.userInput.limit.val("");
    	elements.userInput.skip.val("");
    };
	// Get operations Model
	

	var fillDiseaseDropdown = (function(){
		var url = "http://localhost:3000/api/_collections/?q=" 
             + encode({$fields:['diseases']});
		service(url, populateDiseases);

	})();

	
	var populateOperations = function(jsonObj){
		$.each(jsonObj, function(k, v){
			var str = "#" + k;
			console.log(str);
			var opt = "";
			$.each(v, function(key, val){
				opt = opt + "<button class='btn btn-link btn-sm'>" + val.name + "</button>";
			});
			elements.operations.append(opt);
		});
	
	};

	populateOperations(operations);
	var availableCollectionTags = [
		    "_cde",
		    "_collections",
		    "_column_mapping",
		    "_cromosome_layout",
		    "_field",
		    "_field_detail",
		    "_field_mapping",
		    "system.js",
		    "tcga_acc_drug",
		    "tcga_acc_f1",
		    "tcga_acc_nte",
		    "tcga_acc_nte_f1",
		    "tcga_acc_omf",
		    "tcga_acc_pt",
		    "tcga_acc_rad",
		    "tcga_blca_drug",
		    "tcga_blca_f1",
		    "tcga_blca_f2",
		    "tcga_blca_nte",
		    "tcga_blca_nte_f1",
		    "tcga_blca_omf",
		    "tcga_blca_pt",
		    "tcga_blca_rad",
		    "tcga_brca_drug",
		    "tcga_brca_f1",
		    "tcga_brca_f2",
		    "tcga_brca_f3",
		    "tcga_brca_nte",
		    "tcga_brca_nte_f1",
		    "tcga_brca_omf",
		    "tcga_brca_pt",
		    "tcga_brca_rad",
		    "tcga_cesc_drug",
		    "tcga_cesc_f1",
		    "tcga_cesc_f2",
		    "tcga_cesc_nte",
		    "tcga_cesc_nte_f1",
		    "tcga_cesc_omf",
		    "tcga_cesc_pt",
		    "tcga_cesc_rad",
		    "tcga_chol_drug",
		    "tcga_chol_f1",
		    "tcga_chol_nte",
		    "tcga_chol_nte_f1",
		    "tcga_chol_omf",
		    "tcga_chol_pt",
		    "tcga_chol_rad",
		    "tcga_coad_drug",
		    "tcga_coad_f1",
		    "tcga_coad_nte",
		    "tcga_coad_nte_f1",
		    "tcga_coad_omf",
		    "tcga_coad_pt",
		    "tcga_coad_rad",
		    "tcga_dlbc_drug",
		    "tcga_dlbc_f1",
		    "tcga_dlbc_nte",
		    "tcga_dlbc_nte_f1",
		    "tcga_dlbc_pt",
		    "tcga_dlbc_rad",
		    "tcga_esca_drug",
		    "tcga_esca_f1",
		    "tcga_esca_nte",
		    "tcga_esca_nte_f1",
		    "tcga_esca_omf",
		    "tcga_esca_pt",
		    "tcga_esca_rad",
		    "tcga_gbm_drug",
		    "tcga_gbm_f1",
		    "tcga_gbm_nte",
		    "tcga_gbm_nte_f1",
		    "tcga_gbm_omf",
		    "tcga_gbm_pt",
		    "tcga_gbm_rad",
		    "tcga_hnsc_drug",
		    "tcga_hnsc_f1",
		    "tcga_hnsc_f2",
		    "tcga_hnsc_nte",
		    "tcga_hnsc_nte_f1",
		    "tcga_hnsc_omf",
		    "tcga_hnsc_pt",
		    "tcga_hnsc_rad",
		    "tcga_kich_drug",
		    "tcga_kich_f1",
		    "tcga_kich_nte",
		    "tcga_kich_nte_f1",
		    "tcga_kich_omf",
		    "tcga_kich_pt",
		    "tcga_kich_rad",
		    "tcga_kirc_drug",
		    "tcga_kirc_f1",
		    "tcga_kirc_nte",
		    "tcga_kirc_omf",
		    "tcga_kirc_pt",
		    "tcga_kirc_rad",
		    "tcga_kirp_drug",
		    "tcga_kirp_f1",
		    "tcga_kirp_nte",
		    "tcga_kirp_omf",
		    "tcga_kirp_pt",
		    "tcga_kirp_rad",
		    "tcga_laml_pt",
		    "tcga_lgg_drug",
		    "tcga_lgg_f1",
		    "tcga_lgg_nte",
		    "tcga_lgg_omf",
		    "tcga_lgg_pt",
		    "tcga_lgg_rad",
		    "tcga_lich_drug",
		    "tcga_lich_f1",
		    "tcga_lich_nte",
		    "tcga_lich_nte_f1",
		    "tcga_lich_omf",
		    "tcga_lich_pt",
		    "tcga_lich_rad",
		    "tcga_luad_drug",
		    "tcga_luad_f1",
		    "tcga_ucec_f2",
		    "tcga_ucec_f3",
		    "tcga_ucec_nte",
		    "tcga_ucec_nte_f1",
		    "tcga_ucec_omf",
		    "tcga_ucec_pt",
		    "tcga_ucec_rad",
		    "tcga_ucs_drug",
		    "tcga_ucs_f1",
		    "tcga_ucs_nte",
		    "tcga_ucs_nte_f1",
		    "tcga_ucs_omf",
		    "tcga_ucs_pt",
		    "tcga_ucs_rad",
		    "tcga_uvm_drug",
		    "tcga_uvm_f1",
		    "tcga_uvm_nte",
		    "tcga_uvm_omf",
		    "tcga_uvm_pt",
		    "tcga_uvm_rad"
		];
	elements.userInput.collection.autocomplete({source:availableCollectionTags});
	$(".ui-helper-hidden-accessible").hide();
	elements.operations.click(function(e) {
		var value = e.target.innerText.replace(/\"/g,"");
		var url = getObjects(operations, 'name', value)[0].url;
		var newValue;
		if(availableCollectionTags.indexOf(elements.diseaseBtn.val()) === -1){
			$window.alert("Please pick a table in the Sample Query panel!");
		}else{
			if(url.indexOf("http")===0){
				newValue = url + "?q=" + encode({
					collection: elements.diseaseBtn.val()
					, "$fields":["fields.key"]
				});
			}else{
				newValue = "http://localhost:3000/api/" + elements.diseaseBtn.val() + url;
			}
			elements.query.val(newValue);
			elements.submit.click();
		}	
  	});

	elements.submit.on("click", function(e){
		serviceBusy();
		clearUserQueryPanel();
		serviceBusy(true);
		$.get(elements.query.val(), function(data) {
			serviceBusy(false);
   			if(elements.resultCollpase.hasClass("active")){
				elements.results.jsonViewer(data, {collapsed:true});
			}else{
				elements.results.jsonViewer(data, {collapsed:false});
			}
   			elements.query.val(decode(elements.query.val()));
		});
	});

	elements.userInput.count.click(function(e) {
	    e.preventDefault();
	    $(this).toggleClass('active');
	});

	elements.resultCollpase.click(function(e) {
	    e.preventDefault();
	    $(this).toggleClass('active');
	    if(elements.userInput.collection.val() !== ""){
	    	elements.userInput.submit.click();
	    }else{
	    	elements.submit.click();
	    }
	});


	/* advanced Query
	 */
	var advancedQuery =	(function(){
						i = 1;
					    elements.userInput.advanceInput.addRow.click(function(){
							  var fieldID, valueID;
							  fieldID = "#field" + (i-1);
						      valueID = "#value" + (i-1); 
						      var tmp = {};
						      tmp.field = $(fieldID).val();
						      tmp.value = $(valueID).val(); 
						      if(tmp.field !== ""){
						      	items.push(tmp);
						      	$('#tab_logic').append('<tr id="addr'+i+'"></tr>');
						      	$('#addr'+i).html("<td><input name='name" + i + "' type='text' placeholder='Field' class='form-control input' id='field"+ 
						      							i + "'  /></td>" + 
						      					  "<td><input  name='value" + i + "' type='text' placeholder='Values' class='form-control input' id='value" + 
														i + "'></td>" + 
												  "<td><a href='#'><i class='fa fa-sort' aria-hidden='true'></i></a>" +
						      					  "<td><span  name='range" + i + "' type='text' placeholder='Range' class='form-control' id='range" + 
														i + "'></span></td>" +
												  "<td><span  name='dataType" + i + "' type='text' placeholder='Data Type' class='form-control' id='dataType" + 
														i + "'></span></td></td>");
						      	
						      	i++;
						      }
						  });
					    elements.userInput.advanceInput.delRow.click(function(){
					    	 if(i>0){
								 $("#addr"+(i-1)).html('');
								 i--;
								 items.pop();
							 }
						 });	
					})();
		
		var customerQuery = function(items){
			var constructedURL = "http://localhost:3000/api/";
			var collection, query = [], fieldVals = [], limitVal, skipVal, filterVal; 
			var re = /\s*,\s*/;
			var re2 = /\s*:\s*/;
			
			function trimComma(str){
				return (str.slice(-1) === ",") ? str.replace(/,\s*$/, "") : str;
			}

			
			collection = (elements.userInput.collection.val() === "" ? null:trimComma(elements.userInput.collection.val()));
			query = (elements.userInput.query.val() === "" ? null:trimComma(elements.userInput.query.val()).split(re));
			fieldVals = (elements.userInput.fields.val() === "" ? null:trimComma(elements.userInput.fields.val()).split(re));
			limitVal = (elements.userInput.limit.val() === "" ? null:trimComma(elements.userInput.limit.val()));
			skipVal = (elements.userInput.skip.val() === "" ? null:trimComma(elements.userInput.skip.val()));
			
			var string ="";

			if(items.length !== 0) {

				// string = string + JSON.stringify($.trim(items[0].field)) + ":" 
				// 				+ castDataType($.trim(items[0].value));
				// if(items.length > 1){
				for(var i=0;i<items.length;i++){
					if(i === 0){
						string = string + 
							 JSON.stringify($.trim(items[i].field)) + ":" 
							+ castDataType($.trim(items[i].value));
					}else{
						string = string + ", " + 
							 JSON.stringify($.trim(items[i].field)) + ":" 
							+ castDataType($.trim(items[i].value));	
					}
					
				}
					
			}

			if(query !== null){
				string = string + JSON.stringify($.trim(query[0].split(re2)[0])) + ":" 
								+ castDataType($.trim(query[0].split(re2)[1]));
				if(query.length > 1){
					for(var i=1;i<query.length;i++){
						string = string + ", " + 
								 JSON.stringify($.trim(query[i].split(re2)[0])) + ":" 
								+ castDataType($.trim(query[i].split(re2)[1]));
					}
				}	
			}
			
			
			if(fieldVals !== null){
				if(string === "") {
					console.log("test within fieldVal");
					string = JSON.stringify("$fields")+ ":"+ JSON.stringify(fieldVals);
				}else{
					string = string + ","+ JSON.stringify("$fields")+ ":"+ JSON.stringify(fieldVals);
				}
			}

			if(limitVal !== null){
				if(string === "") {
					string = JSON.stringify("$limit")+ ":"+ Number(limitVal);
				}else{
					string = string + ","+ JSON.stringify("$limit")+ ":"+  Number(limitVal);
				}
			}

			if(skipVal !== null){
				if(string === "") {
					string = JSON.stringify("$skip")+ ":"+  Number(skipVal);
				}else{
					string = string+ ","+ JSON.stringify("$skip")+ ":"+ Number(skipVal);
				}
			}
			
			string = "{" + string + "}";
			//$window.alert(string);
			
			if(elements.userInput.count.hasClass("active")) {
				constructedURL = constructedURL + collection + "/count?q=";
			}else{
				constructedURL = constructedURL + collection + "/?q=";
			}
			elements.query.val(constructedURL + string);
			constructedURL = constructedURL + encodeURIComponent(string);


			return constructedURL;
		};
	
	
	elements.userInput.submit.on("click", function(){
		diseaseSelectionReverse();
		serviceBusy();
		if(availableCollectionTags.indexOf(elements.userInput.collection.val()) === -1) {
			$window.alert("Please enter a Collection name!");
		}else{
			serviceBusy(true);
			$.get(customerQuery(items), function( data ) {
				serviceBusy(false);
				if(elements.resultCollpase.hasClass("active")){
					elements.results.jsonViewer(data, {collapsed:true});

				}else{
					elements.results.jsonViewer(data, {collapsed:false});				
				}
			});
		}	
	});

    /* 
        Tools Evaluation on Disease Table Sets
     */

    var ajv = new Ajv();
    var schemaObject;
    
    var Diseases = function(){
		return new Promise(function(resolve, reject){
			$.get("http://localhost:3000/api/_diseases_tables_mapping", function(result, status){
					if(status === "success"){
						resolve(result);
					}else{
						reject(status);
					}
				});
		});
	};
	
	
	var schemaValidationRatio = function(url, schema){
		$.ajax({
		    url: url,
		    type: 'GET'
		}).error(function (err) {
	    	console.log(url + " ERROR");
	    	throw err;
	    }).done(function(data){ 
		        var valid = [];
		        var doc;
		        if(url.indexOf("pt") > -1){
		        	doc = JSON.parse(data);
		        }else{
		        	doc = data;
		        }
			    var docLength = doc.length;
				for(var i=0;i<docLength;i++){
					valid[i] = ajv.validate(schema, doc[i]);
					if(!valid[i]) console.log(ajv.errors[0].message);
				}
				console.log(valid);
				var passedIndices = getAllIndexes(valid, true);
		        console.log(Math.floor((passedIndices.length/valid.length) * 100), "% of the records pass the schema validation");
				return Math.floor((passedIndices.length/valid.length) * 100);
		    });	
	};

    var getSchemas = function(){
    	return new Promise(function(resolve, reject){
			$.get("http://localhost:3000/api/_tools_schemas", function(result, status){
					if(status === "success"){
						resolve(result);
					}else{
						reject(status);
					}
				});
		});
    };
    
    var score = [];
    getSchemas().then(function(schema){
    	schemaObject = JSON.parse(schema)[0];
    	return Diseases();
    }).then(function(value){
    	var toolKeys = Object.keys(schemaObject);
    	toolKeys.splice((toolKeys.length -1),1); //remove "id"
    	var urlRoot = 'http://localhost:3000/api/';
		var url; 
		var jsonObj = JSON.parse(value);
		var diseaseTypes = [];
		jsonObj.forEach(function(elem){diseaseTypes.push(elem.disease);});
		//for(var i=0;i<diseaseTypes.length;i++){
		for(var i=0;i<9;i++){ //take 9 consecutive disease types to create data structure, look through disease types	
			for(var m=0; m<toolKeys.length;m++){
				var tblKeys = Object.keys(schemaObject[toolKeys[m]]);
				score[diseaseTypes[i]] = {};
				var tmp = {};
				tmp[toolKeys[m]] = [];
				for(var n=0; n<tblKeys.length; n++){
					var schema = schemaObject[toolKeys[m]][tblKeys[n]];
					if(typeof(jsonObj[i].collections[tblKeys[n]]) !== "undefined"){
						url = urlRoot + jsonObj[i].collections[tblKeys[n]];
						//console.log(schemaValidationRatio(url, schema));
						var t = '{' + [tblKeys[n]] + ':' + schemaValidationRatio(url, schema) + '}';
						tmp[toolKeys[m]].push(t);
					}else{
						console.log(jsonObj[i].collections[tblKeys[n]], " doesn't exist.");
						t = 0;
						tmp[toolKeys[m]].push(t);
					}
				}
				score.push(tmp);
			}
		}

    });
    
  

	
   /* visualize data quality by tool
    */

   var data = [
	  [0.99, 0.99, 1, 0.5, 0.45, 0.6],
	  [ 0, 0.99, 1, 0.5, 0.45, 0.6],
	  [ 0.99, 0, 1, 0.5, 0.45, 0.6],
	  [ 0.1, 0.99, 1, 0.5, 0.45, 0.6],
	  [ 0.99, 0.99, 1, 0.5, 0.45, 0.6],
	  [0.99, 0.99, 1, 0.5, 0.45, 0.6]
	];

	
	// Define the margin, radius, and color scale. The color scale will be
	// assigned by index, but if you define your data using objects, you could pass
	// in a named field from the data object instead, such as `d.name`. Colors
	// are assigned lazily, so if you want deterministic behavior, define a domain
	// for the color scale.
	var m = 5,
	    r = 90,
	    colors = d3.scale.category10();
	    //colors = ["#5cb85c","#DCDCDC","#D61687","#1E93C1","yellow","blue"];
	// Insert an svg element (with margin) for each row in our dataset. A child g
	// element translates the origin to the pie center.
	var svg = d3.select("#toolEval").selectAll("svg")
	    		.data(data)
	    		.enter().append("svg")
	    		.attr("width", (r + m) * 2)
	    		.attr("height", (r + m) * 2)
	  			.append("g")
	    		.attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

	// The data for each svg element is a row of numbers (an array). We pass that to
	// d3.layout.pie to compute the angles for each arc. These start and end angles
	// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
	// on the arc, not the layout.
	svg.selectAll("path")
	   .data(d3.layout.pie())
	   .enter()
	   .append("path")
	   .attr("d", d3.svg.arc()
	   					.innerRadius(r* 4 / 5)
	   					.outerRadius(r))
	   .style("fill", function(d, i) { return colors(i); });

	Promise.resolve(getSchemas()).then(function(value) {
	  var tools = Object.keys(JSON.parse(value)[0]);
	  var titles = svg.append("svg:text") 
					  .attr("class", "title") 
					  .text(function(d,i) {return tools[i];}) 
					  .attr("dy", "5px")  
					  .attr("text-anchor", "middle");
	}, function(value) {
	   console.log(value);
	});   
		


  });
