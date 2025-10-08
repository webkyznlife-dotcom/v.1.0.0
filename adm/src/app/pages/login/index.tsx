import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import ApiService, { setAuthToken, LoginResponse } from "../../services/ApiService";

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    // Panggil API login
    const api = ApiService(); // jika perlu, bisa tambahkan baseURL
    const data: LoginResponse = await api.post<LoginResponse>("/user/v1/auth/login", {
      email,
      password,
    });


    // console.log("Login successful:", data);
    // Simpan token & user ke localStorage
    setAuthToken(data);

    // Tandai user sudah login

setIsAuthenticated(true);
setIsAuthenticated(true);
localStorage.setItem("isAuthenticated", "true");
navigate("/dashboard");

  } catch (error: any) {
    console.error("Login failed:", error);
    alert(error.response?.data?.message || "Login failed. Please check your credentials.");
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={styles.layout}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-center" style={styles.title}>
          Sign in
        </h2>
        <h2
          className="text-2xl font-bold text-gray-700 mb-6 text-center"
          style={styles.subtitle}
        >
          Please enter your details
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-xs mb-2 font-bold">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-gray-600 text-xs mb-2 font-bold">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3D3D3D] text-white py-2 rounded-lg hover:bg-[#2D2D2D] transition text-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layout: {
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 0,
    fontFamily: "Poppins, sans-serif",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 16,
    fontFamily: "Poppins, sans-serif",
  },
};

export default LoginPage;