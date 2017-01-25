import * as THREE    from 'three'
import 'style-loader!css-loader!../../../assets/font/stylesheet.css'

export const create = ( text ) => {

    const canvas    = document.createElement('canvas')
    const ctx       = canvas.getContext('2d')

    canvas.width = 500
    canvas.height= 80

    // ctx.rect( 0, 0, 300, 80 )
    // ctx.fillStyle='#fff'
    // ctx.fill()

    ctx.beginPath()
    ctx.fillStyle='#000'
    ctx.font = '40pt dunkin_sansregular'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text,150,40)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(canvas.width/2     , 80)
    ctx.lineTo(canvas.width/2 +10 , 65)
    ctx.lineTo(canvas.width/2 -10 , 65)
    ctx.fill()


    const texture   = new THREE.Texture(canvas)
    texture.needsUpdate = true
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( 1, 1 )

    const material  = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite( material )
    sprite.scale.set( canvas.width, canvas.height, 1 )
    sprite.name = 'flat text'

    return sprite
}
