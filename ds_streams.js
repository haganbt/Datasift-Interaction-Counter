module.exports = {

  initDataSift: function (username, apikey, streamid) {
  	
  	if(consumer === undefined)
  		var consumer = new DataSift();	
  	
    if (consumer.request != null) {
		console.log('Connective active. Subscribing stream');
		consumer.subscribe(streamid)
	} else { 
		//Create a new instance of the DataSift consumer
		console.log('DEBUG: Establishing connection')
		consumer = new DataSift(username,apikey);		
		consumer.connect();
	}

	//Emitted when stream is connected
	consumer.on("connect", function() {
		console.log("Connected!");
		consumer.subscribe(streamid);
	});
	//Emitted when there is an error
	consumer.on("error", function(error) {
		console.log("Error: " + error.message);
	});
	//Emitted when there is a warning
	consumer.on("warning", function(message) {
		console.log("Warning: " + message);
	});
	//Emitted when disconnected
	consumer.on("disconnect", function() {
		console.log("Disconnected!");
	});
	//Emitted when an interaction is received
	consumer.on("interaction", function(obj) {
	
		if(obj.data !== undefined) {
			//console.log(obj.data);
			io.sockets.emit('data', {
				source : obj.data
			});
		}
	});
  }
};

