import { Avatar, MouthCue, Timer} from '../types'
import fs from 'fs'

// TODO: Add a unit test here
export async function mouthCuesToInputFile({
    avatar,
    mouthCues,
    outputPath = './tmp/input.txt',
    timer,
}: {
    avatar: string
    mouthCues: MouthCue[]
    outputPath?: string
    timer: Timer
}) {
    try {
        await fs.promises.writeFile(outputPath, generateFrameData(avatar, mouthCues, timer), {
            flag: 'w',
        })
        /* Lines 17-20 for testing purposes only
        const contents = await fs.promises.readFile(outputPath, 'utf-8')
        console.log(contents);

        return contents
        */
    } catch (err) {
        console.log(err)
        return Error('animationProcessor Error')
    }
}

/*
This converts  data from the MouthCue type into a format for ffmpeg
*/

export function generateFrameData(avatar: string, mouthCues: MouthCue[], timer: Timer) {

    let character = new Avatar(avatar)
    let frameData = ''

    console.log(`${timer.getTotalTimeElapsed()} - Adding realism...`)
    timer.setProcessStart(3)
    for (const mouthCuesKey in mouthCues) {
        // Duration of frame is calculated based on the mouth cue
        let frameDur = (mouthCues[mouthCuesKey].end - mouthCues[mouthCuesKey].start).toFixed(2)
        let currentSec = parseInt(mouthCues[mouthCuesKey].start.toFixed(0))

        // TODO: when testing idle animation and poses, add idling? lastPoseChange and breathPhase
        //console.log('t=%d, frameDur: %d, lastBlink: %d, lastPoseChange: %d', currentSec, frameDur, character.eyes.lastBlink, character.body.lastPoseChange)

        character.updateState(currentSec, parseInt(frameDur), mouthCues[mouthCuesKey].value)
        // Build frame path
        frameData = frameData.concat(character.generateStateString(frameDur))
    }
    timer.setProcessEnd(3)
    console.log(`${timer.getTotalTimeElapsed()} - Adding Realism Complete `)
    return frameData
}