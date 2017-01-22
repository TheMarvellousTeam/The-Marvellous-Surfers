import * as THREE                               from 'three'


export const create = ( state, { renderer, bus } ) => {

    const cube = new THREE.Mesh( new THREE.BoxGeometry(5,5,5), new THREE.MeshBasicMaterial({ color: 0xa120b4 }) )
    renderer.scene.add( cube )

    bus.on('loop', () => {

        cube.position.x = 0
        cube.position.y = 0 - state.cammera_offset_y

    })

}
