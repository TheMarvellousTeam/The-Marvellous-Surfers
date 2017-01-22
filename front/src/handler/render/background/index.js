import * as THREE    from 'three'


const wavesImage            = require('../../../assets/background/waves.png')
const wavesImage2           = require('../../../assets/background/waves2.png')
const displacementImage     = require('../../../assets/background/displacement_map.jpg')

export const create = ( state, { renderer, bus } ) => {

    const container = new THREE.Object3D()

    renderer.scene.add( container )
    container.name = 'ground'
    container.position.z = -26

    const l = 3000

    {
        const textureWaves     = new THREE.TextureLoader().load( wavesImage2 )
        textureWaves.wrapS = textureWaves.wrapT = THREE.RepeatWrapping
        textureWaves.repeat.set( l/300, l/300 )
        const geo = new THREE.PlaneBufferGeometry( l, l )
        const mat = new THREE.MeshBasicMaterial({
            color       : 0xffffff,
            map         : textureWaves,

            transparent : true,
            opacity     : 0.4,
        })
        const mesh = new THREE.Mesh( geo, mat )
        mesh.position.z = -20
        container.add( mesh )


        bus.on('loop', () => {
            textureWaves.offset.y = ( 2 + textureWaves.offset.y - 0.002 ) % 1
        })
    }

    {
        const textureDisplacement   = new THREE.TextureLoader().load( displacementImage )
        const textureWaves          = new THREE.TextureLoader().load( wavesImage )
        textureDisplacement.wrapS = textureDisplacement.wrapT = THREE.RepeatWrapping
        textureDisplacement.repeat.set( l/200, l/200 )
        textureWaves.wrapS = textureWaves.wrapT = THREE.RepeatWrapping
        textureWaves.repeat.set( l/200, l/200 )
        const geo = new THREE.PlaneBufferGeometry( l, l )
        const mat = new THREE.MeshBasicMaterial({
            color               : 0xffffff,
            map                 : textureWaves,

            // displacementMap     : textureDisplacement,
			// displacementScale   : 2,
            // displacementBias    : 0.428408,

            transparent         : true,
        })
        const mesh = new THREE.Mesh( geo, mat )
        mesh.position.z = 6
        container.add( mesh )

        // bus.on('loop', () => {
        //     textureDisplacement.offset.x = ( 2 + textureDisplacement.offset.x - 0.005 ) % 1
        //     textureDisplacement.offset.y = ( 2 + textureDisplacement.offset.y - 0.002 ) % 1
        // })
    }


}