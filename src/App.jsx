import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg';
//import Home from "./pages/home.jsx";
import MyRoute from "./routes/routes.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/authContext.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
      <AuthProvider>
          <MyRoute />
       </AuthProvider>
    </ThemeProvider>
  )
}

export default App
