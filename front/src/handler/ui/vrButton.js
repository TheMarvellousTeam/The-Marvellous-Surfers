

const launchFullscreen = () => {

    const element = document.documentElement

    element.requestFullscreen && element.requestFullscreen()
    element.mozRequestFullScreen && element.mozRequestFullScreen()
    element.webkitRequestFullscreen && element.webkitRequestFullscreen()
    element.msRequestFullscreen && element.msRequestFullscreen()
}

export const create = ( state, {bus} ) => {

    const button = document.getElementById('vrButton')

    button.addEventListener('click', () => {
        state.vr_enabled = !state.vr_enabled
        bus.emit('vr_changed')

        if ( state.vr_enabled )
            launchFullscreen()

        else
            // exi fullscreen
            0
    })

    bus.on('vr_changed', () => {
        button
    })
}