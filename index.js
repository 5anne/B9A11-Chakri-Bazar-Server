const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://chakri-bazar-8e75f.web.app",
        "https://chakri-bazar-8e75f.firebaseapp.com",
    ],
    credentials: true,
}));
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
        // await client.connect();

        const jobJsonCollection = client.db('chakriBazarDB').collection('jobsJson');
        const blogsCollection = client.db('chakriBazarDB').collection('blogsData');
        const jobCollection = client.db('chakriBazarDB').collection('jobs');
        const allJobsCollection = client.db('chakriBazarDB').collection('allJobs');
        const allAppliedJobsCollection = client.db('chakriBazarDB').collection('appliedJobs');

        app.get('/jobsJson', async (req, res) => {
            const cursor = jobJsonCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/jobsJson/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobJsonCollection.findOne(query);
            res.send(result);
        })

        app.get('/blogsData', async (req, res) => {
            const cursor = blogsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addedJobs', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.findOne(query);
            res.send(result);
        })

        app.get('/appliedJobs', async (req, res) => {
            const cursor = allAppliedJobsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
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

        app.delete('/addedJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/allJobsCount', async (req, res) => {
            const count = await allJobsCollection.estimatedDocumentCount();
            res.send({ count });
        })

        app.get('/allJobs', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const result = await allJobsCollection.find().skip(page * size).limit(size).toArray();
            res.send(result);
        })

        app.get('/allJobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allJobsCollection.findOne(query);
            res.send(result);
        })

        app.patch('/allJobs/:id', async (req, res) => {
            const user = req.body;
            console.log(user);
            const id = user._id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    numberOfApplicants: user.numberOfApplicants
                }
            }
            const result = await allJobsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.post('/appliedJobs', async (req, res) => {
            const appliedJob = req.body;
            console.log(appliedJob);
            const result = await allAppliedJobsCollection.insertOne(appliedJob);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('All Jobs are loading here!!!')
})

app.listen(port, () => {
    console.log(`Console is Active on ${port}`)
})