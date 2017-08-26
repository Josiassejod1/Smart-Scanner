		
		
		
		/*
		Function gets the value of the image selected. posts the value
		to the server for the clarifia API to use
		*/
		function getSrc(image)
		{
			var query = $(image).attr('src');
				$.ajax({
					url:'http://localhost:3000',
					data:{data:query},
					crossDomain:true 
					}).done(function(response)
						{
							console.log(response)
							//I take the response data, find the div and dynamically
							//replace it with the div in the ajax response
							//I need to re-add the event listener to the erased list
							var result = $(response).filter('.list-container');
							$(document).ready(function(){
								console.log(result);
								$('.list-container').html(result);
								radioEvent();
							});
						});
					}
			
			//Event listener that listenns to clicks from radio buttons to generate the memes based on options selected

			function radioEvent()
			{

			//Gets input from buttons on radio button and image based on predictions text selected
			$("input[type='radio']").on('change',function() 
			{
				if ($(this).is(':checked')) 
				{
					var giphyKey = config.GIPHY_API_KEY;
					var value = $("input[name='prediction']:checked").val();
					var baseURl = "http://api.giphy.com/v1/gifs/";
					var search = "search?q=";
					var query = value + "&";
					var apiKey = "api_key="+ giphyKey+"&limit=15&offset=5";
					var url = baseURl + search + query + apiKey;
			
			//Makes request to Giphy API
			$.ajax({
				url:url,
				type:'GET',
				crossDomain:true}).done(function(data){
					console.log(data);
					//This erases photos from the OLD GIPH and updates it with a new one
					if  ($('#giphy').children().length > 0)
					{
						var giphDiv = document.getElementById('giphy');
						while(giphDiv.firstChild)
						{
							giphDiv.removeChild(giphDiv.firstChild);
						}
					}

					
				
		  			for (var i = 0; i < data.data.length; i++)
		  			{	
       					var image_src = data.data[i].images.fixed_width.url;
       					$("#giphy").append('<img src='+ image_src+ ' id=giphy'+ i +' class=' + value + '>');
       				}
       			
       				});// end of ajax statement
					}//end of if checked selection
				});//end of jQuey change statement
			}//end of radioEvent function



			radioEvent();			
			



		var instaKey= config.INSTAGRAM_API_KEY;
		var profile_container = document.getElementById('profile_pics');

		/*
			Instagram API 
		*/
		$.ajax({
				url:'https://api.instagram.com/v1/users/self/media/recent/?access_token='+instaKey,
				type:'GET',
				crossDomain:true,
				dataType:'jsonp',
				success: function(data){
					 console.log(data);
					 var string = "";
					 string += "<div class='row'>";

					for (var i = 0 ; i < data.data.length; i++) 
					{
						var img_src = data.data[i].images.low_resolution.url;
						string += "<div class='col-md-3' id='col'>";
						string += '<img onclick= "getSrc(this)" src='+ img_src+ ' id=profile_pic' + i +'>';
						string += "</div>";

						//Formats string to have 4 images on one row
						if ((i+1)%4 == 0) {
							string += "</div>";
							string += "<div class='row'>";
						}
					}

					//Assignes the outted string tp the profile_pic div
					profile_container.innerHTML = string;	

				}
			});

		//Possible improvements, adding loading animation for loading Giphys

		