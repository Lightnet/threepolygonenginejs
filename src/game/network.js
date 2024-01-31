//worker does not work due to clone copy error on socket.io, incorrect code
// 
class GameNetwork{
 static io;

 static getIO(){
  return this.io;
 }
}

export {
  GameNetwork
}