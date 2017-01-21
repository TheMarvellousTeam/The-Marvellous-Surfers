import {create as createCom}    from './service/com'
import * as config              from './config'

export let state = {}

createCom( config.com )
.then( com => {

    e = document.getElementById("waiting_room")
    com.on('players_info', ({you, room}) => {
                
    })

})
