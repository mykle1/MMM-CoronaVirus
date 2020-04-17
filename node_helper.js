/* Magic Mirror
 * Module: MMM-CoronaVirus
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getVirus: function(url) {
        request({
            url: 'https://corona.lmao.ninja/v2/countries',
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                for (i = 0; i < result.length; i++) {
                    var Virus = result[i];
                    if (Virus.country == this.config.country) {
                        var choice = Virus;
                        this.sendSocketNotification('VIRUS_RESULT', {
                            result,
                            choice
                        });
                    }
                };
                this.getWorld();
            }
        });
    },

    getWorld: function(url) {
        request({
            url: 'https://corona.lmao.ninja/v2/all',
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                this.sendSocketNotification('WORLD_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_VIRUS') {
            this.getVirus(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
