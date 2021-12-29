import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap';
// components
import { Navbar, NotFound } from './components';
// pages
import {
	TeacherDashboard,
	TeacherModule,
	TeacherQuestion,
	StudentDashboard,
	StudentModule,
	StudentQuestion,
	Playground,
} from './pages';

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
						<Route path='/playground' element={<Playground />} />

						<Route path='/teacher/*'>
							<Route path='dash' element={<TeacherDashboard />} />
							<Route
								path='module/:moduleForSectionId'
								element={<TeacherModule />}
							/>
							<Route
								path='module/:moduleForSectionId/question/:questionId'
								element={<TeacherQuestion />}
							/>
							<Route path='*' element={<NotFound />} />
						</Route>

						<Route path='/student/*'>
							<Route path='dash' element={<StudentDashboard />} />
							<Route
								path='module/:moduleForSectionId'
								element={<StudentModule />}
							/>
							<Route
								path='module/:moduleForSectionId/question/:questionId'
								element={<StudentQuestion />}
							/>
							<Route path='*' element={<h1>Page Not found</h1>} />
						</Route>

						<Route path='/not-found' element={<h1>Page not found</h1>} />
						<Route path='*' element={<NotFound />} />
					</Routes>
				</div>

				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</BrowserRouter>
	);
}
