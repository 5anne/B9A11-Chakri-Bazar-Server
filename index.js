const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwtdtr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const jobCollection = client.db('chakriBazarDB').collection('jobs');

        app.get('/addedJobs', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/addedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.findOne(query);
            res.send(result);
        })

        app.post('/addedJobs', async (req, res) => {
            const newjob = req.body;
            console.log(newjob);
            const result = await jobCollection.insertOne(newjob);
            res.send(result);
        })

        app.put('/addedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedJobs = req.body;
            const jobs = {
                $set: {
                    image: updatedJobs.image,
                    job_name: updatedJobs.job_name,
                    jobCategory_name: updatedJobs.jobCategory_name,
                    salary_range: updatedJobs.salary_range,
                    job_description: updatedJobs.job_description,
                    job_posted_at: updatedJobs.job_posted_at,
                    deadline: updatedJobs.deadline,
                    applicants_number: updatedJobs.applicants_number
                }
            }
            const result = await jobCollection.updateOne(filter, jobs, options);
            res.send(result);
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
    res.send('All Jobs are here!!!')
})

app.listen(port, () => {
    console.log(`Console is Active on ${port}`)
})