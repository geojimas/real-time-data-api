import mongoose, { Document } from 'mongoose'

export interface BitcoinInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string,
  price: number
  sellers: number
}

