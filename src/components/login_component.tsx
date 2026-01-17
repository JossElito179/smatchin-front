import { Alert, FormControl, Input, InputLabel } from "@mui/material";
import SpotlightCard from "../bits-components/Spot-light-card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Logo from "../assets/530171883_122216480942251755_3185943683385628894_n.jpg";
import { endpoint } from "../utils/utils";

export default function LoginComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      navigate('/teams');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setError('');
      const response = await axios.post(endpoint+'auth/login', {
        user_name: username,
        password,
      });

      const { access_token, id } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('id_user', id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      setUser(user);
      return { success: true, data: user };
    } catch (error) {

      const errorMessage = error || + 'Erreur de connexion';
      setError('' + errorMessage);
      return { success: false, error: errorMessage };
    }
  };


  return (

    <div className="login-container-component w-full h-auto flex items-center justify-center min-h-screen absolute z-10 ">
      <div className="text-white flex items-center justify-center p-10">
        <SpotlightCard
          className="w-full max-w-md backdrop-blur-xs border-2 border-white/50 bg-white/10"
          spotlightColor="rgba(189, 120, 0, 0.4)"
        >
          <div className="flex justify-center ">
            <button className=" rounded-full p-2 px-4 flex items-center justify-center">
              <img src={Logo} alt="logo" className="w-7 h-7" />
              <span className="text-white ml-1.5 text-2xl font-medium align-middle mt-1 " > Check event's site </span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <div className="space-y-5">
            <FormControl fullWidth>
              <InputLabel
                htmlFor="username"
                className="text-gray-300 mb-5 "
                sx={{
                  color: 'rgb(209 213 219)',
                  '&.Mui-focused': {
                    color: 'rgb(251 234 255)',
                  },
                }}
              >
                User name
              </InputLabel>
              <Input
                id="username"
                className="text-white mb-5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  color: 'white',
                  '&:before': {
                    borderColor: 'rgb(209 213 219)',
                  },
                  '&:after': {
                    borderColor: 'rgb(251 234 255)',
                  },
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                htmlFor="password"
                sx={{
                  color: 'rgb(209 213 219)',
                  '&.Mui-focused': {
                    color: 'rgb(251 234 255)',
                  },
                }}
              >
                Password
              </InputLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  color: 'white',
                  '&:before': {
                    borderColor: 'rgb(209 213 219)',
                  },
                  '&:after': {
                    borderColor: 'rgb(251 234 255)',
                  },
                }}
              />

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  Verify your credentials, some error occurred: {error}
                </Alert>
              )}

              <p className="text-center font-sans font-bold text-gray-400 mt-10 ">
                <button onClick={handleSubmit} className="hover:text-white border-white/50 cursor-pointer border-2 transition-all text-white font-bold py-2 px-8 rounded" > Sign in </button>
              </p>
            </FormControl>
          </div>
        </SpotlightCard>
      </div>
      <div className="h1-container hidden md:inline">
        <h1 className="font-light w-xl text-white text-8xl">
          Welcome to Smatch'in admin
        </h1>
      </div>
    </div>

  );
}
