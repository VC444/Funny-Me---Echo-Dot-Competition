'use strict';

var http = require('http');

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        context.succeed(
          buildResponse(
            buildSpeechletResponse("Welcome to an Alexa Skill, this is running on a deployed lambda function", true),
            {}
          )
        );
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`);
        
        switch (event.request.intent.name) {
            
        case "GetJoke":

        var endpoint = "http://api.icndb.com/jokes/random?firstName=Vig&lastName=nesh&exclude=[explicit]"
        var body = "";
        
        http.get(endpoint, (response) => {
            response.on('data', (chunk) => {body += chunk})
            response.on('end', () => {
                var data = JSON.parse(body);
                var randJoke = data.value.joke;
                context.succeed(
                    buildResponse(
                        buildSpeechletResponse(`${randJoke}`, true),
                        {}
                    )
                )
            })
        })
        break;
        
        default:
            throw "Invalid intent"
        }
        break;
        
      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

};


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(output, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
