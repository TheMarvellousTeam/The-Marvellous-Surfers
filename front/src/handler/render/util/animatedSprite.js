import * as THREE    from 'three'


const toAnimate = []

const loop = () => {

    for ( let i=toAnimate.length; i-- ; ) {

        const x = toAnimate[i]

        x.n = ( x.n + 1 ) % x.l

        x.map.offset.x = x.map.repeat.x * x.n
    }

    setTimeout( loop, 200 )
}
loop()


// image
// spriteSize       : size of the sprite in the three world
// animationLength  : for every state, the number of frame of the animation
export const createFactory = ({ image, spriteSize, origin, imageSize, animationLength }) => {

    const max = animationLength.reduce((max,x) => Math.max(max,x),0)

    const pool = []

    const materials = animationLength.map( (l, i) => {

        const map   = new THREE.TextureLoader().load( image )
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.repeat.set( 1 / max, 1 / animationLength.length )
        map.offset.y = map.repeat.y * i

        toAnimate.push({ map, l, n:0 })

        return new THREE.MeshBasicMaterial({ map, transparent: true, alphaTest: 0.5 })
    })

    const geometry = new THREE.PlaneBufferGeometry( spriteSize.x, spriteSize.y )

    return () => {

        if ( pool[0] )
            return pool.shift()

        const sprite = new THREE.Mesh( geometry, materials[0] )

        sprite.rotation.x = Math.PI * 0.2

        sprite.setState     = k =>
            sprite.material = materials[ k ]

        sprite.destroy     = () =>
            pool.push( sprite )

        return sprite
    }

}