import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/surfer/sprites.png'),

    spriteSize  : { x:13.3, y:18.7 },
    origin      : { x:13.3 * 0.5, y:18.7 *0.9 },
    animationLength : [ 3 ],
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
                sprite.setState( 0 )
                // sprite.setState( surfer.velocity.x > 0 ? 1 : 0 )
            }

        })

    bus.on('loop', () => update( state.surfers || [] ))

}