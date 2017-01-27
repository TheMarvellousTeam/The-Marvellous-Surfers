
const INPUT_POLLING = 100

export const create = ( state, {com, controller} ) => {

    const getInput = controller

    const loop = () => {
	    const c = getInput()

        const vx = 'mx' in c
            ? c.mx
            : state.vr_enabled
                ? c.beta
                : c.gamma

        com.emit('action', { vx } )

        // requestAnimationFrame( loop )
        setTimeout( loop, INPUT_POLLING )
    }

    loop()
}
