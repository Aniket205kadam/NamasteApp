const AppConfig = {
<<<<<<< HEAD
  backendUrl: "http://localhost:8080",

};

//String(import.meta.env.VITE_NAMASTEAPP_BACKEND_URL)

=======
  backendUrl: String(import.meta.env.VITE_NAMASTEAPP_BACKEND_URL),
  googleClientId: String(import.meta.env.VITE_NAMASTEAPP_GOOGLE_CLIENT_ID),
  tenorApiKey: String(import.meta.env.VITE_NAMASTEAPP_TENOR_API_KEY),
  tenorClientKey: String(import.meta.env.VITE_NAMASTEAPP_CLIENT_KEY),
};

>>>>>>> 6bb01d1 (feat: User can signup with google)
export default AppConfig;
