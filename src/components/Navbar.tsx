import { appName } from '../config/appGlobalMetaData';

export default function Navbar() {
	return (
		<nav className='navbar navbar-expand navbar-dark bg-dark mb-5 mb-md-3'>
			<div className='container'>
				<a className='navbar-brand h1 mb-0' href='#'>
					{appName}
				</a>

				<ul className='navbar-nav ms-auto'>
					<li className='nav-item d-flex justify-content-center align-items-center'>
						<a className='nav-link' href='#'>
							Sri
						</a>
					</li>

					<li className='nav-item'>
						<button className='btn btn-danger' type='button'>
							Logout
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
}
