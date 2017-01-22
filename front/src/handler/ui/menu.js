let state = null
let com = null
const container = document.getElementById('container-menu')
const waitingRoomDiv = document.getElementById('waiting_room');
const connexionDiv = document.getElementById('connexion');
const playerListDiv = document.getElementById('player-list');
let menuState = 'connexion';


function setMenuState(mState) {

	menuState = mState;
	switch(menuState) {

		case 'connexion':
			waitingRoomDiv.style.display = 'none';
			connexionDiv.style.display = 'block';
			break;

		case 'playerlist':
			waitingRoomDiv.style.display = 'block';
			connexionDiv.style.display = 'none';
			break;

	}

}


export const create = ( aState, services ) => {
    state = aState
    com = services.com

    document.getElementById('playerName').value = generateName()
    setMenuState('connexion');


    const join = name => {
        com.emit('join', {name})
		setMenuState('playerlist')
    }

    document.getElementById('connectButton').addEventListener('click', e => {
        if ( document.getElementById('playerName').value )
    	   join( document.getElementById('playerName').value )
    })

    document.getElementById('playerName').addEventListener('keydown', e => {
        if ( e.which == 13 && document.getElementById('playerName').value )
            join( document.getElementById('playerName').value )
    })

    let readyButton = document.getElementById('readyButton');
    readyButton.onclick = (event) => {
		com.emit('player_ready');
    		readyButton.innerHTML ="WAITING FOR OTHER PLAYERS...";
		readyButton.className = "readyButtonClicked";
    };

    /*
    let input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter your name'
    let go = document.createElement('button')
    go.value = 'Go !'
    go.onclick = function() {
        waitingRoomDiv.removeChild(input)
        waitingRoomDiv.removeChild(go)
        com.emit('join', {name: input.value})
    }

    waitingRoomDiv.appendChild(input)
    waitingRoomDiv.appendChild(go)
    */
	com.on('players_info', (infos) => {
		render();
	})
}

export const deleteUI = () => {
    while ( playerListDiv.lastChild ) {
        playerListDiv.removeChild(playerListDiv.lastChild)
    }
}

export const setVisible = (visible) => {
	container.style.display = visible
		?'block'
		:'none';
}

export const render = () => {

    if ( ! state.waiting_room ) {
        deleteUI()
    } else if ( state.waiting_room.to_update ) {
        deleteUI()
        let ul = document.createElement('ul')
        playerListDiv.appendChild(ul)
        console.log(state.waiting_room)
        for ( let id in state.waiting_room.players ) {
            let player = state.waiting_room.players[id]
            let li = document.createElement('li')
            //li.innerHTML = player.name + (player.ready ? ' (ready)' : ' (not ready)')
	    let span = document.createElement('span');
	    span.innerHTML = player.name;
	    li.className ='itemPlayerName';
	    let checkImg = document.createElement('img');
	    checkImg.src = 'src/assets/menu/check.png';
	    checkImg.className = "logocheck";
	    li.appendChild(checkImg);
	    li.appendChild(span);
	    checkImg.style.display = 'none';
	    if(player.ready) {

	    	li.className = li.className + ' playerReady';
	    	checkImg.style.display = 'inline-block';
	    }
	    ul.appendChild(li)
        }
        state.waiting_room.to_update = false
    }
}


function generateName() {

	const names = ['Marin', 'James', 'Dory', 'Nemo', 'Body', 'Karen', 'Turtle', 'Zippy', 'Franck', 'Monica', 'Mick',
	'Crab', 'Dolphin', 'Fish', 'Gordon', 'Harry'];
	const adjectives = ['Big', 'Mighty', 'Mystic', 'Notorious', 'Kinky', 'Flash', 'Beautiful', 'Graceful', 'Giant', 'Anonymous',
	'Marvellous', 'Marvellous', 'Flappy', 'Fantastic', 'Captain']

	const adj =  adjectives[Math.floor(adjectives.length * Math.random())];
	const name =  names[Math.floor(names.length * Math.random())];

	return adj + ' ' + name;
}
