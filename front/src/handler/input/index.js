
const INPUT_POLLING = 100

export const create = ( state, {com, controller} ) => {

    const getInput = controller

    const loop = () => {
	var action = getInput();
	console.log("envoi de :" );
	console.log(action);
        com.emit('action', action )

        // requestAnimationFrame( loop )
        setTimeout( loop, INPUT_POLLING )
    }

    loop()
}
