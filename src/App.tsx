import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap';
// components
import Navbar from './components/Navbar';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherModule from './pages/TeacherModule';
import NavigateToNotFound from './components/NavigateToNotFound';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			// staleTime: 1000 * 60 * 2, // 2 min
		},
	},
});

export default function App() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Navbar />

				<div className='mb-5'>
					<Routes>
						<Route path='/teacher/*'>
							<Route path='dash' element={<TeacherDashboard />} />
							<Route
								path='module/:moduleForSectionId'
								element={<TeacherModule />}
							/>
							{/* <Route
								path='module/:moduleForSectionId/question/:questionId'
								element={<TeacherQuestion />}
							/> */}
							<Route path='*' element={<NavigateToNotFound />} />
						</Route>
						<Route path='/not-found' element={<h1>Page not found</h1>} />
						<Route path='*' element={<NavigateToNotFound />} />
					</Routes>
				</div>

				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</BrowserRouter>
	);
}
