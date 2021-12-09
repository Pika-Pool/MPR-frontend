import { FaLock, FaLockOpen } from 'react-icons/fa';
import { Link, Navigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Module } from '../components/TeacherModulesList';
import useModuleQuery from '../hooks/useModuleQuery';
import useModuleQuestionsListQuery from '../hooks/useModuleQuestionsListQuery';
import useToggleModuleState from '../hooks/useToggleModuleState';

export interface ModuleQuestion {
	id: number;
	title: string;
	question: string;
	preCommand: string;
	answer: string;
	explanation: string;
	module_id: number;
}

export default function TeacherModule() {
	const { moduleForSectionId } = useParams();
	const moduleQuery = useModuleQuery(+moduleForSectionId!);

	// TODO: error handling
	const moduleQuestionsListQuery = useModuleQuestionsListQuery(
		moduleQuery.data?.id,
	);

	// TODO: error handling
	const { mutate } = useToggleModuleState();
	const onToggleModuleState = (module: Module) => mutate(module);

	if (!moduleForSectionId || isNaN(+moduleForSectionId))
		return <Navigate to='../dash' replace />;

	return (
		<main className='mw-850 container'>
			<header>
				{moduleQuery.data ? (
					<>
						<h2 className='d-flex gap-2 justify-content-between align-items-center fw-bold text-decoration-underline'>
							<span>{moduleQuery.data.module_id.module_name}</span>
							<span
								role='button'
								onClick={() => onToggleModuleState(moduleQuery.data)}
							>
								{moduleQuery.data.module_state ? (
									<FaLockOpen className='lock-icon-open' />
								) : (
									<FaLock className='lock-icon-closed' />
								)}
							</span>
						</h2>

						<p className='mx-2'>{moduleQuery.data.module_id.description}</p>
					</>
				) : (
					<p className='text-danger'>Module data could not be loaded</p>
				)}
			</header>

			<section className='mt-4'>
				<h3>Questions:</h3>

				<div className='accordion'>
					{moduleQuestionsListQuery.isLoading ? <LoadingSpinner /> : null}

					{moduleQuestionsListQuery.data?.map(
						({ id, question, explanation, title }, i) => (
							<div className='accordion-item' key={id}>
								<h2
									className='accordion-header'
									id={`panelsStayOpen-heading${id}`}
								>
									<button
										className='accordion-button'
										type='button'
										data-bs-toggle='collapse'
										data-bs-target={`#panelsStayOpen-collapse${id}`}
										aria-expanded='false'
										aria-controls={`panelsStayOpen-collapse${id}`}
									>
										Q{i + 1}: <strong className='ms-2'>{title}</strong>
									</button>
								</h2>

								<div
									id={`panelsStayOpen-collapse${id}`}
									className='accordion-collapse collapse show'
									aria-labelledby={`panelsStayOpen-heading${id}`}
								>
									<div className='accordion-body'>
										<p>{question}</p>
										<p>{explanation}</p>
										<p>
											<Link
												to={`../module/${moduleForSectionId}/question/${id}`}
											>
												Read more
											</Link>
										</p>
									</div>
								</div>
							</div>
						),
					)}
				</div>
			</section>
		</main>
	);
}
