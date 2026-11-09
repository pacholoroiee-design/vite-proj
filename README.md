# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.







lab 6 reflection
Reflection Questions
1.	Why do we store the token in localStorage? What is one security risk of doing so, and what is a more secure alternative?
We store tokens in localStorage to keep users logged in after refreshing. However, hackers can access them through malicious JavaScript. HttpOnly cookies are a safer alternative.

2.	What is the purpose of the AuthContext? Why not just pass the token as a prop to each component?
AuthContext shares authentication data across components. It avoids passing tokens manually through props and keeps the code organized.


3.	What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.
When the JWT expires, protected requests will fail. The frontend should remove the token and redirect the user to the login page.

4.	What is the difference between the backend's requireAuth middleware (from Lesson 5) and the frontend's ProtectedRoute component? Why do we need both?
requireAuth protects backend API routes, while ProtectedRoute protects frontend pages. Both are needed to secure the application and its data.

lab7 A short paragraph (3–4 sentences) answering: "Why do we use memoryStorage instead of diskStorage when uploading to Cloudinary?"
We use memoryStorage instead of diskStorage when uploading to Cloudinary because it stores the uploaded file temporarily in the server's memory (RAM). This allows us to send the file directly to Cloudinary without saving it first on our computer or server disk. It makes the upload process simpler because we don't need to manage temporary files. In this project, memoryStorage is suitable because Cloudinary handles storing the uploaded images.

