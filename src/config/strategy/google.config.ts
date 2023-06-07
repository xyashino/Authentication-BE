import * as dotenv from 'dotenv';
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, AUTH_CALLBACK_URL, GOOGLE_SCOPE } =
  process.env;
export const GoogleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_SECRET,
  callbackURL: AUTH_CALLBACK_URL,
  scope: GOOGLE_SCOPE.split(','),
};
