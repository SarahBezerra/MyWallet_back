import postRegistrySchema from '../schemas/postRegistrySchema.js'

export function validatePostRegistrySchema(req, res, next) {
  const datasRegistry = req.body;

  const validation = postRegistrySchema.validate(datasRegistry);
  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}