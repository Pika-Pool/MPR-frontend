import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<main className='mw-850 container'>
			<h3>Question Not Found</h3>
			<p>
				Redirect to{' '}
				<Link to='/teacher/dash' replace>
					dashboard
				</Link>
			</p>
		</main>
	);
}
