import express from "express";
import { 
getContactSummaryBySubject,
getMasterSubject
} from "../../../../controllers/admin/v1/dashboard/inquiryAnalysisController.js";

import { 
getTopTrialClassBranch,
getParticipantTrialClass,
getAverageByBranch,
getParticipantsByAgeRange,
getMonthlyParticipantsByBranch
} from "../../../../controllers/admin/v1/dashboard/trialClassBranchController.js";

import { 
getVisitorForChart,
getVisitorSummaryCount
} from "../../../../controllers/admin/v1/dashboard/visitorController.js";


const router = express.Router();

// Inguiry Analysis
router.post("/inquiry-analysis", getContactSummaryBySubject); 
router.get("/inquiry-analysis/master-subject", getMasterSubject);

// Top Trial Class per Branch
router.post("/top-trial-class-branch", getTopTrialClassBranch);

// Participants by Trial Class
router.post("/participant-trial-class", getParticipantTrialClass)

// Average By Branch
router.post("/average-by-branch", getAverageByBranch)

// Participant by Age
router.post("/participant-by-age-range", getParticipantsByAgeRange)

// Participant by Branch
router.post("/participant-by-branch", getMonthlyParticipantsByBranch)

// Dashboard Visitor Bar Chart 
router.post("/visitor-bar-chart", getVisitorForChart)

// Dashboard Visitor Bar Chart 
router.post("/visitor-summary", getVisitorSummaryCount)



export default router;
