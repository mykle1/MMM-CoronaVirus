/* Magic Mirror
 * Module: MMM-CoronaVirus
 *
 * By Mykle1
 *
 */
Module.register("MMM-CoronaVirus", {

    // Module config defaults.
    defaults: {
        country: "",
        totalCasesColor: "",
        deathsColor: "",
        newCasesColor: "",
        recoveryColor: "",
        criticalColor: "",
        activeColor: "",
        useHeader: false,
        header: "",
        maxWidth: "100%",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        rotateInterval: 5 * 60 * 1000,
        updateInterval: 15 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-CoronaVirus.css"];
    },

    getScripts: function() {
        return ["moment.js"];
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

          var people = this.World.cases; // to slow things down so data arrives
          console.log(people);
        // worldTotals
        var worldTotals = document.createElement("div");
        worldTotals.classList.add("small", "bright", "worldTotals");
        worldTotals.innerHTML =
          "World cases = " + '<font color='+this.config.totalCasesColor+'>' +  people.toLocaleString() + '</font>' + " &nbsp &nbsp " +
          "World deaths = " + '<font color='+this.config.deathsColor+'>' + this.World.deaths.toLocaleString() + '</font>'  + " &nbsp &nbsp " +
          "World recoveries = " + '<font color='+this.config.recoveryColor+'>' + this.World.recovered.toLocaleString() + '</font>'  + " &nbsp &nbsp " +
          "Updated ~ " + moment.utc(this.World.updated).local().format('MMMM DD, YYYY ~ h:mm a');
        wrapper.appendChild(worldTotals);


        // singleCountry
        var choice = this.choice;
        var singleCountry = document.createElement("div");
        singleCountry.classList.add("small", "bright", "singleCountry");
        singleCountry.innerHTML = choice.country + " &nbsp &nbsp " +
            '<font color='+this.config.totalCasesColor+'>' + choice.cases.toLocaleString() + '</font>' + " total cases" + " &nbsp &nbsp " +
            '<font color='+this.config.newCasesColor+'>' + choice.todayCases.toLocaleString() + '</font>' + " new cases today" + " &nbsp &nbsp " +
            '<font color='+this.config.deathsColor+'>' + choice.deaths.toLocaleString() + '</font>' + " total deaths" + " &nbsp &nbsp " +
            '<font color='+this.config.deathsColor+'>' + choice.todayDeaths.toLocaleString() + '</font>'  + " deaths today" + " &nbsp &nbsp " +
            '<font color='+this.config.recoveryColor+'>' + choice.recovered.toLocaleString() + '</font>' + " recoveries" + " &nbsp &nbsp " +
            '<font color='+this.config.activeColor+'>' + choice.active.toLocaleString() + '</font>' + " active cases" + " &nbsp &nbsp " +
            '<font color='+this.config.criticalColor+'>' + choice.critical.toLocaleString() + '</font>' + " in critical condition" + " &nbsp &nbsp " +
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
                '<font color='+this.config.totalCasesColor+'>' + Virus.cases.toLocaleString() + '</font>' + " total cases" + " &nbsp &nbsp " +
                '<font color='+this.config.newCasesColor+'>' + Virus.todayCases.toLocaleString() + '</font>' + " new cases today" + " &nbsp &nbsp " +
                '<font color='+this.config.deathsColor+'>' + Virus.deaths.toLocaleString() + '</font>' + " total deaths" + " &nbsp &nbsp " +
                '<font color='+this.config.deathsColor+'>' + Virus.todayDeaths.toLocaleString() + '</font>' + " deaths today" + " &nbsp &nbsp " +
                '<font color='+this.config.recoveryColor+'>' + Virus.recovered.toLocaleString() + '</font>' + " recoveries" + " &nbsp &nbsp " +
                '<font color='+this.config.activeColor+'>' + Virus.active.toLocaleString() + '</font>' + " active cases" + " &nbsp &nbsp " +
                '<font color='+this.config.criticalColor+'>' + Virus.critical.toLocaleString() + '</font>' + " in critical condition" + " &nbsp &nbsp " +
                Virus.casesPerOneMillion.toLocaleString() + " cases per million";
            wrapper.appendChild(countryTotals);

        }
        return wrapper;
    },

    processVirus: function(data) {
        this.Virus = data.result;
        //console.log(this.Virus);

        this.choice = data.choice;
        //console.log(this.choice);
    },

    processWorld: function(data) {
        this.World = data;
        //console.log(this.World);
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
        this.getVirus();
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
        this.updateDom(this.config.initialLoadDelay);
    },
});
