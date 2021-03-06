import regeneratorRuntime           from 'regenerator-runtime'
import * as deviceOrientation       from './deviceOrientation'
import * as mouse                   from './mouse'

const modes = [
    deviceOrientation,
    mouse,
]

// iterate thrught the list,
// once an element have the isSupported to return true, return the create of this element
const next = async ([ first, ...rest ]) => {

    if ( !first )
        return

    else if ( await first.isSupported() )
        return first.create()

    else
        return next( rest )
}

export const create = () =>
    next( modes )