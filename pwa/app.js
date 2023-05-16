(function () {
    'use strict';

    /**
     * app Object Contains all the interesting information concerning our app
     */

    var app = {

        /** @var isLoading Boolean Used to know when the app is loading */
        isLoading: true,

        // DOM elements
        html: $('html'),
        spinner: $('.loader'),
        header: $('header'),

        camera: $('#camera'),
        frame: $('#frame')
    };

    
    /** @var reader FileReader Will be used to read the content of the uploaded images */
    var reader = new FileReader();

    /**
     * remember_foto
     */
    var remember_foto = function () {
        if (window.localStorage && window.localStorage.getItem('fotoPWA')) {
            app.frame.attr('src', window.localStorage.getItem('fotoPWA'));
        }
    }

    reader.addEventListener('load', function () {
        app.frame.attr('src', reader.result);
        window.localStorage.setItem('fotoPWA', reader.result);
    }, false);

    app.camera.change(function (e) {

        /** @var file File Get the first (and only) file selected */
        var file = e.target.files[0];


        // Check the file type do avoid non images
        if (!file.type.match('image.*')) {
            vex.dialog.alert('You need to uploaded an image');
            return;
        }


        // Start reading the the file
        reader.readAsDataURL(file);

    });
    console.log(window.location.pathname);
    if(window.location.pathname.includes('index') || window.location.pathname == '/'){
        if ('getBattery' in navigator) {

            navigator.getBattery().then(function(battery) {
              vex.dialog.alert ({
                unsafeMessage: "Nivel de Bateria Actual: " + battery.level * 100 + "%" + '<br>' + "¿Cargando? " + battery.charging
            });
              
            });
        } 
    }

    // Remove loading
    if (app.isLoading) {
        app.spinner.attr('hidden', true);
        app.header.removeAttr('hidden');
        app.isLoading = false;
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }


    remember_foto();

})();
