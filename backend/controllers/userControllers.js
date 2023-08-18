import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js'
import Diagnosis  from '../models/diagnosisModels.js'

//@desc    Register a new user
//route    POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, department, matric_number, email, phoneNumber, level, genotype, bloodGroup, dateOfBirth, religion, stateOfOrigin, lga, nationality, sex, address} = req.body

    // checking if user exists with email
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    // checking if user exists with matric
    const userExistsMatric = await User.findOne({matric_number})
    if (userExistsMatric) {
        res.status(400)
        throw new Error('User already exists')
    }
    // checking if user exists with phone number
    const userExistsPhone = await User.findOne({phoneNumber})
    if (userExistsPhone) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user  = await User.create({
        firstName,
        lastName,
        department,
        matric_number,
        email,
        phoneNumber,
        level,
        genotype,
        bloodGroup,
        dateOfBirth,
        religion,
        stateOfOrigin,
        lga,
        nationality,
        sex,
        address
    })

    if (user) {
        
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            department: user.department,
            matric_number: user.matric_number,
            email: user.email, 
            phoneNumber: user.phoneNumber, 
            level: user.level,
            genotype: user.genotype,
            bloodGroup: user.bloodGroup,
            dateOfBirth: user.dateOfBirth,
            religion: user.religion,
            stateOfOrigin: user.stateOfOrigin,
            lga: user.lga,
            nationality: user.nationality,
            sex: user.sex,
            address: user.address,
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//@desc     Get user data by :id
//route     Get /api/users/:id
//@access   Private
const getUserDetailsById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
        // Retrieve user details from the database based on the provided ID
        const user = await User.findById(userId, 'firstName lastName email department matric_number phoneNumber level genotype bloodGroup dateOfBirth religion stateOfOrigin lga nationality sex address');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
      
        res.json(user);

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Error finding user' });
    }
})

//@desc    Add a new diagnosis for a user
//route    POST /api/users/:id/diagnoses
//@access  Private
const addDiagnosis = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    const { name, description, diagnosingDoctor } = req.body;
  
    // Create a new diagnosis document
    const diagnosis = await Diagnosis.create({
      userId,
      name,
      description,
      diagnosingDoctor,
    });
  
    // Add the newly created diagnosis's ID to the user's diagnoses array
    user.diagnoses.push(diagnosis._id);
    await user.save();
  
    res.status(201).json({
      _id: diagnosis._id,
      userId: diagnosis.userId,
      name: diagnosis.name,
      description: diagnosis.description,
      date: diagnosis.date,
      diagnosingDoctor: diagnosis.diagnosingDoctor,
    });
});

//@desc    Get all diagnoses for a user
//route    GET /api/users/:id/diagnoses
//@access  Private
const getUserDiagnoses = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    // Retrieve all diagnoses for the user
    const diagnoses = await Diagnosis.find({ userId });
  
    res.json(diagnoses);
});

//@desc    Get all diagnoses
//@route   GET /api/getUSers
//@access  Public
const getUserDetails = asyncHandler(async (req, res) => {
  try {
    // Retrieve all users' details from the database
    const users = await User.find({}, 'firstName lastName department matric_number email phoneNumber sex');

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(users);
  } catch (err) {
    console.error('Error finding users:', err);
    res.status(500).json({ error: 'Error finding users' });
  }
});

//@desc    Get all diagnoses
//@route   GET /api/getDiagnosis
//@access  Public
const getDiagnosis = asyncHandler(async (req, res) => {
  try {
    // Retrieve all users' details from the database
    const users = await Diagnosis.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No Diagnosis found' });
    }

    res.json(users);
  } catch (err) {
    console.error('Error finding Diagnosis:', err);
    res.status(500).json({ error: 'Error finding Diagnosis' });
  }
});



export {
  registerUser,
  getUserDetails,
  getUserDetailsById,
  addDiagnosis,
  getUserDiagnoses,
  getDiagnosis
}

// |