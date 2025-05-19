import { Schema, model, models } from "mongoose"
const OrderSchema = new Schema({
    userId: {
        type: String,
        required: [true, "userId is required"],
    },
    price: {
        type: Number
    },
    product: {
        type: String,
        require: [true, "Product is required"]
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