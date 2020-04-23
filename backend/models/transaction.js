const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref:'user',
            required: true,
            unique: false,
            trim: true
        },

        to: {
            type: Schema.Types.ObjectId,
            ref:'user',
            required: true,
            unique: false,
            trim: true
        },

        date: { 
            type: Date, 
            default: Date.now() // YYYY-MM-DD hh:mm:ss
        },

        amount:{
            type: Number,
            required: true,
            minimum: 0,
            validate:{
                validator: function(value) {
                  return value > 0;
                },
                message: 'amount need to be > 0'
            },
        }
    }
);

const Transaction = mongoose.model("transaction", transactionSchema); // create model

module.exports = Transaction;