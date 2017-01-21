import 'file-loader?name=index.html!./index.html'
import {create as createCom}    from './service/com'
import * as config              from './config'
import pixi 			from "pixi.js"

console.log('hello')

//createCom( config.com )
//    .then( () => 0 )

let state = {

	surfers:[
		{
			id:1,
			name:"Surfeur d'Argent",
			position: {x:0, y:50},
			velocity : {x:1, y:0}
		},
		{
			id:2,
			name:"Surfeur d'Or",
			position: {x:-120, y:10},
			velocity : {x:0, y:0}
		},
		{
			id:3,
			name:"Surfeur de Platine",
			position: {x:120, y:10},
			velocity : {x:0, y:0}
		}
	]

}

//Permet de definir l'id du joueur associe au client
let playerId = 1;

let surferSprites = {};

//Permet de definir l'etat du jeu (action a effectuer dans la game loop)
let gameState = play;


let 	Container 		= PIXI.Container,
	autoDetectRenderer 	= PIXI.autoDetectRenderer,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	TextureCache 		= PIXI.utils.TextureCache,
	Texture 		= PIXI.Textture,
	Sprite 			= PIXI.Sprite;

let 	stage = new Container(),
	renderer = autoDetectRenderer(512,512);

document.body.appendChild(renderer.view);

loader
	.add("surfer1","src/assets/surfer1.png")
	.add("surfer2","src/assets/surfer2.png")
	.load(setup);

function getSurfer(surferId) {

	return state.surfers.filter((surfer) => surfer.id == surferId)[0];

}


function setup(){
	
	let surferTexture = loader.resources.surfer1.texture;
	let playerTexture = loader.resources.surfer2.texture;
	
	state.surfers.forEach((item) => {
	
		let surferSprite = item.id == playerId
			?new Sprite(playerTexture)
			:new Sprite(surferTexture);

		stage.addChild(surferSprite);
		surferSprites[item.id] = surferSprite;
		
	});
	
	let playerSprite = surferSprites[playerId];
	playerSprite.x = renderer.width / 2 - (playerSprite.width /2);
	playerSprite.y = renderer.height * 0.66 - (playerSprite.height : 2);

	gameLoop();
}

function gameLoop() {

	requestAnimationFrame(gameLoop);

	gameState();

	renderer.render(stage);

}

function play() {
	
	state.surfers.forEach((surfer) => {
	
		let coords = computeCoords(surfer);
		surferSprites[surfer.id].x = coords.x;
		surferSprites[surfer.id].y = coords.y;

		surfer.position.x += surfer.velocity.x;
		surfer.position.y += surfer.velocity.y;
	});

}


//Cette fonction permet de definir le delta a appliquer au (position.x,position.y) d'une entite
//(sa position dans le monde) pour obtenir son (sprite.x,sprite.y) (sa position a l'ecran)
function computeCoords(entity) {

	let playerSprite = surferSprites[playerId];
	let player = getSurfer(playerId);

	let x = playerSprite.x + (entity.position.x - player.position.x);
	let y = playerSprite.y + (entity.position.y - player.position.y);
	
	return {x:x, y:y};
}
