// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options";

// This is the main authentication route.
// It is responsible for handling the authentication flow.
// The authentication flow is handled by the NextAuth library.
// The authOptions are the configuration options for the authentication flow.
// The authOptions are imported from the options file.
// The handler function is the main function that is called when the user requests the authentication route.
// The handler function takes the authOptions as an argument.
// The handler function returns a response to the user.
const handler = NextAuth(authOptions);

// This is the GET request handler.
// It is responsible for handling GET requests to the authentication route.
// The GET request handler is the same as the POST request handler.
export { handler as GET, handler as POST };
