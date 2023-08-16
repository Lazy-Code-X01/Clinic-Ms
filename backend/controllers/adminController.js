import asyncHandler from 'express-async-handler'
import Admin from '../models/adminModel.js'
import generateToken from '../utils/generateToken.js'


//@desc    Register a new admin
//route    POST /api/admin
//@access  Public
const registerAdmin = asyncHandler(async (req, res) => {
    const {firstName, lastName, username, password, address, contactNumber, email, sex} = req.body

    // checking if admin exists with email
    const adminExists = await Admin.findOne({email})
    if (adminExists) {
        res.status(400)
        throw new Error('Admin already exists')
    }
    // checking if admin exists with username
    const adminExistsUsername = await Admin.findOne({username})
    if (adminExistsUsername) {
        res.status(400)
        throw new Error('Admin already exists')
    }
    // checking if Admin exists with phone number
    const adminExistsPhone = await Admin.findOne({contactNumber})
    if (adminExistsPhone) {
        res.status(400)
        throw new Error('User already exists')
    }

    const admin  = await Admin.create({
        firstName,
        lastName,
        username,
        password,
        address,
        contactNumber,
        email,
        sex,
    })

    if (admin) {
        
        res.status(201).json({
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            username: admin.username,
            password: admin.password,
            address: admin.address, 
            contactNumber: admin.contactNumber, 
            email: admin.email,
            sex: admin.sex,
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//@desc    Auth user/set token
//route    POST /api/admin/auth
//@access  Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const admin = await Admin.findOne({email})

    if (admin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id)
        res.status(201).json({
            _id: admin._id,
            email: admin.email,
            username: admin.username,
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

//@desc    Logout  user
//route    POST /api/admin/logout
//@access  Public
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "Admin Logged out"})
})

export {
    registerAdmin,
    authUser,
    logoutAdmin,
}