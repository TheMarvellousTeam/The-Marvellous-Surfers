export const drawWorld = ( ctx, l, world ) => {
    for( let x=world.length; x--; )
    for( let y=world[0].length; y--; )
    {

        const { h, vx, vy } = world[x][y]

        ctx.beginPath()
        ctx.rect(x*l, y*l, l, l )
        ctx.fillStyle = `hsl(${ Math.sqrt(h)*100 },50%,50%)`
        ctx.fill()

    }
}