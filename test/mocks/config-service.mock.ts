export const configServiceMock = (key: string) => {
  switch (key) {
    case 'BCRYPT_SALT':
      return 10;
    default:
      return undefined;
  }
};
