import * as THREE                               from 'three'
import {createFactory as createSpriteFactory}   from '../util/animatedSprite'

const createSprite = createSpriteFactory({
        image       : require('../../../assets/boey/boey.png'),

        spriteSize  : { x:30, y:30 },
        animationLength : [ 3 ],
    })


export const create = ( state, { renderer, bus } ) => {

    ;[ 75, -75 ].map( x => {

        const l = 90000
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

}
