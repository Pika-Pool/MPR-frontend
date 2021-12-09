import type { ReactNode } from 'react';

export interface CompleteIncompleteAccordionProps<T> {
	completedHead: string;
	incompleteHead: string;
	completeList?: T[];
	incompleteList?: T[];
	noCompleteMsg: string;
	noIncompleteMsg: string;
	render: (list: T[]) => ReactNode;
}

export default function CompleteIncompleteAccordion<T>({
	completedHead,
	incompleteHead,
	completeList,
	incompleteList,
	noCompleteMsg,
	noIncompleteMsg,
	render,
}: CompleteIncompleteAccordionProps<T>) {
	return (
		<div className='accordion accordion-flush'>
			<div className='accordion-item'>
				<h2 className='accordion-header' id='completed-modules-head'>
					<button
						className='accordion-button collapsed'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#completed-modules'
						aria-expanded='true'
						aria-controls='completed-modules'
					>
						{completedHead}
					</button>
				</h2>

				<div
					id='completed-modules'
					className='accordion-collapse collapse'
					aria-labelledby='completed-modules-head'
				>
					<div className='accordion-body'>
						{!completeList || completeList.length === 0 ? (
							<div>{noCompleteMsg}</div>
						) : (
							render(completeList)
						)}
					</div>
				</div>
			</div>

			<div className='accordion-item mt-3'>
				<h2 className='accordion-header' id='incomplete-modules-head'>
					<button
						className='accordion-button'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#incomplete-modules'
						aria-expanded='false'
						aria-controls='incomplete-modules'
					>
						{incompleteHead}
					</button>
				</h2>

				<div
					id='incomplete-modules'
					className='accordion-collapse collapse show'
					aria-labelledby='incomplete-modules-head'
				>
					<div className='accordion-body'>
						{!incompleteList || incompleteList.length === 0 ? (
							<div>{noIncompleteMsg}</div>
						) : (
							render(incompleteList)
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
