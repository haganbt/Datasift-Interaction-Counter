
module.exports = function(app){

    app.get('/', function(req, res){
        res.render('index', {
            title: 'Express'
        });
    });

    app.post('/submit', function(req, res){     
		var response_message = ''
      	var username = req.body.username;
      	var apikey = req.body.apikey;
      	var streamid = req.body.streamid;
      	if (username == '' || apikey == '' || streamid == ''){
      		response_message = 'Missing Parameters';
      		console.log("DEBUG: Missing creds.");
      	} else {
      		console.log("DEBUG: Submitting creds.");
      		ds.initDataSift(username, apikey, streamid);
      	}

        res.render('index', {
            title: 'Express',
            message: response_message
        });

    });
}