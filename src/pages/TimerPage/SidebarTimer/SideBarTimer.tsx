import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import BoxTodo from '@/shared/components/BoxTodo/BoxTodo';
import ButtonRadius5 from '@/shared/components/ButtonRadius5/ButtonRadius5';
import ButtonTodoToggle from '@/shared/components/ButtonTodayToggle/ButtonTodoToggle';

import { usePatchTaskStatus } from '@/shared/apis/common/queries';
import { usePostTimerStop } from '@/shared/apis/timer/queries';

import { TimerTodoType } from '@/shared/types/tasks';

import BtnListIcon from '@/shared/assets/svgs/btn_list.svg?react';

interface CategoryBoxProps {
	completedTodos: TimerTodoType[];
	ongoingTodos: TimerTodoType[];
	toggleSidebar: () => void;
	onTodoSelection: (id: number, time: number, name: string, categoryName: string) => void;
	selectedTodo: number | null;
	onPlayToggle: (isPlaying: boolean) => void;
	isPlaying: boolean;
	elapsedTime: number;
	formattedTodayDate: string;
	resetTimerIncreasedTime: () => void;
	timerIncreasedTime: number;
	isSideOpen: boolean;
	resetAccumulatedIncreasedTime: () => void;
}

const SideBarTimer = ({
	ongoingTodos = [],
	completedTodos = [],
	toggleSidebar,
	onTodoSelection,
	selectedTodo,
	onPlayToggle,
	isPlaying,
	formattedTodayDate,
	resetTimerIncreasedTime,
	timerIncreasedTime,
	isSideOpen,
	resetAccumulatedIncreasedTime,
}: CategoryBoxProps) => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate, isError, error } = usePatchTaskStatus();
	const { mutate: stopTimer } = usePostTimerStop();

	const handleTodoClick = (id: number, time: number, name: string, categoryName: string) => {
		if (isPlaying) {
			if (selectedTodo !== null) {
				stopTimer(
					{ id: selectedTodo, elapsedTime: timerIncreasedTime, targetDate: formattedTodayDate },
					{
						onSuccess: () => {
							onPlayToggle(false);
							queryClient.invalidateQueries({ queryKey: ['todo', formattedTodayDate] });
							resetTimerIncreasedTime();
							resetAccumulatedIncreasedTime();
						},
					},
				);
			}
		}
		resetTimerIncreasedTime();
		onTodoSelection(id, time, name, categoryName);
	};

	const handleNavigateHome = () => {
		if (isPlaying && selectedTodo !== null) {
			stopTimer(
				{ id: selectedTodo, elapsedTime: timerIncreasedTime, targetDate: formattedTodayDate },
				{
					onSuccess: () => {
						onPlayToggle(false);
						navigate('/home');
					},
				},
			);
		} else {
			navigate('/home');
		}
	};

	const handleMouseEnter = () => {
		import('@/pages/HomePage/HomePage').catch((error) => {
			console.error('홈페이지를 받아오는데 오류가 발생했습니다.', error);
		});
	};

	if (isError) {
		console.error(error);
	}

	return (
		<div
			ref={sidebarRef}
			className={`absolute right-0 flex h-full w-[31.6rem] transform flex-col rounded-bl-[16px] rounded-tl-[16px] bg-gray-bg-03 pl-[1.8rem] transition-transform duration-300 ${isSideOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			<div className="flex h-[5.4rem] w-full items-center justify-between pl-[0.2rem] pt-[2rem]">
				<p className="text-white head-bold-24">오늘 할 일</p>
				<button className="rounded-[1.5rem] hover:bg-gray-bg-04" onClick={toggleSidebar}>
					<BtnListIcon />
				</button>
			</div>
			<div className="h-[82.6rem] overflow-auto pb-[2rem]">
				{ongoingTodos.map((todo) => (
					<BoxTodo
						key={todo.id}
						{...todo}
						isSelected={todo.id === selectedTodo}
						onClick={() => handleTodoClick(todo.id, todo.elapsedTime, todo.name, todo.categoryName)}
						onToggleComplete={() => mutate(todo.id)}
						timerIncreasedTime={todo.id === selectedTodo ? timerIncreasedTime : 0}
					/>
				))}
				<ButtonTodoToggle isCompleted={false} isToggled={false}>
					{completedTodos.map((todo) => (
						<BoxTodo
							key={todo.id}
							{...todo}
							isSelected={todo.id === selectedTodo}
							onToggleComplete={() => mutate(todo.id)}
							timerIncreasedTime={todo.id === selectedTodo ? timerIncreasedTime : 0}
						/>
					))}
				</ButtonTodoToggle>
			</div>
			<div className="flex flex-col items-start gap-[1rem] pb-[2rem] pt-[4rem]">
				<ButtonRadius5.Xl color="main" onClick={handleNavigateHome} onMouseEnter={handleMouseEnter}>
					홈으로 나가기
				</ButtonRadius5.Xl>
			</div>
		</div>
	);
};

export default SideBarTimer;
