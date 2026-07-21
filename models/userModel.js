import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const {Schema}= mongoose

const userSchema=new Schema({
    username: {
        type: String,
        required: [true, "Kullanıcı adı zorunludur."],
        lowercase:true,
        validate:[validator.isAlphanumeric,"Yanlızca alfanümerik karakterler giriniz."]
        
    },
    email:{
        type:String,
        required: [true, "Email alanı zorunludur."],
        unique:true,
        validate:[validator.isEmail,"Geçerli bir email giriniz."]
    },
    password:{
        type:String,
        required:[true, "Şifre alanı zorunludur."],
        minLength:[3,"En az 3 karakter giriniz."]
    },
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        },

    ],
    followings:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        },

    ],

    
},{
    timestamps:true,
});


userSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;


  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});




const User= mongoose.model("User",userSchema);

export default User;



