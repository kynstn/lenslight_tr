import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import Photo from "../models/photoModel.js";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({user:user_id})}
    catch (error) {
      console.log("ERROR",error)
      let errors2={};
      if(error.code===11000){
        errors2.email="Email adresi zaten kayıtlıydı."
      }

      if(error.name==="ValidationError"){
        Object.keys(error.errors).forEach((key)=> {
          errors2[key]=error.errors[key].message;
        });
      }

    res.status(400).json(errors2);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("req.body",req.body);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        succeded: false,
        err: "there is no such user",
      });
    }
    console.log("Kullanıcının forma girdiği şifre:", password);
    console.log("Veritabanından (DB) çekilen şifre:", user.password);

    const same = await bcrypt.compare(password, user.password);
   
    if (same) {

      const token=createToken(user._id)
      res.cookie('jwt',token,{
        httpOnly:true,
        maxAge:1000*60*60*24,
      });
      res.redirect('/users/dashboard')

      
    }else{
      res.status(401).json({
      succeded: false,
      error: "Passwords are not matched",
    });

    }


  } catch (err) {
    return res.status(500).json({
      succeded: false,
      err: err.message,
    });
  }
};

const createToken =(userId)=> {
    return jwt.sign({userId},process.env.JWT_SECRET,
        {expiresIn:'1d',}
    )
}
const getDashboardPage = async (req, res) => {
    try {
        // Eğer kullanıcı giriş yapmadıysa null güvenliği kontrolü
        if (!res.locals.user) {
            return res.redirect('/login');
        }

        const photos = await Photo.find({ user: res.locals.user._id });
        const user =await User.findById({_id: res.locals.user._id}).populate(["followings","followers"])
        res.render("dashboard", {
            link: "dashboard",
            photos: photos,
            user, 
        });
    } catch (error) {
        console.log("Dashboard Hatası:", error.message);
        res.status(500).send("Dashboard yüklenirken bir sorun oluştu.");
    }
};
const getAllUsers= async(req,res)=>{
        try {
            const users = await User.find({_id:{$ne: res.locals.user._id  }})
            res.status(200).render("users",{
                users,
                link:'users',

            });
            }
         catch (error) {
            res.status(500).json({
            succeded:false,
            error,
        });

}
};
const getAUser= async(req,res)=>{
        try {
            const user = await User.findById({_id: req.params.id})

            const inFollowers= user.followers.some((follower)=>{
              return follower.equals(res.locals.user._id);
            })
            const photos = await Photo.find({user:req.params.id})
            res.status(200).render("user",{
                user,
                photos,
                link:'users',
                inFollowers,

            });
            }
         catch (error) {
            res.status(500).json({
            succeded:false,
            error,
        });

}
};
const follow= async(req,res)=>{
        try {

          let user=await User.findByIdAndUpdate({
            _id: req.params.id
          },
        
        {
          $push:{followers:res.locals.user._id}

        },
      {
        new:true
      },)
      user =await User.findByIdAndUpdate({
            _id: res.locals.user._id
          },
        
        {
          $push:{followings:req.params.id}

        },
      {
        new:true
      },)
      res.status(200).redirect(`/users/${req.params.id}`)
 
            }
         catch (error) {
            res.status(500).json({
            succeded:false,
            error,
        });

}
};
const unfollow= async(req,res)=>{
        try {

          let user=await User.findByIdAndUpdate({
            _id: req.params.id
          },
        
        {
          $pull:{followers:res.locals.user._id}

        },
      {
        new:true
      },)
      user =await User.findByIdAndUpdate({
            _id: res.locals.user._id
          },
        
        {
          $pull:{followings:req.params.id}

        },
      {
        new:true
      },)
   res.status(200).redirect(`/users/${req.params.id}`)
 
            }
         catch (error) {
            res.status(500).json({
            succeded:false,
            error,
        });

}
};
export { createUser, loginUser, getDashboardPage,getAllUsers,getAUser,follow,unfollow };