
const createRepulsion = ( x0, fatness, friendlyness, revulsion ) =>
    x =>
        revulsion / ( x *x ) - friendlyness * Math.exp( -( x- x0 )*( x- x0 ) / ( fatness * fatness ) )

const surferFn = createRepulsion( 30,5, 0.5, 60 )
const fishFn = createRepulsion( 0.8, 0.2, 0.9, 16 )

export const create = ( state, { bus } ) => {

    const MAX_ACC = 1

    const fishs = Array.from({ length: 24 })
        .map( (_,i) =>
            ({
                x       : i*0.2,
                y       : 0,
                z       : 0,
                vx      : 0,
                vy      : 0,

                saA     : Math.random() * 0.4 + 0.6,
                saW     : Math.random() * 0.01 + 0.01,

                zPhy    : Math.random() * 100,
                zW      : Math.random() * 0.01 + 0.01,
            })
        )

    const honeyPots = [
        {
            x: 0,
            y: 100,
        }
    ]

    let t = 0

    const iterate = ( fishs, surfers ) => {

        const mainSurfer = surfers[ 0 ]

        t ++

        return fishs.map( (fish,i) => {

            fish.z = Math.sin( fish.zPhy + fish.zW * t )

            const sa = 0.1 + fish.saA * ( 1+Math.sin( fish.saW * t ) )

            let ax = 0
            let ay = 0

            // push / attract surfers
            surfers.forEach( surfer => {

                const dx = surfer.position.x - fish.x
                const dy = surfer.position.y - fish.y

                const l = Math.sqrt( dx*dx + dy*dy )

                const f = sa * Math.min( MAX_ACC, surferFn( Math.max( l, 0.2 ) ) )

                ax += - dx/l * f
                ay += - dy/l * f
            })

            // attracted to honey pot
            honeyPots.forEach( pot => {

                const dx = pot.x - fish.x
                const dy = pot.y - fish.y

                const l = Math.sqrt( dx*dx + dy*dy )

                const f = Math.min( MAX_ACC / 3, l * 0.008 )

                ax += dx/l * f
                ay += dy/l * f

                if ( l < 60 ){
                    // change honey pot
                    honeyPots.length=0
                    honeyPots.push({
                        x: Math.random() * 220 - 110,
                        y: mainSurfer ? mainSurfer.position.y + Math.random() * 280 + 10 : 0,
                    })
                }
            })

            // push / attract other fishes
            fishs.forEach( o => {

                if ( o == fish )
                    return

                const dx = o.x - fish.x
                const dy = o.y - fish.y

                const l = Math.sqrt( dx*dx + dy*dy )

                const f = fishFn( Math.max( l, 0.1 ) )

                ax += - dx/l * f
                ay += - dy/l * f

            })

            // y position
            {
                const oy    = mainSurfer ? mainSurfer.position.y + 60 : 0
                const l     = oy - fish.y

                const f     = Math.min( MAX_ACC / 5, l * 0.003 )

                ay += f
            }

            const vx = fish.vx * 0.95 + ax * 0.1
            const vy = fish.vy * 0.95 + ay * 0.1

            const x = fish.x + vx
            const y = fish.y + vy

            return ({ ...fish, vx, vy, x, y })
        })
    }

    state.fishs = fishs

    bus.on('loop', () => state.fishs = iterate( state.fishs, state.surfers ) )
}
