import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import PageLoader from './components/PageLoader';

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return <PageLoader />

  return (
    <>
      <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4'>
          <Routes>
            <Route path='/' element={ authUser ? <MainPage /> : <Navigate to={"/login"} />  } />
            <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to={"/"} /> } />
            <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to={"/"} /> } />
          </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
