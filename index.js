const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//midleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.BD_USERNAME}:${process.env.BD_PASS}@cluster0.u5q3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();
    const database = client.db('coffeeStore');
    const CoffeCollection = database.collection('coffeeList')

    //data post
    app.post('/users', async (req, res) => {

      const coffeeInfo = req.body;
      console.log('my coffee info', coffeeInfo)
      const result = await CoffeCollection.insertOne(coffeeInfo)
      res.send(result)

    })
    // data get
    app.get('/users', async (req, res) => {
      const cursor = CoffeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    //data get by id
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CoffeCollection.findOne(query);
      res.send(result);
    })

    //data delete
    app.delete('/users/:id', async (req, res) => {

      const _id = req.params.id;
      const query = { _id: new ObjectId(_id) };
      const result = await CoffeCollection.deleteOne(query);
      res.send(result)
    })
    

    // data update with put

    app.put('/users/:id',async (req,res)=>{

      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {
        upsert : true
      }
      const updateInfo  ={ $set: req.body}

      const result  = await CoffeCollection.updateOne(filter,updateInfo,options);
      res.send(result)
    })

    // user added in database
    const userCollection = client.db('userData').collection('user');

      //post data in database
    app.post('/userInfo', async (req,res) => {

      const newuser = req.body;
      const result = await userCollection.insertOne(newuser);
      console.log('my coffee info', newuser)
      res.send(result)
      
      
    })
   


    //get data in database

    app.get('/userInfo',async(req,res)=>{
      const getData = userCollection.find();
      const result = await getData.toArray();
      res.send(result)
    })
     //get by id in database
    //  app.get('/userInfo/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {
    //     _id: new ObjectId(id)
    //   }
    //   const result  = await userCollection.findOne(query);
    //   res.send(result)
    //  })

    // delete by id  in database

   app.delete('/userInfo/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result  = await userCollection.deleteOne(query);
    res.send(result)
   })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {

  res.send('hello i am server')
})

app.listen(port, () => {
  console.log(`this port is open is${port}`)
})

