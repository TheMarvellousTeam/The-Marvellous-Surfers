import * as THREE    from 'three'

const textureBack       = new THREE.TextureLoader().load( require('../../../assets/background/back.png') )
const textureWaves     = new THREE.TextureLoader().load( require('../../../assets/background/waves.png') )

export const create = ( state, { renderer } ) => {

    const container = new THREE.Object3D()

    renderer.scene.add( container )
    container.name = 'ground'
    container.position.z = -16

    const l = 10000

    {
        const geo = new THREE.PlaneBufferGeometry( l, l )
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x050505,
            map: textureBack
        })
        const mesh = new THREE.Mesh( geo, mat )
        // container.add( mesh )
    }

    {
        textureWaves.wrapS = textureWaves.wrapT = THREE.RepeatWrapping
        textureWaves.repeat.set( l/80, l/80 )
        const geo = new THREE.PlaneBufferGeometry( l, l )
        const mat = new THREE.MeshPhongMaterial({
            color       : 0xffffff,
            map         : textureWaves,
            transparent : true,
        })
        const mesh = new THREE.Mesh( geo, mat )
        mesh.position.z = 6
        container.add( mesh )
    }


}