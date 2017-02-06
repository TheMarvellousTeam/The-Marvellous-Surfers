
const createRepulsion = ( x0, fatness, friendlyness, revulsion ) =>
    x =>
        revulsion / ( x *x ) - friendlyness * Math.exp( -( x- x0 )*( x- x0 ) / ( fatness * fatness ) )

const surferFn = createRepulsion( 10, 7, 0.95, 10 )
const fishFn = createRepulsion( 1, 0.2, 0.95, 10 )

export const create = ( state, { bus } ) => {

    const MAX_ACC = 5

    const fishs = Array.from({ length: 20 })
        .map( (_,i) =>
            ({
                x       : i/0.2,
                y       : 0,
                vx      : 0,
                vy      : 0,
            })
        )

    const honeyPots = [
        {
            x: 0,
            y: 100,
        }
    ]

    const iterate = ( fishs, surfers ) => {

        return fishs.map( fish => {

            let ax = 0
            let ay = 0

            surfers.forEach( surfer => {

                const dx = surfer.position.x - fish.x
                const dy = surfer.position.y - fish.y

                const l = Math.sqrt( dx*dx + dy*dy )

                const f = Math.min( MAX_ACC, surferFn( Math.max( l, 1 ) ) )

                // ax += dx/l * f
                // ay += dy/l * f
            })

            honeyPots.forEach( pot => {

                const dx = pot.x - fish.x
                const dy = pot.y - fish.y

                const l = Math.sqrt( dx*dx + dy*dy )

                const f = Math.min( MAX_ACC, l * 0.1 )

                ax += dx/l * f
                ay += dy/l * f

                if ( l < 10 ){
                    // change honey pot
                    honeyPots.length=0
                    honeyPots.push({
                        x: Math.random() * 180 - 90,
                        y: surfers[ 0 ] ? surfers[ 0 ].position.y + Math.random() * 60 + 40 : 0,
                    })
                }
            })

            // fishs.forEach( o => {
            //
            //     if ( o == fish )
            //         return
            //
            //     const dx = o.x - fish.x
            //     const dy = o.y - fish.y
            //
            //     const l = Math.sqrt( dx*dx + dy*dy )
            //
            //     const f = fishFn( Math.max( l, 0.1 ) )
            //
            //     ax += - dx/l * f
            //     ay += - dy/l * f
            //
            // })

            const vx = fish.vx * 0.5 + ax
            const vy = fish.vy * 0.5 + ay

            const x = fish.x + vx
            const y = fish.y + vy

            return ({ ...fish, vx, vy, x, y })
        })
    }

    state.fishs = fishs

    bus.on('loop', () => state.fishs = iterate( state.fishs, state.surfers ) )
}
