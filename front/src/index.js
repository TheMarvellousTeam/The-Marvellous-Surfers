import 'file-loader?name=index.html!./index.html'
import * as config              from './config'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createMenuUI}         from './handler/ui/menu'
import {create as createUiRunHandler}   from './handler/ui/run'

// bootsrap
const state   = { surfers:[{ id:1, position: {x:50, y:0},velocity : {x:0, y:4} }], waves:[], myId:null }
const service = {}
{

    Promise.all([
        createController().then( x => service.controller = x ),
        createCom().then( x => service.com = x ),
    ])
        .then( () =>
            Promise.all([

                createIoHandler( state, service ),
                createInputHandler( state, service ),
                createMenuUI( state, service ),
                createUiRunHandler( state, service ),
            ])
        ).then( () =>
		gameLoop()
	)

}

//Permet de definir l'id du joueur associe au client
let playerId = 1;


//Permet de definir l'etat du jeu (action a effectuer dans la game loop)
let gameState = play;







function gameLoop() {

	requestAnimationFrame(gameLoop);

	gameState();

	renderer.render(stage);

}

//Cette fonction decrit les actions a effectuer lorsque le joueur est en train de jouer
function play() {



	[...state.surfers, ...state.waves, waterBackground].forEach((entity) => {

		const coords = computeCoords(entity);
		sprites[entity.id].x = coords.x;
		sprites[entity.id].y = coords.y;

		entity.position.x += entity.velocity.x;
		entity.position.y += entity.velocity.y;
	});

}



//Cette fonction permet de definir le delta a appliquer au (position.x,position.y) d'une entite
//(sa position dans le monde) pour obtenir son (sprite.x,sprite.y) (sa position a l'ecran)
function computeCoords(entity) {

	const playerSprite = sprites[playerId];
	const player = getSurfer(playerId);

	const x = playerSprite.x + (entity.position.x - player.position.x);
	const y = playerSprite.y - (entity.position.y - player.position.y);

	return {x:x, y:y};
}
