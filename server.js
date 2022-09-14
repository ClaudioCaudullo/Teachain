const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server);
const path = require("path");
const bodyParser = require("body-parser");
const { SocketAddress } = require("net");
const port = process.env.PORT || 5000;
const ExpressPeerServer = require("peer").ExpressPeerServer;

let userArray={}

const options = {
  debug: true,
};

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("connesseione")
  socket.on("i-am-arrived", (peerID, roomID, userName,streamid) => {
    console.log("connesseion dopo e")
    socket.join(roomID);
    socket.to(roomID).emit("new-user-arrived", peerID, roomID, userName);
    userArray[socket.id]={peerID:peerID,roomID:roomID,userName:userName,streamid:streamid};
    console.log("sto inserendo",userArray)
  });

  socket.on("userExited", (peerID, roomID) => {
    try{
    console.log("exit")
    console.log("userArray",userArray)
    io.to(userArray[socket.id].roomID).emit("userLeft", userArray[socket.id].streamid);
    console.log("voglio eliminare",userArray[socket.id])

    delete userArray[socket.id]
    }catch(error){
      console.log("errore nal delete userarray",error)
    }
    console.log("nuovo userarray",userArray)
    try{
    socket.leave(roomID);
  }catch(error){
    console.log("errore nal socket leave",error)
  }
    //io.to(roomID).emit("userLeft","na stringa  aminchia", peerID);
  });

  socket.on("new message", (data, roomID) => {
    socket.emit("new message received", data);
    socket.to(roomID).emit("new message received", data);
  });

  socket.on("disconnect", () => {

    try{
      console.log("exit")
      console.log("userArray",userArray)
      io.to(userArray[socket.id].roomID).emit("userLeft", userArray[socket.id].streamid);
      console.log("voglio eliminare",userArray[socket.id])
    delete userArray[socket.id]
  }catch(error){
    console.log("errore nal delete userarray del disconnect",error)
  }
    console.log("nuovo userarray",userArray)
  });
});

// app.get("/", (req, res) => {
//   res.send("Welcome to the Fast Connect Backend ;)");
// });

app.use("/mypeer", ExpressPeerServer(server, options));

// if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
// }

server.listen(port);
