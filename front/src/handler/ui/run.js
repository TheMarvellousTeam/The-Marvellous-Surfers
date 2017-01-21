import pixi 			        from 'pixi.js'

let state = null
let container = null;
let stage = new PIXI.Container()
let renderer = PIXI.autoDetectRenderer(512,512)
let sprites = {}
let waterBackground = {
	id:'background',
	position: { x:-200, y:50000},
	velocity: { x:0, y:0}
}

function getSurfer(surferId) {

	return state.surfers.filter((surfer) => surfer.id == surferId)[0];

}

export const create = ( st, service ) =>
	new Promise( resolve  => {

		state = st;



		container = document.createElement('div');
		container.id = "run-renderer";
		container.style.display = 'none';
		container.appendChild(renderer.view);
		document.body.appendChild(container);

		return PIXI.loader
			.add('surfer1',require('./../../assets/surfer1.png'))
			.add('surfer2',require('./../../assets/surfer2.png'))
			.add('water',require('./../../assets/water.jpg'))
			.add('wave',require('./../../assets/wave.png'))
			.add('shark',require('./../../assets/shark.jpg'))
			.load(setup);


		function setup(){

			const surferTexture = PIXI.loader.resources.surfer1.texture;
			const playerTexture = PIXI.loader.resources.surfer2.texture;
			const waterTexture = PIXI.loader.resources.water.texture;
			const waveTexture = PIXI.loader.resources.wave.texture;
			const sharkTexture = PIXI.loader.resources.shark.texture;

			sprites['background'] = new PIXI.extras.TilingSprite(waterTexture, waterTexture.baseTexture.width, waterTexture.baseTexture.height*100);
			sprites['background'].position.x = 0;
			sprites['background'].position.y = 0;
			sprites['background'].tilePosition.x = 0;
			sprites['background'].tilePosition.y = 0;
			stage.addChild(sprites['background']);

			state.waves.forEach((wave) => {

					let waveSprite = new PIXI.Sprite(waveTexture);

					stage.addChild(waveSprite);
					sprites[wave.id] = waveSprite;

					});

			state.surfers.forEach((item) => {

					let surferSprite = item.id == state.meId
					?new PIXI.Sprite(playerTexture)
					:new PIXI.Sprite(surferTexture);

					stage.addChild(surferSprite);
					sprites[item.id] = surferSprite;

					});


			const playerSprite = sprites[state.myId];
			playerSprite.x = renderer.width / 2 - (playerSprite.width /2);
			playerSprite.y = renderer.height * 0.66 - (playerSprite.height / 2);

			resolve()
		}
	})


export const render = () => {

	[...state.surfers, ...state.waves, waterBackground].forEach((entity) => {

		const coords = computeCoords(entity);
		sprites[entity.id].x = coords.x;
		sprites[entity.id].y = coords.y;

		entity.position.x += entity.velocity.x;
		entity.position.y += entity.velocity.y;
	});

	renderer.render(stage);

}

//Cette fonction permet de definir le delta a appliquer au (position.x,position.y) d'une entite
//(sa position dans le monde) pour obtenir son (sprite.x,sprite.y) (sa position a l'ecran)
function computeCoords(entity) {

	const playerSprite = sprites[state.myId];
	const player = getSurfer(state.myId);

	const x = playerSprite.x + (entity.position.x - player.position.x);
	const y = playerSprite.y - (entity.position.y - player.position.y);

	return {x:x, y:y};
}


export const setVisible = (visible) => {

	container.style.display = visible
			?'block'
			:'none';

}
