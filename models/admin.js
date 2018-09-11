var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var adminSchema = new mongoose.Schema({
	adminname  :String,
	email     :String,
	firstname :String,
	lastname  :String,
	address   :Number,
	city      :String,
	
});

//adds some methods from the 'PLM' package to our adminSchema
adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);