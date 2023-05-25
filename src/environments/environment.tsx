// export const environment = {
//   development: false,
//   serverUrl: 'http://localhost:8080'
// };

export const environment = {
  development: true,

//    serverUrl: 'https://thenobo.com',
  serverUrl: 'https://staging.thenobo.com',
  // serverUrl: 'http://localhost:8080',

  stripeApiKey: 'pk_test_51HMEdOGy5Yw2ikdlndEcLFwdpkuaIG0ueJ7mKOJyNXK6AliTbPgKEczUkjl3R68MOQfJ6rsNKEkiHLdzAnyrliQN000RjNTljb',

  videoAuthenticationEndpoint: 'https://api.noboplus.com:3001/auth',
  videoUrlEndpoint: 'https://ik.imagekit.io/nobovideo/',
  videoLibraryPublicKey: 'public_pqTTDCXhzT8ZmQ4RFQUCQYkKY0s=',
  maxVideoFileSize: 260000000, // 260Mb Binary
};
