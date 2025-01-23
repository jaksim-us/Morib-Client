import { Dayjs } from 'dayjs';

import { Suspense, lazy, useRef } from 'react';

import BoxTodo from '@/shared/components/BoxTodo/BoxTodo';
import ButtonTodoToggle from '@/shared/components/ButtonTodayToggle/ButtonTodoToggle';

import useClickOutside from '@/shared/hooks/useClickOutside';

import type { TaskListType, TaskType } from '@/shared/types/tasks';

import ButtonAddIcon from '@/shared/assets/svgs/btn_task_add.svg?react';
import MeatBallDefault from '@/shared/assets/svgs/todo_meatball_default.svg?react';

import { usePostCreateTask, usePostToggleTaskStatus } from '@/shared/apisV2/home/home.mutations';

import { useCalendar } from '../hooks/useCalendar';
import BoxTodoInput from './BoxTodoInput/BoxTodoInput';
import StatusDefaultBoxCategory from './StatusDefaultBoxCategory/StatusDefaultBoxCategory';
import { useCreateTodo } from './hooks/useCreateTodo';

const Calendar = lazy(() => import('@/shared/components/Calendar/Calendar'));

interface BoxCategoryProps {
	id: number;
	title: string;
	completedTodos: TaskListType;
	ongoingTodos: TaskListType;
	updateTodayTodos: (todo: Omit<TaskType, 'isComplete'>) => void;
	addingTodayTodoStatus: boolean;
	getSelectedNumber: (id: number) => number;
	addingComplete: boolean;
	onDeleteCategory: (categoryId: number) => void;
}

const format = (date: Dayjs | null) => {
	if (!date) return null;
	const year = date.year();
	const month = String(date.month() + 1).padStart(2, '0');
	const day = String(date.date()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const BoxCategory = ({
	id,
	title,
	ongoingTodos = [],
	completedTodos = [],
	updateTodayTodos,
	addingTodayTodoStatus,
	getSelectedNumber,
	addingComplete,
	onDeleteCategory,
}: BoxCategoryProps) => {
	const { mutate, isError, error } = usePostCreateTask();

	const {
		name,
		isAdding,
		editable,
		handleEditComplete,
		handleInputChange,
		startAddingTodo,
		cancelAddingTodo,
		setName,
		setIsAdding,
	} = useCreateTodo();

	const todoRef = useRef<HTMLDivElement>(null);
	useClickOutside(todoRef, cancelAddingTodo, isAdding && editable);

	const {
		isPeriodOn,
		selectedStartDate,
		selectedEndDate,
		isCalendarOpened,
		defaultDate,
		handlePeriodToggle,
		handleStartDateInput,
		handleEndDateInput,
		handlePeriodEnd,
	} = useCalendar();

	const handleCreatePost = () => {
		const dataToPost = {
			categoryId: id,
			name: name,
			startDate: format(selectedStartDate) as string,
			endDate: format(selectedEndDate),
		};
		mutate(dataToPost);

		setName('');
		setIsAdding(false);
		handleStartDateInput(null);
		handleEndDateInput(null);
		handlePeriodEnd();
	};

	const { mutate: toggleTodoStatus } = usePostToggleTaskStatus();

	if (isError) {
		console.error(error);
	}

	const handleMouseEnter = () => {
		import('@/shared/components/Calendar/Calendar').catch((error) => {
			console.error('캘린더를 받아오는데 오류가 발생했습니다.', error);
		});
	};

	return (
		<article className="flex h-full w-[40.2rem] flex-shrink-0 flex-col rounded-[16px] bg-gray-bg-03 px-[1.8rem] pt-[1.8rem]">
			<div className="mt-[0.4rem] flex items-center justify-between">
				<h2 className="text-white head-bold-24">{title}</h2>
				<div className="flex gap-[0.1rem]">
					<button
						onMouseEnter={handleMouseEnter}
						onClick={startAddingTodo}
						className="rounded-full hover:bg-gray-bg-04 active:bg-gray-bg-05"
					>
						<ButtonAddIcon />
					</button>
					<button onClick={() => onDeleteCategory(id)}>
						<MeatBallDefault className="rounded-full hover:bg-gray-bg-04 active:bg-gray-bg-05" />
					</button>
				</div>
			</div>

			{ongoingTodos.length === 0 && completedTodos.length === 0 && isAdding === false ? (
				<StatusDefaultBoxCategory />
			) : (
				<div className="relative">
					<div className="h-[67.4rem] overflow-y-auto">
						<ButtonTodoToggle isCompleted isToggled={true}>
							{isAdding && (
								<>
									<BoxTodoInput
										ref={todoRef}
										editable={editable}
										onEditComplte={handleEditComplete}
										name={name}
										onInputChange={handleInputChange}
										selectedStartDate={selectedStartDate}
										selectedEndDate={selectedEndDate}
									/>

									{!editable && (
										<Suspense fallback={<div>Loading...</div>}>
											<div className="absolute left-[7.25rem] top-[9.5rem]">
												<Calendar
													isPeriodOn={isPeriodOn}
													selectedStartDate={selectedStartDate ?? defaultDate}
													selectedEndDate={selectedEndDate ?? null}
													onStartDateInput={handleStartDateInput}
													onEndDateInput={handleEndDateInput}
													isCalendarOpened={isCalendarOpened}
													onPeriodToggle={handlePeriodToggle}
													clickOutSideCallback={handleCreatePost}
												/>
											</div>
										</Suspense>
									)}
								</>
							)}

							{ongoingTodos.map(({ id, name, startDate, endDate, elapsedTime }) => {
								const todo = {
									id: id,
									name: name,
									startDate: startDate,
									endDate: endDate,
									elapsedTime: elapsedTime,
								};

								const selectedNumber = getSelectedNumber(id);

								return (
									<BoxTodo
										id={id}
										key={id}
										name={name}
										startDate={startDate}
										endDate={endDate}
										elapsedTime={elapsedTime}
										isSelected={!!selectedNumber}
										selectedNumber={selectedNumber}
										onToggleComplete={() => toggleTodoStatus({ taskId: id })}
										updateTodayTodos={() => updateTodayTodos(todo)}
										clickable={addingTodayTodoStatus}
										addingComplete={addingComplete}
									/>
								);
							})}
						</ButtonTodoToggle>

						{completedTodos.length !== 0 && (
							<ButtonTodoToggle isToggled={false}>
								{completedTodos.map(({ id, name, startDate, endDate, elapsedTime }) => (
									<BoxTodo
										id={id}
										key={id}
										isComplete
										name={name}
										startDate={startDate}
										endDate={endDate}
										elapsedTime={elapsedTime}
										onToggleComplete={() => toggleTodoStatus({ taskId: id })}
										clickable={addingTodayTodoStatus}
										addingComplete={addingComplete}
									/>
								))}
							</ButtonTodoToggle>
						)}
					</div>
				</div>
			)}
		</article>
	);
};

export default BoxCategory;
