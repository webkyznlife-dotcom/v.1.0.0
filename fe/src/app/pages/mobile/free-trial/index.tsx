import React, { useRef, useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import FreeTrialHeaderMobile from "../../mobile/free-trial/components/free-trial-header";
import { motion, useInView } from "framer-motion";
import { Form, Input, DatePicker, Select, Button, Row, Col, Checkbox } from "antd";
import SuccessNotificationDialog from "../../../components/web/ui/dialogs/SuccessNotificationDialog";
import ErrorDialog from "../../../components/web/ui/dialogs/ErrorDialog";
import axios from "axios";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: "55px",
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

const { Option } = Select;

const FreeTrialMobile: React.FC = () => {
  // === Refs & Animation View ===
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");  
  
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  

  // State untuk menyimpan data branch
  const [branches, setBranches] = useState<{ mb_id: number; mb_name: string }[]>([]);
  const [ageGroups, setAgeGroups] = useState<
    { mpa_id: number; mpa_min: number; mpa_max: number; mpa_status: boolean }[]
  >([]);  

  const [programs, setPrograms] = useState<
    {
      mp_id: number;
      mp_name: string;
      mp_description: string;
      mp_category_id: number;
      mp_age_id: number;
      mp_activity_category_id: number;
      mp_status: boolean;
      mp_header_image: string;
      mp_thumbnail: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);  

  // === Form Instance ===
  const [form] = Form.useForm();

  const API_URL = process.env.REACT_APP_API_URL;

  // === Fetch Branch Data ===
  const fetchDataBranch = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/branch`);
      setBranches(response.data.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  // === Fetch Age Groups Data ===
  const fetchDataAgeGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/age-groups`);
      setAgeGroups(response.data.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };  

  // === Fetch Program Data ===
  const fetchDataProgram = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/program`);
      setPrograms(response.data.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };    

  useEffect(() => {
    fetchDataBranch();
    fetchDataAgeGroups();
    fetchDataProgram();
  }, []);  

  // === Form Submit Handler ===
  const onFinish = async (values: any) => {
    try {

      const whatsapp = values.whatsapp?.trim();
      if (!whatsapp) {
        setErrorMessage("Whatsapp number is required");
        setErrorVisible(true);
        return;
      }
      if (whatsapp.startsWith("62")) {
        setErrorMessage("Whatsapp number should not start with '62', please use '08'");
        setErrorVisible(true);
        return;
      }
      if (!whatsapp.startsWith("08")) {
        setErrorMessage("Whatsapp number should start with '08'");
        setErrorVisible(true);
        return;
      }
    
      // Struktur data sesuai API
      const payload = {
        ttc_name: values.name,
        ttc_dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        ttc_email: values.email,
        ttc_whatsapp: values.whatsapp,
        mb_id: values.branch,
        mpa_id: values.ageCategory,
        mp_id: values.trialClass,
        ttc_day: values.day,
        ttc_time: values.time,
        ttc_terms_accepted: values.agreement,
        ttc_marketing_opt_in: values.offers,
        ttc_status: "PENDING", // default
      };

      const response = await axios.post(`${API_URL}/user/v1/trial-class/create`, payload);

      if (response.data.success) {
        // Tampilkan modal sukses
        setSuccessMessage("Successfully submitted your free trial request!");
        setSuccessModalVisible(true);

        form.resetFields();
      } else {
        // Tampilkan modal error
        setErrorMessage(response.data.message || "Submission failed");
        setErrorVisible(true);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setErrorMessage(error.response?.data?.message || "Submission failed");
      setErrorVisible(true);
    }
  };


  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}>
        {/* ================= Header ================= */}
        <FreeTrialHeaderMobile
          title="FREE TRIAL"
          breadcrumb="Home / Free Trial"
        /> 

        {/* ================= Title + Description ================= */}
        <div ref={sectionRef} className="mt-4 mb-0 px-6 pt-0">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Discover Our Programs
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            KYZN Academy's Programs are designed to provide students with a
            well-rounded learning experience, covering all levels of skills and
            techniques. Explore a wide range of programs tailored to match your
            child’s interests and passions.
          </motion.p>
        </div>


        {/* ================= Form Sections ================= */}
        <div className="w-[100%] mx-auto bg-white p-8">
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => {
              if (errorFields.length > 0) {
                setErrorMessage(errorFields[0].errors[0]); // ambil pesan error pertama
                setErrorVisible(true);
              } 
            }}
            >
            <Row gutter={16}>
              {/* Name */}
              <Col span={24}>
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                  <Input placeholder="Jane Smith" />
                </Form.Item>
              </Col>

              {/* Date of Birth */}
              <Col span={24}>
                <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} format="MM/DD/YYYY" />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col span={12}>
                <Form.Item label="Email" name="email" rules={[{ type: "email", required: true }]}>
                  <Input placeholder="your-name@gmail.com" />
                </Form.Item>
              </Col>

              {/* Whatsapp Number */}
              <Col span={12}>
                <Form.Item
                  label="Whatsapp Number"
                  name="whatsapp"
                  rules={[
                    { required: true, message: "Whatsapp number is required" },
                    {
                      pattern: /^08\d+$/,
                      message: "Whatsapp number must start with '08'",
                    },
                  ]}
                >
                  <Input
                    placeholder="08118601000"
                    maxLength={15} // opsional, batasin jumlah digit
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, ""); // hapus non-digit
                      form.setFieldsValue({ whatsapp: onlyNums });
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Branch */}
              <Col span={12}>
                <Form.Item label="Branch" name="branch" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Branch"
                    showSearch
                    optionFilterProp="children"
                  >
                    {branches.map((branch) => (
                      <Option key={branch.mb_id} value={branch.mb_id}>
                        {branch.mb_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>


              {/* Age Category */}
              <Col span={12}>
                <Form.Item label="Age Category" name="ageCategory" rules={[{ required: true }]}>
                  <Select placeholder="Select Age Category" showSearch optionFilterProp="children">
                    {ageGroups.map((group) => (
                      <Option key={group.mpa_id} value={group.mpa_id}>
                        {group.mpa_min}–{group.mpa_max} yr
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>


              {/* Trial Class - Full Width */}
              <Col span={24}>
                <Form.Item
                  label="Choose your Trial Class"
                  name="trialClass"
                  rules={[{ required: true, message: "Please select a trial class" }]}
                >
                  <Select
                    placeholder="Select Trial Class"
                    showSearch
                    optionFilterProp="children"
                  >
                    {programs.map((program) => (
                      <Option key={program.mp_id} value={program.mp_id}>
                        {program.mp_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>


              {/* Day & Time in one row */}
              <Col span={12}>
                <Form.Item
                  label="Day"
                  name="day"
                  rules={[{ required: true, message: "Please select a day" }]} // <- rules ditambahkan
                >
                  <Select defaultValue="all">
                    <Option value="all">All</Option>
                    <Option value="monday">Monday</Option>
                    <Option value="tuesday">Tuesday</Option>
                    <Option value="wednesday">Wednesday</Option>
                    <Option value="thursday">Thursday</Option>
                    <Option value="friday">Friday</Option>
                    <Option value="saturday">Saturday</Option>
                    <Option value="sunday">Sunday</Option>
                  </Select>
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item 
                  label="Time" 
                  name="time"
                  rules={[{ required: true, message: "Please select a time" }]} // <- rules ditambahkan
                >
                  <Select placeholder="Select Time" 
                    showSearch
                    optionFilterProp="children"
                    >
                    {Array.from({ length: 33 }, (_, i) => {
                      // Mulai dari jam 6:00 sampai 22:00 tiap 30 menit
                      const hour = Math.floor((6 * 2 + i) / 2);
                      const minute = (i % 2) === 0 ? "00" : "30";
                      const value = `${hour.toString().padStart(2, "0")}:${minute}`;
                      return (
                        <Option key={value} value={value}>
                          {value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Checkbox Section */}
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject("You must accept terms"),
                },
              ]}
              style={{ marginBottom: 8 }}
            >
              <Checkbox>
                I&apos;ve read and agreed to the terms condition and data{" "}
                <a href="https://legal.kyzn.life/privacy-policy" target="_blank" rel="noopener noreferrer">
                  privacy policy
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="offers"
              valuePropName="checked"
              style={{ marginBottom: 8 }}
            >
              <Checkbox>
                I&apos;m happy to sign up for my personalised content and offers
              </Checkbox>
            </Form.Item>


            {/* Submit & Reset Buttons */}
            <Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full mt-4"
                    size="large"
                    style={{ backgroundColor: "#8B4513", borderColor: "#8B4513" }}
                  >
                    Submit
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    htmlType="button"
                    onClick={() => form.resetFields()}
                    className="w-full mt-4"
                    size="large"
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Container>

      <SuccessNotificationDialog
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={successMessage}
      />

      <ErrorDialog
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />      
    </div>
  );
};

export default FreeTrialMobile;