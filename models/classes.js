var mongoose = require("mongoose");

var classesSchema = new mongoose.Schema({
	class      :String,
	image      :String,
	description    :String,
	user: [
			  { 
			    type: mongoose.Schema.Types.ObjectId,
			    ref: 'User'
			  }
			]
			     
});

module.exports = mongoose.model("Classes", classesSchema);