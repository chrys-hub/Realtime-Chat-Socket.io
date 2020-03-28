const express = require('express');
const path = require('path');
const http=require('http');
const socketio=require('socket.io');
const formatPesan = require('./utils/message');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app=express();
const server=http.createServer(app);
const io=socketio(server);


//set static folder untuk html dan kawan kawan
app.use(express.static(path.join(__dirname, 'public')));

const botName="Chrysna Bot";


//Di jalankan ketika ada client baru terkoneksi
io.on('connection',socket=>{
	console.log('Client Baru Terkoneksi');

	socket.on('joinroom',({username, room})=>{
	const user= userJoin (socket.id, username, room);

	socket.join(user.room);


	socket.emit('Pesan', formatPesan(botName, 'Welcome To ChrysCord!'));

	//Broadcast saat user baru terkoneksi
	socket.broadcast.to(user.room).emit('Pesan',formatPesan(botName, `${user.username} telah bergabung dalam chat`));
	
	// User room Info
	io.to(user.room).emit('roomUsers',{
		room:user.room,
		users:getCurrentUser(user.room)
	});

	});

	
	

	//Listen untuk chat massage
	socket.on('PesanChat',(msg)=>{
		const user= getCurrentUser(socket.id);
		io.to(user.room).emit('Pesan',formatPesan(user.username,msg));
	});

	//Di jalankan saat client disconnect
	socket.on('disconnect',()=>{
		const user = userLeave(socket.id);
		if(user){
		io.to(user.room).emit('Pesan',formatPesan(botName,`${user.username} telah meninggalkan chat`));
			// User room Info
		io.to(user.room).emit('roomUsers',{
		room:user.room,
		users:getRoomUsers(user.room)
	});
	}
});
});

const PORT=process.env.PORT || 3000;

server.listen(PORT,
	()=>console.log(`server berjalan pada port ${PORT}`))