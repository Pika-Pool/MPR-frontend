import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import TeacherModulesList from '../components/TeacherModulesList';
// types
import type { CSSProperties } from 'react';

const tabsList = ['modules', 'students'] as const;
type DashboardTab = typeof tabsList[number];

export default function TeacherDashboard() {
	// eslint-disable-next-line @kyleshevlin/prefer-custom-hooks
	const [tab, setTab] = useState<DashboardTab>(tabsList[0]);

	return (
		<main className='teacher-dashboard container'>
			<header
				className='teacher-dashboard__tab-selector row fs-3 fw-bold mb-5 border rounded'
				style={{ '--tab-index': tabsList.indexOf(tab) } as CSSProperties}
			>
				{tabsList.map(tabName => (
					<div
						key={tabName}
						onClick={() => setTab(tabName)}
						role='button'
						className={`col text-center text-capitalize ${
							tabName === tab && 'text-white'
						}`}
					>
						{tabName}
					</div>
				))}
			</header>
			<h1 className='text-capitalize'>{tab}</h1>

			<DashboardContent tab={tab} />
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
			return null;
		default:
			return <Navigate to='/not-found' />;
	}
}
