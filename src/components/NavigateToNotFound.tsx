import { Navigate } from 'react-router-dom';

export default function NavigateToNotFound() {
	return <Navigate to='/not-found' replace />;
}
