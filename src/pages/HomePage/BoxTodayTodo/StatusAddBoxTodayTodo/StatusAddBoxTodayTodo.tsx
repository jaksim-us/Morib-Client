import BoxTodo from '@/shared/components/BoxTodo/BoxTodo';
import HomeLargeBtn from '@/shared/components/ButtonHomeLarge/ButtonHomeLarge';

import { HomeLargeBtnVariant } from '@/shared/types/global';
import type { TaskType } from '@/shared/types/tasks';

import { LARGE_BTN_TEXT, SMALL_BTN_TEXT } from '@/shared/constants/btnText';

import HomeSmallBtn from './ButtonHomeSmall/ButtonHomeSmall';

interface StatusAddBoxTodayTodoProps {
	selectedTodayTodos: Omit<TaskType, 'isComplete'>[];
	onDisableAddStatus: () => void;
	deleteTodayTodos: (todo: Omit<TaskType, 'isComplete'>) => void;
	getSelectedNumber: (id: number) => number;
	enableComplete: () => void;
	cancelComplte: () => void;
	addingComplete: boolean;
	onCreateTodayTodos: () => void;
}

const StatusAddBoxTodayTodo = ({
	selectedTodayTodos,
	onDisableAddStatus,
	deleteTodayTodos,
	getSelectedNumber,
	enableComplete,
	cancelComplte,
	addingComplete,
	onCreateTodayTodos,
}: StatusAddBoxTodayTodoProps) => {
	//Todo: 선택된 Todo들을 취소하고 다시 추가하는 로직 추가
	const hasTodayTodos = !(selectedTodayTodos.length === 0);
	const clickable = addingComplete ? '' : 'pointer-events-none cursor-default ';
	const handleMouseEnter = () => {
		import('@/pages/TimerPage/TimerPage').catch((error) => {
			console.error('타이머 페이지를 받아오는데 오류가 발생했습니다.', error);
		});
	};

	return (
		<div className="flex flex-grow flex-col justify-between">
			{hasTodayTodos ? (
				<ul className="mt-[0.7rem] max-h-[57.5rem] overflow-auto">
					{selectedTodayTodos.map(({ id, elapsedTime, startDate, endDate, name }) => {
						const selectedNumber = getSelectedNumber(id);

						return (
							<li key={id}>
								<BoxTodo
									id={id}
									elapsedTime={elapsedTime}
									startDate={startDate}
									endDate={endDate}
									name={name}
									clickable={true}
									isSelected={!!selectedNumber}
									selectedNumber={selectedNumber}
									updateTodayTodos={deleteTodayTodos}
									addingComplete={addingComplete}
								/>
							</li>
						);
					})}
				</ul>
			) : (
				<p className="mx-auto mt-[22.2rem] text-center text-gray-05 head-bold-24">
					할 일 카드를 선택하여
					<br />
					오늘 할 일을 추가해 보세요.
				</p>
			)}

			<div className="flex justify-between">
				{selectedTodayTodos.length !== 0 ? (
					addingComplete ? (
						<HomeSmallBtn onClick={cancelComplte}>{SMALL_BTN_TEXT.MODIFICATION}</HomeSmallBtn>
					) : (
						<HomeSmallBtn onClick={enableComplete}>{SMALL_BTN_TEXT.COMPLETION}</HomeSmallBtn>
					)
				) : (
					<HomeSmallBtn onClick={onDisableAddStatus}>{SMALL_BTN_TEXT.CANCEL}</HomeSmallBtn>
				)}
				<div className={clickable}>
					<HomeLargeBtn
						variant={HomeLargeBtnVariant.LARGE}
						disabled={!addingComplete}
						onClick={onCreateTodayTodos}
						onMouseEnter={handleMouseEnter}
					>
						{LARGE_BTN_TEXT.START_TIMER}
					</HomeLargeBtn>
				</div>
			</div>
		</div>
	);
};

export default StatusAddBoxTodayTodo;
