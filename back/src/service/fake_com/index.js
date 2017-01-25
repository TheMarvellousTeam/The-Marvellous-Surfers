import {EventEmitter}   from 'events'


export const create = config => {

    const ee     = new EventEmitter

    window.fakeCom = ee

    return {
        on      : ee.on.bind( ee ),
        emit    : ( socketId, eventName, data = {} ) =>
            ee.emit( eventName, data )
    }
}