export const small_wave = world => {

    const n = 0|( Math.random()*2 )

    for(let i=n; i--;) {

        const x = 0|( Math.random()*world.length )
        const y = 0|( Math.random()*world[0].length )

        world[x][y] = { ...world[x][y], vh: world[x][y].vh + 0.005 }
    }

    return world
}


export const horizontal_step = world => {

    const stiffness = 0.01
    const damping   = 0.05

    for( let x=world.length; x--; )
    for( let y=world[0].length; y--; )
    {

        const { vh, h } = world[x][y]

        const a = - stiffness * h - damping * vh

        world[x][y] = { ...world[x][y], vh: vh+a, h: h+vh+a }
    }

    return world
}


const rules = [
    {x:1 , y: 0},
    {x:1 , y: 1},
    {x:0 , y: 1},
    {x:-1, y: 1},
    {x:-1, y: 0},
    {x:-1, y:-1},
    {x:0 , y:-1},
    {x:1 , y:-1},
]
const corner = ({ x, y }) =>
    (+!!x) + (+!!y) -1

const s = rules.map( () => 0 )

const propagationPattern = ( vx, vy ) => {

    let sum = 0
    for( let k=rules.length; k--; ){

        const dot = vx * rules[k].x + vy * rules[k].y

        sum += s[k] = Math.max( 0, dot + 0.2 ) * ( corner( rules[k] ) ? 0.707 : 1 )

    }

    for( let k=rules.length; k--; )
        s[k] /= sum

    return s
}

const copy = world =>
    world.map( arr => arr.map( o => ({ ... o })) )


const PROPAGATION_VELOCITY_CONSERVATION = 0.95
const ENERGY_TRANSFERT = 0.5

export const propagation_step = world => {

    const next_world = copy( world )

    for( let x=world.length; x--; )
    for( let y=world[0].length; y--; )
    {

        const {h, wx, wy} = world[x][y]

        const _wh = - ENERGY_TRANSFERT * h
        const energy_tranfered = - _wh


        propagationPattern( wx, wy )
            .forEach( (ponderation,i) => {

                const ix = x+rules[i].x
                const iy = y+rules[i].y

                if( !world[ix] || !world[ix][iy] )
                    return



                next_world[ix][iy].h    += ponderation * energy_tranfered * 1.02
                next_world[ix][iy].wx   += ponderation * energy_tranfered * rules[i].x
                next_world[ix][iy].wy   += ponderation * energy_tranfered * rules[i].y
            })

        next_world[x][y].wx *= PROPAGATION_VELOCITY_CONSERVATION
        next_world[x][y].wy *= PROPAGATION_VELOCITY_CONSERVATION
        next_world[x][y].wh = _wh
        next_world[x][y].h  += _wh


    }

    return next_world
}