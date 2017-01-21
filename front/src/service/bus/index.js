import EventEmitter         from 'events'

export const create  = () => Promise.resolve( new EventEmitter )