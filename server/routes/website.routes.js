import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { changes, deploy, generateWebsite, getAllWebsites, getWebsiteById, getWebsiteBySlug } from "../controllers/website.controller.js";


const websiteRouter = express.Router()

websiteRouter.post("/generate",isAuth, generateWebsite)
websiteRouter.post("/update/:id",isAuth, changes)
websiteRouter.get("/get-by-id/:id",isAuth, getWebsiteById)
websiteRouter.get("/get-all",isAuth, getAllWebsites)
// website.routes.js
websiteRouter.get("/deploy", isAuth, deploy); // Keep as GET with query params
// website.routes.js
websiteRouter.get("/public/site/:slug", getWebsiteBySlug);


export default websiteRouter