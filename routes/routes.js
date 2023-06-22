const express = require('express');
const bodyParser = require('body-parser');
const Model = require('../model/model')
const router = express.Router();

// console.log('kmkmk')

router.use(bodyParser.json());

const customerRequests ={};

router.post('/post',async(req,res)=>{
    // console.log('err');
    const customerName = req.body.customer_name;

  

  


  try{

    const today = new Date();
    const dayOfWeek = today.getDay();

    const hours = today.getHours();

    if (dayOfWeek === 1) {
        throw{
            message:'Please don’t use this api on mondayyy'
            
        }
    }
    else if(hours >= 8 && hours <= 15){
        throw{
            message:'Please try after 3pm'
        }
    }

    if(customerRequests[customerName]){
        const requestInfo = customerRequests[customerName];
        const currentTime = new Date();


        const timeDifference = (currentTime - requestInfo.timestamp)/(1000*60);

        if(timeDifference < 5 && requestInfo.count >=1){
            throw{
                message:'maximum limit exceeded'
            };
        }

        if(timeDifference >= 2){
            requestInfo = 0;
        }

        if(customerRequests[customerName] && customerRequests[customerName].count >= 2){
            throw {
                message: 'maximum limit exceeded'
              };
        }
    }


    // console.log('try')
    
        const data = new Model({
            customer_name:req.body.customer_name,
            dob:req.body.dob,
            monthly_income : req.body.monthly_income
        });


        const dataToSave = await data.save();
         
        if (!customerRequests[customerName]) {
            customerRequests[customerName] = {
              count: 1,
              timestamp: new Date()
            };
          } else {
            customerRequests[customerName].count++;
            customerRequests[customerName].timestamp = new Date();
          }

        res.status(200).json(dataToSave);
    }catch(error){
        console.error('Validation error:',error.message);
        console.log('API Error:',error.message)
         res.status(400).json({message:error.message});
    }
    // console.log('catch')
})

router.get('/get',async (req,res)=>{

try{
    const startTime = new Date();
    const currentDate = new Date();
    const lowerAgeLimit = 10;
    const upperAgeLimit = 25;
    
    const lowerBirthDate = new Date(currentDate.getFullYear() - lowerAgeLimit, currentDate.getMonth(), currentDate.getDate());
    const upperBirthDate = new Date(currentDate.getFullYear() - upperAgeLimit - 1, currentDate.getMonth(), currentDate.getDate());
    // console.log('kkk')
    console.log(lowerBirthDate,upperBirthDate)
    const customers = await Model.find({}, { customer_name: 1, dob: 1 });

    const filteredCustomers = customers.filter(customer => {
      const dob = new Date(customer.dob);
      return dob <= lowerBirthDate && dob >= upperBirthDate;
    });


    const customerNames = filteredCustomers.map(customer => customer.customer_name);
    // console.log('arrr')
    // console.log(customerNames)
    const endTime = new Date();
    const differenceInMilliseconds = endTime - startTime;
    
    console.log(differenceInMilliseconds);

    res.status(200).json(customerNames);
}
catch(error){
    console.error(error);
    res.status(500).json({message:'Internal Server Error'})
}
})

module.exports = router;