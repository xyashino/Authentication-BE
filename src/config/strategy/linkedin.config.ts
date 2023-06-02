import * as dotenv from 'dotenv';
dotenv.config();

const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_SECRET,
  AUTH_CALLBACK_URL,
  LINKEDIN_SCOPE,
} = process.env;
export const LinkedinConfig = {
  clientID: LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_SECRET,
  callbackURL: AUTH_CALLBACK_URL,
  scope: LINKEDIN_SCOPE.split(','),
};
