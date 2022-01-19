/* eslint-disable @kyleshevlin/prefer-custom-hooks */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
	FaCheck,
	FaChevronRight,
	FaExclamationCircle,
	FaExclamationTriangle,
	FaTimes,
} from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components';
import QueryResultElement from '../components/QueryResultElement';
import SqlResultsTable from '../components/SqlResultsTable';
import { InitSqlJsError } from '../constants/errors/sqlJsErrors';
import {
	getStudentModuleQuestion,
	markQuestionComplete,
	type StudentQuestion as TStudentQuestion,
} from '../constants/queryFns/studentQueryFns';
import { studentQueryKeys } from '../constants/queryKeys';
import useSqlJs from '../hooks/useSqlJsJs';
import { isNumber } from '../utils/typeGuards';
// ace editor
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-nord_dark';
import type { QueryExecResult } from 'sql.js';
import type { AxiosQueryError } from '../config/axiosInstance';

export default function StudentQuestion() {
	const { questionId } = useParams();
	const studentId = 1;

	const questionQuery = useQuery<TStudentQuestion, AxiosQueryError>(
		studentQueryKeys.moduleQuestionQuery(+questionId!),
		() => getStudentModuleQuestion(studentId, +questionId!),
		{ enabled: isNumber(questionId) },
	);

	const { execCodeResults, execSqlCode, error } = useSqlJs();
	useEffect(() => {
		if (!questionQuery.isSuccess) return;
		const { preCommand, answer } = questionQuery.data.question;
		execSqlCode(preCommand + '\n\n' + answer);
	}, [execSqlCode, questionQuery.data?.question, questionQuery.isSuccess]);

	if (!isNumber(questionId) || questionQuery.error?.response?.status === 404)
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

	return (
		<main className='question-container'>
			<section className='question-description'>
				<QueryResultElement<TStudentQuestion>
					{...questionQuery}
					render={data => (
						<QuestionInfoSection
							expectedAnswer={error || execCodeResults}
							{...data}
						/>
					)}
				/>
			</section>

			<QuestionPlaygroundAndResults
				questionId={questionId}
				preCommand={questionQuery.data?.question.preCommand}
				expectedResults={error || execCodeResults}
			/>
		</main>
	);
}

// eslint-disable-next-line react/display-name
const QuestionInfoSection = memo(
	({
		question: { answer, explanation, preCommand, question, title },
		is_complete,
		expectedAnswer,
	}: TStudentQuestion & { expectedAnswer?: Error | QueryExecResult[] }) => {
		return (
			<>
				<div className='d-flex gap-2 justify-content-between align-items-center mb-5'>
					<h1 className='text-decoration-underline'>{title}</h1>

					<div className='d-flex flex-column justify-content-center align-items-center'>
						{is_complete ? (
							<>
								<FaCheck className='lock-icon-open' fontSize='2rem' />
								<small className='fw-bold'>Done</small>
							</>
						) : (
							<>
								<FaExclamationTriangle
									className='lock-icon-closed'
									fontSize='2rem'
								/>
								<small className='fw-bold'>Pending</small>
							</>
						)}
					</div>
				</div>

				<section>
					<h5>Question</h5>
					<p>{question}</p>
				</section>

				{explanation ? (
					<section>
						<h5>Explanation</h5>
						<p>{explanation}</p>
					</section>
				) : null}

				{preCommand ? (
					<section>
						<h5>Pre-command</h5>
						<p>
							<code>{preCommand}</code>
						</p>
					</section>
				) : null}

				<section>
					<h5>Expected Result</h5>
					{!answer ? <p>No expected answer provided</p> : null}

					{expectedAnswer instanceof Error ? (
						<p className='text-danger'>Could not be loaded</p>
					) : (
						expectedAnswer?.map(({ columns, values }, i) => (
							<SqlResultsTable key={i} columns={columns} values={values} />
						))
					)}
				</section>
			</>
		);
	},
);

function QuestionPlaygroundAndResults({
	questionId,
	preCommand = '',
	expectedResults,
}: {
	preCommand?: string;
	questionId: number;
	expectedResults?: Error | QueryExecResult[];
}) {
	const [sqlCode, setSqlCode] = useState(createCodeBoilerplate(preCommand));
	const { execSqlCode, isLoading, SQL, error, execCodeResults, isReadyToExec } =
		useSqlJs();

	const onExecSql = useCallback(
		() => execSqlCode(sqlCode || ''),
		[execSqlCode, sqlCode],
	);

	const lastRunTimeRef = useRef(new Date());
	useEffect(() => {
		const func = (e: KeyboardEvent) => {
			if (
				// check key entered is right
				e.ctrlKey &&
				e.key === 'Enter' &&
				// check sqljs is ready
				isReadyToExec &&
				// check there is some code to run
				sqlCode &&
				lastRunTimeRef.current.getTime() <= new Date().getTime() - 100
			) {
				onExecSql();
				lastRunTimeRef.current = new Date();
			}
		};

		window.addEventListener('keypress', func);
		() => window.removeEventListener('keypress', func);
	}, [SQL, isReadyToExec, onExecSql, sqlCode]);

	if (isLoading) return <LoadingSpinner />;
	if (error instanceof InitSqlJsError || !SQL)
		return <h3 className='text-danger'>Could not load an SQL instance</h3>;

	return (
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
					onChange={e => setSqlCode(e)}
					value={sqlCode}
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
						<CodeExecMessage
							questionId={questionId}
							execCodeError={error}
							execCodeResults={execCodeResults}
							expectedResults={expectedResults}
						/>
					</pre>

					<div className='d-flex align-items-center'>
						<button
							className='btn btn-outline-danger d-flex justify-content-between align-items-center ms-2 align-self-start'
							onClick={() => setSqlCode(createCodeBoilerplate(preCommand))}
							disabled={!sqlCode}
							title='Ctrl + Enter'
						>
							Reset
						</button>
						<button
							className='btn btn-outline-success d-flex justify-content-between align-items-center ms-2 align-self-start'
							onClick={onExecSql}
							disabled={!sqlCode}
							title='Ctrl + Enter'
						>
							Run <FaChevronRight />
						</button>
					</div>
				</div>

				<pre className='result-tables'>
					{execCodeResults?.length === 0 ? (
						<p className='text-info bg-light'>
							SQL code is valid, but no output for given query
						</p>
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
	);
}

function CodeExecMessage({
	questionId,
	execCodeError,
	execCodeResults,
	expectedResults,
}: {
	questionId: number;
	execCodeError?: Error;
	execCodeResults?: QueryExecResult[];
	expectedResults?: QueryExecResult[] | Error;
}) {
	const studentId = 1;
	const queryClient = useQueryClient();
	const { mutate } = useMutation(markQuestionComplete, {
		onSuccess: data => {
			queryClient.refetchQueries(
				studentQueryKeys.moduleQuestionQuery(questionId),
			);
			queryClient.refetchQueries(studentQueryKeys.moduleQuestionsListQuery);

			if (data.is_module_complete) {
				queryClient.refetchQueries(studentQueryKeys.modulesListQuery);
			}
		},
	});

	if (execCodeError || expectedResults instanceof Error)
		return (
			<>
				<FaExclamationCircle className='me-1' />{' '}
				{execCodeError?.toString() || 'Expected Results could not be loaded'}
			</>
		);

	if (execCodeResults && expectedResults) {
		if (compareQueryResults(execCodeResults, expectedResults)) {
			mutate({ studentId, questionId });
			return (
				<p className='text-success'>
					<FaCheck className='me-1' /> You have cracked the question!!🥳
				</p>
			);
		}
		return (
			<p className='text-danger'>
				<FaTimes className='me-1' /> Your solution does not match the expected
				results!!🥳
			</p>
		);
	}

	return null;
}

function createCodeBoilerplate(preCommand: string) {
	return `/* Pre-command given by teacher */
${preCommand}

/* You code goes under this */
`;
}

function compareQueryResults(val1: QueryExecResult[], val2: QueryExecResult[]) {
	return JSON.stringify(val1) === JSON.stringify(val2);
}
