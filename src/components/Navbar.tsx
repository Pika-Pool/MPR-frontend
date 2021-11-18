export default function Navbar() {
	return (
		<nav className='navbar navbar-expand navbar-dark bg-dark mb-5 mb-md-3'>
			<div className='container'>
				<a className='navbar-brand h1 mb-0' href='#'>
					DatumDB
				</a>

				<ul className='navbar-nav ms-auto'>
					<li className='nav-item'>
						<a className='nav-link' href='#' tabIndex={-1} aria-disabled='true'>
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
