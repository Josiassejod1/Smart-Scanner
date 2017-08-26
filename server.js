
'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
const Clarifai = require('clarifai');
const async = require('async');
const Inert =  require('inert');
const Path = require('path');
const ENV = require('dotenv').config();






var apiKey = process.env.MACHINE_LEARNING_API_KEY;
var host = process.env.DB_HOST;
var port = process.env.DB_PORT;
var IG_Key = process.env.INSTAGRAM_API_KEY;

const app = new Clarifai.App({
		apiKey: apiKey
	});

const server = new Hapi.Server({
	connections: {
        routes: {
            files: {
                relativeTo: __dirname
            }
        }
    }
});

//Utilized hapi.js server as connection

server.connection({
	host: host,
	port: port
});

//Gets index.html route
server.register([Vision, Inert], (err) => {
	server.views({
		engines:{
			html: Handlebars
		},
		relativeTo: __dirname,
		path: './view'
	});
});

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
    	directory: {
        	path : __dirname,
        	listing:true,
    	},
    
    }
});


//Starts up server

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});

//Gets updated predictions from API
		
		
server.route({
	method :'GET',
	path: '/',
	handler: function(request, reply) {

		//Gets on src url for the image that is clicked.
		var igSrc = request.query.data;
		var img_src = "";
		if (igSrc === undefined) {
			//Sets the first image that the prediction API recognizes from the API
			img_src = 'http://www.whatitreatedtoday.com/wp-content/uploads/2014/02/SnowshoeCatLayingDown.ashx_-e1392572276122.jpeg';
			} else {
				img_src = igSrc;
			}
		//Outputs predictions from the program
		app.models.predict(Clarifai.GENERAL_MODEL, img_src).then(
  			function(response) {
   				//Outputs a collections of predictions
   				for (var i = 0 ; i < response.rawData.outputs[0].data.concepts.length; i++)	{
    					if  (response.rawData.outputs[0]
    						.data.concepts[i]["value"] > 0.9000000)	{
    							console.log(response.rawData.outputs[0].data.concepts[i]["name"]);	
    							
    					}
   					}
   				response = response.rawData.outputs[0].data.concepts;
   				//Uses handlebar.js templating system to output data to client side
   				reply.view('index', {prediction:response});
   				});
			}
		});

	
		//Test output to return outputs for predictions
  		//		Outputs prediction to console for testing purpose
    				
   				

