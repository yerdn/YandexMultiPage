//( function () {
	var moscowMap = undefined;
	
	removeMap = function() {
		if(moscowMap) {
			console.log("Destroying map");
    		moscowMap.destroy();
    		moscowMap = undefined;
    	}
	}
	
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "welcome-page" ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
            	removeMap();
                window.history.back();
            }
        }
    } );
    
    //Yandex map
    console.log("Loading yandex maps API...");
    //ymaps.ready(init);
    var yandexCoords = [55.734152, 37.587904];

    function init() {
    	console.log("Yandex maps API loaded");
    	$("#next").bind({click: function(){
    		if(!moscowMap) {
    			console.log("Initializing yandex maps...");
    	        moscowMap = new ymaps.Map("mosMap", {
    	            center: yandexCoords,
    	            zoom: 12,
    	            type: 'yandex#hybrid',
    	            controls: []
    	        });
    	        console.log("Initialization complete");
    	        
    	        var placemark = new ymaps.Placemark(yandexCoords, {
    	        	iconCaption: 'Yandex Head Office',
    	        	hintContent: 'Ulitsa Lva Tolstogo 16, Moscow, Russia 119021'
    	        }, {
    	            preset: "islands#redDotIconWithCaption",
    	        });
    	        moscowMap.geoObjects.add(placemark);
    		}
    	}});
    	
    	$("#back").bind({click: function(){
    		removeMap();
    	}});       
    }
    
    createRoute = function() {
    	console.log("Creating route...");
    	var options = {enableHighAccuracy: false, maximumAge: 0, timeout: 10000};

    	function successCallback(position)
    	{
    		var start = [position.coords.latitude, position.coords.longitude];
//    		var start = [55.817465, 37.569150];
    		console.log("Starting position: ", start);
    		var multiRoute = new ymaps.multiRouter.MultiRoute({
    	        referencePoints: [
    	            start,
    	            yandexCoords
    	        ],
    	        params: {
    	            results: 1
    	        }
    	    }, {
    	        boundsAutoApply: true
    	    });
    		
    		moscowMap.geoObjects.add(multiRoute);
    	}

    	function errorCallback(error)
    	{
    		console.log("ERROR(" + error.code + "): "+ error.message);
    		alert("Couldn't find current location: " + error.message);
    	}

    	navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    	
    }
    
    activateButton = function(active) {
    	$('.map-type').removeClass('active');
    	$(active).addClass('active');
    }
    
    $("#create-route").bind({click: createRoute});
    
    $("#type-map").bind({click: function(){
    	activateButton(this);
    	moscowMap.setType('yandex#map');
    }});
    $("#type-satellite").bind({click: function(){
    	activateButton(this);
    	moscowMap.setType('yandex#satellite');
    }});
    $("#type-hybrid").bind({click: function(){
    	activateButton(this);
    	moscowMap.setType('yandex#hybrid');
    }});
    
    $("#current-location").bind({click: function(){
    	console.log("Finding current location...");
    	
    	var options = {enableHighAccuracy: false, maximumAge: 0, timeout: 10000};

    	function successCallback(position)
    	{
    		var currentCoords = [position.coords.latitude, position.coords.longitude];
    		console.log("Current Location: ", currentCoords);
    		
    		moscowMap.setCenter(currentCoords);
    		
    		var placemark = new ymaps.Placemark(currentCoords, {
    			balloonContentBody: 'My Current Location'
	        }, {
	            preset: "islands#blueCircleIcon",
	        });
	        moscowMap.geoObjects.add(placemark);
    	}

    	function errorCallback(error)
    	{
    		console.log("ERROR(" + error.code + "): "+ error.message);
    		alert("Couldn't find current location: " + error.message);
    	}

    	navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }});
    
    var actualProvider;
    $("#traffic").bind({click: function() {
    	var text = $(this).text();
    	console.log("Clicked " + text);
    	if(!actualProvider) {
    	// Creating a "Now" traffic provider with the layer of information points enabled.
    		actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
    	}
    	
    	if(text === 'Show Traffic') {
    		// And then adding it to the map.
            actualProvider.setMap(moscowMap);
            $(this).text('Hide Traffic');
    	} else {
            actualProvider.setMap(null);
    		$(this).text('Show Traffic');
    	}
    }});
    
//} () );