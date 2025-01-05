import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { ThemeProvider } from "./App/Theme.jsx";
import { BrowserRouter } from "react-router-dom"
import { SocketProvider } from "./App/Socket";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)


