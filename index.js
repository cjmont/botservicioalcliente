var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAAZAIwAcSFfQBABBeNRZBynVy5ZBMAmv4vur1ZBpSL625T9yTjhl5xf43Uhcy635NVobTFOIUDVFugR0n4w02KgGbfxNrb8M410yc736QLY52GmCGyZCL8q2Cq3HbmzPDWC7Ka6ZBtJIKbzK13RSA5f7QkVbHPbC9fsQnzB0BVJ0RG4fYV6vpZA'

var app = express();
app.use(bodyParser.json());
app.listen(3000, function(){
    console.log('Servidor puerto 3000');
    
});

app.get('/', function(req, res){
   
    res.send('Bienvenido al bot');
});

app.get('/webhook', function(req, res){
    
    if(req.query['hub.verify_token'] === 'siriusblack'){
        res.send(req.query['hub.challenge']);
    }else{
        res.send("acceso no permitido");
    }
});

app.post('/webhook', function(req, res){

	var data = req.body;
	if(data.object == 'page'){

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){

			if(messagingEvent.message){
				receiveMessage(messagingEvent);
			}
		});
	});
	res.sendStatus(200);
  }
});

function receiveMessage(event){
	var senderID = event.sender.id;
	var messageText = event.message.text;

	
	evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId, message){
    var finalMessage = '';

	if(isContain(message, 'ayuda')){
		finalMessage = 'Como esta estimado(a) En que le puedo ayudar?';
	}else{
		finalMessage = ' Para propositos de evaluacion y calidad. Por favor expliqueme con mas detalle su consulta sobre:' + message;
	}

sendMessageText(recipientId, finalMessage);
}

function sendMessageText(recipientId, message){

	var messageData = {
		recipient : {
			id : recipientId

		},
		message: {
			text: message
		}

	};
	
	callSendAPI(messageData);
}

function callSendAPI(messageData){

request({
	uri: 'https://graph.facebook.com/v2.6/me/messages',
	qs : {access_token : APP_TOKEN},
	method: 'POST',	
	json: messageData
}, function(error, response, data) {

	if(error){
		console.log('no es posible eviar el mensaje');
	}else{

		console.log('mensaje enviado');
	}
});

}

function isContain(sentence, word){

	return sentence.indexOf(word)> -1;

}