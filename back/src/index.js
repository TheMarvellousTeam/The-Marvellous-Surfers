import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'

export const create = async config => {

    const com = await createCom( config.com )

    com.on('connection', ({ socketId })  => com.emit( socketId, 'ready' ) )

}


