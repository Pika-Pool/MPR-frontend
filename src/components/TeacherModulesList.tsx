import { useEffect, useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import env from '../config/env';

interface Module {
	id: number;
	module_state: boolean;
	module_name: string;
}

export default function TeacherModulesList() {
	const [listOfModules, setListOfModules] = useState<Module[]>([]);

	useEffect(() => {
		fetch(`${env.serverBaseUrl}/datumApp/teacherHome/1`, {
			mode: 'cors',
			headers: { Accept: 'application/json' },
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setListOfModules(data);
			})
			.catch(err => console.error(err));
	}, []);

	const onToggleModuleState = (id: number) => {
		fetch(`${env.serverBaseUrl}/datumApp/changeState`, {
			body: JSON.stringify({ id }),
			mode: 'cors',
			headers: { Accept: 'application/json' },
			method: 'PUT',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				// setListOfModules(data);
			})
			.catch(err => console.log(err));
	};

	return (
		<ol className='teacher-modules-list list-group list-group-numbered'>
			{listOfModules.map(({ id, module_name, module_state }) => (
				<li className='list-group-item d-flex' key={id}>
					<div className='d-flex justify-content-between align-items-center w-100 ms-2'>
						<div>{module_name}</div>

						<div onClick={() => onToggleModuleState(id)} role='button'>
							{module_state ? <FaLockOpen /> : <FaLock />}
						</div>
					</div>
				</li>
			))}
		</ol>
	);
}
