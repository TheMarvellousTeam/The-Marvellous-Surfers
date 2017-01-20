import listen               from 'engine.io-client'
import {genUID}             from '../../util/uid'
import EventEmitter         from 'events'

export const create  = ( options = {} ) => {

    const ee = new EventEmitter
    ee._emit = ee.emit

    const requests = {}


    let socket
    let reconnectTimeout

    const socketBinding = () =>
        socket
            .on('error', err => ee._emit('error', err ))
            .on('open', () => {
                clearTimeout( reconnectTimeout )
                ee._emit('open')
            })
            .on('close', () => {

                ee._emit('disconnect' )

                socket.removeAllListeners()
                socket.close()
                socket = null
                clearTimeout( reconnectTimeout )
                reconnectTimeout = setTimeout( connect, 1000 )
            })
            .on('message', m => {

                let {type, payload, meta} = JSON.parse(m)
                payload = payload || {}

                if ( meta && meta.key in requests ) {

                    const { reject, resolve } = requests[ meta.key ]

                    delete requests[ meta.key ]

                    payload.error

                        ? reject( payload )

                        : resolve( payload )

                }

                ee._emit( type, payload )
            })

    const connect = () =>
        new Promise(( resolve, reject ) => {

            socket = listen(
                `ws://${ options.hostname || 'localhost' }${ options.port ? ':'+options.port : ''  }`,
                {
                    upgrade     : options.upgrade,
                    transports  : options.transports,
                }
            )

            socketBinding( socket )

            ee
                .once( 'error' , err => reject( err ) )
                .once( 'ready', () => resolve() )
        })

    ee.emit = ( type, payload ) =>

        new Promise( (resolve, reject) => {

            const key = genUID()

            requests[ key ] = { resolve, reject }

            socket && socket.send( JSON.stringify({ type, payload, meta:{ key } }) )
        })

    return connect().then( () => ee )
}
