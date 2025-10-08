// src/components/ContactForm.tsx
import React, { useRef, useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, message } from "antd"; 
import SuccessNotificationDialog from "../../../../../components/web/ui/dialogs/SuccessNotificationDialog";
import ErrorDialog from "../../../../../components/web/ui/dialogs/ErrorDialog";
import axios from "axios"; 

const { TextArea } = Input;
const { Option } = Select;

type FormValues = {
  fullName: string;
  institutionName: string;
  whatsapp: string;
  workEmail: string;
  help: string;
  branch: string;
  message: string;
};

const ContactForm: React.FC = () => {

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");  
  
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  

  const [form] = Form.useForm<FormValues>();

  const API_URL = process.env.REACT_APP_API_URL;

  // State untuk menyimpan data branch
  const [branches, setBranches] = useState<{ mb_id: number; mb_name: string }[]>([]);   
  const [subjects, setSubjects] = useState<{
    subject_id: number;
    subject_name: string;
    subject_description: string;
    subject_status: boolean;
    created_at: string;
    updated_at: string;
  }[]>([]);
  
  // === Fetch Branch Data ===
  const fetchDataBranch = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/branch`);
      setBranches(response.data.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };   

  // === Fetch Branch Data ===
  const fetchDataSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/v1/subject`);
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };   

  useEffect(() => {
    fetchDataBranch();
    fetchDataSubjects();
  }, []);  

  // === Form Submit Handler ===
  const onFinish = async (values: FormValues) => {
    try {
      // --- Full Name ---
      if (!values.fullName?.trim()) {
        setErrorMessage("Full Name is required");
        setErrorVisible(true);
        return;
      }

      // --- Institution Name ---
      if (!values.institutionName?.trim()) {
        setErrorMessage("Institution Name is required");
        setErrorVisible(true);
        return;
      }

      // --- Whatsapp ---
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

      // --- Work Email ---
      if (!values.workEmail?.trim()) {
        setErrorMessage("Work Email is required");
        setErrorVisible(true);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.workEmail)) {
        setErrorMessage("Invalid email format");
        setErrorVisible(true);
        return;
      }

      // --- Branch ---
      if (!values.branch) {
        setErrorMessage("Branch is required");
        setErrorVisible(true);
        return;
      }

      // --- Help / Subject ---
      if (!values.help) {
        setErrorMessage("Subject is required");
        setErrorVisible(true);
        return;
      }

      // --- Message ---
      if (!values.message?.trim()) {
        setErrorMessage("Message is required");
        setErrorVisible(true);
        return;
      }

      // Payload ke API sesuai model TrxContact
      const payload = {
        tc_pic_name: values.fullName,
        tc_institution: values.institutionName,
        tc_whatsapp: values.whatsapp,
        tc_email: values.workEmail,
        tc_message: values.message,
        mb_id: values.branch,
        subject_id: values.help,
        tc_is_membership: false, // default
        tc_status: "NEW",        // default
      };

      const response = await axios.post(
        `${API_URL}/user/v1/contact-us/create`,
        payload
      );

      if (response.data.success) {
        setSuccessMessage("Successfully submitted your contact request!");
        setSuccessModalVisible(true);
        form.resetFields();
      } else {
        setErrorMessage(response.data.message || "Submission failed");
        setErrorVisible(true);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setErrorMessage(error.response?.data?.message || "Submission failed");
      setErrorVisible(true);
    }
  };


  const onReset = () => {
    form.resetFields(); // reset manual lewat button
  };

  return (
    <div>
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
      className="bg-white w-full max-w-2xl mx-auto pt-3"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="fullName"
          label="PIC Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="Jane Smith" />
        </Form.Item>

        <Form.Item
          name="institutionName"
          label="Institution Name"
          rules={[{ required: true, message: "Please enter institution name" }]}
        >
          <Input placeholder="PT Akademi Fambam" />
        </Form.Item>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="whatsapp"
          label="PIC Whatsapp"
          rules={[
            { required: true, message: "Whatsapp number is required" },
            {
              pattern: /^08\d+$/,
              message: "Whatsapp number must start with '08'",
            },
          ]}
        >
          <Input
            placeholder="0818118601000"
            maxLength={15} // opsional, biar panjang nomor dibatasi
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="workEmail"
          label="PIC Work Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="jane@kyzn.life" />
        </Form.Item>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="help"
          label="What can we help you with?"
          rules={[{ required: true, message: "Please select an option" }]}
        >
          <Select 
            placeholder="Select Subject"
            showSearch
            optionFilterProp="children"
          >
            {subjects.map((subject) => (
              <Option key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
      </div>

      {/* Row 4 */}
      <Form.Item 
        name="message" 
        label="Message" 
        rules={[{ required: true, message: "Please enter your message" }]}
        className="mb-10"
      >
        <TextArea rows={4} placeholder="Type your message" />
      </Form.Item>

      {/* Submit & Reset */}
      <Form.Item>
        <div className="flex gap-3">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-yellow-600 hover:bg-yellow-700 flex-1"
          >
            Submit
          </Button>
          <Button
            htmlType="button"
            onClick={onReset}
            className="flex-1"
            danger
          >
            Reset
          </Button>
        </div>
      </Form.Item>
    </Form>

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

export default ContactForm;
