import { FaCheck, FaTimes } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { CompleteIncompleteAccordion, QuestionCardList } from '../components';
import QueryResultElement from '../components/QueryResultElement';
import {
	getStudentModule,
	getStudentModuleQuestionsList,
} from '../constants/queryFns/studentQueryFns';
import { studentQueryKeys } from '../constants/queryKeys';
import { isNumber } from '../utils/typeGuards';

export default function StudentModule() {
	const { moduleForSectionId } = useParams();
	const studentId = 1;

	const moduleQuery = useQuery(
		studentQueryKeys.moduleQuery(+moduleForSectionId!),
		() => getStudentModule(studentId, +moduleForSectionId!),
		{ enabled: isNumber(moduleForSectionId) },
	);

	const questionsListQuery = useQuery(
		studentQueryKeys.moduleQuestionsListQuery,
		// TODO: moduleForSection -> moduleId
		() =>
			getStudentModuleQuestionsList(
				studentId,
				moduleQuery.data?.module.module_id.id ?? -1,
			),
		{ enabled: isNumber(moduleForSectionId) && moduleQuery.data != null },
	);

	if (!isNumber(moduleForSectionId))
		return (
			<main className='mw-850 container'>
				<h3>Module Not Found</h3>
				<p>
					Redirect to{' '}
					<Link to='../dash' replace>
						dashboard
					</Link>
				</p>
			</main>
		);

	return (
		<main className='mw-850 container'>
			<header className='mb-3'>
				<QueryResultElement {...moduleQuery}>
					{moduleQuery.data ? (
						<>
							<div className='d-flex gap-2 justify-content-between align-items-center'>
								<h2 className='fw-bold text-decoration-underline'>
									{moduleQuery.data.module.module_id.module_name}
								</h2>
								<div className='d-flex flex-column justify-content-center align-items-center'>
									{moduleQuery.data.is_complete ? (
										<>
											<FaCheck className='lock-icon-open' fontSize='2rem' />
											<small className='fw-bold'>Done</small>
										</>
									) : (
										<>
											<FaTimes className='lock-icon-closed' fontSize='2rem' />
											<small className='fw-bold'>Pending</small>
										</>
									)}
								</div>
							</div>

							<p className='mx-2'>
								{moduleQuery.data.module.module_id.description}
							</p>
						</>
					) : (
						<p className='text-danger'>Module data could not be loaded</p>
					)}
				</QueryResultElement>
			</header>

			<QueryResultElement {...questionsListQuery}>
				<h2>Questions</h2>
				{questionsListQuery.data ? (
					<CompleteIncompleteAccordion
						completedHead='Completed Questions'
						completeList={questionsListQuery.data.complete}
						noCompleteMsg="You don't have any Completed Questions"
						incompleteHead='Incomplete Questions'
						incompleteList={questionsListQuery.data.incomplete}
						noIncompleteMsg="You don't have any Incomplete Questions"
						render={list => (
							// TODO: moduleForSection -> moduleId
							<QuestionCardList
								moduleId={moduleForSectionId}
								questions={list}
							/>
						)}
					/>
				) : (
					<p>Could not load this module&rsquo;s questions</p>
				)}
			</QueryResultElement>
		</main>
	);
}
