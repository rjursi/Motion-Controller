var xSpeed = 0.5;
var ySpeed = 0.5;
var zSpeed = 0.5;

let keyPressMap = []
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
	
	keyPressMap[keyCode] = true;
    if (keyCode === 87) {
		if(keyPressMap[32] === true){
			forFindMesh.position.z -= zSpeed;	
		}else{
			forFindMesh.position.y += ySpeed;		
		}
		
	
    } else if (keyCode == 83) {
    	
		
		if(keyPressMap[32] === true){
			forFindMesh.position.z += zSpeed;	
		}else{
			forFindMesh.position.y -= ySpeed;	
		}
		
    } else if (keyCode == 65) {
        forFindMesh.position.x -= xSpeed;
    } else if (keyCode == 68) {
        forFindMesh.position.x += xSpeed;
    } 
	
	console.info(`mesh location : ${forFindMesh.position.x}, ${forFindMesh.position.y}, ${forFindMesh.position.z}`);
};


document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    var keyCode = event.which;
	
	keyPressMap[keyCode] = false;
   
};
