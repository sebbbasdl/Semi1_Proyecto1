require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const router = require('./routes/index')
const admin = require('./routes/admin')
const suscriptor = require('./routes/suscriptor')

const app = express();

app.set('port', 2000);
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.set('json spaces', 2);

const cors = require('cors')
var corsOptions = { origin: true, optionsSuccessStatus: 200 }
app.use(cors(corsOptions))


app.use('/', router);
app.use('/', admin);
app.use('/', suscriptor);

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});