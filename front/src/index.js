import 'file-loader?name=index.html!./index.html'
import * as config              from './config'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createMenuUI}         from './handler/ui/menu'
import {create as createUiRunHandler}   from './handler/ui/run'
import {render as renderUiRun}   from './handler/ui/run'

// bootsrap
const state   = { surfers:[{ id:1, position: {x:50, y:0},velocity : {x:0, y:4} }], waves:[], myId:1, gameState:'run' }
const service = {}
{

    Promise.all([
        createController().then( x => service.controller = x ),
        createCom(config.com).then( x => service.com = x ),
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

function gameLoop() {

	requestAnimationFrame(gameLoop);

	//gameState();
	switch(state.gameState){
	
		case "menu":
			break;

		case "run":
			renderUiRun();
			break;
	
	}

}



