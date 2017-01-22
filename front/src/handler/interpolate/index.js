
const interpolateNumber = ( k, a, b ) =>
    (1-k)*a + k*b

const interpolateEntity = ( k, a, b ) =>
    ({
        ...b,
        position    : {
            x : interpolateNumber( k, a.position.x, b.position.x ),
            y : interpolateNumber( k, a.position.y, b.position.y ),
        },
        velocity    : {
            x : interpolateNumber( k, a.velocity.x, b.velocity.x ),
            y : interpolateNumber( k, a.velocity.y, b.velocity.y ),
        },
    })

const interpolateEntityList = ( k, list_a, list_b ) =>
    list_b.map( b => {

        const a = list_a.find( e => b.id == e.id )

        return a ? interpolateEntity( k, a, b ) : b
    })

export const create = ( state, { bus } ) => {

    bus.on('loop', () => {

        if ( !state.interpolate )
            return

        const { previous, next } = state.interpolate

        const k = Math.min( 1, ( Date.now() - previous.date ) / ( next.date - previous.date ) )

        state.surfers = interpolateEntityList( k, previous.surfers, next.surfers )
        state.waves = interpolateEntityList( k, previous.waves, next.waves )
        state.sharks = interpolateEntityList( k, previous.sharks, next.sharks )

    })

}
