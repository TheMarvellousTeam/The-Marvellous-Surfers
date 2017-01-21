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
import {create as createRun, render as renderRun, setVisible as setVisibleRun}   from './handler/ui/run'

// bootsrap
const state   = { surfers:[{ id:1, position: {x:50, y:0},velocity : {x:0, y:4} }, { id:2, position: {x:50, y:40},velocity : {x:10, y:4} }], waves:[], myId:1, gameState:'menu' }
const service = {}
{

    Promise.all([
        createController().then( x => service.controller = x ),
        createCom(config.com).then( x => service.com = x ),
        createRenderer(config.renderer).then( x => service.renderer = x ),
        createBus().then( x => service.bus = x ),
    ])
        .then( () =>
            Promise.all([

                createIoHandler( state, service ),
                createInputHandler( state, service ),
                // createMenu( state, service ),
                // createRun( state, service ),
                createRenderHandler( state, service ),

            ])
        )

}

{
    const loop = () => {

        service.bus && service.bus.emit('loop')

        requestAnimationFrame( loop )
    }
    loop()
}
