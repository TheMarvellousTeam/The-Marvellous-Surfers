import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
        image       : require('../../../assets/boey/boey.png'),

        spriteSize  : { x:30, y:30 },
        animationLength : [ 3 ],
    })


export const create = ( state, { renderer, bus } ) => {

    /*
    ;[ 100, -100 ].map( x => {

        const l = 1000
        const geo = new THREE.PlaneBufferGeometry( 30, l )

        const _sprite = createSprite()
        _sprite.setState(0)

        const sprite = new THREE.Mesh( geo, _sprite.material )

        sprite.material.map.repeat.set( 1 / 3, l / 30 )
        sprite.position.z = -9
        sprite.position.x = x
        sprite.position.y = l/2


        renderer.scene.add( sprite )
    })
    */
    const object_by_id = {}


    const getSprite = id => {

        if ( object_by_id[ id ] )
            return object_by_id[ id ]

        object_by_id[ id ] = createSprite()
        object_by_id[ id ].name = 'boey'

        return object_by_id[ id ]
    }

    let boeys = [];

    ;[-1,1].forEach(x => {
    for(let i = 0; i < 100; ++i) {
    	
	let boey = {
		position : {
			x : 100*x,
			y : 30  *  i
		},
		id:(Math.random().toString(32).slice(2))
	}
	boeys.push(boey);
    
    }
    });
    const update = () => {
	/*
        Object.keys( object_by_id )
            .filter( id => !waves.some( wave => id == wave.id ) )
            .forEach( id => {

                object_by_id[ id ].parent && object_by_id[ id ].parent.remove( object_by_id[ id ] )
                object_by_id[ id ].destroy()
                delete object_by_id[ id ]
            })
	*/

        boeys.forEach( boey => {

            const sprite = getSprite( boey.id )

            if( !sprite.parent )
                renderer.scene.add( sprite )

            // update
            {
                // position
                sprite.position.x = boey.position.x
                sprite.position.y = boey.position.y - state.cammera_offset_y


                // animation
                sprite.setState( 0 )

            }

        })
    }
    bus.on('loop', () => update())

}
