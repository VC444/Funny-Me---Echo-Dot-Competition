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
            buildSpeechletResponse("Welcome to Fun Me. Say 'Tell a joke' and then your name.", false),
            {}
          )
        );
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`);
        
        switch (event.request.intent.name) {
            
        case "GetJoke":
            
        var name = event.request.intent.slots.userName.value
        var endpoint = `http://api.icndb.com/jokes/random?firstName=${name}&lastName=&exclude=[explicit]`
        var body = "";
            
         http.get(endpoint, (response) => {
            response.on('data', (chunk) => {body += chunk})
            response.on('end', () => {
                var data = JSON.parse(body);
                var randJoke = data.value.joke;
                context.succeed(
                    buildResponse(
                        buildSpeechletResponse(`${randJoke}`, false),
                        {}
                    )
                )
            })
        })
        break;
        
        case "AMAZON.HelpIntent":
            
            var message = "Fun Me is a skill that tells you Chuck Norris Jokes, but with a small change. It replaces the phrase 'Chuck Norris' with your name!" 
                        + " Just say 'Alexa, tell a joke', and then your first name. To hear another joke, say 'next' and then your name."
            
            context.succeed(
                buildResponse(
                    buildSpeechletResponse(`${message}`, false),
                    {}
                )
            )
        break;
        
        case "AMAZON.CancelIntent":
            context.succeed(
                buildResponse(
                    buildSpeechletResponse("Ok. Goodbye!", true),
                    {}
                )
            )
        break;
        
        case "AMAZON.StopIntent":
            context.succeed(
                buildResponse(
                    buildSpeechletResponse("Ok. Goodbye!", true),
                    {}
                )
            )
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

function buildResponse(speechletResponse, sessionAttributes) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
