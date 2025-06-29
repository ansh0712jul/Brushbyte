import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express();


app.use(cors( {
    origin : process.env.CORS_ORIGIN,
    credentials : true

}))

// to get data form json 
app.use(express.json({
    limit : "20kb",
}))

// url encoder middleware to get data from url
app.use(urlencoded({
    extended : true,
    limit : "20kb"
}))

app.use(express.static("public"))
app.use(cookieParser())


// import routes here 
import userRouter from "./routes/user.routes.js"


app.use("/api/v1/users" , userRouter );

export { app };