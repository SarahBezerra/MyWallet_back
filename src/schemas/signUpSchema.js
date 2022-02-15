import joi from "joi"

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^.{4,}$/).required()
})

export default signUpSchema;