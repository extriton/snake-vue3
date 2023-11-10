import { sounds } from '@/consts/sounds'

export const playSound = function(soundId) {

    const snd = new Audio()
    snd.volume = 0.4
    snd.autoplay = true
    
    for (let i = 0; i < sounds.length; i++)
        if (soundId == sounds[i].soundId) {
            snd.src = sounds[i].publicPath
            break
        }

}