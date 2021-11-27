import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useModuleQuestionQuery from '../hooks/useModuleQuestionQuery';

export default function TeacherQuestion() {
	// TODO: handle case where questionId is not a number
	const { questionId } = useParams();

	const moduleQuestionQuery = useModuleQuestionQuery(+questionId!);

	if (moduleQuestionQuery.isLoading) return <LoadingSpinner />;
	if (moduleQuestionQuery.error || !moduleQuestionQuery.data)
		return (
			<h3 className='text-danger'>Could not fetch question data. Try again</h3>
		);

	const { answer, explanation, preCommand, question, title } =
		moduleQuestionQuery.data;

	return (
		<main className='module-question-container container mw-850'>
			<h1 className='text-decoration-underline mb-5'>{title}</h1>

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
				<h5>Your Solution Command</h5>
				<p>
					<code>{answer}</code>
				</p>
			</section>
		</main>
	);
}
