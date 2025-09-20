import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Add all auth routes
auth.addHttpRoutes(http);

export default http;
