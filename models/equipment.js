var mongoose = require("mongoose");


var equipmentSchema = new mongoose.Schema({
	name         :String,
	amount       :Number,
	category     :String,
	
});



module.exports = mongoose.model("Equipment", equipmentSchema);