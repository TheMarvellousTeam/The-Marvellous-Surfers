import pixi 			        from 'pixi.js'

let state = null;

function getSurfer(surferId) {

	return state.surfers.filter((surfer) => surfer.id == surferId)[0];

}

export const create = ( st, service ) => {
	
	state = st;

	let sprites = {}
	let waterBackground = {
		id:'background',
		position: { x:-200, y:50000},
		velocity: { x:0, y:0}
	}

	this.stage = new PIXI.Container()
	this.renderer = PIXI.autoDetectRenderer(512,512)

	document.body.appendChild(renderer.view);

	loader
		.add('surfer1',require('./assets/surfer1.png'))
		.add('surfer2',require('./assets/surfer2.png'))
		.add('water',require('./assets/water.jpg'))
		.add('wave',require('./assets/wave.png'))
		.add('shark',require('./assets/shark.jpg'))
		.load(setup);


	function setup(){

		const surferTexture = loader.resources.surfer1.texture;
		const playerTexture = loader.resources.surfer2.texture;
		const waterTexture = loader.resources.water.texture;
		const waveTexture = loader.resources.wave.texture;
		const sharkTexture = loader.resources.shark.texture;

		sprites['background'] = new PIXI.extras.TilingSprite(waterTexture, waterTexture.baseTexture.width, waterTexture.baseTexture.height*100);
		sprites['background'].position.x = 0;
		sprites['background'].position.y = 0;
		sprites['background'].tilePosition.x = 0;
		sprites['background'].tilePosition.y = 0;
		stage.addChild(sprites['background']);

		state.waves.forEach((wave) => {

				let waveSprite = new Sprite(waveTexture);

				stage.addChild(waveSprite);
				sprites[wave.id] = waveSprite;

				});

		state.surfers.forEach((item) => {

				let surferSprite = item.id == playerId
				?new Sprite(playerTexture)
				:new Sprite(surferTexture);

				stage.addChild(surferSprite);
				sprites[item.id] = surferSprite;

				});


		const playerSprite = sprites[playerId];
		playerSprite.x = renderer.width / 2 - (playerSprite.width /2);
		playerSprite.y = renderer.height * 0.66 - (playerSprite.height : 2);

	}
}

export const render = () => {
	
	console.log('render run');

}
