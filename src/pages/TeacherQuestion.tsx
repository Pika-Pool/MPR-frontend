/* eslint-disable @kyleshevlin/prefer-custom-hooks */
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaExclamationCircle } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useModuleQuestionQuery from '../hooks/useModuleQuestionQuery';
import { isNumber } from '../utils/typeGuards';
import useSqlJs from '../hooks/useSqlJsJs';
// ace editor
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-nord_dark';
import { InitSqlJsError } from '../constants/errors/sqlJsErrors';
import SqlResultsTable from '../components/SqlResultsTable';
// import { updateQuestionRequest } from '../constants/queryFns/teacherQueryFns';
// import { useMutation, useQueryClient } from 'react-query';
// import { moduleQueryKeys } from '../constants/queryKeys';

const preCommandComment = '--Enter the pre-command below:\n',
	answerComment = '\n--Enter your solution below:\n',
	sqlCodeRegex = new RegExp(
		`^(?<preCommandComment>${preCommandComment})(?<preCommand>[\\S\\s]*)(?<answerComment>${answerComment})(?<answer>[\\S\\s]*)$`,
	),
	defaultSqlCode = preCommandComment + answerComment;

export default function TeacherQuestion() {
	const { questionId } = useParams();

	const moduleQuestionQuery = useModuleQuestionQuery(+questionId!);
	const [sqlCode, setSqlCode] = useState(defaultSqlCode);
	const hasUserChangedSqlCodeRef = useRef(false);

	const onSqlCodeChange = (newCode: string) => {
		if (typeof newCode !== 'string') return;

		const match = newCode.match(sqlCodeRegex);
		if (!match) {
			console.log('no match');
			return;
		}

		hasUserChangedSqlCodeRef.current = true;
		setSqlCode(() => {
			console.log('setSqlCode');
			return newCode;
		});
	};

	const resetSqlCode = useCallback(() => {
		const data = moduleQuestionQuery.data;
		if (!data) return setSqlCode(defaultSqlCode);

		const { answer, preCommand } = data;
		return setSqlCode(preCommandComment + preCommand + answerComment + answer);
	}, [moduleQuestionQuery.data]);

	useEffect(() => {
		const data = moduleQuestionQuery.data;
		if (!data || hasUserChangedSqlCodeRef.current) return;

		resetSqlCode();
	}, [moduleQuestionQuery.data, resetSqlCode]);

	const { execSqlCode, execCodeResults, error: sqlError } = useSqlJs();
	const onExecSql = () => execSqlCode(sqlCode);

	// const queryClient = useQueryClient();
	// const { mutate: updateQuestion, isLoading: isUpdateModuleLoading } =
	// 	useMutation(
	// 		async () => {
	// 			const { data } = moduleQuestionQuery;
	// 			if (!data) return;

	// 			const match = sqlCode.match(sqlCodeRegex);
	// 			if (!match) throw new Error('code input not in the right format');

	// 			return updateQuestionRequest({
	// 				...data,
	// 				answer: match.groups?.answer || '',
	// 				preCommand: match.groups?.preCommand || '',
	// 			});
	// 		},
	// 		{
	// 			onSuccess() {
	// 				queryClient.refetchQueries(
	// 					[moduleQueryKeys.moduleQuestionQuery, questionId],
	// 					{ exact: true },
	// 				);
	// 				queryClient.refetchQueries(moduleQueryKeys.moduleQuestionsListQuery, {
	// 					exact: true,
	// 				});
	// 				hasUserChangedSqlCodeRef.current = false;
	// 			},
	// 		},
	// 	);

	// const [isEditMode, setIsEditMode] = useState(false);

	if (
		!isNumber(questionId) ||
		moduleQuestionQuery.error?.response?.status === 404
	) {
		return (
			<main className='mw-850 container'>
				<h3>Question Not Found</h3>
				<p>
					Redirect to{' '}
					<Link to='../dash' replace>
						dashboard
					</Link>
				</p>
			</main>
		);
	}

	if (moduleQuestionQuery.isLoading) return <LoadingSpinner />;
	if (moduleQuestionQuery.error || !moduleQuestionQuery.data) {
		const { error, data } = moduleQuestionQuery;
		console.log({ error, data });
		return (
			<h3 className='text-danger'>Could not fetch question data. Try again</h3>
		);
	}

	const { explanation, question, title } = moduleQuestionQuery.data;

	return (
		<main className='question-container'>
			<section className='question-description'>
				<h1 className='text-decoration-underline d-flex justify-content-between align-items-center gap-2	'>
					{title}
					{/* <span className='text-primary' role='button'>
						{!isEditMode ? (
							<FaEdit
								title='edit question info'
								onClick={() => setIsEditMode(true)}
							/>
						) : null}
					</span> */}
				</h1>

				<section>
					<h5>Question</h5>
					<p>{question}</p>
				</section>

				<section>
					<h5>Explanation</h5>
					<p>{explanation || 'No explanation given'}</p>
				</section>
			</section>

			{sqlError instanceof InitSqlJsError ? (
				<p className='text-danger'>
					There was an error while starting the SQL Playground
				</p>
			) : (
				<>
					<section className='question-playground-editor'>
						<AceEditor
							mode='sql'
							theme='nord_dark'
							name='question-playground-editor'
							editorProps={{ $blockScrolling: true }}
							fontSize='1.1rem'
							width='100%'
							height='100%'
							placeholder='Enter some SQL. No inspiration ? Try “select sqlite_version()”'
							tabSize={2}
							value={sqlCode}
							onChange={str => onSqlCodeChange(str)}
							setOptions={{
								wrap: true,
								showInvisibles: true,
								useSoftTabs: true,
							}}
						/>
					</section>

					<section className='question-playground-results'>
						<div className='d-flex justify-content-between align-items-start p-2'>
							<pre className='error text-danger text-wrap d-flex justify-content-between align-items-center'>
								{sqlError ? (
									<p className='text-danger'>
										<FaExclamationCircle className='me-1' /> {sqlError.message}
									</p>
								) : null}
							</pre>

							<div className='d-flex align-items-center'>
								{/* <button
									className='btn btn-outline-danger d-flex justify-content-between align-items-center ms-2 align-self-start'
									onClick={() => updateQuestion()}
									disabled={
										isUpdateModuleLoading || !hasUserChangedSqlCodeRef.current
									}
								>
									Update
								</button> */}
								<button
									className='btn btn-outline-danger d-flex justify-content-between align-items-center ms-2 align-self-start'
									onClick={resetSqlCode}
								>
									Reset
								</button>
								<button
									className='btn btn-outline-success d-flex justify-content-between align-items-center ms-2 align-self-start'
									onClick={onExecSql}
									disabled={sqlCode === defaultSqlCode}
								>
									Run <FaChevronRight />
								</button>
							</div>
						</div>

						<pre className='result-tables'>
							{execCodeResults?.length === 0 ? (
								<p className='text-info bg-light'>No output for given query</p>
							) : null}
							{
								// results contains one object per select statement in the query
								execCodeResults?.map(({ columns, values }, i) => (
									<SqlResultsTable key={i} columns={columns} values={values} />
								))
							}
						</pre>
					</section>
				</>
			)}
		</main>
	);
}
