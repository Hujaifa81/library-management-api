import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './config'
import routes from './modules/routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        message: 'Server is Running',

    });
})

app.listen(config.port, () => {
    console.log(`server is running ${config.port}`);
})

async function server() {
    try {
        await mongoose.connect(config.db_url as string)
        console.log('db connected')
    }
    catch (error) {
        console.error(`server error ${error}`)
    }
}
server()