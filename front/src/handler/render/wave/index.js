import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/wave/wave.png'),

    spriteSize  : { x:30, y:30 },
    animationLength : [ 3, 3, 3 ],
})

export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}


    const getSprite = id => {

        if ( object_by_id[ id ] )
            return object_by_id[ id ]

        object_by_id[ id ] = createSprite()
        object_by_id[ id ].name = 'sufer'

        return object_by_id[ id ]
    }

    const update = ( waves ) => {

        Object.keys( object_by_id )
            .filter( id => !waves.some( wave => id == wave.id ) )
            .forEach( id => {

                object_by_id[ id ].parent && object_by_id[ id ].parent.remove( object_by_id[ id ] )
                object_by_id[ id ].destroy()
                delete object_by_id[ id ]
            })

        waves.forEach( wave => {

            const sprite = getSprite( wave.id )

            if( !sprite.parent )
                renderer.scene.add( sprite )

            // update
            {
                // position
                sprite.position.x = wave.position.x
                sprite.position.y = wave.position.y


                // animation
                sprite.setState( 2 )

            }

        })
    }

    bus.on('loop', () => update( state.waves || [] ))

}
