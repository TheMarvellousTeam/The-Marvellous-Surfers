import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'
import {createEmitter}                          from '../util/particuleEmitter'
import {create as createText}                   from './billboardText'

const createSprite = {
    main: createSpriteFactory({
        image       : require('../../../assets/surfer/main.png'),

        spriteSize  : { x:30, y:30 },
        animationLength : [ 3,3,3 ],
    })
    ,
    other: createSpriteFactory({
        image       : require('../../../assets/surfer/other.png'),

        spriteSize  : { x:30, y:30 },
        animationLength : [ 3,3,3 ],
    })
    ,
}

export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}


    const getObject = surfer => {

        if ( object_by_id[ surfer.id ] )
            return object_by_id[ surfer.id ]

        const object = new THREE.Object3D()
        object.name = 'surfer'


        {
            const sprite = surfer.id == state.myId ? createSprite.main() : createSprite.other()
            object.add( sprite )

            object.destroy  = sprite.destroy
            object.setState = sprite.setState
        }

        if ( surfer.id == state.myId ) {

        } else {

            const text = createText( surfer.name )

            text.position.z = 30
            text.position.x = 0
            text.scale.x = 300*0.08
            text.scale.y = 80*0.08

            object.add( text )
        }

        renderer.scene.add( object )

        // bounding box
        renderer.scene.add( object.helper = new THREE.BoxHelper( object, 0xffff00 ) )

        // cube gizmo
        {
            const cube = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({ color: 0xa120b4 }) )
            renderer.scene.add( cube )
            object.cube = cube
        }

        // particule
        {
            const emitter = createEmitter({
                rate                    : 1,
                velocity                : new THREE.Vector3(0,-1,0),
                velocity_amplitude      : new THREE.Vector3(0.3,0,1),

                position_amplitude      : new THREE.Vector3(15,1,0),

            })
            renderer.scene.add( emitter )
            object.emitter = emitter
        }

        return object_by_id[ surfer.id ] = object
    }

    const update = ( surfers ) =>
        surfers.forEach( surfer => {

            const object = getObject( surfer )


            // update
            {
                // position
                object.position.x = surfer.position.x
                object.position.y = surfer.position.y - state.cammera_offset_y

                // gizmo
                object.cube.position.x = surfer.position.x
                object.cube.position.y = surfer.position.y - state.cammera_offset_y

                // emitter
                object.emitter.position.x = surfer.position.x
                object.emitter.position.y = surfer.position.y - state.cammera_offset_y - 10

                object.helper.update( object )

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