import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/shark/shark.png'),

    spriteSize  : { x:30, y:30 },
    animationLength : [ 3, 3, 3 ],
})

export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}
    const sprite_by_id = {}


    const getSprite = id => {

        if ( object_by_id[ id ] )
            return object_by_id[ id ]

        object_by_id[ id ] = createSprite()
        object_by_id[ id ].name = 'shark'

        return object_by_id[ id ]
    }

    const update = ( sharks ) => {

        Object.keys( object_by_id )
            .filter( id => !sharks.some( shark => id == shark.id ) )
            .forEach( id => {

                object_by_id[ id ].parent && object_by_id[ id ].parent.remove( object_by_id[ id ] )
                object_by_id[ id ].destroy()
                delete object_by_id[ id ]
            })

        sharks.forEach( shark => {

            const sprite = getSprite( shark.id )

            if( !sprite.parent )
                renderer.scene.add( sprite )

            // update
            {
                // position
                sprite.position.x = shark.position.x
                sprite.position.y = shark.position.y


                // animation
                sprite.setState( 2 )

            }

        })
    }

    bus.on('loop', () => update( state.sharks || [] ))

}
