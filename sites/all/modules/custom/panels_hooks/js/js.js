/***/
(function ($) {
	
	function request(url, type){
		var value;
		if(type == "front"){
			value = $("#front_page_module .rows.property").length;
		}else{
			value = $("#search_module .rows.property").length;
		}		
		var limit = parseInt($("#all-property").val());
		var last_uid = 1;
		var ar = new Array();
		$("#more-results p span").show();
		if($(".last_user_id").length > 0){
			$(".last_user_id").each(function(){
				ar.push($(this).val());
			});
			last_uid = $(ar).get(-1);
		}
		$.ajax({
			url: url + value + "&lastuid=" + last_uid,
			success: function(result){
				$("#front_page_module ,#search_module").append(result);
				if(type == "front"){
					value = $("#front_page_module .rows.property").length;
				}else{
					value = $("#search_module .rows.property").length;
				}
				$("#more-results p span").hide();
				if(value == limit){
					$("#more-results").detach();
				}
			}
		});
	}	
	
	function searchRequest(url, type){
		var value;
		value = $("#search_module .rows." + type).length;
		if(type == "user"){
			var limit = parseInt($("#all-accomodation").val());
		}else{
			var limit = parseInt($("#all-property").val());
		}
		$("#more-results p span").show();
		$.ajax({
			url: url + value,
			success: function(result){
				$("#front_page_module ,#search_module").append(result);
				value = $("#search_module .rows."+type).length;
				$("#more-results p span").hide();
				if($("#watchdog").length > 0){
					$("#more-results").hide();
				}else{
					$("#more-results").fadeIn(500);
				}		
				
			}
		});
	}

  Drupal.behaviors.panels_hooksModule = {
    attach: function (context, settings) {
			if($("#cboxLoadedContent").length == 0){
				if($("#front_page_module").length > 0){
					var url = "/front_page_ajax.php?offset=";
					request(url, "front");
					$("#more-results p").click(function(){
						request(url, "front");
					});
				}else if($("#search_module").length > 0){
					var searchVal = $.cookie("searchVal");
					var searchType = $.cookie("searchType");
					var res = searchVal.split("_");
					var lastEl = res[res.length-1];
					var type;
					console.log("searchType " + searchType);
					if(searchType == "flatmates"){
						var url = "/search_page_flatmates.php?searchIndex=" + searchVal + "&offset=";
						type = "users";
						$(".switch.flatmates").addClass("active");
						$("#search-flatmates").show();
						$("#search-rooms").hide();
					}else{
						var url = "/search_page_rooms.php?searchIndex=" + searchVal + "&offset=";
						type = "property";
						$(".switch.rooms").addClass("active");
						$("#search-flatmates").hide();
						$("#search-rooms").show();						
					}
					for( var i = 0; i < res.length - 1; i++ ) {
						if(res[i] != ""){
							$(".search-form #locations").prepend("<div class='item'><input title='" + res[i] + "' data-toggle='tooltip' name='search-item' type='text' value='" + res[i] + "'><span class='close' title='Delete' data-toggle='tooltip'></span></div>");
						}
					};
					var gender, sort, minRent, maxRent, minAge, maxAge, acomodationTypes, minStay, maxStay, peopleTypes, professions,
					roomType, bathroomType, furnishing, features;
					searchRequest(url, type);
					$("#search-form #search-flatmates .form-action button").click(
						function(){
							searchVal = "";
							$("#search-code #locations .item").each(
								function(){
									searchVal += $(this).find("input").val()+"_";
								}
							);
							$.cookie("searchVal", searchVal, { path:'/' });
							$.cookie("searchType", "flatmates", { path:'/' });
							gender = $("#search-flatmates select[name=gender] option:selected").val();
							if(gender == "any"){gender = "";}
							sort = $("#search-flatmates select[name=sort-priority] option:selected").val();
							var minRent_ = $("#search-flatmates select[name=min-rent] option:selected").val();
							var maxRent_ = $("#search-flatmates select[name=max-rent] option:selected").val();
							acomodationTypes = $("#search-flatmates select[name=preferred-accomodation] option:selected").val();
							peopleTypes = $("#search-flatmates select[name=people-type] option:selected").val();
							professions = $("#search-flatmates select[name=professions-type] option:selected").val();
							var minAge_ = $("#search-flatmates input.min_age").val();
							var maxAge_ = $("#search-flatmates input.max_age").val();
							var minStay_ = $("#search-flatmates input.min_stay").val();
							var maxStay_ = $("#search-flatmates input.max_stay").val();
							$.cookie("searchVal", searchVal, { path:'/' });
							
							if(parseInt(minRent_) > parseInt(maxRent_)){
								minRent = maxRent_;
								maxRent = minRent_;
							}else{
								minRent = minRent_;
								maxRent = maxRent_;								
							}							
							if(parseInt(minAge_) > parseInt(maxAge_)){
								minAge = maxAge_;
								maxAge = minAge_;
							}else{
								minAge = minAge_;
								maxAge = maxAge_;								
							}							
							if(parseInt(minStay_) > parseInt(maxStay_)){
								minStay = maxStay_;
								maxStay = minStay_;
							}else{
								minStay = minStay_;
								maxStay = maxStay_;								
							}
							
							url = "/search_page_flatmates.php?searchIndex="+searchVal+"&gender="+gender+"&sort="+sort+"&minRent="+minRent+"&maxRent="+maxRent+"&acomodationTypes="+acomodationTypes+"&peopleTypes=";
							url += peopleTypes+"&professions="+professions+"&minAge="+minAge+"&maxAge="+maxAge+"&minStay="+minStay+"&maxStay="+maxStay;
							$("#search_module").html("");
							url +="&offset=";
							searchRequest(url, "users");
						}
					);				
					$("#search-form #search-rooms .form-action button").click(
						function(){
							searchVal = "";
							$("#search-code #locations .item").each(
								function(){
									searchVal += $(this).find("input").val()+"_";
								}
							);
							features = "";
							$.cookie("searchVal", searchVal, { path:'/' });
							$.cookie("searchType", "rooms", { path:'/' });
							sort = $("#search-rooms select[name=sort-priority] option:selected").val();
							minRent_ = $("#search-rooms select[name=min-rent] option:selected").val();//
							maxRent_ = $("#search-rooms select[name=max-rent] option:selected").val();//
							gender = $("#search-rooms select[name=gender] option:selected").val();//
							if(gender == "any"){gender = "";}							
							roomType = $("#search-rooms select[name=room-type] option:selected").val();
							bathroomType = $("#search-rooms select[name=bathroom-type] option:selected").val();
							furnishing = $("#search-rooms select[name=furnishing] option:selected").val();
							stayLength = $("#search-rooms select[name='preffered-stay-length'] option:selected").val();
							acomodationTypes = $("#search-rooms select[name='preferred-accomodation'] option:selected").val();
							if(parseInt(minRent_) > parseInt(maxRent_)){
								minRent = maxRent_;
								maxRent = minRent_;
							}else{
								minRent = minRent_;
								maxRent = maxRent_;								
							}								
							$(".checkbox input[type=checkbox]").each(
								function(){
									if($(this).is(':checked')){
										features +=	$(this).val() + "_";
									}
								}
							);
							url = "/search_page_rooms.php?searchIndex="+searchVal+"&gender="+gender+"&sort="+sort+"&minRent="+minRent+"&maxRent="+maxRent+"&acomodationTypes="+acomodationTypes+"&roomType=";
							url += roomType+"&bathroomType="+bathroomType+"&furnishing="+furnishing+"&stayLength="+stayLength+"&features="+features;
							$("#search_module").html("");
							url +="&offset=";
							console.log(url);
							searchRequest(url, "property");
						}
					);				
					$(".page-home #more-results p").click(function(){
						request(url, "search");
					});	
					$(".page-search-node #more-results p").click(function(){
						if($(".switch.flatmates").hasClass("active")){
							searchRequest(url, "users");
						}else{
							searchRequest(url, "property");
						}
					});
					//$("#search-code input[name=search_block_form]").val(searchVal);
					$("#switcher .switch.flatmates").click();
					$("a.search_form").click(
						function(){
							$("#overlay").fadeIn(200, function(){
								var top_ = $('html').offset().top;
								$("#search-form").css("top", top_ + "px");
								$("#search-form").show();
							});
							return false;
						}
					);
					$("#switcher .switch").click(
						function(){
							$("#search-flatmates").hide();
							$("#search-rooms").hide();
							if($(this).hasClass("rooms")){
								$("#search-rooms").show();
							}else{
								$("#search-flatmates").show();
							}
							$(".switch").removeClass("active");
							$(this).addClass("active");
						}
					);
				}
			}
		}
  };
}(jQuery));