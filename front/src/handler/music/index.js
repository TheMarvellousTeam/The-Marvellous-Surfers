import theme    from '../../assets/theme.mp3'

export const create = ( state, {bus} ) => {

    const audio = new Audio
    audio.src = theme
    audio.loop = true

    bus.on('changeGameState', gameState =>
        gameState == 'run' && audio.play()
    )
}