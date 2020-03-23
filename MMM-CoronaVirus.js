/* Magic Mirror
 * Module: MMM-CoronaVirus
 *
 * By Mykle1
 *
 */
Module.register("MMM-CoronaVirus", {

    // Module config defaults.
    defaults: {
        useHeader: false, // False if you don't want a header
        header: "", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 0, // fade speed
        initialLoadDelay: 1250,
        retryDelay: 2500,
        rotateInterval: 5 * 60 * 1000,
        updateInterval: 30 * 60 * 1000,
        country: "USA", // Country to always be shown
    },

    getStyles: function() {
        return ["MMM-CoronaVirus.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        //  Set locale.
        this.Virus = [];
        this.World = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Maintain Social Distance . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }



        // worldTotals
        var worldTotals = document.createElement("div");
        worldTotals.classList.add("small", "bright", "worldTotals");
        worldTotals.innerHTML = "World Totals as of &nbsp " + moment().format('h:mm a') + " &nbsp &nbsp " +
            this.World.cases.toLocaleString() + " cases" + " &nbsp &nbsp " +
            this.World.deaths.toLocaleString() + " deaths" + " &nbsp &nbsp " +
            this.World.recovered.toLocaleString() + " recovered";
        wrapper.appendChild(worldTotals);


        // singleCountry
        var choice = this.choice;
        var singleCountry = document.createElement("div");

        singleCountry.classList.add("small", "bright", "singleCountry");
        singleCountry.innerHTML = choice.country + " &nbsp &nbsp " +
            choice.cases.toLocaleString() + " total cases" + " &nbsp &nbsp " +
            choice.todayCases.toLocaleString() + " new cases today" + " &nbsp &nbsp " +
            choice.deaths.toLocaleString() + " total deaths" + " &nbsp &nbsp " +
            choice.todayDeaths.toLocaleString() + " deaths today" + " &nbsp &nbsp " +
            choice.recovered.toLocaleString() + " recoveries" + " &nbsp &nbsp " +
            choice.active.toLocaleString() + " active cases" + " &nbsp &nbsp " +
            choice.critical.toLocaleString() + " in critical condition" + " &nbsp &nbsp " +
            choice.casesPerOneMillion.toLocaleString() + " cases per million";
        wrapper.appendChild(singleCountry);



        // loop through the obects
        var keys = Object.keys(this.Virus);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var Virus = this.Virus[keys[this.activeItem]];

            // totals by country
            var countryTotals = document.createElement("div");
            countryTotals.classList.add("small", "bright", "countryTotals");
            countryTotals.innerHTML =
                Virus.country + " &nbsp &nbsp " +
                Virus.cases.toLocaleString() + " total cases" + " &nbsp &nbsp " +
                Virus.todayCases.toLocaleString() + " new cases today" + " &nbsp &nbsp " +
                Virus.deaths.toLocaleString() + " total deaths" + " &nbsp &nbsp " +
                Virus.todayDeaths.toLocaleString() + " deaths today" + " &nbsp &nbsp " +
                Virus.recovered.toLocaleString() + " recoveries" + " &nbsp &nbsp " +
                Virus.active.toLocaleString() + " active cases" + " &nbsp &nbsp " +
                Virus.critical.toLocaleString() + " in critical condition" + " &nbsp &nbsp " +
                Virus.casesPerOneMillion.toLocaleString() + " cases per million";
            wrapper.appendChild(countryTotals);

        }
        return wrapper;
    },

    processVirus: function(data) {
        this.Virus = data.result;
        this.choice = data.choice;
        this.loaded = true;
    },

    processWorld: function(data) {
        this.World = data;
        this.loaded = true;
    },

    scheduleCarousel: function() {
          console.log("Carousel of CoronaVirus fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getVirus();
        }, this.config.updateInterval);
        this.getVirus(this.config.initialLoadDelay);
    },

    getVirus: function() {
        this.sendSocketNotification('GET_VIRUS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "VIRUS_RESULT") {
            this.processVirus(payload);
        }
        if (notification === "WORLD_RESULT") {
            this.processWorld(payload);
        }
        if (this.rotateInterval == null) {
            this.scheduleCarousel();
        }
        this.updateDom(this.config.animationSpeed);
        this.updateDom(this.config.initialLoadDelay);
    },
});
