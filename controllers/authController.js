import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql';

const router = express.Router();


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users' 
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected");
  }
});


export const signup = async (req, res) => {
  const { userName, userEmail, contactNumber, password } = req.body;

 
  connection.query(
    'SELECT * FROM userdata WHERE userEmail = ?',
    [userEmail],
    async (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error selecting user:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (selectResult.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10); 

      connection.query(
        'INSERT INTO userdata (userName, userEmail, contactNumber, password) VALUES (?, ?, ?, ?)',
        [userName, userEmail, contactNumber, hashedPassword], 
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting user:', insertErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(201).json({ message: 'User created successfully' });
        }
      );
    }
  );
}


export const login = async (req, res) => {
  const { userEmail, password } = req.body;


  connection.query(
    'SELECT * FROM userdata WHERE userEmail = ?',
    [userEmail],
    async (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error selecting user:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (selectResult.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = selectResult[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      
      const token = jwt.sign({ userId: user.id }, 'secret_key');
      res.status(200).json({ message: 'Login successful', token });
    }
  );
}


router.post('/signup', signup);
router.post('/login', login);

export default router;
