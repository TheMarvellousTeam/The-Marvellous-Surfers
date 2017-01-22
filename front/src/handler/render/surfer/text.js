import * as THREE    from 'three'

export const create = ( text ) => {

    const canvas    = document.createElement('canvas')
    const ctx       = canvas.getContext('2d')

    canvas.width = 300
    canvas.height= 50

    // ctx.rect( 0, 0, 200, 80 )
    // ctx.fillStyle='#fff'
    // ctx.fill()

    ctx.beginPath()
    ctx.fillStyle='#000'
    ctx.font = '40pt Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(text,0,30)
    ctx.fill()


    const texture   = new THREE.Texture(canvas)
    texture.needsUpdate = true
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( 1, 1 )

    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    const geo = new THREE.PlaneBufferGeometry( canvas.width, canvas.height )
    const mesh = new THREE.Mesh( geo, mat )
    mesh.name = 'flat text'

    return mesh
}
