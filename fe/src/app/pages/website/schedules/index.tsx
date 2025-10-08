import React, { useRef, useState, useEffect } from "react";
import { Container } from "../../../components/web/layout";
import ProgramsHeader from "./components/schedules-header/index";
import { motion, useInView } from "framer-motion";
import { Select, Modal, Calendar, message } from "antd";
import ScheduleTable, { ScheduleRow } from "../schedules/components/schedules";
import TabsDay, { TabPane } from "./components/schedules/TabsDay";
import axios from "axios";
import zumbaImage from "../../../assets/images/program/zumba.png";
import dayjs from "dayjs";

interface AgeGroup {
  mpa_id: number;
  mpa_min: number;
  mpa_max: number;
  mpa_status: boolean;
}

interface Branch {
  mb_id: number;
  mb_name: string;
  mb_address: string;
  mb_city: string;
  mb_province: string;
  mb_postal_code: string;
  mb_phone: string;
  mb_status: boolean;
  created_at: string;
  updated_at: string;
}

interface ProgramActivityCategory {
  mpac_id: number;
  mpac_name: string;
  mpac_status: boolean;
}

interface ScheduleSlot {
  program: string;
  age: string;
  time: string;
  instructor: string;
}

interface ScheduleRowOutput {
  room: string;
  schedules: (ScheduleSlot | null)[];
}

interface Court {
    mc_id: number;
    mc_name: string;
    mc_type: string;
    mc_status: boolean;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

const { Option } = Select;

// ======================
// Styles
// ======================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    // paddingTop: "55px",
    transition: "margin-left 0.3s ease-in-out",
  },
  headingAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "2.1rem",
    marginBottom: "0.5rem",
    letterSpacing: "-0.02em",
    textAlign: "center",
  },
  headingSubAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "1rem",
    color: "#555",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
    lineHeight: 1.6,
  },
}; 

// ======================
// Dummy Data
// ======================

const times = [
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00",
  "22:00",
];

// ======================
// Main Component
// ======================
const SchedulesWebsite: React.FC = () => {
  // ======================
  // State
  // ======================
  const [selectedAge, setSelectedAge] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [branchesData, setBranchesData] = useState<Branch[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);

  const [schedules, setSchedules] = useState<ScheduleRowOutput[]>([]);
  const [pickDate, setPickDate] = useState(dayjs().format("YYYY-MM-DD")); 

  const [activeTab, setActiveTab] = useState<string>(
    new Date().toLocaleDateString("en-GB") // format dd/mm/yyyy
  );  

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;  

  // ======================
  // Ref & InView
  // ======================
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  // ======================
  // Generate Days
  // ======================
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const daysWithDates = Array.from({ length: 7 }).map((_, i) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
    const dateStr = current.toLocaleDateString("en-GB"); // dd/mm/yyyy
    return { day: dayName, date: dateStr };
  });

  // ======================
  // Fetch Data Functions
  // ======================
  const fetchAgeGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/age-groups`);
      if (response.data.success) {
        setAgeGroups(response.data.data); // asumsi response.data.data adalah array string nama age group
      } else {
        message.error("Failed to fetch age groups");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching age groups");
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/branch`);
      if (response.data.success) {
        // Ambil hanya yang aktif (mb_status === true)
        const activeBranches = response.data.data.filter((branch: Branch) => branch.mb_status);
        setBranchesData(activeBranches);
      } else {
        message.error("Failed to fetch branches");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching branches");
    }
  };

  const fetchCourts = async () => {
    try {
      const response = await axios.get<{ success: boolean; data: Court[] }>(`${API_URL}/user/v1/court`);

      if (response.data.success && response.data.data) {
        // Ambil hanya yang aktif
        const activeCourts = response.data.data.filter((court) => court.mc_status);
        setCourts(activeCourts);
      } else {
        message.error("Failed to fetch courts");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching courts");
    }
  };


  const fetchDataSchedules = async (
    dateParam?: string | null,
    ageParam?: string | null,
    branchParam?: string | null,
    courtParam?: string | null
  ) => {
    try {
      const response = await axios.post(`${API_URL}/user/v1/schedules/formatted`, {
        selectedAge: ageParam !== undefined ? ageParam : selectedAge,
        selectedBranch: branchParam !== undefined ? branchParam : selectedBranch,
        selectedCourt: courtParam !== undefined ? courtParam : selectedCourt,
        pickDate: dateParam !== undefined ? dateParam : pickDate,
      });

      if (response.data.success) {
        const scheduleRows: ScheduleRow[] = response.data.data;
        setSchedules(scheduleRows);
      } else {
        message.error("Failed to fetch schedules");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching schedules");
    }
  };



  // ======================
  // Handlers
  // ======================
  
  const handleSubmitFilter = () => {
    fetchDataSchedules(); // pakai nilai baru langsung
  };

  const showModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
  };

  const handleDayChange = (day: string, date: string) => {

    // date: "04/10/2025" → split dulu
    const [dd, mm, yyyy] = date.split("/"); 
    const formattedDate = `${yyyy}-${mm}-${dd}`; // "2025-10-04"

    setActiveTab(day); // update tab aktif
    setPickDate(formattedDate); // update state
    fetchDataSchedules(formattedDate); // pakai nilai baru langsung
  };  

  // ======================
  // useEffect untuk load data saat mount
  // ======================
  useEffect(() => {
    fetchAgeGroups();
    fetchBranches();
    fetchCourts();
    
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD
    handleDayChange(
      daysWithDates.find(d => d.date === today.toLocaleDateString("en-GB"))?.day || "",
      today.toLocaleDateString("en-GB")
    );
    fetchDataSchedules(formattedToday, "All", null, "All"); // pakai nilai baru langsung    

  }, []);  

  // ======================
  // JSX Render
  // ======================
  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, paddingBottom: "50px" }}>
        {/* Header */}
        <ProgramsHeader title="SCHEDULES" breadcrumb="Home / Schedules" />

        {/* Title + Description */}
        <div ref={sectionRef} className="mt-16 mb-12 px-6 pt-0 max-w-[1200px] w-full mx-auto">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Discover Our Schedules
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Schedules are thoughtfully organized to support every stage of your child’s
            learning journey. Discover flexible and structured scheduling options that
            align with your child's interests, ensuring a balanced and enriching experience.
          </motion.p>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-10 mb-6 max-w-[1200px] w-full mx-auto">
          {/* Filter by Ages */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Filter by Ages
            </label>
            <Select
              placeholder="Select Age"
              value={selectedAge}
              onChange={(val) => setSelectedAge(val || "All")}
              className="text-gray-800 w-full"
            >
              <Option value="All">All</Option>
              {ageGroups.map((age) => (
                <Option key={age.mpa_id} value={age.mpa_id}>
                  {`${age.mpa_min} - ${age.mpa_max} Years`}
                </Option>
              ))}
            </Select>
          </div>

          {/* Filter by Branch */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Filter by Branch
            </label>
            <Select
              placeholder="Choose one"
              value={selectedBranch}
              onChange={(val) => setSelectedBranch(val || "")}
              className="text-gray-800 w-full"
            >
              <Option value="">Choose one</Option>
              {branchesData.map((branch) => (
                <Option key={branch.mb_id} value={branch.mb_id}>
                  {branch.mb_name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Filter by Court */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Filter by Court
            </label>
            <Select
              placeholder="All"
              value={selectedCourt}
              onChange={(val) => setSelectedCourt(val || "")}
              className="text-gray-800 w-full"
            >
              <Option value="">All Court</Option>
                {courts.map((court) => (
                  <Option key={court.mc_id} value={court.mc_id}>
                    {court.mc_name}
                  </Option>
                ))}
            </Select>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              &nbsp;
            </label>
            <div className="flex gap-2">
              <button
              onClick={() => {
                  const today = new Date();
                  const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD

                  setPickDate(formattedToday);    // update date untuk fetchDataSchedules
                  setSelectedAge("All");
                  setSelectedBranch("");
                  setSelectedCourt("All");
                  handleDayChange(
                    daysWithDates.find(d => d.date === today.toLocaleDateString("en-GB"))?.day || "",
                    today.toLocaleDateString("en-GB")
                  );
                  fetchDataSchedules(formattedToday, "All", null, "All"); // pakai nilai baru langsung
                }}
                className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex-1"
              >
                Reset
              </button>

              <button
                onClick={handleSubmitFilter}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Start Schedules */}
        <div className="mt-2 fi max-w-[1200px] w-full mx-auto">
          <TabsDay days={daysWithDates} onChange={handleDayChange} activeDayFromParent={activeTab}
          >
            {daysWithDates.map(({ day, date }) => (
              <TabPane key={day} day={day}>
                <ScheduleTable
                  days={daysWithDates.map(d => d.day)}
                  times={times}
                  rows={schedules}
                />

                {/* Tombol Full Screen */}
                <div className="flex justify-center mt-2">
                  <button
                    onClick={showModal}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Open Schedule in Full Screen
                  </button>
                </div>

              </TabPane>
            ))}
          </TabsDay>
        </div>

        {/* Modal Ant Design */}
        <Modal
          title="Calendar"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width="95%"
          style={{ top: "20px", padding: 0 }}
          bodyStyle={{
            height: "80vh",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TabsDay days={daysWithDates} onChange={handleDayChange} activeDayFromParent={activeTab}>
              {daysWithDates.map(({ day, date }) => (
                <TabPane key={day} day={day}>
                  <ScheduleTable
                    days={daysWithDates.map(d => d.day)}
                    times={times}
                    rows={schedules}
                  />
                </TabPane>
              ))}
            </TabsDay>
          </div>
        </Modal>

        {/* End Schedules Here */}
      </Container>
    </div>
  );
};

export default SchedulesWebsite;
