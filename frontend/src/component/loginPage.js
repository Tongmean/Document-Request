// import React, { useState } from 'react';
// import useLogin from '../hook/useLogin';
// import Modal from 'react-bootstrap/Modal';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const { error, isLoading, login } = useLogin();
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const navigate = useNavigate();

//   const location = useLocation();
//   const handleSubmit = async (e) => {
//     const from = location.state?.from?.pathname || "/homePage";
//     console.log('from',from)
//     console.log('location.state?.from?.pathname',location)
//     // e.preventDefault();
//     console.log('Login attempt:', { email, password });
//     // // Add your login logic here
//     // alert('Login functionality would be implemented here');
//     e.preventDefault();
//     const success = await login(email, password);
//     if (!success) {
//         setShowErrorModal(true);
//         alert(error);
//     } else {
//         // navigate('/homePage');
//         navigate(from, { replace: true });
//     }
//   };
//     const handleCloseErrorModal = () => {
//         setShowErrorModal(false);
//     };
//   return (
//     <>
//       <link 
//         href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
//         rel="stylesheet"
//       />
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         {/* Left Column - Drawing Request System */}
//         <div className="col-md-6 bg-primary d-flex align-items-center justify-content-center text-white">
//           <div className="text-center p-5">
//             <div className="mb-4">
//               <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="3" fill="none"/>
//                 <path d="M40 60 L55 75 L80 45" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h1 className="display-4 fw-bold mb-3">Drawing Request System</h1>
//             <p className="lead mb-4">
//               Streamline your technical drawing requests with our comprehensive management platform
//             </p>
//           </div>
//         </div>

//         {/* Right Column - Login Form */}
//         <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
//           <div className="w-100" style={{ maxWidth: '400px' }}>
//             <div className="text-center mb-4">
//               <h2 className="fw-bold mb-2">Welcome Back</h2>
//               <p className="text-muted">Please login to your account</p>
//             </div>

//             <div>
//               <div className="mb-3">
//                 <label htmlFor="email" className="form-label fw-semibold">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   className="form-control form-control-lg"
//                   id="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label fw-semibold">
//                   Password
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     className="form-control form-control-lg"
//                     id="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     className="btn btn-outline-secondary"
//                     type="button"
//                     loading={isLoading}
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 className="btn btn-primary btn-lg w-100 mb-3"
//               >
//                 Login
//               </button>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
//         <Modal.Header closeButton>
//             <Modal.Title>Error</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{error}</Modal.Body>
//         <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseErrorModal}>
//                 Close
//             </Button>
//         </Modal.Footer>
//     </Modal>
//     </>
//   );
// }
import React, { useState } from 'react';
import useLogin from '../hook/useLogin';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { error, isLoading, login } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (!success) {
      setShowErrorModal(true);
    } else {
      // navigate(from, { replace: true });
            // Cleanup
      // sessionStorage.removeItem('redirectAfterLogin');

      navigate('/homePage');
      }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container-fluid vh-100">
        <div className="row h-100">

          {/* LEFT SIDE */}
          <div className="col-md-6 bg-primary d-flex align-items-center justify-content-center text-white">
            <div className="text-center p-5">
              <h1 className="display-4 fw-bold mb-3">
                Drawing Request System
              </h1>
              <p className="lead">
                Streamline your technical drawing requests
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
            <div className="w-100" style={{ maxWidth: '400px' }}>

              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Please login to your account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>

      {/* ERROR MODAL */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
