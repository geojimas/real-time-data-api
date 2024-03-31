import mongoose from 'mongoose'

export const connectDB = async () => {
    const URI: string = process.env.MONGO_URI ? (process.env.MONGO_URI as string) : ''
    try {
        mongoose.connection.on('connected', () => console.log('Connecting..'))
        mongoose.connection.on('open', () => console.log('opening..'))
        const conn = await mongoose.connect(URI, {})
        console.log('MongoDB connected Successfully!')
        console.log(`Host: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        throw new Error('Unable to connect to the database')
    }
}