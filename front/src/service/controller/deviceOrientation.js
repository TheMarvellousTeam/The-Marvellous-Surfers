
export const isSupported = () =>
    typeof window !== 'undefined' && !!window.DeviceOrientationEvent
        && new Promise( resolve => {

            const handler = event => {
                clearTimeout( timeout )
                window.removeEventListener('deviceorientation', handler)
                resolve( event.beta !== null )
            }
            window.addEventListener('deviceorientation', handler)

            const timeout = setTimeout( () => {
                clearTimeout( timeout )
                window.removeEventListener('deviceorientation', handler)
                resolve( false )
            },200)
        })

export const create = () => {

    const control = {}

    window.addEventListener('deviceorientation', event =>
        control.vx = Math.min(1, Math.max(-1, event.beta / 50 ))
    )

    return () => control
}
