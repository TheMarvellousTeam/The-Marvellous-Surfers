import 'file-loader?name=index.html!./index.html'
import {create as createCom}    from './service/com'
import * as config              from './config'

console.log('hello')

createCom( config.com )
    .then( () => 0 )