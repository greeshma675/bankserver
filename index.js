//import express
const express = require('express')
const jsonwebtoken=require('jsonwebtoken')
//import dataservice
const dataservice=require('./services/data.service')
//serve app creation using express
const app = express()
//parse json
app.use(express.json())
//set up port number for server app
app.listen(3000,()=>{
    console.log("server started at 3000");
})
//middleware
const appMiddleware=(req,res,next)=>{
    console.log("Application specific middleware");
    next()
}
app.use(appMiddleware)

const jwtMiddleware=(req,res,next)=>{
    try{
        //fetch token
        // token=req.body.token //while token in body
        token=req.headers['token']
        // verify token
        const data=jsonwebtoken.verify(token,"secretkey12345")
        console.log(data);
        next()
    }
    catch{
        res.status(401).json({
            status:false,
            statusCode:401,
            message:"Please login"
        })
    }
}

//user request resolving
app.get('/',(req,res)=>{
    res.send("GET request")
})
//user response resolving
app.post('/',(req,res)=>{
    res.send("POST request")
})
//to modify entire data
app.put('/',(req,res)=>{
    res.send("PUT request")
})
//to modify partially
app.patch('/',(req,res)=>{
    res.send("PATCH request")
})
//to delete data
app.delete('/',(req,res)=>{
    res.send("DELETE request")
})


//register user
app.post('/register',(req,res)=>{
    console.log(req);
    const result=dataservice.register(req.body.username,req.body.acno,req.body.password)
    res.status(result.statusCode).json(result)
})
//log in
app.post('/login',(req,res)=>{
    console.log(req);
    const result=dataservice.login(req.body.acno,req.body.password)
    res.status(result.statusCode).json(result)
})
//deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req);
    const result=dataservice.deposit(req.body.acno,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})
//withdraw
app.post('/withdraw',(req,res)=>{
    console.log(req);
    const result=dataservice.withdraw(req.body.acno,req.body.password,req.body.amount)
    res.status(result.statusCode).json(result)
})
app.post('/transaction',(req,res)=>{
    console.log(req);
    const result=dataservice.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
})




