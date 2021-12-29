import type { CSSProperties } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TeacherModulesList from '../components/TeacherModulesList';
import TeacherStudentStats from '../components/TeacherStudentStats';

const tabsList = ['modules', 'students'] as const;
type DashboardTab = typeof tabsList[number];

export default function TeacherDashboard() {
	const location = useLocation();
	const navigate = useNavigate();

	// remove starting '#'
	const currentTab = location.hash.substring(1) as DashboardTab;

	if (!tabsList.find(tab => tab === currentTab))
		return (
			<Navigate
				to={{ ...location, hash: '#' + tabsList[0] }}
				replace
				state={location.state}
			/>
		);

	return (
		<main className='mw-850 container'>
			<header
				className='teacher-dashboard__tab-selector row fs-3 fw-bold mb-5 border rounded'
				style={
					{
						'--tab-index': tabsList.indexOf(currentTab),
					} as CSSProperties
				}
			>
				{tabsList.map(tabName => (
					<div
						key={tabName}
						onClick={() =>
							navigate(
								{ ...location, hash: '#' + tabName },
								{ replace: true, state: location.state },
							)
						}
						role='button'
						className={`col text-center text-capitalize ${
							tabName === currentTab && 'text-white'
						}`}
					>
						{tabName}
					</div>
				))}
			</header>
			<h1 className='text-capitalize'>{currentTab}</h1>

			<DashboardContent tab={currentTab} />
		</main>
	);
}

interface DashboardContentProps {
	tab: DashboardTab;
}

function DashboardContent({ tab }: DashboardContentProps) {
	switch (tab) {
		case 'modules':
			return <TeacherModulesList />;
		case 'students':
			return <TeacherStudentStats />;
		default:
			throw new Error(`"tab" must be one of ${tabsList}, got: ${tab}`);
	}
}
