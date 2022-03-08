// import express, { Router } from 'express';
// import morgan from 'morgan';
// import mongoose, { connect } from 'mongoose';


const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express();
const port  = 3000;
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(morgan(':remote-addr - :remote-user :method :url [:date[clf]] :status :res[content-length] - :response-time ms'))

const db = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/perfomance", { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("database connected successfully");
    } catch (error) {
        console.log("database not connected", error);
    }
}
db()

var userSchema = new mongoose.Schema({
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    semester: {
      type: String,
    },
    passout: {type: String},
    lastgrade: { type: Number},
    address: { type: String},
    collage: { type: String},
    hobbi: {type: String}
  });
  
const student = mongoose.model('student', userSchema);

var userSchema = new mongoose.Schema({
    id: {
      type: Number,
    },
  });
  
const present = mongoose.model('present', userSchema);

app.route('/create_student').get(async (req, res) => {
    var myArray = []
    for (let i = 0; i < 500000; i++) {
        myArray.push({
            id: i+1,
            name: 'pratik rameshbhai ranpariya',
            semester: '3rd',
            passout: '12th',
            lastgrade: 88,
            address: '46, rajeshwari society, near abc mall, Kenal road kamrej, surat, 395006',
            collage: 'vidhyadeep institute of technologies',
            hobbi: 'cricket, music, reading'
        })
    }
    await student.insertMany(myArray)
    return res.json({data: myArray})
})

app.route('/create_present').get(async (req, res) => {
    var myArray = []
    for (let i = 500001; i < 1000000; i++) {
        myArray.push({
            id: i+1,
        })
    }
    await present.insertMany(myArray)
    return res.json({data: myArray})
})

app.route('/count_student').get(async (req, res) => {
    return res.json(await student.countDocuments())
})

app.route('/count_present').get(async (req, res) => {
    return res.json(await student.countDocuments())
})

app.route('/get_student').get(async (req, res) => {
    const Agg = [
        {
            $match: {
                id: {
                    $in: [500000, 2000, 4000]
                }
            }
        },
        {
            $limit: 10
        },
    ]
    return res.json(await student.aggregate(Agg))
})

app.route('/get_present').get(async (req, res) => {
    const Agg = [
        {
            $match: {
                id: { $in : [500000, 2000, 4000, 2525, 453543, 15231,] }
            }
        },
        // {
        //     $lookup: {
        //         from: 'students',
        //         localField: 'id',
        //         foreignField: 'id',
        //         as: 'student'
        //     }
        // },
        {
            $limit: 10
        },
    ]
    return res.json(await present.aggregate(Agg))
})

app.listen(port, () => {
    console.log(`we are live on ${port}`)
})