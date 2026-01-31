import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hook/useAuthContext'
import ProtectedRoleRouteExit from './protect/ProtectroleExit'
import Loginpage from './component/loginPage'
import Homepage from './component/homePage'
import MainLayout from './layout/MainLayout'
import Drawingrequestexisting from './Page/exist/drawingRequestexisting/Drawingrequestexist'
import Exithome from './Page/exist/Existhome'
import CreatedrawingRequest from './Page/exist/drawingRequestexisting/CreatedrawingRequest'
import DrawingRequestPrint from './Page/exist/Printdrawingrequest'
import Drawingresponse from './Page/exist/drawingResponse/Drawingresponse'
import CreatedrawingResponse from './Page/exist/drawingResponse/Createdrawingresponse'

///new
import DrawingNewRequestForm from './Page/new/PrintNewdrawingRequest'
import Drawingrequestnew from './Page/new/Drawingrequest/Drawingrequest'
import DrawingresponseNew from './Page/new//Drawingresponse/Drawingresponse'
import DrawingapproveNew from './Page/new/Drawingapprove.js/Drawingapprove'
import DrawingsenderNew from './Page/new/sender/Drawingsender'

import CreateDrawingRequest from './Page/new/Drawingrequest/CreatedrawingRequest'

//import 
import GlobalUpdateAlert from './component/GlobalUpdateAlert'
import User from './Page/user/User'
function App() {
  const { user } = useAuthContext()
  const isAuthenticated = Boolean(user?.token)
  // console.log("User in App.js:", user?.data[0].email);

  return (
    <Router>
        <GlobalUpdateAlert />
      <Routes>
        {/* Public routes (NO layout) */}
        <Route path="/login" element={<Loginpage />} />
        {/* <Route element={<ProtectedRoleRouteExit/>}>
          <Route path="/homePage" element={<Homepage />} />
        </Route> */}
        <Route path="/homePage" element={<Homepage />} />
        

        {/* Protected routes (WITH layout) */}
        {isAuthenticated && (
          <Route element={<MainLayout />}>
            <Route path="/404" element={<p>404 Page Not found</p>} />

            {/* add more protected routes here */}
            <Route path="/exist/home" element={<Exithome/>} />

            <Route path="/exist/drawingrequest" element={<Drawingrequestexisting/>} />
            <Route element={<ProtectedRoleRouteExit allowedRoles={['Requestor']} />}>
              <Route path="/exist/createdrawingrequest" element={<CreatedrawingRequest/>} />
            </Route>
            {/* <Route element={<ProtectedRoleRouteExit allowedRoles={['Requestor', 'Responsor']} />}>
              <Route path="/exist/drawingrequest/:request_id" element={<DrawingRequestPrint/>} />
            </Route> */}
            <Route path="/exist/drawingrequest/:request_id" element={<DrawingRequestPrint/>} />

            {/* Reponse */}
            <Route element={<ProtectedRoleRouteExit allowedRoles={['Responsor']} />}>
              <Route path="/exist/createdrawingresponse/:request_id" element={<CreatedrawingResponse/>} />
            </Route>
            <Route path="/exist/drawingresponse" element={<Drawingresponse/>} />


            {/* New*/}
            <Route path="/new/drawingrequest" element={<Drawingrequestnew/>} />
            <Route path="/new/createdrawingrequest" element={<CreateDrawingRequest/>} />
            <Route element={<ProtectedRoleRouteExit allowedRoles={['Requestor', 'Responsor']} />}>
                 <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} />
            </Route>
            <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} />

            {/* <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} /> */}
            {/* New*/}
            <Route path="/new/drawingresponse" element={<DrawingresponseNew/>} />
            {/* <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} /> */}
            {/* New*/}
            <Route path="/new/drawingapprove" element={<DrawingapproveNew/>} />
            {/* <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} /> */}
            <Route path="/new/drawingsender" element={<DrawingsenderNew/>} />
            {/* <Route path="/new/drawingrequest/:request_id" element={<DrawingNewRequestForm/>} /> */}

            <Route element={<ProtectedRoleRouteExit allowedRoles={['superadmin']} />}>
              <Route path="/user" element={<User/>} />
            </Route>
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
