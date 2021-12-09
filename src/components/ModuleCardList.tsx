import { Link } from 'react-router-dom';
import type { Module } from './TeacherModulesList';

export default function ModuleCardList({ modules }: { modules: Module[] }) {
	return (
		<div className='grid-responsive'>
			{modules.map(
				({
					module_id: { module_name, description, id },
					id: moduleForSectionId,
				}) => (
					<Link
						to={`../module/${moduleForSectionId}`}
						key={id}
						className='card text-decoration-none'
					>
						<div className='card-body'>
							<h5 className='card-title border-2 border-bottom pb-2 mb-3'>
								{module_name}
							</h5>
							<p className='card-text'>{description}</p>
							{/* <a href='#' className='card-link'>
								Card link
							</a> */}
						</div>
					</Link>
				),
			)}
		</div>
	);
}
