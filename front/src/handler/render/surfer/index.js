import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/surfer/batch.png'),

    spriteSize  : { x:30, y:30 },
    origin      : { x:13.3 * 0.5, y:18.7 *0.9 },
    animationLength : [ 3,3,3 ],
})

export const create = ( state, { renderer, bus } ) => {

    const sprite_by_id = {}


    const getSprite = id => {

        if ( sprite_by_id[ id ] )
            return sprite_by_id[ id ]

        sprite_by_id[ id ] = createSprite()
        sprite_by_id[ id ].name = 'sufer'

        return sprite_by_id[ id ]
    }

    const update = ( surfers ) =>
        surfers.forEach( surfer => {

            const sprite = getSprite( surfer.id )

            if( !sprite.parent )
                renderer.scene.add( sprite )

            // update
            {
                // position
                sprite.position.x = surfer.position.x
                sprite.position.y = surfer.position.y


                // animation
                if ( surfer.velocity.x < -0.1 ) {
                    sprite.setState( 0 )

                } else if ( surfer.velocity.x > 0.1 ) {
                    sprite.setState( 1 )

                }else {

                    sprite.rotation.y = surfer.velocity.x

                    sprite.setState( 2 )
                }

            }

        })

    bus.on('loop', () => update( state.surfers || [] ))

}