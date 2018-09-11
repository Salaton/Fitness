var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
	username :String,
	password :String,
	fullname :String,
	email    :String,
	phoneno  :Number,
	address  :String,
	classes: [
  { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes'
  }
]
});

//adds some methods from the 'PLM' package to our userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);