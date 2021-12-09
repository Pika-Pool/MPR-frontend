import { Link } from 'react-router-dom';
import type { ModuleQuestion } from '../pages/TeacherModule';

export default function QuestionCardList({
	questions,
	moduleId,
}: {
	questions: ModuleQuestion[];
	moduleId: number;
}) {
	return (
		<div className='grid-responsive'>
			{questions.map(({ question, title, id }) => (
				<Link
					to={`../module/${moduleId}/question/${id}`}
					key={id}
					className='card text-decoration-none'
				>
					<div className='card-body'>
						<h5 className='card-title border-2 border-bottom pb-2 mb-3'>
							{title}
						</h5>
						<p className='card-text'>
							{question.length <= 100
								? question
								: question.slice(0, 100) + '...'}
						</p>
						{/* <a href='#' className='card-link'>
								Card link
							</a> */}
					</div>
				</Link>
			))}
		</div>
	);
}
