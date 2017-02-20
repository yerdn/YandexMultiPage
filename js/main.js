( function () {
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
    ymaps.ready(init);
    var yandexCoords = [55.734152, 37.587904];

    function init() {
    	console.log("Yandex maps API loaded");
    	$("#next").bind({click: function(){
    		if(!moscowMap) {
    			console.log("Initializing yandex maps...");
    	        moscowMap = new ymaps.Map("mosMap", {
    	            center: yandexCoords,
    	            zoom: 12,
    	            type: 'yandex#hybrid'
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
    
    $("#create-route").bind({click: createRoute});
} () );