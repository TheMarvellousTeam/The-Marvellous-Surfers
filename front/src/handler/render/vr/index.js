
const f = x =>
    Math.floor( x * 100 ) / 100


export const create = ( state, { renderer, bus, controller } ) =>

    bus.on('loop', () => {

        const { gamma, alpha, beta } = controller()

        const vr = gamma * alpha > 0 && Math.abs( gamma ) > 0.6 && Math.abs( alpha ) > 0.6 && Math.abs( beta ) < 0.6

        // console.log( vr, f(gamma), f(alpha), f(beta) )

        if ( vr != state.vr_enabled ) {
            state.vr_enabled = vr
            renderer.setVr( state.vr_enabled )

            bus.emit('vr_changed')
        }

    })

