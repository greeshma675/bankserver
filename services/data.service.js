const jwt=require('jsonwebtoken')
//import db.js
const db=require('./db')

// db={
//     1000:{"acno":1000,"username":"anu","password":1000,"balance":5000,transaction:[]},
//     1001:{"acno":1001,"username":"binu","password":1001,"balance":3000,transaction:[]}
//   }
  const register=(username,acno,password)=>{

    return db.user.findOne({
      acno
    }).then(user=>{
      console.log(user);
      if(user){
        return{
                status:false,
                message:"Already registered..!!Please login.",
                statusCode:401
            }
          }else{
            // db[acno]={acno,username,password,"balance":0,transaction:[]}
            // insert to db
            const newUser=new db.user(
              {
                acno,
                username,
                password,
                balance:0,
                transaction:[]
            })
            newUser.save()
            return{
              status:true,
              message:"Registered successfully",
              statusCode:200
          }
          }
    })
  
    // if(acno in db){
    //   return{
    //       status:false,
    //       message:"Already registered..!!Please login.",
    //       statusCode:401
    //   }
    // }else{
    //   db[acno]={acno,username,password,"balance":0,transaction:[]}
    //   return{
    //     status:true,
    //     message:"Registered successfully",
    //     statusCode:200
    // }
    // }
  }
  const login=(acno,password)=>{
    return db.user.findOne({
      acno,
      password
    }).then(user=>{
      if(user){
        currentUser=user.username
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
          message:"Invalid username or password",
          statusCode:401
      }
      }
    })
    // if(acno in db){
    //     if(pswd==db[acno]["password"]){
    //       currentUser=db[acno]["username"]
    //       currentAcno=acno
    //       token=jwt.sign({
    //         //store account no inside token
    //         currentAcno:acno
    //       },"secretkey12345")
    //       return {
    //           status:true,
    //           message:"Login successfully",
    //           statusCode:200,
    //           currentUser,
    //           currentAcno,
    //           token
    //       }
    //     }else{
    //       return {
    //           status:false,
    //           message:"Incorrect password",
    //           statusCode:401
    //       }
    //     }
    // }else{
    //   return {
    //     status:false,
    //     message:"User not existing",
    //     statusCode:401
    // }
    // }
  }
  const deposit=(acno,pswd,amount)=>{
    return db.user.findOne({
      acno,
      password:pswd,
      amount}).then(user=>{
      let amnt=parseInt(amount)
      if(user){
        user.balance+=amnt
        user.transaction.push({
          type:"CREDIT",
          amount:amnt
        })
        user.save()
        return {
            status:true,
            message:amnt+" deposited.New balance="+user.balance,
            statusCode:200
        }
      }else{
        return {
          status:false,
          message:"Invalid credentials",
          statusCode:401
      }
      }
    })
    // if(acno in db){
    //   if(pswd==db[acno]["password"]){
    //     let amnt=parseInt(amount)
    //     db[acno]["balance"]+=amnt
    //     db[acno].transaction.push({
    //       type:"CREDIT",
    //       amount:amnt
    //     })
    //     return {
    //         status:true,
    //         message:amnt+" deposited.New balance="+db[acno]["balance"],
    //         statusCode:200
    //     }
    //   }else{
    //     return {
    //       status:false,
    //       message:"Incorrect password",
    //       statusCode:401
    //   }
    //   }
    // }else{
    //   return {
    //     status:false,
    //     message:"User not existing",
    //     statusCode:401
    // }
    // }
  }
  const withdraw=(acno,pswd,amount)=>{
    let amnt=parseInt(amount)
    return db.user.findOne({
      acno,password:pswd,amount
    }).then(user=>{
      if(user){
        if(user.balance>amnt){
          user.balance=user.balance-amnt
          user.transaction.push({
            type:"DEBIT",
            amount:amnt
          })
          user.save()
          return {
            status:true,
              message:amnt+" withdrawed.New balance="+user.balance,
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
          message:"Invalid credentials",
          statusCode:401
      }
      }
    })
    
    
    // if(acno in db){
    //   if(pswd==db[acno]["password"]){
    //     let amnt=parseInt(amount)
    //     if(db[acno]["balance"]>amnt){
    //     db[acno]["balance"]=db[acno]["balance"]-amnt
    //     db[acno].transaction.push({
    //       type:"DEBIT",
    //       amount:amnt
    //     })
    //     return {
    //       status:true,
    //         message:amnt+" withdrawed.New balance="+db[acno]["balance"],
    //         statusCode:200
    //     }
    //   }
    //     else{
    //       return {
    //         status:false,
    //         message:"Insufficient balance",
    //         statusCode:422
    //     }
    //     }
    //   }else{
    //     return {
    //       status:false,
    //       message:"Incorrect password",
    //       statusCode:401
    //   }
    //   }
    // }else{
    //   return {
    //     status:false,
    //     message:"User not existing",
    //     statusCode:401
    // }
    // }
  }
  const getTransaction=(acno)=>{
    return db.user.findOne({acno}).
    then(user=>{
      if(user){
        return{
          status:true,
          statusCode:200,
          transaction:user.transaction
        } 
      }else{
        return {
          status:false,
          message:"User not existing",
          statusCode:401
        }
      }
    })
    // if(acno in db){
    // return{
    //   status:true,
    //   statusCode:200,
    //   transaction:db[acno]["transaction"]
    // } 
    // }
    // else{
    //   return {
    //     status:false,
    //     message:"User not existing",
    //     statusCode:401
    //   }
    // }
  }
  //export
module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction
}