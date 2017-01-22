import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'


let waiting_players = {}

let god = {}
let surfers = []
let sharks = []
let waves = []

let inputs = {}
let kill_loop = null

const PLAYER_WIDTH = 5
const PLAYER_HEIGHT = 20
const WAVE_WIDTH = 30
const WAVE_HEIGHT = 5
const SHARK_WIDTH = 2
const SHARK_HEIGHT = 1
const MIN_SPEED = 3
const BOUND_MAX = 65;

function dump() {
    return {
        god: god,
        surfers: surfers,
        waves: waves,
        sharks: sharks
    }
}

let d = Date.now()
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

    generateWaves();
    generateSharks()

    //gestion de la dureee de vie des vagues
    waves = waves.filter(wave => {

    	wave.lifetime -= 100;
	return wave.lifetime > 0;

    });

    d = Date.now()

    // update client
    surfers.forEach(player => {
        com.emit(player.id, 'state', dump())
    });

}

function applyInputOn(id, input) {
    //blindy apply Platane's input
    let surfer = surfers.find(s => s.id == id);
    if( surfer) {

    	surfer.velocity.x = input
	}

}

function resolveCollisions() {



	surfers.forEach((player) => {
       	player.state.type = 'ok';
	player.velocity.y = Math.max(MIN_SPEED, player.velocity.y - 0.2)
	// player/player
	surfers.forEach((player2) => {
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
        });

        // player/wave
	waves.forEach((wave) => {
            if ( //player.state.type != 'surf' &&
                 player.position.y - wave.position.y > 0 &&
                 player.position.y - wave.position.y < PLAYER_HEIGHT / 2 &&
                 player.position.x - PLAYER_WIDTH / 2 > wave.position.x - WAVE_WIDTH / 2 && 
                 player.position.x + PLAYER_WIDTH / 2 < wave.position.x + WAVE_WIDTH / 2 ) {

                player.velocity.y = Math.max(wave.velocity.y, player.velocity.y)
                player.state.type = 'surf'
                player.state.date = new Date()
            }
        });

        // player/shark
	sharks.forEach((shark) => {
            if ( player.position.x + PLAYER_WIDTH > shark.position.x &&
                 player.position.x < shark.position.x + SHARK_WIDTH &&
                 player.position.y + PLAYER_HEIGHT > shark.position.y &&
                 player.position.y > shark.position.y + SHARK_HEIGHT ) {

                sharks = sharks.filter(s => s.id == shark.id)
                player.velocity.y = Math.max(MIN_SPEED, player.velocity.y / 2)
            }
        });

	if(player.position.x <= -BOUND_MAX || player.position.x >= BOUND_MAX) {

		player.position.x = BOUND_MAX * Math.sign(player.position.x);

	}

    });

}

function generateWaves() {

	const random = Math.random() * 100 ;

	//on cree une nouvelle vavgue
	if(random > 95) {

		//on selectionne le dernier surfeur
		//const lastSurferPosition = surfers.map(s => s.position.y).reduce(Math.min, Infinity)

		let minY = Infinity;
		surfers.forEach((surfer) => {

			if(surfer.position.y < minY) {

				minY = surfer.position.y;

			}

		});
		const y = minY - 50;

		const x = Math.random() * (2*BOUND_MAX-WAVE_WIDTH) - BOUND_MAX
		const wave = {
			id:genUID(),
			position : {x:x, y:y},
			velocity : {x:0, y:5 * Math.random() + 6},
			lifetime : 2500 * Math.random() + 5000
		}
		waves.push(wave);
	}
}

function generateSharks() {

	const random = Math.random() * 100 ;

	//on cree une nouvelle vavgue
	if(random > 96) {

		//on selectionne le dernier surfeur
		let maxY = 0;
		surfers.forEach((surfer) => {

			if(surfer.position.y > maxY) {

				maxY = surfer.position.y;

			}

		});
		const y = maxY + 50;

		const x = Math.random() * (2*BOUND_MAX-SHARK_WIDTH) - BOUND_MAX
		const shark = {
			position : {x:x, y:y},
			velocity : {x:0, y:-2},
			lifetime : 5000 * Math.random() + 3000
		}
		sharks.push(shark);
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
	surfers.forEach(surfer => {

		com.emit(surfer.id, 'state',dump())

	});

	if(surfers.length  == 0) {

        // kill the game loop
        clearTimeout( kill_loop )

		waiting_players = {}

	}
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
            let player_interval = Math.floor(2*BOUND_MAX / sockets.length +1) // remove +1 when god arises
            let currentPosition = - BOUND_MAX + player_interval
            for ( let sid in waiting_players ) {
                // create player
                surfers.push({
                    id: sid,
                    name: waiting_players[sid].name,
                    state: { type: 'ok', date: new Date() },
                    position: { x: currentPosition,
                                y: 0 },
                    velocity: { x: 0,
                                y: MIN_SPEED },
                    orientation: 0
                })
                currentPosition += player_interval
                com.emit(sid, 'start', {type: 'surfer', state: dump()})
            }
            waiting_players = null // "forbid" join

            // start server loop
            {
                const loop = () => {
                    serverLoop(com)

                    clearTimeout( kill_loop )
                    kill_loop = setTimeout( loop, config.srv.rate )
                }
                loop()
            }

        }
    })

    com.on('action', ({socketId, vx}) => {
        inputs[socketId] = vx*3
    })

}
const genUID = () =>
    Math.random().toString(36).slice(2)
