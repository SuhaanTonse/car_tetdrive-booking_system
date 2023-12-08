const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./db_config");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    // console.log(password);
    pool.query(
      `SELECT * FROM user WHERE user_email = ?`,
      [email],
      (err, rows) => {
        if (err) {
          throw err;
        }
        var row = JSON.parse(JSON.stringify(rows));
        // console.log(row);

        if (row.length > 0) {
          const user = row[0];
          // console.log(user.user_pass);
          bcrypt.compare(password, user.user_pass, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
        } else {
          return done(null, false, { message: "Email Is Not Registered" });
        }
      }
    );
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser((user_id, done) => {
    // console.log(user_id);
    pool.query(
      `SELECT * FROM user WHERE user_id = ? `,
      [user_id],
      (err, rows) => {
        if (err) {
          return done(err);
        }
        var row = JSON.parse(JSON.stringify(rows));
        // console.log(`id ${row[0].user_id}`);
        return done(null, row[0]);
      }
    );
  });
}

module.exports = initialize;
