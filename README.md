**Setup:**
Install dependencies with 'npm install'
   Also install and run MongoDB if using locally
   Note: I got MongoDB from https://www.mongodb.com/try/download/community
Create '.env' file to set environmental variables
   Set MONGO_URI and PORT in .env
      Example Port: 3000
      Example MONGO_URI: MONGO_URI=mongodb://localhost:27017/microservice-a
Launch the microservice with the command 'npm run start'

**How to programmatically REQUEST data:**
The main program can send data to the microservice using standard HTTP requests. These allow you to create, update, or delete expense records.

Create (POST /expenses)
To create a new expense, your application should send a `POST` request to the microservice with the expense details in JSON format. This uses the fields `userId`, `date`, `category`, `amount`, and `name`.

Read (GET /expenses/user/:userId)
Fetch all expenses for a given user by including their `userId` in the URL. The microservice responds with a JSON array of that user’s expenses, sorted by most recent date first.

Update (PUT /expenses/:id)
Update an existing expense by its unique ID. You can send only the fields you want to change. The microservice validates and applies the updates, returning the modified record.

Delete (DELETE /expenses/:id)
Remove an expense by its unique ID. If the expense exists, it will be deleted and a confirmation message is returned.

**Example of creating an expense using JS fetch:**
   await fetch('http://localhost:3000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         userId: 'user1',
         date: '2025-05-18',
         category: 'Food',
         amount: 25.50,
         name: 'Groceries'
      })
   });

**How to programmatically RECIEVE data:**
The microservice responds with JSON data, such as a single expense object after creation or update, or an array of expenses when reading by user ID. Error responses also return JSON with an error or message field describing the issue.

**Example of reading and recieving an existing user's expenses:**
   const res = await fetch('http://localhost:3000/expenses/user/user1');
   const expenses = await res.json();
   console.log(expenses); // prints expenses to console
