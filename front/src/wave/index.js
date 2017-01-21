import 'file-loader?name=wave.html!./index.html'
import {drawWorld}                                      from './draw'
import {small_wave, horizontal_step, propagation_step}  from './phy'

const createWorld = (n, m=n) =>
    Array.from({ length: n })
    .map( (_,x) =>
        Array.from({ length: m })
        .map( (_,y) =>
            ({
                x,y,
                h:0,

                // transfert
                w:0,

                wh:0,
                wx:0,
                wy:0,
            })
        )
    )

const create = () => {

    const canvas    = document.createElement('canvas')
    const ctx       = canvas.getContext('2d')
    const container = document.getElementById('app')

    const {width, height} = container.getBoundingClientRect()

    canvas.width    = width
    canvas.height   = height

    container.appendChild( canvas )

    let world       = createWorld( 40, 40 )

    world[10][20].h = 30


    let k=0
    const loop = () => {

        world = small_wave( world )

        world = propagation_step( world )

        if ( Math.random() < 0.1 )
            world[Math.floor(Math.random()*world.length*0.3)][Math.floor(Math.random()*world[0].length)].h = 20

        if ( ( k++ ) % 40 == 0 )
            world[Math.floor(world.length*0.5)][Math.floor(world[0].length*0.5)].h = 20

        // world = horizontal_step( world )

        drawWorld( ctx, 10, world )

        requestAnimationFrame( loop )
        // setTimeout( loop, 100 )
    }

    loop()
}

create()
