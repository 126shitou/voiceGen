import { Schema, model, models } from "mongoose"
import { getCurrentTime } from '@/lib/utils';

const VoiceSchema = new Schema({
    userId: {
        type: String,
    },
    voiceUrl: {
        type: String,
        require: [true, "voiceUrl is required"]
    },
    text: {
        type: String,
        default: ""
    },
    cost: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
    },
    updateDate: {
        type: Date,
        default: getCurrentTime()
    },
})
const Voice = models.Voice || model("Voice", VoiceSchema)
export default Voice