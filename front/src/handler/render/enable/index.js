
export const create = ( state, { com, renderer, bus } ) => {

    com.on('start', () =>
        !renderer.attached() && renderer.attach()
    )

}