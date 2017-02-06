import * as THREE                               from 'three'


export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}

    const container = new THREE.Object3D()
    container.name = 'fishtank'
    container.position.z = -42
    renderer.scene.add( container )

    const getObject = id => {

        if ( object_by_id[ id ] )
            return object_by_id[ id ]

        const object = new THREE.Mesh( new THREE.BoxGeometry(0.8,4,0.1), new THREE.MeshBasicMaterial({ color: 0x1f8989 }) )

        container.add( object )

        return object_by_id[ id ] = object
    }

    const updateFishs = ( fishs, offset_y ) =>
        fishs.forEach( ( fish, id ) => {

            const object = getObject( id )

            object.position.x = fish.x
            object.position.y = fish.y - offset_y
            object.position.z = fish.z * 20

            const a = Math.atan2( fish.vy, fish.vx )

            object.rotation.z = a + Math.PI / 2
        })

    bus.on('loop', () => {
        updateFishs( state.fishs || [], state.cammera_offset_y )
    })

}