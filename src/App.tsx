import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TeacherDashboard from './pages/TeacherDashboard';

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path='/teacher/dash' element={<TeacherDashboard />} />

				<Route path='*' element={<h1>Page not found</h1>} />
			</Routes>
		</BrowserRouter>
	);
}
