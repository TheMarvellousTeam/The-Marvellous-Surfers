import engineIo         from 'engine.io'
import {EventEmitter}   from 'events'


export const create = config => {

    const ee     = new EventEmitter
    ee._emit = ee.emit

    const server = engineIo.listen( config.port )

    ee.emit = ( socketId, type, data={} ) =>
        server.clients[ socketId ] && server.clients[ socketId ].send( JSON.stringify({ type, data }) )

    server
        .on('connection', socket => {

            socket

                .on('message',  buffer => {

                    try{

                        const {type, payload, meta} = buffer && JSON.parse( buffer.toString() )

                        ee._emit( type, { ...( payload || {} ), meta, socketId: socket.id } )

                    } catch( err ){
                        console.log('error', err)
                    }

                })

                .on('close',    ()  => ee._emit( 'deconnection', { socketId: socket.id } ) )

                .on('error',    err => console.log('error', err) )

            ee._emit( 'connection', { socketId: socket.id } )

        })

    return ee
}