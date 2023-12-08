const path = require("path");
const crypto = require("crypto");
const { pool } = require("../../config/db_config");

// Get Admin Dashboard Page
exports.getDashboard = (req, res) => {
  pool.query(`SELECT * FROM car`, (err, rows) => {
    if (!err) {
      res.render("admindashboard", {
        user: req.session.userId,
        title: "Admin Dashboard ",
        rows,
      });
    } else {
      console.log(err);
    }
  });
};

//Get Add Cars Page
exports.getAddCars = (req, res) => {
  res.render("addcars", { title: "Add Cars" });
};

// Add Car Details Into Database
exports.addCars = (req, res) => {
  let image;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No Files Were Uploaded");
  }

  image = req.files.image;
  image.name = crypto.randomUUID({ disableEntropyCache: true }) + image.name;
  uploadPath = path.resolve("./") + "/uploads/" + image.name;
  // console.log(image);
  // console.log(uploadPath);

  image.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });
  const {
    company,
    model,
    transmission,
    seating_capacity,
    fuel,
    milage,
    price,
  } = req.body;

  pool.query(
    `Insert INTO car SET company=?,model=?,transmission=?,seating_capacity=?,fuel=?,milage=?,price=?,image=?`,
    [
      company,
      model,
      transmission,
      seating_capacity,
      fuel,
      milage,
      price,
      image.name,
    ],
    (err, rows) => {
      if (!err) {
        res.render("addcars", { alert: "Successfully Added Car Details" });
      } else {
        console.log(err);
      }
    }
  );
};

// Get Update Page
exports.getEditCars = (req, res) => {
  pool.query(
    `SELECT * FROM car WHERE car_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("editcars", { title: "Edit Car Details", rows });
      } else {
        console.log(err);
      }
    }
  );
};

// Car Details Update Code
exports.updateCars = (req, res) => {
  const {
    company,
    model,
    transmission,
    seating_capacity,
    fuel,
    milage,
    price,
  } = req.body;

  pool.query(
    ` UPDATE car SET company=?,model=?,transmission=?,seating_capacity=?,fuel=?,milage=?,price=? WHERE car_id=?`,
    [
      company,
      model,
      transmission,
      seating_capacity,
      fuel,
      milage,
      price,

      req.params.id,
    ],
    (err, rows) => {
      if (!err) {
        pool.query(
          `SELECT * FROM car WHERE car_id = ?`,
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("editcars", {
                title: "Edit Car Details",
                alert: "Successfully Updated Car Details",
                rows,
              });
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
};

// Delete A Car From Database
exports.deleteCars = (req, res) => {
  pool.query(
    "DELETE FROM car WHERE car_id =?",
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.redirect("/admin/dashboard");
      } else {
        console.log(err);
      }
    }
  );
};

//Get User Test-Drive Booking Details From Database

exports.getUserTestDriveBookings = (req, res) => {
  pool.query(
    `SELECT car.car_id,car.image, car.company, car.model, DATE_FORMAT(testdrive.booking_date,'%d/%m/%Y') AS booking_date ,testdrive.address , user.user_email,user.user_fname
    FROM testdrive INNER JOIN car ON
     testdrive.car_id = car.car_id
     INNER JOIN user ON testdrive.user_id = user.user_id
   `,
    (err, rows) => {
      if (!err) {
        res.render("adminviewtestdrivebookings", {
          title: "User Test Drive Bookings",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

exports.getUserFeedbacks = (req, res) => {
  pool.query(
    `SELECT car.car_id,car.image, car.company, car.model, 
    feedback.ratings, feedback.comments, user.user_email,user.user_fname
    FROM feedback INNER JOIN car ON
     feedback.car_id = car.car_id
     INNER JOIN user ON feedback.user_id = user.user_id
   `,
    (err, rows) => {
      if (!err) {
        res.render("adminviewfeedbacks", {
          title: "User Feedbacks",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};
