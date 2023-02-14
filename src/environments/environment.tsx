// export const environment = {
//   development: false,
//   serverUrl: 'http://localhost:8080'
// };

export const environment = {
  development: true,
  disableBrowser: false, // set to true for in-browser development
  // disableBrowser: true,
  serverUrl: 'https://api.urpplus.com',
  // serverUrl: 'https://api-testing.urpplus.com',
  // serverUrl: 'http://localhost:8080',
  videoAuthenticationEndpoint: 'https://api.urpplus.com:3001/auth',
  videoUrlEndpoint: 'https://ik.imagekit.io/urpvideo/',
  videoLibraryPublicKey: 'public_pqTTDCXhzT8ZmQ4RFQUCQYkKY0s=',
  maxVideoFileSize: 260000000, // 260Mb Binary
};
