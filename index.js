const express = require("express");
const path = require("path");
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express();
const PORT = process.env.PORT || 8080;

//Midelware
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // body-parser
app.use(express.urlencoded());
//Sesiones
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
app.use(session({
  store: MongoStore.create({
      mongoUrl:"mongodb+srv://gonzalo:gonzalo@cluster0.ibhqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      mongoOptions: advancedOptions
  }),
  cookie: { maxAge: 60000 },
  secret:"misecreto",
  resave:false,
  saveUninitialized:false,
  rolling:true
}))


//Routes
const chatRoute = require("./routes/chat")
app.use("/api/chat", chatRoute);
const ptosTest = require("./routes/ptosTest")
app.use("/api/productos-test", ptosTest);
const login = require("./routes/login")
app.use("/api/login", login)
const logout = require("./routes/logout")
app.use("/api/logout", logout)

//Servidor HTTP
const http = require("http");
const server = http.createServer(app);

//Servidor de Socket
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket)=> {
  socket.emit("render", "")
  socket.on("actualizacion", ()=>{
    io.sockets.emit("render", "")
  })
})


//Comienzo Servidor
server.listen(PORT, () => {
  console.log(`Server is run on port ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))