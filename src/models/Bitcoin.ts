import { model, Schema } from 'mongoose'
import { BitcoinInterface } from '../interfaces/BitcoinDto'

const bitcoinSchema = new Schema<BitcoinInterface>(
  {
    name: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
    },
    sellers: {
      type: Number,
    },
  },
  { timestamps: true }
)

const Bitcoin = model<BitcoinInterface>('Bitcoin', bitcoinSchema)

export default Bitcoin
