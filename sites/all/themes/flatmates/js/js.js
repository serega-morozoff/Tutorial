(function ($) {
	
	function addMoreAccomodation(ele){
		var type = ele.parent().parent().find("select :selected").val();
		var name = ele.parent().parent().find("select :selected").html();
		var check = 0;
		$("#create-preferred-accomodation .item").each(
			function(){
				if($(this).find("input").val() == name){
					check = 1;
				}
			}
		);			
		if(check == 0){
			$("#create-preferred-accomodation .selected").prepend("<div class='item'><input disabled type='text' id='tid-" + type + "' value='" + name + "'><span class='close' title='Delete' data-toggle='tooltip'></span></div>");
			$('[data-toggle="tooltip"]').tooltip();
			ele.parent().find("select :selected").attr("disabled","disabled");	
		}		
	}
	
	function addMoreLocation(ele){
		var name = ele.val();
		if(name != ""){
			$("#with-g-point .selected").prepend("<div class='item'><input type='text' disabled value='" + name + "'><span class='close' title='Delete' data-toggle='tooltip'></span></div>");
			$('[data-toggle="tooltip"]').tooltip();			
			$("#edit-field-preffered-locations-google tr").each(
				function(){
						if($(this).find("input").val() == ""){
							$(this).find("input").val(name);
						}
				}
			);
			$("#edit-field-preffered-locations-google button").mousedown();
			$("#g_autocomplete").val("");
		}		
	}	
	
	var locations = new Array();
	function addMoreLocationFront(ele){
		var name = ele.val();
		if(name != ""){
			locations.push(name);
			$(".form-search #locations").prepend("<div class='item'><input title='" + name + "' data-toggle='tooltip' name='search-item' type='text' value='" + name + "'><span class='close' title='Delete' data-toggle='tooltip'></span></div>");
			setTimeout(function(){$('[data-toggle="tooltip"]').tooltip()}, 500);
			$(ele).val("");
			console.log(locations);
		}		
	}
	
	function showUpload(){
		if($("#edit-field-choose-photo-from-my-image table").length == 0){
			$("#edit-field-choose-photo-from-my-image").removeClass("active");
			$("#edit-field-image").show();
		}		
	}

	function showMediaUpload(){
		if($("#edit-field-image table").length == 0){
			$("#edit-field-image").removeClass("active");
			$("#edit-field-choose-photo-from-my-image").show();
		}else{
			$("#edit-field-image").addClass("active");
			$("#edit-field-choose-photo-from-my-image").hide();
		}	
	}
	
	jQuery(document).ajaxComplete(function(event, xhr, settings) {
    
		if($("body").hasClass("page-node-49")){
			showUpload();
			showMediaUpload();
		}
		$('[data-toggle="tooltip"]').tooltip(); 
	});
	
	function requiredInput(){
		$("label").each(function(){
				if($(this).hasClass("required")){
					if($(this).next().hasClass("selected")){
						if($(this).next().html().length == 0){
							$(this).parent().find(".error").show();
							$(this).parent().find(".error").css({"opacity": "1","width": "auto","height": "26px","bottom": "0px"});
							$("body").stop().animate({scrollTop:$("#general-details").offset().top}, '500', 'swing');
						}
					}else{
						if($(this).next().val() == ""){
							$(this).parent().find(".error").show();
							$(this).parent().find(".error").css({"opacity": "1","width": "auto","height": "26px","bottom": "0px"});
							$("body").stop().animate({scrollTop:$("#general-details").offset().top}, '500', 'swing');
						}						
					}
				}
			}
		)
	}
	
	function getLocationsFront(){
		var searchVal = $.cookie("searchVal");
		if(searchVal !== undefined){
			var res = searchVal.split("_");
			for( var i = 0; i < res.length - 1; i++ ) {
				if(res[i] != ""){
					$(".prefix #locations").prepend("<div class='item'><input title='" + res[i] + "' data-toggle='tooltip' name='search-item' type='text' value='" + res[i] + "'><span class='close' title='Delete' data-toggle='tooltip'></span></div>");
				}
			};
			$('[data-toggle="tooltip"]').tooltip();					
		}

	}
	
  Drupal.behaviors.social_login = {
    attach: function (context, settings) {
			getLocationsFront();
			$("#search-block-form input[type='text']").click(
				function(){
					$(".form-search .prefix").fadeIn(100);
				}
			);
			$("#search-block-form #close").click(
				function(){
					$(".form-search .prefix").fadeOut(100);
				}
			);
			$("#switcher .switch").click(
				function(){
					$(".switch").removeClass("active");
					$(this).addClass("active");
				}
			);
			$('[data-toggle="tooltip"]').tooltip(); 
			$('#overlay, #close').click(
				function(){
					$("#search-form").fadeOut(300, function(){
						$('#overlay').hide();
					});
				}
			);
			setTimeout(function(){
				$(".view-find-accomodation-pictures .owl-theme .owl-controls .owl-buttons").prepend("<span class='left'></span>");
				$(".view-find-accomodation-pictures .owl-theme .owl-controls .owl-buttons").prepend("<span class='right'></span>");
			}, 100);
			$("input").focus(
				function(){
					var ele = $(this);
					$(this).parent().find(".error").animate({
						opacity: 0,
						width: "0",
						height: "0",
						bottom: "0"
					}, 200, function() {
						$(this).parent().find(".error").hide();
					});
				}
			);
			$(".field-required.error").click(function(){
				var ele = $(this);
				$(this).animate({
						opacity: 0,
						width: "0",
						height: "0",
						bottom: "0"
					}, 200, function() {
						ele.parent().find("input").focus();
						ele.hide();
					});
					
			});
			if($('#g_autocomplete').length > 0){
				 var autocomplete = new google.maps.places.Autocomplete(
							/** @type {!HTMLInputElement} */(document.getElementById('g_autocomplete')),
							{
								types: ['geocode'],
								componentRestrictions: {country: "au"}
							});
			}
			if($('#search-code-input').length > 0){
				 var autocomplete = new google.maps.places.Autocomplete(
							/** @type {!HTMLInputElement} */(document.getElementById('search-code-input')),
							{
								types: ['geocode'],
								componentRestrictions: {country: "au"}
							});
			}
			if($("#edit-search-block-form--2").length > 0){
				 var autocomplete = new google.maps.places.Autocomplete(
							/** @type {!HTMLInputElement} */(document.getElementById('edit-search-block-form--2')),
							{
								types: ['geocode'],
								componentRestrictions: {country: "au"}
							});				
			}
			$(".panel-pane.pane-custom.pane-6").click(
				function(){
					$(".panel-pane.pane-custom.pane-6").fadeOut(100,function(){
						$(".pane-user-field-mobile .field-item").fadeIn(100);
					});
				}
			);			
			$(".show_mobile .text").click(
				function(){
					$(".show_mobile .text").fadeOut(100,function(){
						$(".show_mobile .phone").fadeIn(100);
					});
				}
			);
			$('#create-preferred-accomodation .add-more').click(function(){
				var ele = $(this);
				addMoreAccomodation(ele);
			});
			$(document).on('click', '#create-preferred-accomodation .selected .item span', function(){ 
				var name = $(this).prev().val();
				$("#create-preferred-accomodation select").find("option:contains('"+name+"')").removeAttr("disabled");
				$(this).parent().detach();
			}); 

			$("#with-g-point .add-more").click(function(){
				var ele = $(this);
				addMoreLocation(ele);
			});
			$("#g_autocomplete").one( "change",	function(){
					var ele = $(this);
					setTimeout(
						function(){
							addMoreLocation(ele);
						}, 500
					)
				}
			);			

			$(document).on('click', '#locations .item span', function(){ 
					var name = $(this).parent().find("input").val();
					$(this).parent().detach();
					locations.splice( $.inArray(name, locations), 1 );
				}
			);
			$("input[name=search_block_form]").change(function(){
					var ele = $(this);
					setTimeout(
						function(){
							addMoreLocationFront(ele);
						}, 500
					)
				}
			);
			$(document).on('click', '#with-g-point .selected .item span', function(){ 
					$(this).parent().detach();
					var loc = $(this).parent().find("input").val();
					$("#edit-field-preffered-locations-google tr").each(
						function(){
								if($(this).find("input").val() == loc){
									$(this).detach();
								}
						}
					);					
			});
			$("#edit-field-choose-photo-from-my-image .media-widget a").hover(
				function(){
					$("#edit-field-choose-photo-from-my-image label.control-label").css("text-decoration","underline");
				},
				function(){
					$("#edit-field-choose-photo-from-my-image label.control-label").css("text-decoration","none");
				}
			);
			$(".node-form.node-accomodation-form button.create-list").click(
				function(){
					var name = $("#tenant_name").val();
					var age = $(".tenant-age").val();
					var who = $(".represent-who select option:selected").html();
					var gender = $(".tenant-gender input[type=radio]:checked").next().find("span").html();
					var age = $("#tenant-age").val();
					var accomodation = new Array();
					$("#create-preferred-accomodation .selected .item").each(
						function(){
							accomodation.push($(this).find("input").val());
						}
					)
					if(accomodation.length == 0){
						accomodation.push($("#create-preferred-accomodation .selectBox-label").html());
					}
					var loc = new Array();
					$("#with-g-point .selected .item").each(
						function(){
							loc.push($(this).find("input").val());
						}
					)
					var rent = $("#weekly-rent").val();
					var move_date = $("#edit-submitted-move-date").val();
					var pLength = $("input[name=preffered-length-number]").val();
					var days = $("#preffered-length select option:selected").html();
					if(name != ""){$(".form-item-title input").val(name);}
					if(rent != ""){$("#edit-field-rent-budget input").val(rent);}
					if(name != ""){$("#edit-field-accomodation-name input").val(name);}
					if(who != ""){$("#edit-field-represent-who-und :contains('" + who + "')").attr("selected", "selected");}
					if(accomodation.length > 0){$.each(accomodation, function(key, value){
							$("#edit-field-accomodation select :contains('" + value + "')").attr("selected", "selected");
						});
					}
					if(gender != ""){$("#edit-field-gender-und :contains('" + gender + "')").attr("selected", "selected");}
					if(age != ""){$("#edit-field-age-und-0-value").val(age);}
					if(rent != ""){$("#edit-field-rent-budget").val(rent);}
					if(move_date != ""){$("#edit-field-move-date-und-0-value-datepicker-popup-0").val(move_date);}
					if(days != ""){
						$("#edit-field-preferred-stay-length-und-0-field-length-und :contains('" + days + "')").attr("selected", "selected");
						$("#edit-field-stay-length-term :contains('" + days + "')").attr("selected", "selected");
					}
					if(pLength != ""){
						$("#edit-field-preferred-stay-length input").val(pLength);
						$("#edit-field-stay-length-number input").val(pLength);
					}
					check = 0;
					$("#edit-field-preffered-locations-google input").each(
						function(){
								if($(this).val() != ""){
									check = 1;
								}
						}
					);
					if(check == 0){
						$("#edit-field-preffered-locations-google input").val($("#g_autocomplete").val());
					}
					
					requiredInput();
					if($(".field-required.error").css("display") == "block"){
						return false;	
					}					
				}
			);
			$("#edit-field-choose-photo-from-my-image a.button.browse").click(
				function(){
					$("#edit-field-image").hide();
					$("#edit-field-choose-photo-from-my-image").addClass("active");
				}
			);
			$(document).on('click', '.ui-dialog-titlebar-close', function(){ 
				showUpload();
			});			
			$(document).on('click', '.make_search', function(){
				console.log(locations);
				var locationsString = locations.join("_");
				var locationsStringType;
				if($(".switch.active").html() == "Rooms"){
					locationsString += "_rooms";
					locationsStringType += "rooms";
				}else{
					locationsString += "_flatmates";
					locationsStringType += "flatmates";
				}
				console.log(locationsString);
				$.cookie("searchType", locationsStringType, { path:'/' });
				$.cookie("searchVal", locationsString, { path:'/' });
				window.location.href = "/search/node";
			});
		}
	}
}(jQuery));