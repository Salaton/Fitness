var mongoose = require("mongoose");

var trainerSchema = new mongoose.Schema({
	email        :String,
	firstname    :String,
	lastname     :String,
	address      :Number,
	service      :String,
	city         :String,
	//postal       :Number,
	description  :String,
	image        :String
	
});

module.exports = mongoose.model("Trainer", trainerSchema);