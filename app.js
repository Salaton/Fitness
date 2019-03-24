var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	User = require("./models/user"),
	Class = require("./models/classes"),
	Trainer = require("./models/trainer"),
	Equipment = require("./models/equipment"),
	Admin = require("./models/admin"),
	Enroll = require("./models/enroll"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	fs = require("fs"),
	async = require("async");

mongoose.connect("mongodb://localhost/Fitness");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
	require("express-session")({
		//secret used to encode and decode sessions
		secret: "She is the only one you want",
		resave: false,
		saveUninitialized: false
	})
);

//setting up passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//reading the session, taking encoded data from sessions and decoding it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//static files
app.use(express.static("public"));

//=============================
//          ROUTES            |
//=============================

app.get("/", function(req, res) {
	var trainers = {};
	var classes = {};
	Trainer.find({}, function(err, trainer) {
		if (err) {
			console.log(err);
		} else {
			trainers = trainer;
		}
	});
	Class.find({}).exec(function(err, allClass) {
		if (err) {
			console.log(err);
		} else {
			classes = allClass;
			res.render("index", { classes: allClass, trainer: trainers });
		}
	});
});

app.post("/", function(req, res) {
	if (req.body.captcha === undefined || req.body.captcha === "" || req.body.captcha === null) {
		return res.json({ success: false, msg: "Please select captcha" });
	}

	//secret key
	const secretKey = "6LdvnJkUAAAAABdkQIzWCnGmB8TxHUj6g8FJxAbp";

	// Verify URL
	const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${
		req.body.captcha
	}&remoteip=${req.connection.remoteAddress}`;

	// Make Request To VerifyURL
	request(verifyUrl, (err, response, body) => {
		body = JSON.parse(body);
		console.log(body);

		// If Not Successful
		if (body.success !== undefined && !body.success) {
			return res.json({ success: false, msg: "Failed captcha verification" });
		}

		//If Successful
		return res.json({ success: true, msg: "Captcha passed" });
	});
});

app.get("/classes", function(req, res) {
	Class.find({}, function(err, allClass) {
		if (err) {
			console.log(err);
		} else {
			res.render("classes", { classes: allClass });
		}
	});
});

app.get("/enroll", (req, res) => {
	var username = username;
	Enroll.find({}, function(err, enroll) {
		if (err) {
			console.log(err);
		} else {
			res.render("enroll", { enroll: enroll });
		}
	});
});

app.post("/enroll", isLoggedIn, function(req, res) {
	Enroll.create(
		new Enroll({
			username: req.body.username,
			email: req.body.email,
			fullname: req.body.fullname,
			enroll: req.body.enroll
		}),
		function(err, enroll) {
			if (err) {
				console.log(err);
				return res.render("classes");
			}
		}
	);
});

app.get("/trainer", function(req, res) {
	Trainer.find({}, function(err, trainer) {
		if (err) {
			console.log(err);
		} else {
			res.render("trainer", { trainer: trainer });
		}
	});
});

app.get("/testimonial", function(req, res) {
	res.render("testimonial");
});

app.get("/contacts", function(req, res) {
	res.render("contacts");
});

//route parameters for dashboard
app.get("/Dashboard/dashboard", function(req, res) {
	res.render("Dashboard/dashboard");
});

app.get("/Dashboard/table", function(req, res) {
	var users;
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		User.find({ fullname: regex }, function(err, allUser) {
			if (err) {
				console.log(err);
			} else {
				users = allUser;
			}
		});
		// Get all equipments from DB and render them on tables page
		Equipment.find({ name: regex }, function(err, allEquipment) {
			if (err) {
				console.log(err);
			} else {
				res.render("Dashboard/table", { equipment: allEquipment, user: users });
			}
		});
	} else {
		User.find({}, function(err, allUser) {
			if (err) {
				console.log(err);
			} else {
				users = allUser;
			}
		});
		// Get all equipments from DB and render them on tables page
		Equipment.find({}, function(err, allEquipment) {
			if (err) {
				console.log(err);
			} else {
				res.render("Dashboard/table", { equipment: allEquipment, user: users });
			}
		});
	}
});

app.get("/Dashboard/equipments", function(req, res) {
	res.render("Dashboard/equipments");
});
//handling equipment details
app.post("/Dashboard/equipments", function(req, res) {
	Equipment.create(
		new Equipment({ name: req.body.name, amount: req.body.amount, category: req.body.category }),
		function(err, equipment) {
			if (err) {
				console.log(err);
				return res.redirect("Dashboard/equipments");
			}
		}
	);
});

app.get("/Dashboard/trainer", function(req, res) {
	Trainer.find({}, function(err, trainer) {
		if (err) {
			console.log(err);
		} else {
			res.render("Dashboard/trainer", { trainer: trainer });
		}
	});
});
//handling trainer details
app.post("/Dashboard/trainer", function(req, res) {
	Trainer.create(
		new Trainer({
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			address: req.body.address,
			service: req.body.service,
			city: req.body.city,
			description: req.body.description,
			image: req.body.image
		}),
		function(err, trainer) {
			if (err) {
				console.log(err);
				return res.render("Dashboard/trainer");
			}
		}
	);
});

app.get("/Dashboard/user", function(req, res) {
	res.render("Dashboard/user");
});
//handling admin details
app.post("/Dashboard/user", function(req, res) {
	Admin.create(
		new Admin({
			username: req.body.username,
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			address: req.body.address,
			city: req.body.city
		}),
		function(err, admin) {
			//delete Admin.city;
			if (err) {
				console.log(err);
				return res.render("Dashboard/user");
			}
		}
	);
});

app.get("/Dashboard/classes", function(req, res) {
	Class.find({}, function(err, allClass) {
		if (err) {
			console.log(err);
		} else {
			res.render("Dashboard/classes", { classes: allClass });
		}
	});
});
app.post("/Dashboard/classes", function(req, res) {
	Class.create(new Class({ class: req.body.class, image: req.body.image, description: req.body.description }), function(
		err,
		classes
	) {
		if (err) {
			console.log(err);
			return res.render("Dashboard/classes");
		}
	});
});

//Authentication Routes

//show sign up form
app.get("/signup", function(req, res) {
	res.render("signup");
});

//handling user sign up
app.post("/signup", function(req, res) {
	// var user = req.body;
	// delete user.password;
	// User.register(new User(user), req.body.password, function(err, user){

	User.register(
		new User({
			username: req.body.username,
			fullname: req.body.fullname,
			email: req.body.email,
			phoneno: req.body.phoneno,
			address: req.body.address
		}),
		req.body.password,
		function(err, user) {
			if (err) {
				console.log(err);
				return res.render("signup");
			}
			//log the user in
			passport.authenticate("local")(req, res, function() {
				res.redirect("/");
			});
		}
	);
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res) {
	res.render("login");
});

app.get("/adminlogin", function(req, res) {
	res.render("adminlogin");
});
//login logic
//middleware-runs between the start of the route and the final end of the route handler
app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login"
	}),
	function(req, res) {}
);

app.post(
	"/adminlogin",
	requireAdmin(),
	passport.authenticate("local", {
		successRedirect: "/Dashboard/dashboard",
		failureRedirect: "/adminlogin"
	}),
	function(req, res) {}
);

function requireAdmin() {
	return function(req, res, next) {
		User.findOne({ username: req.body.username }, function(err, user) {
			if (err) {
				return next(err);
			}
			if ((req.body.username = "Admin")) {
				successRedirect: "Dashboard/dashboard";
			} else {
				failureRedirect: "/login";
			}
			// Hand over control to passport
			next();
		});
	};
}

// logic route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

//regularExpression for search function
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.listen(process.env.PORT || 3000, process.env.IP || "localhost", function() {
	console.log("Server listening...");
});
