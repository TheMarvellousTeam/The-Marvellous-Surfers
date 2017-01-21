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
    {
        const container = document.getElementById('mainScene')
        const {width, height} = container.getBoundingClientRect()

        const ratio = 1

        setSize( width*ratio, height*ratio )

        const canvas = renderer.domElement

        if( canvas.parentNode )
            canvas.parentNode.removeChild( canvas )

        container.appendChild( canvas )
        canvas.style=`width:${width}px;height:${height}px;`
    }

    return Promise.resolve({ scene, camera })
}