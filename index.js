require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const verifyFirebaseToken = require("./auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbafs04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const tasksCollection = client.db("taskDB").collection("tasks");

    app.get("/featured-tasks", async (req, res) => {
      const result = await tasksCollection
        .find()
        .sort({ deadline: 1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", verifyFirebaseToken, async (req, res) => {
      const newTask = req.body;
      // console.log(newTask);
      const result = await tasksCollection.insertOne(newTask);
      res.send(result);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.findOne(query);
      res.send(result);
    });

    app.patch("/tasks/bid/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { bidsCount: 1 } }
      );
      res.send(result);
    });

    app.get("/my-tasks", verifyFirebaseToken, async (req, res) => {
      const { userEmail } = req.query;

      const query = userEmail ? { userEmail } : {};
      try {
        const result = await tasksCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    app.get("/my-tasks/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const userEmail = req.query.userEmail;

      try {
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
          return res.status(404).json({ error: "Task not found" });
        }

        if (userEmail && task.userEmail !== userEmail) {
          return res.status(403).json({ error: "Unauthorized access" });
        }

        res.send(task);
      } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    app.put("/my-tasks/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const userEmail = req.query.userEmail;
      const updatedTaskData = req.body;

      try {
        // Update only if task with this id and userEmail exists
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id), userEmail: userEmail },
          { $set: updatedTaskData }
        );

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ error: "Task not found or unauthorized" });
        }

        if (result.modifiedCount > 0) {
          return res.json({
            success: true,
            modifiedCount: result.modifiedCount,
          });
        } else {
          return res.status(400).json({ error: "No changes were made" });
        }
      } catch (err) {
        console.error("Error Updating task:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    app.delete("/my-tasks/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      try {
        const result = await tasksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.status(404).send({ success: false, error: "Task not found" });
        }
      } catch (err) {
        console.error("Error deleting task:", err);
        res
          .status(500)
          .send({ success: false, error: "Failed to delete task" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Freelance Marketplace Server!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
