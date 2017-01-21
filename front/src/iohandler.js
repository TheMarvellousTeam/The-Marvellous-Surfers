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

    let e = document.getElementById("waiting_room")

    let ul = document.createElement("ul")
    let input = document.createElement("input")
    input.type = "text"
    input.value = "Enter your name"
    let go = document.createElement("button")
    go.value = "Go !"
    go.onclick = function() {
        e.removeChild(input)
        e.removeChild(go)
        com.emit('join', {name: input.value})
        e.appendChild(ul)
    }
    e.appendChild(input)
    e.appendChild(go)

    com.on('players_info', ({you, room}) => {
        console.log('receive players_info')
        while( ul.lastChild ) {
            ul.removeChild(ul.lastChild)
        }
        console.log(room)
        for ( let id in room ) {
            let player = room[id]
            console.log(player)
            let li = document.createElement("li")
            li.innerHTML = player.name + (player.ready ? " (ready)" : " (not ready)")
            if ( id == you ) {
                let ready = document.createElement("button")
                ready.value = "Ready !"
                ready.onclick = function(){
                    com.emit('ready')
                    li.removeChild(ready)
                }
                li.appendChild(ready)
            }
            ul.appendChild(li)        
        }            
    })

    com.on('start', () => {
        
    })

})
