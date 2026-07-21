import Photo from "../models/photoModel.js"
import User from "../models/userModel.js"
const getIndexPage = async (req,res) => {

    const photos= await Photo.find().sort({  uploadedAt :-1 }).limit(9)

    const numOfUser=await User.countDocuments({})
    const numOfPhotos=await Photo.countDocuments({})


    res.render("index",{
        link:"index",
        photos,
        numOfUser,
        numOfPhotos,
    });
}

const getAboutPage = (req,res) => {
    res.render("about",{
        link:"about",
    })
};
const getRegistertPage = (req,res) => {
    res.render("register",{
        link:"register",
    })
};
const getLoginPage = (req,res) => {
    res.render("login",{
        link:"login",
    })
};
const getLogout = (req,res) => {
    res.cookie('jwt', '',{
        maxAge: 1,

    });
    res.redirect('/');

};

const createPhoto = (req, res) => {
    res.render("photo"); 
};

export { getIndexPage, getAboutPage, createPhoto,getRegistertPage,getLoginPage,getLogout };


