/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');
const validate = require("validate.js");

module.exports = {
  resetPasswordRequest: function (req, res) {
    var email = req.param('email');

    User.findOne({email: email}).then(function (user) {

      if (user) {
        SendGrid.send(
          user.email,
          sails.config.mail.resetPassword.subject,
          sails.config.mail.resetPassword.adminEmail,
          "Reset password link " + user.getResetPasswordLink().url
        );
        return res.json({});
      } else {
        return res.json({});
      }


    }).catch(function (err) {
      return res.json(400, err);
    });
  },
  resetPassword: function (req, res) {

    var token = req.param("code");
    var password = req.body.password;
    if (password !== req.body.confirmPassword) {
      return res.json(400, Errors.build({"non_field_error": 'Password doesn\'t match!'}, Errors.ERROR_REGISTER_VALIDATION));
    }

    var result = User.types.password(password);
    if (!result) {
      return res.json(400, Errors.build({"non_field_error": 'Invalid password!'}, Errors.ERROR_REGISTER_VALIDATION));
    }

    Token.verify(token, function (err, decoded) {
      if (err) return res.json(400, {"non_field_error": "Code is expired"})
      User.findOne(decoded.id).then(function (user) {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) return next(err);
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            user.save(function (err) {
              if (err) return res.json(400, Errors.build(err.message, Errors.ERROR_VALIDATION)
              );
              var token = Token.issue({id: user.id});
              return res.json({
                user: user,
                token: token
              });
            })
          })
        })
      }).catch(function (err) {
        return res.json(400, Errors.build(err.message, Errors.ERROR_VALIDATION));
      })
    });
  },


  avatar: async (req, res) => {
    let user = await User.findOne(req.user.id);
    let files = await MediaManager.upload(req.file("img"), user.id);
    let file = files[0];
    let savedFile = await Img.create({user: user.id, path: file.fd, size: file.size, type: file.type});
    user.avatar = sails.config.appUrl + savedFile.url;
    await user.save();
    return res.json(user)
  },

  changePassword: async (req, res) => {
    let user = await User.findOne(req.user.id);
    let constraints = {
      oldPassword: {
        presence: true
      },
      password: (value, attributes, attributeName, options, constraints) => {
        if (!User.types.password(value)) return {
          presence: true,
          equality: "password",
          format: {
            pattern: "",
            message: function (value, attribute, validatorOptions, attributes, globalOptions) {
              return "Wrong format"
            }
          }
        };
        return {
          equality: "confirmPassword",
        }
      },
      confirmPassword: (value, attributes, attributeName, options, constraints) => {
        if (!User.types.password(value)) return {
          presence: true,
          equality: "password",
          format: {
            pattern: "",
            message: function (value, attribute, validatorOptions, attributes, globalOptions) {
              return "Wrong format"
            }
          }
        };
        return {
          presence: true,
          equality: "password",
        }
      }
    };

    let result = validate(req.body, constraints);
    if (result) {
      return res.json(401, result)
    }
    let isValidPassword = await User.checkPassword(req.body.oldPassword, user);
    if (!isValidPassword) {
      return res.json(401, {"message": "Wrong old password"})
    }
    user.password = await User.passwordHash(req.body.password);
    await user.save();
    let token = Token.issue({id: user.id});
    return res.json({
      user: user,
      token: token
    });
  }
};

