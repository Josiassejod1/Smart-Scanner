
'use strict'
const $ = require('jquery');
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
//const LodashFilter = require('lodash.filter');
//const LodashTake = require('lodash.take');
const Clarifai = require('clarifai');
const async = require('async');
const Inert =  require('inert');
const Path = require('path');
const ENV = require('dotenv').config();

var apiKey = process.env.MACHINE_LEARNING_API_KEY;

const app = new Clarifai.App({
		apiKey: apiKey
	});

const server = new Hapi.Server();

server.connection({
	host: process.env.IP,
	port: process.env.PORT
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
		console.log(igSrc);
		var img_src = "";
		if (igSrc === undefined) {
			//Sets the first image that the prediction API recognizes from the API
			img_src = "http://dalvin.net/profile.jpg";
			} else {
				img_src = igSrc;
			}
    	 
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
