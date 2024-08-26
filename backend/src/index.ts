import getEnvVar, { parseEnv } from 'env/index';
import expressApp from 'apps/server';
import { connectDB } from 'apps/database';


parseEnv();
connectDB();

expressApp.listen(parseInt(getEnvVar('PORT')), () => {
  console.log(`Server listening at ${getEnvVar('PORT')}`);
});
