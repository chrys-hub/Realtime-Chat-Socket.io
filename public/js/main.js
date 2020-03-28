const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username dan room url
const {username, room} = Qs.parse(location.search,{
	ignoreQueryPrefix:true
});

const socket=io();

//Join chatroom
socket.emit('joinroom',{username, room});

//Get Room dan users

socket.on('roomUsers', ({room, users})=>{
	outputRoomName(room);
	usersOut(users);
});

//Pesan dari server
socket.on('Pesan', Pesan =>{
	console.log(Pesan);
	outputPesan(Pesan);

	//Scroll ke bawah
	chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Submit pesan
chatForm.addEventListener('submit', e => {
	e.preventDefault();
  
	// Get message text
	const msg = e.target.elements.msg.value;
  
	// Emit message to server
	socket.emit('PesanChat', msg);

	//clear input
	//set ke empty string
	e.target.elements.msg.value = '';
	//focusing di input
	e.target.elements.msg.focus();
  });


  //Cetak Output Pesan Di DOM

  function outputPesan(Pesan){
	  //create div ele
	  const div = document.createElement('div');
	  //add class message (lihat html) di div
	  div.classList.add('message');
	  div.innerHTML=`<p class="meta">${Pesan.username} <span>${Pesan.time}</span></p>
	  <p class="text">
		  ${Pesan.text}
	  </p>`;

	  document.querySelector('.chat-messages').appendChild(div);
  };

  //Room name DOM
  function outputRoomName(room){
	roomName.innerText = room;
  };

  function usersOut(users){
  userList.innerHTML = `${users.map(user=><li>${user.username}</li>)}`;
  }