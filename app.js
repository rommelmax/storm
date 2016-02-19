var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	twit = require('twit'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

//Rutas
var routes = require('./routes/index');

//Redes Sociales
var streamTw = require('./routes/rs/streamingTwitter');

//SVP Estadísticas
var estValman = require('./routes/SVP/estadisticas/valman');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use('/', routes);

//Redes Sociales
app.use('/rs/streamingTwitter', streamTw);

//SVP Estadisticas
app.use('/SVP/estadisticas/valman', estValman);

var count = 0;
io.sockets.on('connection', function(socket){
	count++;
	console.log('Usuario conectado. - ' + count + ' Usuario(s) online');
	socket.emit('users', {number:count});
	socket.broadcast.emit('users', {number:count});
	socket.on('disconnect', function(){
		count--;
		console.log('Usuario desconectado. - ' + count + ' Usuario(s) online');
		socket.broadcast.emit('users',{number:count});
	});
});

var T = new twit({
	consumer_key: 'W9VIomDrWBZPW7WyHRN6lPcs8',
	consumer_secret: 'zFdLBRyxiVDSwPjJhQogqHdwAUrjJcOhX9HFO77YoL4Pa35wTv',
	access_token: '837012307-YuuPs8rNL0Xs3obNb5MNn1E73iEE0iZebVjcA5Et',
	access_token_secret: 'TNM0UJSaOBOQs4pZNwlivkUsIRtILwZhGbuTcwtBDEm2W',
	callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
});

/*
T.stream('statuses/filter', {track: ['amor','@TagTelevia','televia.com.mx','#TelevíaTeMueve','#TAGTeleVía','52658855','@Circuito_Mx','@Supervia_DF','#PasaConPase','@tagpasemx','@AUSurMx','@OHL_Mexico']}, function(stwitter){
	stwitter.on('data', function(tweet){
		io.sockets.emit('stwitter',{
			avatar: tweet.user.profile_image_url_https,
			user: '@' + tweet.user.screen_name,
			text: tweet.text,
			ubicacion: tweet.user.location,
			creacion: tweet.created_at,
			siguiendo: tweet.user.friends_count,
			seguidores: tweet.user.followers_count	
		});
	});
});
*/

var stwitter = T.stream('statuses/filter', {track: ['amor','@TagTelevia','televia.com.mx','#TelevíaTeMueve','#TAGTeleVía','52658855','@Circuito_Mx','@Supervia_DF','#PasaConPase','@tagpasemx','@AUSurMx','@OHL_Mexico']})
stwitter.on('tweet', function(tweet){		
	io.sockets.emit('stwitter',{
		avatar: tweet.user.profile_image_url_https,
		user: '@' + tweet.user.screen_name,
		text: tweet.text,
		ubicacion: tweet.user.location,
		creacion: tweet.created_at,
		siguiendo: tweet.user.friends_count,
		seguidores: tweet.user.followers_count	
	});
});


/*
T.post('statuses/update', {status:'Yeah!!!, por esto soy Ing. Twit desde Node.js'},function(err, data, response){
	console.log(data)
})
*/
/*
T.get('search/tweets', {q:'TagTelevia since:2016-02-16',count:1000}, function(err,data,res){
	console.log(data)
})
*/
server.listen(3000, function(){
	console.log('Servidor activo en el puerto 3000.');
});

module.exports = app;