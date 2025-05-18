import mongoose  from 'mongoose'



const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address:{ type: [String],default:"" },
  phoneNo:{ type: String, default:"" },
  isActive:{ type: Boolean, default:false },
  alergy:{ type: [String], default:[] },
  avatar:{ type: String, default:"https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=360" },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;