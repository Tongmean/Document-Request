import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hook/useAuthContext'

import Loginpage from './component/loginPage'
import Homepage from './component/homePage'
import MainLayout from './layout/MainLayout'
import Drawingrequestexisting from './Page/exist/drawingRequestexisting/Drawingrequestexist'
import Drawingrequestnew from './Page/new/Drawingrequest'
import Exithome from './Page/exist/Existhome'
import CreatedrawingRequest from './Page/exist/drawingRequestexisting/CreatedrawingRequest'
import DrawingRequestPrint from './Page/exist/Printdrawingrequest'
import Drawingresponse from './Page/exist/drawingResponse/Drawingresponse'
import CreatedrawingResponse from './Page/exist/drawingResponse/Createdrawingresponse'
function App() {
  const { user } = useAuthContext()
  const isAuthenticated = Boolean(user?.token)
  // console.log("User in App.js:", user);

  return (
    <Router>
      <Routes>
        {/* Public routes (NO layout) */}
        <Route path="/login" element={<Loginpage />} />
        <Route path="/homePage" element={<Homepage />} />

        {/* Protected routes (WITH layout) */}
        {isAuthenticated && (
          <Route element={<MainLayout />}>
            <Route path="/404" element={<p>404 Page Not found</p>} />

            {/* add more protected routes here */}
            <Route path="/exist/home" element={<Exithome/>} />

            <Route path="/exist/drawingrequest" element={<Drawingrequestexisting/>} />
            <Route path="/exist/createdrawingrequest" element={<CreatedrawingRequest/>} />

            <Route path="/exist/drawingrequest/:request_id" element={<DrawingRequestPrint/>} />
            {/* Reponse */}
            
            <Route path="/exist/createdrawingresponse/:request_id" element={<CreatedrawingResponse/>} />
            <Route path="/exist/drawingresponse" element={<Drawingresponse/>} />

            {/* New*/}
            <Route path="/new/drawingrequest" element={<Drawingrequestnew/>} />
          </Route>
        )}

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/404' : '/login'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
