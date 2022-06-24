const jwt=require('jsonwebtoken')

db={
    1000:{"acno":1000,"username":"anu","password":1000,"balance":5000,transaction:[]},
    1001:{"acno":1001,"username":"binu","password":1001,"balance":3000,transaction:[]}
  }
  const register=(username,acno,password)=>{
    if(acno in db){
      return{
          status:false,
          message:"Already registered..!!Please login.",
          statusCode:401
      }
    }else{
      db[acno]={acno,username,password,"balance":0,transaction:[]}
      return{
        status:true,
        message:"Registered successfully",
        statusCode:200
    }
    }
  }
  const login=(acno,pswd)=>{
    if(acno in db){
        if(pswd==db[acno]["password"]){
          currentUser=db[acno]["username"]
          currentAcno=acno
          token=jwt.sign({
            //store account no inside token
            currentAcno:acno
          },"secretkey12345")
          return {
              status:true,
              message:"Login successfully",
              statusCode:200,
              currentUser,
              currentAcno,
              token
          }
        }else{
          return {
              status:false,
              message:"Incorrect password",
              statusCode:401
          }
        }
    }else{
      return {
        status:false,
        message:"User not existing",
        statusCode:401
    }
    }
  }
  const deposit=(acno,pswd,amount)=>{
    if(acno in db){
      if(pswd==db[acno]["password"]){
        let amnt=parseInt(amount)
        db[acno]["balance"]+=amnt
        db[acno].transaction.push({
          type:"CREDIT",
          amount:amnt
        })
        return {
            status:true,
            message:amnt+" deposited.New balance="+db[acno]["balance"],
            statusCode:200
        }
      }else{
        return {
          status:false,
          message:"Incorrect password",
          statusCode:401
      }
      }
    }else{
      return {
        status:false,
        message:"User not existing",
        statusCode:401
    }
    }
  }
  const withdraw=(acno,pswd,amount)=>{
    if(acno in db){
      if(pswd==db[acno]["password"]){
        let amnt=parseInt(amount)
        if(db[acno]["balance"]>amnt){
        db[acno]["balance"]=db[acno]["balance"]-amnt
        db[acno].transaction.push({
          type:"DEBIT",
          amount:amnt
        })
        return {
          status:true,
            message:amnt+" withdrawed.New balance="+db[acno]["balance"],
            statusCode:200
        }
      }
        else{
          return {
            status:false,
            message:"Insufficient balance",
            statusCode:422
        }
        }
      }else{
        return {
          status:false,
          message:"Incorrect password",
          statusCode:401
      }
      }
    }else{
      return {
        status:false,
        message:"User not existing",
        statusCode:401
    }
    }
  }
  const getTransaction=(acno)=>{
    if(acno in db){
    return{
      status:true,
      statusCode:200,
      transaction:db[acno]["transaction"]
    } 
    }
    else{
      return {
        status:false,
        message:"User not existing",
        statusCode:401
      }
    }
  }
  //export
module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction
}