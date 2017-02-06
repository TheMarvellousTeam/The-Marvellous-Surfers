
export const isSupported = () =>
    typeof document !== 'undefined'


const getPointerX = event =>
    event.targetTouches ? event.targetTouches[ 0 ].clientX : event.clientX

export const create = () => {

    const control = {}

    let {width}   = document.body.getBoundingClientRect()

    window.addEventListener('resize', () =>
        width = document.body.getBoundingClientRect().width
    )

    const mouseHandler = event =>
        control.mx = getPointerX(event) / width * 2 -1

    document.body.addEventListener('mousemove', mouseHandler )
    document.body.addEventListener('touchmove', mouseHandler )

    return () => control
}
