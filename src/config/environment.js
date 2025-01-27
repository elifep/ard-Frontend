export const VITE_API_URL = import.meta.env.VITE_API_URL;
if (!VITE_API_URL) {
    throw new Error("VITE_API_URL environment variable is not defined.");
}