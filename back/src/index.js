import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'


let waiting_players = {}

let god = {}
let surfers = []
let sharks = []
let waves = []

let inputs = {}

const PLAYER_WIDTH = 1
const PLAYER_HEIGHT = 2
const WAVE_WIDTH = 2
const WAVE_HEIGHT = 1
const SHARK_WIDTH = 2
const SHARK_HEIGHT = 1
const MIN_SPEED = 1

function dump() {
    return {
        god: god,
        surfers: surfers,
        waves: waves,
        sharks: sharks
    }
}

function serverLoop(com) {
    //input processing
    for ( let id in inputs ) {
        applyInputOn(id, inputs[id])
    }

    // update position of each entity
    [...surfers, ...sharks, ...waves].forEach(e => {
        e.position.x += e.velocity.x
        e.position.y += e.velocity.y
    })

    resolveCollisions()

    // TODO don't leave the screen fuckers !

    // update client
    com.emit(god.id, 'state', dump())
    for ( let player in surfers ) {
        com.emit(player.id, 'state', dump())
    }

}

function applyInputOn(id, input) {
    //blindy apply Platane's input
    let surfer = surfers.find(s => s.id == id);
    surfer.velocity.x = input
    console.log(surfer.name + " vx : " + input);
}

function resolveCollisions() {
    for ( let player in surfers ) {
        // player/player
        for ( let player2 in surfers ) {
            if ( player.id != player2.id ) {
                const dx = Math.abs(player.position.x - player2.position.x)
                const dy = Math.abs(player.position.y - player2.position.y)
                if ( dx < PLAYER_WIDTH && dy < PLAYER_HEIGHT ) {
                    if ( dx < PLAYER_WIDTH ) {
                        if ( player.position.x < player2.position.x ) {
                            player.position.x -= dx / 2
                            player2.position.x += dx / 2
                        } else {
                            player.position.x += dx / 2
                            player2.position.x -= dx / 2
                        }
                    }
                    if ( dy < PLAYER_HEIGHT ) {
                        if ( player.position.y < player2.position.y ) {
                            player.position.y -= dy / 2
                            player2.position.y += dy / 2
                        } else {
                            player.position.y += dy / 2
                            player2.position.y -= dy / 2
                        }
                    }
                    player.velocity.x = - player.position.x
                    player2.velocity.x = - player2.position.x
                    player.state.type = 'bump'
                    player.state.date = new Date()
                    player2.state.type = 'bump'
                    player2.state.date = new Date()
                }
            }
        }

        // player/wave
        for ( let wave in waves ) {
            if ( player.state.type != 'surf' &&
                 player.position.y - wave.position.y > 0 && player.position.y - wave.position.y < PLAYER_HEIGHT / 2 &&
                 player.position.x > wave.position.x && player.position.x + PLAYER_WIDTH < wave.position.x + WAVE_WIDTH ) {

                player.velocity.y = wave.velocity.y
                player.state.type = 'surf'
                player.state.date = new Date()
            }
        }

        // player/shark
        for ( let shark in sharks ) {
            if ( player.position.x + PLAYER_WIDTH > shark.position.x &&
                 player.position.x < shark.position.x + SHARK_WIDTH &&
                 player.position.y + PLAYER_HEIGHT > shark.position.y &&
                 player.position.y > shark.position.y + SHARK_HEIGHT ) {

                sharks = sharks.filter(s => s.id == shark.id)
                player.velocity.y = Math.max(MIN_SPEED, player.velocity.y / 2)
            }
        }

    }

}


export const create = config => {

	const com = createCom( config.com)

    com.on('connection', ({ socketId }) => {
        com.emit( socketId, 'ready' )
    })

    com.on('deconnection', ({socketId}) =>  {
    	console.log('[DISCONNECT]' + socketId);

	//mise a jour liste d'attente
	if(waiting_players) {
    		delete waiting_players[socketId];
        	for ( let sid in waiting_players ) {
                	com.emit(sid, 'players_info', {you: sid, room: waiting_players})
         	}
	}

	//suppression du surfer in game
	surfers = surfers.filter(surfer => surfer.id != socketId);
	com.emit('state', dump())
    })

    com.on('join', ({ socketId, name }) => {
        console.log('[JOIN] '+name+ ' (sid:'+socketId+')')
        if ( waiting_players ) {
            waiting_players[socketId] = {name: name, ready: false}
            for ( let sid in waiting_players ) {
                com.emit(sid, 'players_info', {you: sid, room: waiting_players})
            }
        }
    })

    com.on('player_ready', ({ socketId }) => {
        console.log('[READY] '+waiting_players[socketId].name)
        waiting_players[socketId].ready = true
        let ready = true
        for ( let sid in waiting_players ) {
            com.emit(sid, 'players_info', {you: sid, room:waiting_players})
            ready = ready && waiting_players[sid].ready
        }
        if ( ready ) {
            console.log('[START]')
            // choose and create god
            let sockets = Object.keys(waiting_players)
      // send start to players
            let player_interval = Math.floor(100 / sockets.length +1) // remove +1 when god arises
            let i = 0
            for ( let sid in waiting_players ) {
                // create player
                surfers.push({
                    id: sid,
                    name: waiting_players[sid].name,
                    state: { type: 'ok', date: new Date() },
                    position: { x: ++i * player_interval,
                                y: 0 },
                    velocity: { x: 0,
                                y: 1 },
                    orientation: 0
                })
                com.emit(sid, 'start', {type: 'surfer', state: dump()})
            }
            waiting_players = null // "forbid" join

            // start server loop
            setInterval(function() {
                serverLoop(com)
            }, config.srv.rate)
        }
    })

    com.on('action', ({socketId, vx}) => {
        inputs[socketId] = vx
	console.log("ACTION");
	console.log(vx);
    })



}
