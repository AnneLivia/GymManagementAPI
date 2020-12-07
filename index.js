//importação de pacotes
const express = require('express');
const consign = require('consign');

//inicializa a aplicacao com express
const app = express();

//importa arquivos em subpastas para o index
consign().
	then("routes").
	into(app);

app.listen(3000, () => {
	console.log('server started');
});