import 'file-loader?name=index.html!./index.html'
import * as config              from './config'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'
import {create as createRenderer}       from './service/renderer'
import {create as createBus}            from './service/bus'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createRenderHandler}  from './handler/render'

import {create as createMenu, render as renderMenu, setVisible as setVisibleMenu}         from './handler/ui/menu'

// bootsrap
const state   = window.state = {
    surfers:[],
    waves:[],
    myId:1,
    gameState:'menu'
}
const service = {}
{

    Promise.all([
        createController().then( x => service.controller = x ),
        createCom(config.com).then( x => service.com = x ),
        createRenderer(config.renderer).then( x => service.renderer = x ),
        createBus().then( x => service.bus = x ),
    ])
        .then( () => {

		service.bus.on('changeGameState', (gameState) => {

			console.log('new game state : ' +gameState);
			switch(gameState) {

				case 'run':
					setVisibleMenu(false);
					break;

			}
		});

	}).then( () => {

            Promise.all([

                createIoHandler( state, service ),
                createInputHandler( state, service ),
                createMenu( state, service ),
                createRenderHandler( state, service ),

            ])
        })
        .catch( err => console.log( err ))
}

{
    let k = 0
    const loop = () => {

        k ++

        // if ( state.surfers[ 0 ] ) {
        //     state.surfers[ 0 ].position.y = k * 0.7
        //     state.surfers[ 0 ].velocity.x = Math.cos( k / 30 ) * 0.3
        //     state.surfers[ 0 ].position.x += state.surfers[ 0 ].velocity.x
        // }
        //
        // state.surfers[ 1 ].position.y = k * 0.7 + Math.sin( k / 70 ) * 20

        service.bus && service.bus.emit('loop')

        requestAnimationFrame( loop )
    }
    loop()
}
