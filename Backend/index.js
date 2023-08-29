const connectToDb=require("./db")
const express=require("express")
var cors = require('cors')           //this is used call api in fronthend directly
const app=express()
app.use(cors())
connectToDb();
app.use(express.json())      //it must when we want to used req.body

app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))
app.listen(5000)