import { create as createBackground }   from './background'
import { create as createSurfer }       from './surfer'
import { create as createCamera }       from './camera'
import { create as createEnable }       from './enable'

export const create = (...args) => Promise.all([
    createBackground( ...args ),
    createSurfer( ...args ),
    createCamera( ...args ),
    createEnable( ...args ),
])
