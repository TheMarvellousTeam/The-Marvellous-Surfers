import { create as createBackground }   from './background'
import { create as createSurfer }       from './surfer'

export const create = (...args) => Promise.all([
    createBackground( ...args ),
    createSurfer( ...args ),
])
