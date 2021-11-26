import { FaLock, FaLockOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useModulesListQuery from '../hooks/useModulesListQuery';
import useToggleModuleState from '../hooks/useToggleModuleState';
import LoadingSpinner from './LoadingSpinner';

export default function TeacherModulesList() {
	const modulesListQuery = useModulesListQuery();
	// TODO: error handling
	const { mutate: onToggleModuleState } = useToggleModuleState();

	if (modulesListQuery.isLoading) return <LoadingSpinner />;
	if (modulesListQuery.error) {
		console.log(Object.prototype.toString.call(modulesListQuery.error));
		return (
			<h3 className='text-danger'>Something went wrong. Try again later.</h3>
		);
	}

	return (
		<ol className='teacher-modules-list list-group list-group-numbered'>
			{modulesListQuery.data?.map(module => {
				const {
					id: module_for_section_id,
					module_id: { module_name },
					module_state,
				} = module;

				return (
					<li className='list-group-item d-flex' key={module_for_section_id}>
						<div className='d-flex justify-content-between align-items-center w-100 ms-2'>
							<Link to={`../module/${module_for_section_id}`}>
								{module_name}
							</Link>

							<div onClick={() => onToggleModuleState(module)} role='button'>
								{module_state ? (
									<FaLockOpen className='lock-icon-open' />
								) : (
									<FaLock className='lock-icon-closed' />
								)}
							</div>
						</div>
					</li>
				);
			})}
		</ol>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isModule(obj: any): obj is Module {
	return (
		((obj != null && typeof obj === 'object') || typeof obj === 'function') &&
		typeof obj.id === 'number' &&
		((obj.module_id !== null && typeof obj.module_id === 'object') ||
			typeof obj.module_id === 'function') &&
		typeof obj.module_id.id === 'number' &&
		typeof obj.module_id.module_name === 'string' &&
		typeof obj.module_id.description === 'string' &&
		typeof obj.module_state === 'boolean' &&
		typeof obj.section_id === 'number'
	);
}

export interface Module {
	id: number;
	module_id: {
		id: number;
		module_name: string;
		description: string;
	};
	module_state: boolean;
	section_id: number;
}
