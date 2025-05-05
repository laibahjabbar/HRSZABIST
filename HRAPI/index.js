const express=require('express');
const cors=require('cors');
const pool=require('./db');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    try{
        res.json('welcome ');
    }
    catch(err){
        res.status(500).json({Error:err.messgage})
    }
});


app.get('/emp',async(req,res)=>{
    try{
        const result =await pool.query('select * from employees ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/empcount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from employees ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/countriescount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from countries ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/regionscount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from regions ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})


const PORT=process.env.PORT;
app.listen(PORT,()=>{
   console.log(`connect successfully..on PORT ${PORT}`);
});