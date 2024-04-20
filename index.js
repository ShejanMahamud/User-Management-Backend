const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')

// middlewares
app.use(cors())
app.use(express.json())

//mongo config uri
const uri = process.env.MONGO_URI;

//mongo client
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const run = async () => {
    try{
        await client.connect();

        const userCollection = client.db('users').collection('userCollection');

        app.get('/users', async (req,res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.post('/users',async (req,res)=>{
            const user = req.body
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.put('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const user = req.body;

            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedUser = {
                $set:{
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter,updatedUser,options)
            res.send(result)
        })

        app.delete('/users/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result)

        })

        await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}
run().catch(console.log)

app.get('/',(req,res)=>{
    res.send('Server Running....!')
})

app.listen(port,()=>{
    console.log('App running on this port',port)
})