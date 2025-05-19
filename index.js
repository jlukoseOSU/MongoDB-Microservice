require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error(
    "Missing environment variables. Check MONGO_URI and PORT in .env"
  );
  process.exit(1);
}

// Connect to MongoDB using connection string from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Expense schema definition
const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
});

// Remove __v from JSON responses (automatically added by mongoose for version control)
expenseSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Create a new expense
 * POST /expenses
 * Body: JSON with userId, date, category, amount, name
 * Responses:
 * 201 Created - Expense successfully created, sends back json of expense
 * 400 Bad Request - Validation error or missing fields
 */
app.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Get all expenses for a specific user
 * GET /expenses/user/:userId
 * Params: userId (string)
 * Responses:
 * 200 OK - Returns an array of expenses (can be empty)
 * 400 Bad Request - Invalid userId
 * 500 Internal Server Error - Database error
 */
app.get("/expenses/user/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update an expense by ID
 * PUT /expenses/:id
 * Params: id (MongoDB ObjectId)
 * Body: JSON with any fields to update (e.g., category, amount)
 * Responses:
 * 200 OK - Successfully updated the expense, sends back json of expense
 * 400 Bad Request - Invalid ID format or validation error
 * 404 Not Found - No expense found with the given ID
 */
app.put("/expenses/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid expense ID" });
  }

  try {
    const updated = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Delete an expense by ID
 * DELETE /expenses/:id
 * Params: id (MongoDB ObjectId)
 * Responses:
 * 200 OK - Expense successfully deleted
 * 400 Bad Request - Invalid ID format
 * 404 Not Found - No expense found with the given ID
 * 500 Internal Server Error - Database error
 */
app.delete("/expenses/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid expense ID" });
  }

  try {
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server on port from .env
app.listen(process.env.PORT, () =>
  console.log(`Microservice running on port ${process.env.PORT}`)
);
