import express from "express"
import dotenv from "dotenv"
import conn from "./db.js"
import cookieParser from "cookie-parser"
import methodOverride from "method-override"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import { checkUser } from "./middlewares/authMiddleware.js"
import fileupload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})


// connection to the DB
conn();

const app = express()
const port =process.env.PORT || 3000;


//ejs templait engine
app.set('view engine','ejs');

// static files middleware
app.use(express.static('public'));
app.use(express.json());
app.use(fileupload({useTempFiles:true}))
app.use(methodOverride('_method',{
    methods:['POST','GET'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
//app.get(checkUser)
app.use((req, res, next) => {
    checkUser(req, res, next);
});
app.use('/photos',photoRoute);
app.use('/users',userRoute);
app.use('/',pageRoute);
//app.use('/users',userRoute);


app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
});
