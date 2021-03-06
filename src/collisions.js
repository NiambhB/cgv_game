"use strict";

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< C O L L I S I O N S ! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*/////////////////////////////////////////////////////////////////////////////////
	This function checks for collision of bounding boxes of alpha and the map buildings
	Called by collisions and randomMoveArray
	INPUT: object to check collision with
	OUTPUT: object array of suspected collisions with input objects
//////////////////////////////////////////////////////////////////////////////////*/
function buildingBoxCollision( object ){
	var suspectObjects = [];
	var objectBox = new THREE.Box3();
    objectBox.setFromObject( object );		//Computes the world-axis-aligned bounding box of an Object3D (including its children), accounting for the object's, and children's, world transforms

	for(var i = 0; i < worldMap.buildingBoxes.length; i++){
		if(objectBox.intersectsBox(worldMap.buildingBoxes[i])){
			suspectObjects.push(worldMap.buildings[i]);
		}
	}
	return suspectObjects;
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Function to check for collisions between player and buildings, collectibles and powerups
	Called by updateForFrame and alpha.respawn
	INPUT: none
	OUTPUT: none
	credit: // https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function  collisions() {
	var originPoint = player.position.clone();					// players position
	var suspectObjects = buildingBoxCollision(alpha);

	for (var vertexIndex = 0; vertexIndex < alpha.geometry.vertices.length; vertexIndex++){
		var localVertex = alpha.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( alpha.matrix );
		var directionVector = globalVertex.sub( alpha.position );
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var BuildingCollisionResults = ray.intersectObjects( suspectObjects , true );
		var PowerupsCollisionResults = ray.intersectObjects(powerups);
		var CollectibleCollisionResults = ray.intersectObjects(collectibles);

		// Check building collisions
		if (
			BuildingCollisionResults.length > 0 &&
			BuildingCollisionResults[0].distance < directionVector.length() - alpha.collisionLeeway  &&
			!BuildingCollisionResults[0].point.equals(new THREE.Vector3(0,0,0))
		){ // TODO: adjust this offset (-1 currently)
			console.log("hit");
			Explosion();
			break;
		}

		// Check Powerups[] collisions: if powerup 0,1,2 do stuff to alpha.stats, delete power up from powerupsarray, and remove from scene (maybe with a fancy animation):

		if (PowerupsCollisionResults.length > 0 && PowerupsCollisionResults[0].distance < directionVector.length()){
			//Check what type of powerup it was
			if(PowerupsCollisionResults[0].object.type == powerupTypes["gun"]){
				console.log("Gun"); //TODO: update alpha stats
			}else if(PowerupsCollisionResults[0].object.type == powerupTypes["invisible"]){
				console.log("Invisible"); //TODO: update alpha stats
			}else if(PowerupsCollisionResults[0].object.type == powerupTypes["gravity"]){
				console.log("Gravity"); //TODO: update alpha stats
			}

			PowerupsCollisionResults[0].object.activatePower();
			activePowerups.push(PowerupsCollisionResults[0].object);
			powerups.splice(powerups.indexOf (PowerupsCollisionResults[0].object), 1 );
			scene.remove(PowerupsCollisionResults[0].object);
		}

		// Check the Collectibles[] collisions: much like the powerups check above:
		if ( CollectibleCollisionResults.length > 0 && CollectibleCollisionResults[0].distance < directionVector.length() ){
			console.log(collectibles.indexOf (CollectibleCollisionResults[0].object) );
			collectibles.splice(collectibles.indexOf (CollectibleCollisionResults[0].object), 1 );
			scene.remove(CollectibleCollisionResults[0].object);
			score = score + 1000000
			collectibleCount++;

			if(collectibleCount == level.collectiblesToWin) {
				window.alert( "You won the level!");
				//currLevel++;
				restartGame(currLevel + 1);
				return;
				//TODO: win the level if all collectibles collected
			}
		}

	}// end for loop

} // end collision function

//END OF COLLISION FUNCTIONS
