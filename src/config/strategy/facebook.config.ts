import * as dotenv from 'dotenv';
dotenv.config();

const {
  FACEBOOK_APP_ID,
  FACEBOOK_SECRET_KEY,
  AUTH_CALLBACK_URL,
  FACEBOOK_SCOPE,
} = process.env;
export const FacebookConfig = {
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_SECRET_KEY,
  callbackURL: AUTH_CALLBACK_URL,
  profileFields: ['email', 'name', 'photos', 'displayName'],
  scope: FACEBOOK_SCOPE.split(','),
};
