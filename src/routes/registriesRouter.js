import { Router } from 'express'
import { getStatement, postRegistry, deleteRegistry } from '../controllers/registriesController.js';
import { validatePostRegistrySchema } from '../middlewares/validatePostRegistrySchema.js';
import { validateToken } from '../middlewares/validateToken.js';

const registriesRouter = Router();

registriesRouter.get('/statement', validateToken, getStatement);
registriesRouter.post('/register/:registryType', validateToken, validatePostRegistrySchema, postRegistry);
registriesRouter.delete('/delete-registry/:_id', deleteRegistry);

export default registriesRouter;