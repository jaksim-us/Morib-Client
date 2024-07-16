import { useEffect, useMemo, useState } from 'react';

import FriendInfoCarousel from '@/components/molecules/FriendInfoCarousel';
import Timer from '@/components/molecules/Timer';
import TimerSideBar from '@/components/molecules/TimerSideBar';
import TimerSideBox from '@/components/molecules/TimerSideBox';
import TimerTitle from '@/components/molecules/TimerTitle';
import TimerPageTemplates from '@/components/templates/TimerPageTemplates';

import useToggleSidebar from '@/hooks/useToggleSideBar';

import { useGetTodoList } from '@/apis/timer/queries';

import HamburgerIcon from '@/assets/svgs/btn_hamburger.svg?react';

const TimerPage = () => {
	const { isSidebarOpen, toggleSidebar } = useToggleSidebar();
	const { data: todosData, isLoading, error } = useGetTodoList('2024-07-15');

	const todos = useMemo(() => todosData?.data.task || [], [todosData]);
	const tasktotaltime = todosData?.data || [];

	const [targetTime, setTargetTime] = useState(0);
	const [targetName, setTargetName] = useState('');
	const [targetCategoryName, setTargetCategoryName] = useState('');
	const [id, setId] = useState(null);

	useEffect(() => {
		if (todos.length > 0) {
			setTargetTime(todos[0].targetTime);
			setTargetName(todos[0].name);
			setTargetCategoryName(todos[0].categoryName);
			setId(todos[0].id);
		}
	}, [todos]);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading todos</div>;

	return (
		<TimerPageTemplates>
			<div className="relative flex h-[108rem] w-[192rem] bg-[url('@/assets/images/img_timer_bg.png')]">
				<div className="absolute left-0">
					<TimerSideBox />
				</div>
				<div className="ml-[56.6rem] mt-[-0.8rem]">
					<TimerTitle targetName={targetName} targetCategoryName={targetCategoryName} />
					<Timer totalTimeOfToday={tasktotaltime.totalTimeOfToday} targetTime={targetTime} />
					<FriendInfoCarousel />
				</div>
				<button
					onClick={toggleSidebar}
					className="ml-[38.2rem] mt-[3.2rem] h-[5.4rem] w-[5.4rem] rounded-[1.5rem] hover:bg-gray-bg-04"
				>
					<HamburgerIcon />
				</button>
				{isSidebarOpen && (
					<div className="absolute inset-0 z-10 bg-dim">
						<div className="absolute inset-y-0 right-0 flex justify-end overflow-hidden">
							<TimerSideBar
								ongoingTodos={todos}
								completedTodos={todos}
								toggleSidebar={toggleSidebar}
								setTargetTime={setTargetTime}
								setTargetName={setTargetName}
							/>
						</div>
					</div>
				)}
			</div>
		</TimerPageTemplates>
	);
};

export default TimerPage;
