const baseUrl = "http://localhost:3000/expenses";

// Create example expense
async function createExpense({ userId, date, category, amount, name }) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, date, category, amount, name }),
  });
  const data = await response.json();
  console.log("Created:", data);
  return data._id;
}

// get expenses for a specified user
async function getExpenses(userId) {
  const response = await fetch(`${baseUrl}/user/${userId}`); // await fetch(`http://localhost:3000/expenses/user1`
  const data = await response.json();
  console.log("Recieved expenses:", data);
}

// update an expense
async function updateExpense(id, updatedValues) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedValues),
  });
  const data = await response.json();
  console.log("Updated:", data);
}

// delete an expense
async function deleteExpense(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log("Deleted:", data);
}

// main
(async () => {
  try {
    // example expense
    const expenseData = {
      userId: "user1",
      date: "2025-05-18",
      category: "Food",
      amount: 25.5,
      name: "Lunch",
    };

    const id = await createExpense(expenseData); // make example expense
    await getExpenses("user1"); // get expenses for user1

    updatedExpenseData = {
      name: "Groceries",
      amount: 30.0,
    };

    await updateExpense(id, updatedExpenseData); // update example expense
    await getExpenses("user1"); // get expenses for user1 again

    await deleteExpense(id); // delete expense
    await getExpenses("user1"); // get expenses for user1 again
  } catch (err) {
    console.error("Error:", err);
  }
})();
