module.exports = function(app)
{
     app.get('/',function(req,res){
        res.sendFile(__dirname + '/index.html');
		
     });
	
	 app.get('/download', function(req, res){
		 res.sendFile(__dirname + '/download.html');
	 });
	
     app.get('/node_modules/three/build/three.js',function(req,res){
        res.sendFile(__dirname + '/node_modules/three/build/three.js');
     });
	
	 app.get('/res/js/main.js',function(req,res){
        res.sendFile(__dirname + '/res/js/main.js');
     });
	
	 app.get('/res/js/mainSocketHandle.js',function(req,res){
        res.sendFile(__dirname + '/res/js/mainSocketHandle.js');
     });
	
	 app.get('/apkFile/blindness.apk', function(req,res){
		res.sendFile(__dirname + '/apkFile/blindness.apk'); 
	 });
}