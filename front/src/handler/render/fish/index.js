import * as THREE                               from 'three'


export const create = ( state, { renderer, bus } ) => {

    const object_by_id = {}

    const container = new THREE.Object3D()
    container.name = 'fishtank'
    renderer.scene.add( container )

    const getObject = id => {

        if ( object_by_id[ id ] )
            return object_by_id[ id ]

        const object = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshBasicMaterial({ color: 0xa120b4 }) )

        container.add( object )

        return object_by_id[ id ] = object
    }

    const updateFishs = ( fishs, offset_y ) =>
        fishs.forEach( ( fish, id ) => {

            const object = getObject( id )

            object.position.x = fish.x
            object.position.y = fish.y - offset_y

        })

    bus.on('loop', () => {
        updateFishs( state.fishs || [], state.cammera_offset_y )
    })

}