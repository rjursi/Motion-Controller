module.exports = function(app)
{
     app.get('/',function(req,res){
        res.sendFile(__dirname + '/index.html')
     });
     app.get('/res/js/lib/three.js',function(req,res){
        res.sendFile(__dirname + '/res/js/lib/three.js');
     });
	
	 app.get('/res/js/lib/socket.io-1.4.8.js',function(req,res){
        res.sendFile(__dirname + '/res/js/lib/socket.io-1.4.8.js');
     });
	
	 app.get('/res/js/main.js',function(req,res){
        res.sendFile(__dirname + '/res/js/main.js');
     });
	
	 app.get('/res/js/mainSocketHandle.js',function(req,res){
        res.sendFile(__dirname + '/res/js/mainSocketHandle.js');
     });
}