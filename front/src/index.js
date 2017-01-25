import 'file-loader?name=index.html!./index.html'
import 'style-loader!css-loader!./style.css'

import * as config              from './config'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'
import {create as createRenderer}       from './service/renderer'
import {create as createBus}            from './service/bus'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createRenderHandler}  from './handler/render'
import {create as createSwarmHandler}    from './handler/swarm'
import {create as createInterpolationHandler}  from './handler/interpolate'

import {create as createMenu, setVisible as setVisibleMenu}         from './handler/ui/menu'

// will be uncommented to build the standalone ( #yolo )
// #standalone require('../../back/src').create( require('../../back/src/config') )

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
                createInterpolationHandler( state, service ),
                // createSwarmHandler( state, service ),

            ])
        })
        .catch( err => console.log( err ))
}

{
    const loop = () => {

        service.bus && service.bus.emit('loop')

        requestAnimationFrame( loop )
    }
    loop()
}


document.getElementById('title').src = require('./assets/menu/logo.png')