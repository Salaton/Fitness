var mongoose = require("mongoose");


var enrollSchema = new mongoose.Schema({
	username :String,
	email    :String,
	fullname :String,
	enroll   : Array,
});



module.exports = mongoose.model("enroll", enrollSchema);