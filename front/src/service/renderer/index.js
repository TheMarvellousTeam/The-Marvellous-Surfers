import * as THREE    from 'three'

export const create = config => {

    const camera    = new THREE.PerspectiveCamera( 50, 1, 0.01, 3000 )
    camera.position.set( 0, 0, 120 )
    camera.lookAt( new THREE.Vector3(0,0,0) )
    camera.updateProjectionMatrix ()

    const scene     = new THREE.Scene()

    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialiasing: true })
    renderer.setClearColor(0x6DBD9A, 1)
    renderer.setPixelRatio(window.devicePixelRatio)

    window.scene    = scene
    window.THREE    = THREE

    // add gizmo
    {
        const axisHelper = new THREE.AxisHelper( 5 )
        axisHelper.name = 'axis'
        scene.add( axisHelper )
    }

    const setSize =  ( width, height ) => {

        camera.aspect = width / height
        camera.updateProjectionMatrix ()

        renderer.setSize(width, height)
    }

    const render = () =>
        renderer.render(scene, camera)


    // render loop
    {
        const loop = () => {
            render()

            requestAnimationFrame( loop )
        }
        loop()
    }

    // attach canvas
    const attach = () => {

        const container = document.getElementById('mainScene')
        container && ( container.style.display = 'block' )

        setTimeout( () =>  {

            const {width, height} = container.getBoundingClientRect()


            const ratio = 1

            setSize( width*ratio, height*ratio )

            const canvas = renderer.domElement

            if( canvas.parentNode )
                canvas.parentNode.removeChild( canvas )

            container.appendChild( canvas )
            canvas.style=`width:${width}px;height:${height}px;`

        })
    }

    const detach = () => {
        const canvas = renderer.domElement
        const container = document.getElementById('mainScene')
        container && ( container.style.display = 'none' )
        if( canvas.parentNode )
            canvas.parentNode.removeChild( canvas )
    }

    const attached = () =>
        !!renderer.domElement.parentNode

    detach()

    return Promise.resolve({ scene, camera, attach, detach, attached })
}