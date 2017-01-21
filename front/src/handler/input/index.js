
const INPUT_POLLING = 100

export const create = ( state, {com, controller} ) => {

    const getInput = controller

    const loop = () => {

        com.emit('input', getInput() )

        // requestAnimationFrame( loop )
        setTimeout( loop, INPUT_POLLING )
    }

    loop()
}
