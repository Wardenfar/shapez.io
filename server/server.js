const io = require('socket.io');
const server = io.listen(8000);

console.log("Listening")

let clients = [];
let storage = {};

server.on('connection', (socket) => {

    console.log('Connected client');

    socket.on('get', function(data, callback){
        let shape = JSON.stringify(data.shape);

        let result;
        if(!storage[shape]){
            result = false;
            storage[shape] = 0;
        }else if(storage[shape] <= 0){
            result = false;
        }else{
            result = true;
            storage[shape]--;
        }
        console.log('get', result, storage[shape], data.shape[0][0].subShape)
        callback({result})
    })

    socket.on('send', function(data){
        let shape = JSON.stringify(data.shape);
        if(!storage[shape]){
            storage[shape] = 0
        }
        storage[shape]++;
        console.log('send', storage[shape], data.shape[0][0].subShape)
    })

    socket.on("disconnect", () => {
        let index = clients.indexOf(socket)
        if(index != -1){
            clients = clients.splice(index, 1)
        }
        console.info(`Client disconnected [id=${socket.id}]`);
    });
});