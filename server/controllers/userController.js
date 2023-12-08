const { pool } = require("../../config/db_config");
const bcrypt = require("bcrypt");

// Get User Login Page
exports.loginpage = (req, res) => {
  res.render("userlogin", { title: "User Login " });
};

// Get User Register Page
exports.registerpage = (req, res) => {
  res.render("userregister", { title: "User Register " });
};

// Add User Details Into Database
exports.userregister = async (req, res) => {
  let { firstname, lastname, phone, email, password, password2 } = req.body;

  if (!firstname || !lastname || !phone || !email || !password || !password2) {
    res.render("userregister", { alert: "Please Enter All Fields" });
  } else if (password.length < 8) {
    res.render("userregister", {
      alert: "Password Should Be At least 8 Characters In Length ",
    });
  } else if (password != password2) {
    res.render("userregister", {
      alert: "Passwords Don't Match",
    });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      `SELECT * FROM user WHERE user_email = ?`,
      [email],
      (err, rows) => {
        if (err) {
          throw err;
        }
        if (rows.length > 0) {
          res.render("userregister", {
            alert: "Email Already Registered",
          });
        } else {
          pool.query(
            `INSERT INTO user SET user_email =? ,user_fname =?,  user_lname=?, user_phone=?, user_pass =?  `,
            [email, firstname, lastname, phone, hashedPassword],
            (err, rows) => {
              if (err) {
                throw err;
              }
              // console.log(rows);
              req.flash("success_msg", "You Are Now Registered. Please Login");
              res.redirect("/user/login");
            }
          );
        }
      }
    );
  }
};

// Get User Dashboard Page
exports.getDashboard = (req, res) => {
  pool.query(`SELECT * FROM car`, (err, rows) => {
    if (!err) {
      res.render("userdashboard", {
        user: req.user.user_fname,
        title: "User Dashboard",
        rows,
      });
    } else {
      console.log(err);
    }
  });
};

// Get Book Test Drive Page
exports.getTestdriveBooking = (req, res) => {
  pool.query(
    `SELECT * FROM car WHERE car_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("booktestdrive", {
          title: "Book Test Drive",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

//Add Test Drive Booking Details Into Database
exports.bookTestDrive = (req, res) => {
  const car_id = req.params.id;
  const user_id = req.user.user_id;

  const { date, state, city, address, pincode } = req.body;

  pool.query(
    `Insert INTO testdrive SET booking_date=?,state=?,city=?,address=?,pincode=?,car_id=?,user_id=?`,
    [date, state, city, address, pincode, car_id, user_id],
    (err, rows) => {
      if (!err) {
        pool.query(
          `SELECT * FROM car WHERE car_id = ?`,
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("booktestdrive", {
                title: "Book Test Drive",
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

//View Test Drive Bookings

exports.viewTestDriveBookings = (req, res) => {
  pool.query(
    `SELECT car.car_id,car.image, car.company, car.model, DATE_FORMAT(testdrive.booking_date,'%d/%m/%Y') AS booking_date ,testdrive.address 
    FROM testdrive INNER JOIN car ON
     testdrive.car_id = car.car_id
     WHERE user_id = ?`,
    [req.user.user_id],
    (err, rows) => {
      if (!err) {
        res.render("viewtestdrivebookings", {
          title: "My Test Drive Bookings",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

// Get Write Feedback Page
exports.getfeedback = (req, res) => {
  pool.query(
    `SELECT * FROM car WHERE car_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (!err) {
        res.render("carfeedback", {
          title: "Feedback Form",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};

// Add feedback into database
exports.writefeedback = (req, res) => {
  const car_id = req.params.id;
  const user_id = req.user.user_id;

  const { ratings, comments } = req.body;

  pool.query(
    `Insert INTO feedback SET ratings=?,comments=?,user_id=?,car_id=?`,
    [ratings, comments, user_id, car_id],
    (err, rows) => {
      if (!err) {
        pool.query(
          `SELECT * FROM car WHERE car_id = ?`,
          [req.params.id],
          (err, rows) => {
            if (!err) {
              res.render("carfeedback", {
                title: "Feedback Form",
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

// View My Feedbacks

exports.viewFeedbacks = (req, res) => {
  pool.query(
    `SELECT car.car_id,car.image, car.company, car.model, feedback.ratings, feedback.comments
    FROM feedback INNER JOIN car ON
     feedback.car_id = car.car_id 
     WHERE user_id =?`,
    [req.user.user_id],
    (err, rows) => {
      if (!err) {
        res.render("viewfeedbacks", {
          title: "My Feedbacks",
          rows,
        });
      } else {
        console.log(err);
      }
    }
  );
};
