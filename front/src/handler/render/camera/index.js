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

        const target = {
            x : p.x * 0.6,
            y : p.y// + Math.sin( t/100 )*10,
        }

        const l = {
            x   : renderer.camera.position.x - target.x,
            y   : renderer.camera.position.y - target.y,
        }

        const b = 0.06
        const k = 0.02

        const ax = - k * l.x - b * v.x
        const ay = - k * l.y - b * v.y

        v.x += ax
        v.y += ay

        renderer.camera.position.x += v.x
        renderer.camera.position.y += v.y
        renderer.camera.lookAt( new THREE.Vector3(p.x,p.y,0) )
    })

}