import * as THREE       from 'three'
import { StereoEffect } from './StereoEffect'

export const create = (config = {}) => {

    let vr = false

    const camera    = new THREE.PerspectiveCamera( 50, 1, 0.01, 3000 )
    camera.position.set( 0, 0, 120 )
    camera.lookAt( new THREE.Vector3(0,0,0) )
    camera.updateProjectionMatrix ()

    const scene     = new THREE.Scene()

    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialiasing: true })
    renderer.setClearColor(0x6DBD9A, 1)
    renderer.setPixelRatio(window.devicePixelRatio)

    const effect = new StereoEffect( renderer )


    window.scene    = scene
    window.THREE    = THREE

    const setSize =  ( width, height ) => {

        camera.aspect = width / height
        camera.updateProjectionMatrix ()

        renderer.setSize(width, height)
        effect.setSize(width, height)
    }

    const render = () =>
        vr
            ? effect.render( scene, camera )
            : renderer.render(scene, camera)



    // render loop
    {
        const loop = () => {
            render()

            requestAnimationFrame( loop )
        }
        loop()
    }

    // attach canvas
    const ratio = 1
    const attach = () => {

        const container = document.getElementById('mainScene')
        container && ( container.style.display = 'block' )

        setTimeout( () =>  {

            const {width, height} = container.getBoundingClientRect()

            setSize( width*ratio, height*ratio )

            const canvas = renderer.domElement

            if( canvas.parentNode )
                canvas.parentNode.removeChild( canvas )

            container.appendChild( canvas )
            canvas.style=`width:${width}px;height:${height}px;`

        })
    }

    window.addEventListener('resize', () => {
        const container = document.getElementById('mainScene')
        const {width, height} = container.getBoundingClientRect()
        setSize( width*ratio, height*ratio )
    })

    const detach = () => {
        const canvas = renderer.domElement
        const container = document.getElementById('mainScene')
        container && ( container.style.display = 'none' )
        if( canvas.parentNode )
            canvas.parentNode.removeChild( canvas )
    }

    const attached = () =>
        !!renderer.domElement.parentNode

    const setVr = x =>
        vr = x

    detach()

    return Promise.resolve({ scene, camera, attach, detach, attached, setVr })
}