
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
            },1600)
        })

export const create = () => {

    const control = {}

    window.addEventListener('deviceorientation', event => {
        control.gamma   = event.gamma / 90
        control.beta    = event.beta  / 90
        control.alpha   = event.gamma / 90
    })

    return () => control
}
