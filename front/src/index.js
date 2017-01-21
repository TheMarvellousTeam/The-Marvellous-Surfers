import 'file-loader?name=index.html!./index.html'
import * as config              from './config'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createMenu, render as renderMenu, setVisible as setVisibleMenu}         from './handler/ui/menu'
import {create as createRun, render as renderRun, setVisible as setVisibleRun}   from './handler/ui/run'

// bootsrap
const state   = { surfers:[{ id:1, position: {x:50, y:0},velocity : {x:0, y:4} }], waves:[], myId:1, gameState:'menu' }
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
                createMenu( state, service ),
                createRun( state, service ),

            ])
        )
        .then( () => gameLoop() )

}

function gameLoop() {

	requestAnimationFrame(gameLoop);

	switch(state.gameState){

		case 'menu':
			setVisibleMenu(true);
			setVisibleRun(false);
			renderMenu();
			break;

		case 'run':
			setVisibleMenu(false);
			setVisibleRun(true);
			renderRun();
			break;

	}

}



