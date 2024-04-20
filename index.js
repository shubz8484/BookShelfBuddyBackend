const express = require("express");
const app = express();
const port = process.env.port || 5000;
const cors = require("cors");

// const connectDB = require("./utils/db");
//middleware this will connect to our fropntend
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello server is on");
});

//mongo config

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://shubz412663:3tZNTGJT2lTIKo7Q@bookstore.cf6hgas.mongodb.net/?retryWrites=true&w=majority&appName=Bookstore";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection of documents
    const bookCollection = client.db("BookInventory").collection("books");

    //insert a book into data base
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollection.insertOne(data); // Corrected bookCollection
      res.send(result);
    });

    //get all the books from database
    // app.get("/all-books", async (req, res) => {
    //   const books = await bookCollection.find();
    //   const result = await books.toArray();
    //   res.send(result);
    // });

    //update book data : patch or update method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...updateBookData,
        },
      };
      const options = { upsert: true };
      //update
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //delete a book data

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });

    //find by nd by category
    app.get("/all-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    //to get single book data
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// connectDB().then(() => {
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
// });

// 3tZNTGJT2lTIKo7Q
// shubz412663
