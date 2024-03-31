import { BitcoinInterface } from 'interfaces/BitcoinDto'
import Bitcoin from '../models/Bitcoin'
import { Server } from 'socket.io'

export const generateBitcoinValues = async (io: Server) => {
  const name: string = 'Salfum'
  const price: number = Math.floor(Math.random() * 49) + 2
  const sellers: number = Math.floor(Math.random() * 49) + 2
  try {
    const bitcoin: BitcoinInterface | null = await Bitcoin.findOne({ name })
    if (!bitcoin) {
      const bitcoin: BitcoinInterface = new Bitcoin({ name, price, sellers })
      await bitcoin.save()
      // Emit the new Bitcoin data to all connected clients
      const newBitcoin = await Bitcoin.findOne({ name })
      io.emit('bitcoin', newBitcoin)
    } else {
      const updatedBitcoin: BitcoinInterface | null = await Bitcoin.findByIdAndUpdate(
        { _id: bitcoin.id },
        { $set: { name, price, sellers } },
        { new: true }
      )
      console.log(`Price: ${updatedBitcoin?.price} / Sellers : ${updatedBitcoin?.sellers}`)
      if (updatedBitcoin) {
        io.emit('bitcoin', updatedBitcoin)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
