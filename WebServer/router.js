module.exports = function(app)
{
	 app.get('/res/js/modelingData/*', function(req, res){
		 
		 res.sendFile(__dirname + req.path);
	 });
	
	
	 app.get('/node_modules/three/examples/js/libs/draco/*', function(req, res){
		 console.log(req.path);
		 res.sendFile(__dirname + req.path);
	 });
	
	
     app.get('/',function(req,res){
        res.sendFile(__dirname + '/index.html');
		
     });
	
	 app.get('/download', function(req, res){
		 res.sendFile(__dirname + '/download.html');
	 });
	
     app.get('/node_modules/three/build/three.js',function(req,res){
        res.sendFile(__dirname + '/node_modules/three/build/three.js');
     });
	 
	
	 
	 app.get('/node_modules/three/examples/js/loaders/GLTFLoader.js',function(req,res){
        res.sendFile(__dirname + '/node_modules/three/examples/js/loaders/GLTFLoader.js');
     });
	
	 app.get('/node_modules/three/examples/js/loaders/DRACOLoader.js',function(req,res){
        res.sendFile(__dirname + '/node_modules/three/examples/js/loaders/DRACOLoader.js');
     });
	
	 app.get('/node_modules/three/examples/js/controls/OrbitControls.js', function(req, res){
		 res.sendFile(__dirname + '/node_modules/three/examples/js/controls/OrbitControls.js');
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