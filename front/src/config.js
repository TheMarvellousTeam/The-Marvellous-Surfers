export const com = {
    port            : 80 || process.env.COM_PORT || 8080,
    hostname        : location.host || process.env.COM_HOST || 'localhost',
}
