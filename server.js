import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';

const app = express()

const { MONGO_URL } = process.env

const port = 3000 || process.env.PORT

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())

    const DeviceSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, "Your name is required"],
          unique: true,
        },
        value: {
          type: Boolean,
          required: [true, "Your state is required"],
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
        updatedAt: {
        type: Date,
        default: new Date(),
        }
    });
    
    const Device = mongoose.model("Device", DeviceSchema)

    const SensorSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, "Your name is required"],
          unique: true,
        },
        value: {
          type: Number,
          required: [true, "Your state is required"],
        },
        createdAt: {
          type: Date,
          default: new Date(),
          default: new Date(),
        },
        updatedAt: {
        type: Date,
        }
    });
    
    const Sensor = mongoose.model("Sensor", SensorSchema)


    const connectDB = async ( req, res ) => { 
        try {
            mongoose
            .connect(
               MONGO_URL
                )
            .then(() => console.log("MongoDB is  connected successfully"))
        } catch (error) {
            console.error(error)
        }
    }
    

app.get('/', async (res) => {
    res.status(200).json({
        'msg': 'hello world'
    })
})

app.get('/device', async (req, res) => {
    try {
        const response = await Device.find({})
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json(error)
    }
})

app.get('/device/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await Device.findOne({_id : id})
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json(error)
    }
})

app.post('/device', async (req, res) => {

    const {  name, value } = req.body
    try {
        const response = await Device.create({
            name: name,
            value: value
        })

        res.status(201).json(response)
        
    } catch (error) {
        res.status(401).json(error)
    }
})

app.put('/device/:id', async (req, res) => {

    const {  name, value } = req.body

    const { id } = req.params
    try {

        const user = await Device.findOne({ _id: id })

        if (!user) {
            return res.status(404).json({ msg: 'Not Found' });
        }

        const response = await Device.findOneAndUpdate(
            {
              _id: id 
            },
            {
              $set: { name, value }
            },
            {
                new: true
            }
        )

        res.status(201).json({'message': 'updated successfully'})
        
    } catch (error) {
        res.status(401).json(error)
    }
})

app.delete('/device/:id', async (req, res) => {
    const { id } = req.params

    try {

        const user = await Device.findOne({ _id: id })

        if (!user) {
            return res.status(404).json({ msg: 'Not Found' });
        }
        
        await Device.findOneAndDelete({ _id: id })

        res.status(201).json({ 'msg' : 'Device deleted successfully'})

    } catch (error) {
        res.status(401).json(error)
    }
    
})

app.get('/sensor', async (req, res) => {
    try {
        const response = await Sensor.find({})
        res.status(200).json(response)
    } catch (err) {
        res.status(404).json(err)
    }
})

app.get('/sensor/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await Sensor.findOne({ _id: id})
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json(err)
    }
})

app.post('/sensor', async (req, res) => {

    const { name, value } = req.body

    try {
        const response = await Sensor.create({
            name, 
            value
        })
        res.status(201).json(response)
    } catch (err) {
        res.status(401).json(err)
    }
})

app.put('/sensor/:id', async (req, res) => {
    const { id } = req.params
    const { name, value } = req.body

    try {
        const user = await Sensor.findOne({ _id: id })

        if(!user) return res.status(404).json({ 'message': 'sensor not found' })

        await Sensor.findOneAndUpdate(
            { _id : id },
            { $set : { name, value}  },
            { new: true}
        )

        res.status(201).json({'message': 'updated successfully'})
    } catch (error) {
        res.status(401).json({'message': error.message})
    }
})


app.delete('/sensor/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await Sensor.findOne({ _id: id })

        if(!user) return res.status(404).json({'message': ' sensor not found'})

        await Sensor.findOneAndDelete({ _id: id})

        res.status(201).json({ 'msg' : 'Device deleted successfully'})
    } catch (error) {
        res.status(404).json({'message': error.message})
    }
})


app.listen( port , () => {
    connectDB()
    console.log('listening on port ' + port)
})