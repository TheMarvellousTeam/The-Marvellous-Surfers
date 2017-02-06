import engineIo         from 'engine.io'
import {EventEmitter}   from 'events'
import {createServer}   from 'http'
import express          from 'express'

export const create = config => {

    const ee     = new EventEmitter
    ee._emit = ee.emit

    const app       = express()
    const http      = createServer(app)

    const live      = engineIo.attach(http)

    http.listen( config.port, err => console.log( err ? err : `listening to port ${config.port}` ) )

    app.use(express.static('dist'))


    ee.emit = ( socketId, type, payload={}, meta={} ) =>
        live.clients[ socketId ] && live.clients[ socketId ].send( JSON.stringify({ type, payload, meta }) )


    live
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