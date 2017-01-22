import * as THREE    from 'three'

export const create = ( state, { renderer, bus } ) => {

    let t = 0

    const v = { x:0, y:0 }
    bus.on('loop', () => {

        t ++

        const mainSurfer = state.surfers.find( ({ id }) => id == state.myId )

        if ( !mainSurfer )
            return

        const p = mainSurfer.position

        state.cammera_offset_y = p.y

        const target = {
            x : p.x * 0.9,
            y : p.y -90  - state.cammera_offset_y,
        }

        const l = {
            x   : renderer.camera.position.x - target.x,
            y   : renderer.camera.position.y - target.y,
        }


        const b = 0.03
        const k = 0.001

        const ax = - k * l.x - b * v.x
        const ay = - k * l.y - b * v.y

        v.x += ax
        v.y += ay

        v.x += -k * l.x
        v.y += -k * l.x

        renderer.camera.position.x += v.x
        renderer.camera.position.y += v.y

        renderer.camera.position.x = target.x
        renderer.camera.position.y = target.y
        renderer.camera.position.x = 0
        // renderer.camera.position.y = -90
        //
        //
        renderer.camera.position.z = 110
        renderer.camera.lookAt( new THREE.Vector3(p.x,p.y - state.cammera_offset_y,0) )

    })

}