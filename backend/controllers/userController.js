import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body
    // console.log(req.body)
    // find user on basis of either email or username object
    const user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      // if user exists return from function with error message
      return res.status(400).json({ error: 'User already exists' })
    }

    // generate a salt to be hased with password
    const salt = await bcrypt.genSalt(10)
    // generate hashed password with salt
    const hashedPassword = await bcrypt.hash(password, salt)

    // create a new user
    const newUser = new User({
      // name -> name: name,
      name,
      email,
      username,
      password: hashedPassword,
    })

    // save the new user in database
    await newUser.save()

    // if newUser exists/ newUser is created return status of 201 and userData
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        // bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      })
    } else {
      res.status(400).json({ error: 'Invalid user data' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log('Error in signupUser: ', err.message)
  }
}

// login user function
export const loginUser = async (req, res) => {
  try {
    // get username and password from body
    const { username, password } = req.body
    // find user from database using username
    const user = await User.findOne({ username })
    // if password is correct/not
    // if wrong username then user will be null hence compare empty string with password for that
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    )

    // if no user or password not correct return from function
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: 'Invalid username or password' })
    generateTokenAndSetCookie(user._id, res)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    //   bio: user.bio,
      profilePicture: user.profilePicture,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log('Error in loginUser: ', err.message)
  }
}

// logs out user by clearing the cookie
export const logoutUser = async (req, res) => {
  try {
    // clear the cookie
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({ message: 'User logged out successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log('Error in logoutUser: ', err.message)
  }
}




// getting user profile
export const getUserProfile = async (req, res) => {
  // fetch user profile either by username or userId
  // query is either username or id
  const { query } = req.params
  try {
    let user

    // check if the query is valid userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select('-password')
        .select('-updatedAt')
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select('-password')
        .select('-updatedAt')
    }

    // find user using username and select everything except the password
    // const user = await User.findOne({ username })
    // .select('-password')
    // .select('-updatedAt')

    // if user not present return user not found
    if (!user) return res.status(400).json({ error: 'User not found' })

    // return user if status 200
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log('Error in getUserProfile: ', err.message)
  }
}
