
const INPUT_POLLING = 100

export const create = ( state, {com, controller} ) => {

    const getInput = controller

    const loop = () => {
	var action = getInput();
        com.emit('action', action )

        // requestAnimationFrame( loop )
        setTimeout( loop, INPUT_POLLING )
    }

    loop()
}
