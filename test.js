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
  const response = await fetch(`${baseUrl}/user/${userId}`);
  const data = await response.json();
  console.log("Recieved expenses:", data);
}

// update an expense
async function updateExpense(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "Groceries", amount: 30.0 }),
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
    const expenseData = {
      userId: "user1",
      date: new Date().toISOString(),
      category: "Food",
      amount: 25.5,
      name: "Lunch",
    };

    const id = await createExpense(expenseData);
    await getExpenses("user1");
    await updateExpense(id);
    await getExpenses("user1");
    await deleteExpense(id);
  } catch (err) {
    console.error("Error:", err);
  }
})();
