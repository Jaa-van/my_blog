const Joi = require("joi");

// const user_validation = {
//   user_singup: async (req, res, next) => {
//     console.log("req :", req.body);
//     const body = req.body;
//     console.log(body);
//     const schema = Joi.object().keys({
//       nickname: Joi.string().min(1).max(20).required(),
//       password: Joi.string().min(1).max(20).required(),
//       confirm: Joi.ref("password"),
//     });

//     try {
//       // 검사시작
//       await schema.validateAsync(body);
//     } catch (e) {
//       // 유효성 검사 에러
//       return res.status(400).json({ code: 400, message: e.message });
//     }
//     next();
//   },
// };

const user_validation = {
  user_signup: async (req, res, next) => {
    const data = req.body;
    const userSchema = Joi.object().keys({
      nickname: Joi.string().required().messages({
        "string.base": "404/닉네임에러라고 자식아",
        "any.required": "403/닉네임이 없다고",
      }),
      // .error((error) => new Error("402/닉네임에러다 자식아")),
      password: Joi.string()
        .required()
        .error((error) => new Error("403/비번 에러다 자식아")),
      confirm: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .error((error) => new Error("402/확인 에러다 이놈아")),
    });

    try {
      await userSchema.validateAsync(data);
    } catch (error) {
      throw new Error(error.message || "400/이거냐되냐");
    }
  },
};
module.exports = user_validation;
