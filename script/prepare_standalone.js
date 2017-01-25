const fs = require('fs')

fs.writeFileSync(
    './back/src/index.js',

    fs.readFileSync('./back/src/index.js').toString()
        .replace( '\'./service/com\'', '\'./service/fake_com\'' )
)


fs.writeFileSync(
    './front/src/index.js',

    fs.readFileSync('./front/src/index.js').toString()
        .replace( '\'./service/com\'', '\'./service/fake_com\'' )
        .replace( new RegExp( '// #standalone ([^\n]*)', 'g' ), ( _, s ) => s )
)