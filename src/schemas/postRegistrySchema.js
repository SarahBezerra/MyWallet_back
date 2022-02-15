import joi from 'joi'

const postRegistrySchema = joi.object({
    value: joi.string().pattern(/^[0-9]+\.[0-9]{2}$/).required(),
    description: joi.string().pattern(/^.{2,13}$/).required(),
})

export default postRegistrySchema;