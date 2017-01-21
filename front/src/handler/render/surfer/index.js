import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/surfer/batch.png'),

    spriteSize  : { x:13.3, y:18.7 },
    origin      : { x:13.3 * 0.5, y:18.7 *0.9 },
    animationLength : [ 3,3 ],
})

export const create = ( state, { renderer, bus } ) => {

    const sprite_by_id = {}


    const getSprite = id =>
        sprite_by_id[ id ] = ( sprite_by_id[ id ] || createSprite() )

    const update = ( surfers ) =>
        surfers.forEach( surfer => {

            const sprite = getSprite( surfer.id )

            if( !sprite.parent )
                renderer.scene.add( sprite )

            // update
            {
                // position
                sprite.position.x = 0
                sprite.position.y = 0

                // animation
                sprite.setState( 0 )
            }

        })

    bus.on('loop', () => update( state.surfers || [] ))

}