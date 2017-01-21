import * as THREE    from 'three'

export const create = config => {

    const camera    = new THREE.PerspectiveCamera( 50, 1, 0.01, 3000 )
    camera.position.set( 0, 60, 0 )
    camera.lookAt( new THREE.Vector3(0,0,0) )
    camera.updateProjectionMatrix ()

    const scene     = new THREE.Scene()

    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialiasing: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)

    window.scene    = scene
    window.THREE    = THREE

    // add gizmo
    {
        const axisHelper = new THREE.AxisHelper( 5 )
        axisHelper.name = 'axis'
        scene.add( axisHelper )
    }

    // LIGHTS
    {
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 )
        hemiLight.color.setHSL( 0.6, 1, 0.6 )
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
        hemiLight.position.set( 0, 500, 0 )
        hemiLight.name= 'hemilight'
        scene.add( hemiLight )

        //
        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 )
        dirLight.color.setHSL( 0.1, 1, 0.95 )
        dirLight.position.set( -1, 1.75, 1 )
        dirLight.position.multiplyScalar( 5 )
        dirLight.castShadow = true
        dirLight.shadow.mapSize.width = 2048
        dirLight.shadow.mapSize.height = 2048
        dirLight.name= 'dirLight'
        const d = 50
        dirLight.shadow.camera.left = -d
        dirLight.shadow.camera.right = d
        dirLight.shadow.camera.top = d
        dirLight.shadow.camera.bottom = -d
        dirLight.shadow.camera.far = 3500
        dirLight.shadow.bias = -0.0001

        scene.add( dirLight )
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