import * as dotenv from 'dotenv';
dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  AUTH_CALLBACK_URL,
  GITHUB_SCOPE,
} = process.env;
export const GithubConfig = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: AUTH_CALLBACK_URL,
  scope: GITHUB_SCOPE.split(','),
  passReqToCallback: true,
};
