import * as THREE    from 'three'


const toAnimate = []

const loop = () => {

    for ( let i=toAnimate.length; i-- ; ) {

        const sprite = toAnimate[i]

        sprite._maxAnimationN = ( sprite._maxAnimationN + 1 ) % sprite._animationLength

        sprite.material.map.offset.x = sprite.material.map.repeat.x * sprite._maxAnimationN
    }

    setTimeout( loop, 200 )
}
loop()


// image
// spriteSize       : size of the sprite in the three world
// animationLength  : for every state, the number of frame of the animation
export const createFactory = ({ image, spriteSize, origin, imageSize, animationLength, frameDelay }) => {

    const max = animationLength.reduce((max,x) => Math.max(max,x),0)

    frameDelay = frameDelay || 20

    const pool = []

    return () => {

        if ( pool[0] )
            return pool.shift()

        const texture   = new THREE.TextureLoader().load( image )
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set( 1 / max, 1 / animationLength.length )


        const material  = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
        const geo = new THREE.PlaneBufferGeometry( spriteSize.x, spriteSize.y )
        const sprite = new THREE.Mesh( geo, material )

        sprite.rotation.x = Math.PI * 0.2

        // const material  = new THREE.SpriteMaterial({ map: texture, transparent: true })
        // const sprite = new THREE.Sprite( material )
        // sprite.scale.set(spriteSize.x, spriteSize.y, 1)

        sprite.material.map.offset.x = 1/3


        sprite._maxAnimationLength      = max
        sprite._animationLength         = 1
        sprite._maxAnimationN           = 0

        sprite.setState     = k => {
            sprite._animationLength = animationLength[ k ]
            sprite._maxAnimationN   = sprite._maxAnimationN % sprite._animationLength
            sprite.material.map.offset.y = sprite.material.map.repeat.y * k
            sprite.material.map.offset.x = sprite.material.map.repeat.x * sprite._maxAnimationN
        }

        sprite.destroy     = () =>
            pool.push( sprite )


        toAnimate.push( sprite )

        return sprite
    }

}