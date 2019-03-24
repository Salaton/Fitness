var mongoose = require("mongoose");

var responseSchema = new mongoose.Schema({
	email: String,
	firstname: String,
	lastname: String,
	subject: String,
	message: String
});

module.exports = mongoose.model("Response", responseSchema);
