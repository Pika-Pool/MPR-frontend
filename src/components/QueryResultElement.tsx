import type { ReactNode } from 'react';
import type { UseQueryResult } from 'react-query';
import LoadingSpinner from './LoadingSpinner';

export type QueryResultElementProps<TData, TError> = UseQueryResult<
	TData,
	TError
> & {
	children?: ReactNode;
	render?: (data: TData) => ReactNode;
};

export default function QueryResultElement<TData = unknown, TError = unknown>({
	children,
	render,
	data,
	error,
	isLoading,
	isError,
}: QueryResultElementProps<TData, TError>) {
	if (isLoading) return <LoadingSpinner />;

	if (isError) {
		console.error(error);
		return (
			<h3 className='text-danger'>Could not fetch your data. Try again</h3>
		);
	}

	if (render) return <>{render(data!)}</>;
	return <>{children}</>;
}
