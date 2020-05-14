// 오브젝트의 위치를 공통으로 설정할 객체로 사용할 예정


// 맵 하나의 객체를 만드는 용도로 사용 
function BaseObject() {
  this.objStatus = {};
	
  // 공통 오브젝트 위치 값
  this.objStatus.x = 0;
  this.objStatus.y = 0;
  this.objStatus.z = 0;
	
	
  // 공통 오브젝트 회전각 값
  this.objStatus.r_x = 0;
  this.objStatus.r_y = 0;
  this.objStatus.r_z = 0;
	
	
  // 공통 오브젝트 사이즈값	
  this.objStatus.sizeX = 0;
  this.objStatus.sizeY = 0;
  this.objStatus.sizeZ = 0;
}


module.exports = BaseObject;