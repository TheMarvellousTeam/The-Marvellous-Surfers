import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'
import {create as createText}                   from './text'

const createSprite = createSpriteFactory({
    image       : require('../../../assets/surfer/batch.png'),

    spriteSize  : { x:30, y:30 },
    animationLength : [ 3,3,3 ],
})

export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}


    const getObject = surfer => {

        if ( object_by_id[ surfer.id ] )
            return object_by_id[ surfer.id ]

        const object = new THREE.Object3D()
        object.name = 'surfer'


        {
            const sprite = createSprite()
            object.add( sprite )

            object.destroy  = sprite.destroy
            object.setState = sprite.setState
        }
        {
            const text = createText( surfer.name )

            text.position.z = 5
            text.position.x = 50
            text.scale.x = 0.3
            text.scale.y = 0.3

            object.add( text )
        }

        return object_by_id[ surfer.id ] = object
    }

    const update = ( surfers ) =>
        surfers.forEach( surfer => {

            const object = getObject( surfer )

            if( !object.parent )
                renderer.scene.add( object )

            // update
            {
                // position
                object.position.x = surfer.position.x
                object.position.y = surfer.position.y


                // animation
                if ( surfer.velocity.x < -0.25 ) {

                    object.rotation.z = - ( surfer.velocity.x + 0.25 ) * 0.4

                    object.setState( 1 )

                } else if ( surfer.velocity.x > 0.25 ) {

                    object.rotation.z = - ( surfer.velocity.x - 0.25 ) * 0.4

                    object.setState( 0 )

                }else {

                    object.rotation.z = - surfer.velocity.x * 0.8

                    object.setState( 2 )
                }

            }

        })

    bus.on('loop', () => update( state.surfers || [] ))

}