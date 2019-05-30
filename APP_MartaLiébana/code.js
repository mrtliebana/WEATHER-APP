
$(document).on("mobileinit", function(){


$(function(){


	    $("body").bind("swipeleft", function(e) {
	    $.mobile.changePage( '#principal', { transition: "slide" });
		});

		$("body").bind("swiperight", function(e) {
	    $.mobile.changePage( '#ciudades', { transition: "slide" });
		});




//PAG PRINCIPAL ----------------------------------------------
        
        
	//UBICACIÓN AL ENTRAR


	navigator.geolocation.getCurrentPosition(fn_ok, fn_error);  

	var latitud;
	var longitud;
	
	function fn_ok(respuesta) {
		latitud = respuesta.coords.latitude;
		longitud = respuesta.coords.longitude;
		var coordenada = latitud + ',' + longitud;
		
		$.ajax({  
    		url: 'http://api.openweathermap.org/data/2.5/weather?appid=c30a8e8d381444d15aaea2f332824848',
    		data: { lat:latitud, lon:longitud },
			success: function (tiempo) {

				  console.log(tiempo);

				let temperatura = tiempo.main.temp-272.15;
				temperatura = temperatura.toFixed(0); //para poner cuantos decimales quiero
			  
				let tempmax = tiempo.main.temp_max-272.15;
				tempmax = tempmax.toFixed(0);

				let tempmin = tiempo.main.temp_min-272.15;
				tempmin = tempmin.toFixed(0);



				//let f = new Date();
				//document.getElementById('mañana').innerHTML=f.getHours(),f.getMinutes(), f.getSeconds();

				  
				$("#ciudad").html(tiempo.name);
				$("#iconito").html("<img class='sol' src='icon/"+ tiempo.weather[0].icon +".png' >");
				$("#grados").html(temperatura+'º');
				$("#tiempo").html(tiempo.weather[0].description);
				$("#rango").html(tempmax +'º'+' / '+ tempmin +'º');
				$("#humedad").html('Humedad - ' + tiempo.main.humidity + '%');
				$("#viento").html('Viento - ' + tiempo.wind.speed + ' km/h');



			//PAG CIRCULOS ------------
				

				  
				
				
				

				
    		},
    		error: function(textStatus, errorThrown ){
				alert("Lo sentimos ha habido un error: " + errorThrown);
    		}
		});
	}

	function fn_error(fallo) {
		alert('Hubo un problema al consultar los datos:' + fallo.message)
	}



$("#circulos").on("pageinit",function(){
	//let lista = '';
	// trae datos del storage
	let ciudades = JSON.parse(localStorage.getItem('ciudades'));
	
	if(ciudades == null){
		ciudades = [];
	}else{
		console.log(ciudades);
		$.each(ciudades, function (ind, elems) {
			$("#listaguardados").append("<li class='item'><a href='#'>"+ ciudades[ind]+"</a></li>");
			//lista += "<li class='item'><a href='#'>"+ ciudades[ind]+"</a></li>";
			
		});
		console.log(lista);
		//$("#listaguardados").append(lista);
		$("#listaguardados").listview( "refresh" );
		$("#listaguardados").trigger( "updatelayout");
	}
});

//BUSCADOR-----------------------------------------------
	

		$("#ciudades").on("pageinit", function(){


			//--------- prueba localstorage

		
			
	
				//comprobar si hay datos en el storage
				//if (typeof ciudades.length != 0){
				// si es que si -> volcar datos de el storage
				// para eso, recorrer ciudades y pintarlas en #listaguardados

				//$.each(ciudades, function (ind, elems) { 
				//	elems += "<li>" + ciudades[ind] + "</li>";
				//});

				//$("#listaguardados").append(elems);
				//$("#listaguardados").listview( "refresh" );
			
			   ///}else{
				//$.mobile.changePage("#ciudades", {transition: "slideup"});
			   //}

			  
	


			//--------- prueba localstorage


		 		$( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
		        var $ul = $( this ),
		            $input = $( data.input ),
		            value = $input.val(),
		            html = "";
		        $ul.html( "" );

		        if ( value && value.length > 2 ) {
		            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
		            $ul.listview( "refresh" );
		            $.ajax({
		                url: "http://gd.geobytes.com/AutoCompleteCity",
		                dataType: "jsonp",
		                crossDomain: true,
		                data: {
		                    q: $input.val()
		                }
		            })
		            .then( function ( response ) {
		                $.each( response, function ( i, val ) {
		                    html += "<li>" + val + "</li>";
		                });
		                $ul.html( html );
		                $ul.listview( "refresh" );
		               // $ul.trigger( "updatelayout");
		            });
		        }
		    });


		 });





 // al hacer click en la ciudad ir a la pagina principal con los datos nuevos

$("#listaguardados").on('click', 'li', function() {


	$.mobile.changePage("#principal", {transition: "slideup"});
	

			$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?appid=c30a8e8d381444d15aaea2f332824848',
			data: { q: $(this).text(), units: "metric" },
			success: function (response) {

				console.log(response);

				let temperatura = response.main.temp;
				temperatura = temperatura.toFixed(0); //para poner cuantos decimales quiero
			  
				let tempmax = response.main.temp_max;
				tempmax = tempmax.toFixed(0);

				let tempmin = response.main.temp_min;
				tempmin = tempmin.toFixed(0);


				  
				$("#ciudad").html(response.name);
				$("#grados").html(temperatura+'º');
				$("#tiempo").html(response.weather[0].description);
				
				$("#rango").html(tempmax +'º'+' / '+ tempmin +'º');
				$("#humedad").html('Humedad - ' + response.main.humidity + '%');
				$("#viento").html('Viento - ' + response.wind.speed + ' km/h');
				

				
				
			},
			error: function(textStatus, errorThrown ){
				alert(" Ha habido un error al cargar la página " + errorThrown);
			}
		});
	});




				// AÑADIR CIUDAD -------------------------------------------------------

	// Pillar los datos de la ciudad que haces click

	$(document).on('click', '#autocomplete li', function() {


		// pintar en el html los datos de la ciudad que haces click 
	
		let ciudad = "<li><a href='#'>" + $(this).text() + "</a></li>";
		$("#listaguardados").append(ciudad);
		$("#listaguardados").listview( "refresh" );


	//--------- prueba localstorage

		// traer valor actual del storage
		let ciudades = JSON.parse(localStorage.getItem('ciudades'));
		if(ciudades == null){
			ciudades = [];
		}
		// añadir en el array nueva ciudad
		ciudades.push($(this).text());
		

		// escribir en el storage el array
		localStorage.setItem('ciudades', JSON.stringify(ciudades));


		$.mobile.changePage("#circulos", {transition: "slideup"});


	//--------- prueba localstorage


	
	
		//	localStorage
		
		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?appid=c30a8e8d381444d15aaea2f332824848',
			data: {
				q: $(this).text()
			}
		})
		
		
		
		.then( function ( response ) {
			console.log(response);
					
		});
								
	});



});

});