import { Schema, model, models } from "mongoose"
const OrderSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
    },
    price: {
        type: Number
    },
    type: {
        type: String,
        enum: ["monthly", "yearly"],
        require: [true, "Type is required"]
    },
    CreateDate: {
        type: String,
    },
    UpdateDate: {
        type: String,
        default: new Date().toLocaleString()
    },

})
const Order = models.Order || model("Order", OrderSchema)
export default Order