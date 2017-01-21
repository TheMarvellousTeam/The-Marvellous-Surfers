import * as THREE    from 'three'

const textureBack       = new THREE.TextureLoader().load( require('../../../assets/background/back.png') )
const textureBubble1    = new THREE.TextureLoader().load( require('../../../assets/background/back.png') )

export const create = ( state, { renderer } ) => {

    const container = new THREE.Object3D()

    renderer.scene.add( container )
    container.name = 'ground'
    container.position.z = -6

    {
        const geo = new THREE.PlaneBufferGeometry( 100, 100 )
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x050505,
            map:textureBack
        })
        const mesh = new THREE.Mesh( geo, mat )
        container.add( mesh )
    }

    {
        const geo = new THREE.PlaneBufferGeometry( 100, 100 )
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x050505,
            map:textureBubble1
        })
        const mesh = new THREE.Mesh( geo, mat )
        mesh.position.y = -1
        container.add( mesh )
    }


}