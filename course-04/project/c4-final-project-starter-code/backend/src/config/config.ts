const config = {
  "auth-domain": process.env.REACT_APP_AUTH0_DOMAIN,
  "auth-client-id": process.env.REACT_APP_AUTH0_CLIENT_ID,
  "callbackUrl": process.env.CALLBACK_URL,
  "todoTable": process.env.TODOS_TABLE,
  "bucket-name": process.env.BUCKET_NAME
}

export default config;