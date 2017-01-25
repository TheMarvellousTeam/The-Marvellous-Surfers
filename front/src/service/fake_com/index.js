import {genUID}       from '../../util/uid'

export const create = config => {

    const ee = window.fakeCom

    const socketId = genUID()

    ee.emit('connection', { socketId } )

    const api = {
        on  : ee.on.bind( ee ),
        emit: ( eventName, data = {} ) => ee.emit( eventName, { socketId, ...data } ),
    }

    return Promise.resolve( api )
}