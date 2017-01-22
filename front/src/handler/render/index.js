import { create as createBackground }   from './background'
import { create as createSurfer }       from './surfer'
import { create as createBoey }         from './boey'
import { create as createWave }         from './wave'
import { create as createShark }         from './wave'
import { create as createCamera }       from './camera'
import { create as createEnable }       from './enable'

export const create = (...args) => Promise.all([
    createBackground( ...args ),
    createSurfer( ...args ),
    createWave( ...args ),
    createShark( ...args ),
    createBoey( ...args ),
    createCamera( ...args ),
    createEnable( ...args ),
])
