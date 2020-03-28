var users = [];
console.log(users);

// Join user ke dalam chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}


// GET user

function getCurrentUser(id){

    return users.find(user => user.id === id);
}

//User Meninggalkan chat room

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        //[0] di karenakan kita return hanya 1 user saja index ke 0
        return users.splice(index,1)[0];
    }
}

//GET room user
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}