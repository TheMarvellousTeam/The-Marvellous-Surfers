
export const isSupported = () =>
    typeof document !== 'undefined'


const getPointerX = event =>
    event.targetTouches ? event.targetTouches[ 0 ].clientX : event.clientX

export const create = () => {

    const control = {}

    const {width}   = document.body.getBoundingClientRect()

    const mouseHandler = event =>
        control.vx = Math.min(1, Math.max(-1, ( getPointerX(event) / width - 0.5 )*2.1 ))

    document.body.addEventListener('mousemove', mouseHandler )
    document.body.addEventListener('touchmove', mouseHandler )

    return () => control
}
