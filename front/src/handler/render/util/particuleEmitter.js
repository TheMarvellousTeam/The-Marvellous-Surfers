import * as THREE    from 'three'


const image = require('../../../assets/particule/bubble.png')


// image
// spriteSize       : size of the sprite in the three world
// animationLength  : for every state, the number of frame of the animation
export const createEmitter = config => {

    const rate = config.rate || 1


    const n_sprite = 2

    // active
    const particules = []

    // inactive
    const pool = []

    const emitter = new THREE.Object3D()

    const loop = () => {

        // spawn new ones
        const n = rate
        for ( let i=n; i--; ) {
            const p = prepare( pool[0] ? pool.shift() : spawn(), config )
            particules.push( p )
            !p.parent && emitter.add( p )
        }

        // update
        for ( let i=particules.length; i-- ; ) {

            const p = particules[i]

            p.t ++

            if ( p.t > p.duration ) {
                // end of life
                particules.splice(i,1)
                p.visible = false
                pool.push( p )

            } else {

                p.position.x += p.velocity.x
                p.position.y += p.velocity.y
                p.position.z += p.velocity.z

                const u = p.t / p.duration

                const k = Math.sqrt( 1 - Math.abs( u - 0.5 ) * 2 )

                p.scale.set(
                    k * p.size,
                    k * p.size,
                    k * p.size,
                )

            }

        }

        requestAnimationFrame( loop )
    }

    const materials = Array.from({ length: n_sprite })
        .map( (_,i) => {

            const map   = new THREE.TextureLoader().load( image )
            map.wrapS = map.wrapT = THREE.RepeatWrapping
            map.repeat.set( 1 / n_sprite, 1 )
            map.offset.x = i/n_sprite

            return new THREE.MeshBasicMaterial({ map, transparent: true })
        })

    const geometry = new THREE.PlaneBufferGeometry( 1, 1 )

    const spawn = () => {

        const particule = new THREE.Mesh( geometry, materials[0] )

        particule.velocity = new THREE.Vector3

        return particule
    }

    const prepare = ( particule, { position_amplitude, velocity_amplitude, velocity } ) => {

        particule.size = 2 + Math.random() * 5


        particule.position.set(
            position_amplitude.x * ( Math.random() - 0.5 ),
            position_amplitude.y * ( Math.random() - 0.5 ),
            position_amplitude.z * ( Math.random() - 0.5 )
        )

        particule.velocity.set(
            velocity.x + velocity_amplitude.x * ( Math.random() - 0.5 ),
            velocity.y + velocity_amplitude.y * ( Math.random() - 0.5 ),
            velocity.z + velocity_amplitude.z * ( Math.random() - 0.5 )
        )
        particule.velocity.normalize()
        particule.velocity.multiplyScalar( 0.6 )

        particule.scale.set( particule.size, particule.size, 1 )

        particule.duration = 0|( 12 + Math.random() * 16 )
        particule.t        = 0

        particule.visible = true

        particule.material = materials[ Math.floor( Math.random() * n_sprite ) ]

        return particule
    }

    loop()


    return emitter
}