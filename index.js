require('dotenv').config()
const path = require('path')
const routes = require('./src/routes')

const lti = require('ltijs').Provider

// Setup
lti.setup('iualcoelknasfnk',
    {

        url: 'mongodb+srv://testFarr:251098@cluster0.aju2r.mongodb.net/?retryWrites=true&w=majority',
        connection: {user: process.env.DB_USER, pass: process.env.DB_PASS}
    }, {
        staticPath: path.join(__dirname, './public'), // Path to static files
        cookies: {
            secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
            sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
        },
        devMode: true, // Set DevMode to true if the testing platform is in a different domain and https is not being used
        dynRegRoute: '/register'
})

// When receiving successful LTI launch redirects to app
lti.onConnect(async (token, req, res) => {
    return res.sendFile(path.join(__dirname, './public/index.html'))
})

// When receiving deep linking request redirects to deep screen
lti.onDeepLinking(async (token, req, res) => {
    return lti.redirect(res, '/deeplink', {newResource: true})
})

// Setting up routes
lti.app.use(routes)

// Setup function
const setup = async () => {
    await lti.deploy({port: 5110})
    await lti.registerPlatform({
        url: 'https://wtech-moodle.net',
        name: 'Moodle',
        clientId: 'd1zUijq8RnrWNV6',
        authenticationEndpoint: 'https://wtech-moodle.net/mod/lti/auth.php',
        accesstokenEndpoint: 'https://wtech-moodle.net/mod/lti/token.php',
        authConfig: {method: 'JWK_SET', key: 'https://wtech-moodle.net/mod/lti/certs.php'}
    })
}

setup()
