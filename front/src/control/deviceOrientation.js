
export const isSupported = () =>
    typeof window !== 'undefined' && !!window.DeviceOrientationEvent

export const create = () => {

    const control = {}

    window.addEventListener('deviceorientation', event =>
        control.vx = Math.min(1, Math.max(-1, event.beta / 50 ))
    )

    return () => control
}
