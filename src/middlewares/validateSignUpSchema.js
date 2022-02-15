import signUpSchema from "../schemas/signUpSchema.js";

export function validateSignUpSchema(req, res, next) {
  const datasSignUp = req.body;

  const validation = signUpSchema.validate(datasSignUp);
  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}