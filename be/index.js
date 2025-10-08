import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

// Config
import { PORT, UPLOAD_DIR } from "./config/config.js";

// Database
import { sequelize } from "./models/index.js";

// Middleware
import { logger } from "./middleware/logger.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { validateTrialClass } from "./middleware/validateTrialClass.js";
import { validateContact } from "./middleware/validateContactUs.js";
import { validateThirdPartySchedules } from "./middleware/validateThirdPartySchedules.js";
import { validateProgramCategories } from "./middleware/validateProgramCategories.js";

// Routes
import uploadRoutes from "./upload/uploadRoutes.js";

// =============== User Routes =============== //
// v1 //
import collaborationRoutesV1 from "./routes/user/v1/collaboration/collaborationRoutes.js";
import customerTestimonialRoutesV1 from "./routes/user/v1/customer_testimonial/customerTestimonialRoutes.js";
import courtRoutesV1 from "./routes/user/v1/court/courtRoutes.js";
import branchRoutesV1 from "./routes/user/v1/branch/branchRoutes.js";
import eventRoutesV1 from "./routes/user/v1/event/eventRoutes.js";
import programRoutesV1 from "./routes/user/v1/program/programRoutes.js";
import programCategoriesRoutesV1 from "./routes/user/v1/program_categories/programCategoriesRoutes.js";
import programActivityCategoriesRoutesV1 from "./routes/user/v1/program_activity_categories/programCategoriesRoutes.js";
import subjectRoutesV1 from "./routes/user/v1/subject/subjectRoutes.js";
import authRoutesV1 from "./routes/user/v1/auth/authRoutes.js";
import trialClassRoutesV1 from "./routes/user/v1/trial_class/trialClassRoute.js";
import ageGroupsRoutesV1 from "./routes/user/v1/age_groups/ageGroupsRoutes.js";
import contactUsRoutesV1 from "./routes/user/v1/contact_us/contactUsRoute.js";
import schedulesRoutesV1 from "./routes/user/v1/schedule/scheduleRoutes.js";
import visitorRoutesV1 from "./routes/user/v1/visitor/visitorRoute.js";

// ========================================== //


// ============== Admin Routes ============== //
// v1 //
import adm_programManagementAgeGroupsRoutesV1 from "./routes/admin/v1/program_management/ageGroupsRoutes.js";
import adm_programManagementCategoriesRoutesV1 from "./routes/admin/v1/program_management/categoriesRoute.js";
import adm_programManagementClassesRoutesV1 from "./routes/admin/v1/program_management/classesRoute.js";
import adm_programManagementActivityCategoriesRoutesV1 from "./routes/admin/v1/program_management/activityCategoriesRoutes.js";
import adm_programManagementKeyPointsRoutesV1 from "./routes/admin/v1/program_management/keyPointsRoute.js";
import adm_programManagementProgramTypeRoutesV1 from "./routes/admin/v1/program_management/programTypeRoute.js";
import adm_programManagementLinkClassesRoutesV1 from "./routes/admin/v1/program_management/linkClassesRoute.js";

import adm_eventRoutesV1 from "./routes/admin/v1/event/eventRoute.js";
import adm_collaborationRoutesV1 from "./routes/admin/v1/collaboration/collaborationRoute.js";
import adm_locationsMapRoutesV1 from "./routes/admin/v1/location/map/mapRoute.js";
import adm_locationsBranchListRoutesV1 from "./routes/admin/v1/location/branch_list/branchRoute.js";
import adm_contactUsRoutesV1 from "./routes/admin/v1/contact_us/contactUsRoute.js";
import adm_trialClassRoutesV1 from "./routes/admin/v1/trial_class/trialClassRoute.js";
import adm_facilitiesManagementFacilitiesRoutesV1 from "./routes/admin/v1/facilities_management/facilities/facilitiesRoute.js";
import adm_facilitiesManagementLinkFacilitiesRoutesV1 from "./routes/admin/v1/facilities_management/link_facilities/linkFacilitiesRoute.js";
import adm_courtsManagementRoutesV1 from "./routes/admin/v1/courts_management/court/courtRoute.js";
import adm_courtsManagementLinkCourtRoutesV1 from "./routes/admin/v1/courts_management/link_court/linkCourtRoute.js";
import adm_customerTestimonialRoutesV1 from "./routes/admin/v1/customer_testimonial/customerTestimonialRoute.js";
import adm_trainersRoutesV1 from "./routes/admin/v1/trainers/trainersRoute.js";
import adm_scheduleRoutesV1 from "./routes/admin/v1/schedule/scheduleRoute.js";
import adm_dashboardRoutesV1 from "./routes/admin/v1/dashboard/dashboardRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =============== Middleware =============== //
// Setup CORS whitelist
const whitelist = ["http://localhost:3000", "https://kyzn.life", "http://localhost:3001"];
const corsOptions = {
  origin: function (origin, callback) {
    // Kalau request tanpa Origin (misal Postman/curl)
    if (!origin) {
      if ((process.env.NODE_ENV || "development").trim() === "development") {
        // ✅ Izinkan saat development
        return callback(null, true);
      } else {
        // ❌ Tolak saat production
        return callback(new Error("Not allowed by CORS"), false);
      }
    }

    // Kalau ada origin, cek whitelist
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// =============== Swagger =============== //
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =============== Routes =============== //
// User v1
app.use("/api/user/v1/collaboration", collaborationRoutesV1);
app.use("/api/user/v1/customer-testimonial", customerTestimonialRoutesV1);
app.use("/api/user/v1/court", courtRoutesV1);
app.use("/api/user/v1/branch", branchRoutesV1);
app.use("/api/user/v1/event", eventRoutesV1);
app.use("/api/user/v1/program", programRoutesV1);
app.use("/api/user/v1/subject", subjectRoutesV1); 
app.use("/api/user/v1/auth", authRoutesV1);
app.use("/api/user/v1/trial-class", validateTrialClass, trialClassRoutesV1);
app.use("/api/user/v1/age-groups", ageGroupsRoutesV1);
app.use("/api/user/v1/contact-us", validateContact, contactUsRoutesV1);
app.use("/api/user/v1/schedules", schedulesRoutesV1);
app.use("/api/user/v1/program-categories", validateProgramCategories, programCategoriesRoutesV1);
app.use("/api/user/v1/program-activity-categories", programActivityCategoriesRoutesV1);
app.use("/api/user/v1/log-visitor", visitorRoutesV1);


// Admin v1
app.use("/api/admin/v1/program-management/age-groups", verifyToken, adm_programManagementAgeGroupsRoutesV1);
app.use("/api/admin/v1/program-management/categories", verifyToken, adm_programManagementCategoriesRoutesV1);
app.use("/api/admin/v1/program-management/classes", verifyToken, adm_programManagementClassesRoutesV1);
app.use("/api/admin/v1/program-management/activity-categories", verifyToken, adm_programManagementActivityCategoriesRoutesV1);
app.use("/api/admin/v1/program-management/key-points", verifyToken, adm_programManagementKeyPointsRoutesV1);
app.use("/api/admin/v1/program-management/program-type", verifyToken, adm_programManagementProgramTypeRoutesV1);
app.use("/api/admin/v1/program-management/link-classes", verifyToken, adm_programManagementLinkClassesRoutesV1);
app.use("/api/admin/v1/event", verifyToken, adm_eventRoutesV1);
app.use("/api/admin/v1/collaboration", verifyToken, adm_collaborationRoutesV1);
app.use("/api/admin/v1/locations/map", verifyToken, adm_locationsMapRoutesV1);
app.use("/api/admin/v1/locations/branch-list", verifyToken, adm_locationsBranchListRoutesV1);
app.use("/api/admin/v1/contact-us", verifyToken, adm_contactUsRoutesV1);
app.use("/api/admin/v1/trial-class", verifyToken, adm_trialClassRoutesV1);
app.use("/api/admin/v1/facilities-management/facilities", verifyToken, adm_facilitiesManagementFacilitiesRoutesV1);
app.use("/api/admin/v1/facilities-management/link-facilities", verifyToken, adm_facilitiesManagementLinkFacilitiesRoutesV1);
app.use("/api/admin/v1/courts-management/court", verifyToken, adm_courtsManagementRoutesV1);
app.use("/api/admin/v1/courts-management/link-court", verifyToken, adm_courtsManagementLinkCourtRoutesV1);
app.use("/api/admin/v1/customer-testimonial", verifyToken, adm_customerTestimonialRoutesV1);
app.use("/api/admin/v1/trainers", verifyToken, adm_trainersRoutesV1);
app.use("/api/admin/v1/schedule", verifyToken, adm_scheduleRoutesV1);
app.use("/api/admin/v1/dashboard", verifyToken, adm_dashboardRoutesV1);


// Upload
app.use("/upload", uploadRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

// Root endpoint
app.get("/", (req, res) =>
  res.send("Hello Express 5 + Sequelize + ES Modules!")
);


// =============== Custom Error Handling =============== //
// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Endpoint tidak ditemukan");
});

// Global error handler (CORS, Postman, curl, dll)
app.use((err, req, res, next) => {
  console.error(err.message);

  // Deteksi user-agent untuk Postman/cURL (aktif hanya di production)
  if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production") {
    const ua = (req.headers["user-agent"] || "").toLowerCase();
    if (ua.includes("postman") || ua.includes("curl")) {
      return res.status(403).send("⚠️ Access via Postman/cURL is not allowed");
    }
  }

  if (err.message.includes("CORS")) {
    res.status(403).send("⚠️ Access denied due to CORS policy");
  } else {
    res.status(500).send("⚠️ An error occurred on the server");
  }
});

// =============== Start Server =============== //
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} (ENV: ${process.env.NODE_ENV || "development"})`)
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
