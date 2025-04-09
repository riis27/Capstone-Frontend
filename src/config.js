const BACKEND_URL=process.env.NODE_ENV === "development" ? "http://localhost:2727" : "(projectcap from render)";

export default BACKEND_URL