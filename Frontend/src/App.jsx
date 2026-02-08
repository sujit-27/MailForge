import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ForgeChatProvider } from "@/context/ForgeChatContext";
import { queryClient } from "./lib/queryClient";
import ThemeProvider from "./components/LandingPage/ThemeProvider";

import Home from "./pages/Home";
import Contact from "./components/auth/Contact";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserDetails, setCredentials } from "./redux/slices/authSlice";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./sections/Dashboard/DashboardLayout";
import SendEmail from "./sections/Dashboard/SendEmail";
import EmailLogs from "./sections/Dashboard/EmailLogs";
import Templates from "./sections/Dashboard/Templates";
import Analytics from "./sections/Dashboard/Analytics";
import ApiKeys from "./sections/Dashboard/ApiKeys";
import Profile from "./sections/Dashboard/Profile";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import SendEmailHub from "./sections/Dashboard/SendEmail";
import SendEmailProjectPage from "./pages/SendEmailProjectPage";
import EmailLogsDetailsPage from "./pages/EmailLogsDetailsPage";
import Pricing from "./pages/Pricing";
import Transaction from "./pages/Transaction";
import TemplatePreview from "./sections/Modals/TemplatePreview";
import Docs from "./sections/Documentation/Docs";
import About from "./sections/LandingPage/About";
import Human from "./sections/LandingPage/Human";
import Blog from "./sections/LandingPage/Blog";
import Support from "./sections/LandingPage/Support";
import FAQ from "./sections/LandingPage/FAQ";
import TemplateCreation from "./sections/Modals/TemplateCreation";
import ForgeChatWidget from "./components/chatbot/ForgeChatWidget";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(
        setCredentials({
          token,
          user: JSON.parse(user),
        })
      );
      dispatch(getUserDetails({ user, token: token }));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <ForgeChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/humans" element={<Human/>}/>
              <Route path="/blog" element={<Blog/>}/>
              <Route path="/support" element={<Support/>}/>
              <Route path="/faq" element={<FAQ/>}/>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send-email" element={<SendEmail />} />
                <Route path="/email-logs" element={<EmailLogs />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/api-keys" element={<ApiKeys />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                <Route path="/send-email" element={<SendEmail />} /> 
                <Route path="/send-email/:projectId" element={<SendEmailProjectPage />} /> 
                <Route path="/email-logs" element={<EmailLogs />} />
                <Route path="/email-logs/:projectId" element={<EmailLogsDetailsPage />} />
                <Route path="/billing" element={<Transaction />} />
                <Route path="/preview/:templateId" element={<TemplatePreview />} />
                <Route path="/templates/create" element={<TemplateCreation/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
          <ForgeChatWidget />
          </ForgeChatProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
