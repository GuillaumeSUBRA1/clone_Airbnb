export default [
    {
        context: ['/oauth2', '/login', '/assets', '/auth', '/tenant', '/landlord','/booking'],
        target: 'http://localhost:8080',
        secure: true,
    }
]