const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    customer_name:{
        required:true,
        type:String
    },
    dob:{
        required:true,
        type:String,
        validate:{
             validator: function(values){
                const today = new Date();
                const birthDate = new Date(values);
                const age  = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if(monthDiff <0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
                    age--;
                }

                return age >= 15;
             },
             message:'Age must be at least 15.'
            }
        
    },
    monthly_income:{
        required:true,
        type:String
    }
})

module.exports = mongoose.model('Data',dataSchema)