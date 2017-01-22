import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/wave/wave.png'),

    spriteSize  : { x:30, y:30 },
    animationLength : [ 3, 3, 3 ],
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

    const update = ( waves ) =>
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

    bus.on('loop', () => update( state.waves || [] ))

}
