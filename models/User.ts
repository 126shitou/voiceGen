import { Schema, model, models } from "mongoose"
const UserSchema = new Schema({
    thirdPartId: {
        type: String,
        unique: [true, "User Id alreay exists"],
    },
    name: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
    },
    image: {
        type: String
    },
    Balance: {
        type: Number,
        default: 0
    },
    CreateDate: {
        type: String,
    },
    UpdateDate: {
        type: String,
        default: new Date().toLocaleString()
    },

})
const User = models.User || model("User", UserSchema)
export default User