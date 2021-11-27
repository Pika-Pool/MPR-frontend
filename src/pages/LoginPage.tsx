import { appName } from '../config/appGlobalMetaData';
import { GoogleLogin } from 'react-google-login';

export default function LoginPage() {
	return (
		<div className='login-page-container'>
			<main className='card login-card mx-auto'>
				<div className='card-body'>
					<h1 className='card-title text-center fw-bold mb-4'>
						Log in to {appName}
					</h1>

					<GoogleLogin
						className='card-link'
						clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
						buttonText='Log In with Google'
						onSuccess={a => console.log(a)}
						onFailure={a => console.log(a)}
						cookiePolicy='single_host_origin'
						icon={false}
						responseType='code'
					/>

					<GoogleLogin
						className='card-link'
						clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
						buttonText='Sign Up with Google'
						onSuccess={a => console.log(a)}
						onFailure={a => console.log(a)}
						cookiePolicy='single_host_origin'
						icon={false}
						responseType='code'
					/>
				</div>
			</main>
		</div>
	);
}
