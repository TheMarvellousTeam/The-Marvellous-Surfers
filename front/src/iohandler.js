import {create as createCom}    from './service/com'
import * as config              from './config'

export let state = {
		
		surfers : [
		{
			id:1,
			name:'Surfeur d\'Argent',
			position: {x:50, y:0},
			velocity : {x:0, y:4}
		},
		{
			id:2,
			name:'Surfeur d\'Or',
			position: {x:-120, y:0},
			velocity : {x:0, y:4}
		},
		{
			id:3,
			name:'Surfeur de Platine',
			position: {x:120, y:0},
			velocity : {x:0, y:2}
		}
		], 
		
		waves: [
		{
			id:4,
			position:{x:0, y: -300},
			velocity:{x:0, y: 6}
		},
		{
			id:5,
			position:{x:-50, y: -350},
			velocity:{x:0, y: 5}
		},
		{
			id:6,
			position:{x:20, y: -550},
			velocity:{x:0, y: 5}
		},
		{
			id:7,
			position:{x:0, y: -800},
			velocity:{x:0, y: 6}
		},
		{
			id:4,
			position:{x:-100, y: -900},
			velocity:{x:0, y: 5}
		},
		{
			id:8,
			position:{x:200, y: -1000},
			velocity:{x:0, y: 5}
		}
		]
	}

createCom( config.com )
.then( com => {

    e = document.getElementById("waiting_room")
    com.on('players_info', ({you, room}) => {
                
    })

})
