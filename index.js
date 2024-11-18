const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//midlware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rvjkksn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const coffeCollection = client.db("coffeDb").collection('Coffe');


        app.get('/coffe', async (req, res) => {
            const result = await coffeCollection.find().toArray();
            res.send(result);
        })
        app.get('/coffe/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffe', async (req, res) => {
            const newCofee = req.body;
            const result = await coffeCollection.insertOne(newCofee)
            res.send(result)

        })

        app.delete('/coffe/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/coffe/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const upadtedCoffe = req.body
            const updateDoc = {
                $set: {
                    name: upadtedCoffe.name,
                    quantity: upadtedCoffe.quantity,
                    supplier: upadtedCoffe.supplier,
                    taste: upadtedCoffe.taste,
                    category: upadtedCoffe.category,
                    details: upadtedCoffe.details,
                    photo: upadtedCoffe.photo
                },
            };
            const result = await coffeCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Coffe server is running")

})
app.listen(port, () => {
    console.log(`coffe server is running on  Port ${port}`);
})
