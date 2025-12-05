import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import ImageGenerator from './pages/ImageGenerator'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<ImageGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
