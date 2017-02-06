

export const create = ( state, { renderer, bus, controller } ) =>

    bus.on('loop', () => {

        // const { gamma, alpha, beta } = controller()

        // const vr = gamma * alpha > 0 && Math.abs( gamma ) > 0.6 && Math.abs( alpha ) > 0.6 && Math.abs( beta ) < 0.6

        // console.log( vr, f(gamma), f(alpha), f(beta) )

        if ( renderer.getVr() != state.vr_enabled )
            renderer.setVr( state.vr_enabled )

    })

