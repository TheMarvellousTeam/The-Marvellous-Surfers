import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'

console.log('starting ...')

let waiting_players = {}

let god = {}
let surfers = []
let sharks = []
let waves = []

let inputs = {}
let kill_loop = null

const PLAYER_WIDTH = 5
const PLAYER_HEIGHT = 10
const WAVE_WIDTH = 30
const WAVE_HEIGHT = 5
const SHARK_WIDTH = 5
const SHARK_HEIGHT = 5
const MIN_SPEED = 3
const BOUND_MAX = 85;

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
    surfers.forEach(e => {
        e.position.x += e.velocity.x * 3
        e.position.y += e.velocity.y
    })
    ;[...sharks, ...waves].forEach(e => {
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

    let minY = Infinity;
    surfers.forEach((surfer) => {
        if(surfer.position.y < minY) {
            minY = surfer.position.y;
        }
    });

    sharks = sharks.filter(s => s.position.y > -50)

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
                            player.position.x -= 2*(PLAYER_WIDTH - dx)
                            player2.position.x += 2*(PLAYER_WIDTH - dx)
                        } else {
                            player.position.x += 2*(PLAYER_WIDTH - dx)
                            player2.position.x -= 2*(PLAYER_WIDTH - dx)
                        }
                    }
                    if ( dy < PLAYER_HEIGHT ) {
                        if ( player.position.y < player2.position.y ) {
                            player.position.y -= PLAYER_HEIGHT - dy
                            player2.position.y += PLAYER_HEIGHT - dy
                        } else {
                            player.position.y += PLAYER_HEIGHT - dy
                            player2.position.y -= PLAYER_HEIGHT - dy
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


        // player/shark
        //
    for( let i = sharks.length ; i-- ; ) {
        const shark = sharks[i]
            if (
                    //dist < 10 ) {
                 player.position.x + PLAYER_WIDTH / 2 > shark.position.x - SHARK_WIDTH / 2 &&
                 player.position.x - PLAYER_WIDTH / 2 < shark.position.x + SHARK_WIDTH / 2 &&
                 player.position.y + PLAYER_HEIGHT / 2 > shark.position.y - SHARK_HEIGHT / 2 &&
                 player.position.y - PLAYER_HEIGHT / 2 > shark.position.y + SHARK_HEIGHT / 2 ) {
                console.log('MIAM MIAM '+shark.id)
                console.log('shark: '+shark.position.y)
                console.log('surfer: '+player.position.y)
                //sharks = sharks.filter(s => s.id != shark.id)
                player.velocity.y = MIN_SPEED
                player.state.type = 'miam'
            }
            if ( player.state.type = 'miam' )
                break;
    }
        // player/wave
	waves.forEach((wave) => {
            if ( //player.state.type != 'surf' &&
                 player.position.y - wave.position.y > -5 &&
                 player.position.y - wave.position.y < PLAYER_HEIGHT / 2 &&
                 player.position.x - PLAYER_WIDTH / 2 > wave.position.x - WAVE_WIDTH / 2 &&
                 player.position.x + PLAYER_WIDTH / 2 < wave.position.x + WAVE_WIDTH / 2 ) {

                player.velocity.y = Math.max(wave.velocity.y, player.velocity.y)
                player.state.type = 'surf'
                player.state.date = new Date()
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
			velocity : {x:0, y: Math.floor(5 * Math.random() + 6)},
			lifetime : Math.floor(2500 * Math.random() + 5000)
		}
		waves.push(wave);
	}
}

function generateSharks() {

	const random = Math.random() * 100 ;

	//on cree une nouvelle vavgue
	if(sharks.length < 20 && random > 85) {

		let maxY = 0;
		surfers.forEach((surfer) => {

			if(surfer.position.y > maxY) {

				maxY = surfer.position.y;

			}

		});
		const y = maxY + 100;

		const x = Math.random() * (2*BOUND_MAX-SHARK_WIDTH) - BOUND_MAX
		const shark = {
            id: genUID(),
			position : {x:x, y:y},
			velocity : {x:0, y:-5},
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
        } else {
            surfers.push({
                id: socketId,
                name: name,
                state: { type: 'ok', date: new Date() },
                position: { x: 0,
                            y: surfers.reduce( ( min, suffer ) => Math.min( min, suffer.position.y ), Infinity )  },
                velocity: { x: 0,
                            y: MIN_SPEED },
                orientation: 0
            })
            com.emit(socketId, 'players_info', {you: socketId, room: {}})
            com.emit(socketId, 'start', {type: 'surfer', state: dump()})
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
