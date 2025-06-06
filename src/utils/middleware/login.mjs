import db from "../database.mjs";
import { sendJsonResponse } from "../utilFunction.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !!password) sendJsonResponse(res, true, 400, 'All field are required', null)

    const existingEmail = await db('users')
      .where({ email })
      .select('*');

    if (existingEmail.length) sendJsonResponse(res, true, 201, 'Email alredy in used', null)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db('users')
      .insert({
        username,
        email,
        password: hashedPassword
      })


    const [newUser] = await db('users')
      .select('id', 'username', 'email')
      .where({ email });



    sendJsonResponse(res, true, 200, 'Username registered', newUser);
  } catch (error) {
    console.error(error);
    return sendJsonResponse(res, false, 500, "Failed to register", null);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !!password) sendJsonResponse(res, true, 400, 'All field are required', null)

    const user = await db('users')
      .where({ email })
      .select('*')
      .first();

    if (!user) {
      return sendJsonResponse(res, false, 401, "Invalid credentials", null);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendJsonResponse(res, false, 401, "Invalid credentials", null);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.setHeader('Authorization', `Bearer ${token}`);


    sendJsonResponse(res, true, 200, "Login successful", {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    sendJsonResponse(res, false, 500, "Server error", null);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user.id

    await db('users')
      .where({ id: id })
      .delete();

    sendJsonResponse(res, true, 200, 'Deleted user', null);
  } catch (error) {
    console.error("delete error:", error);
    sendJsonResponse(res, false, 500, "Server error", null);
  }
};