import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AutoFixedGrid from '@/shared/components/AutoFixedGrid/AutoFixedGrid';
import FallbackApiError from '@/shared/components/FallbackApiError/FallbackApiError';
import ModalWrapper, { ModalWrapperRef } from '@/shared/components/ModalWrapper/ModalWrapper';
import Spacer from '@/shared/components/Spacer/Spacer';

import useClickOutside from '@/shared/hooks/useClickOutside';

import { getThisWeekRange } from '@/shared/utils/date';
import { getDailyCategoryTask, isTaskExist, splitTasksByCompletion } from '@/shared/utils/tasks';

import { TaskType } from '@/shared/types/tasks';

import BellIcon from '@/shared/assets/svgs/bell.svg?react';
import FriendSettingIcon from '@/shared/assets/svgs/friend_setting.svg?react';
import LargePlusIcon from '@/shared/assets/svgs/large_plus.svg?react';

import { ROUTES_CONFIG } from '@/router/routesConfig';

import { useAddCategory, useDeleteCategory, usePostAddTodayTodos } from '@/shared/apisV2/home/home.mutations';
import { useGetCategoryTask, useGetWorkTime } from '@/shared/apisV2/home/home.queries';

import BoxAddCategory from './BoxAddCategory/BoxAddCategory';
import BoxCategory from './BoxCategory/BoxCategory';
import BoxTodayTodo from './BoxTodayTodo/BoxTodayTodo';
import ButtonMoreFriends from './ButtonMoreFriends/ButtonMoreFriends';
import ButtonUserProfile from './ButtonUserProfile/ButtonUserProfile';
import DatePicker from './DatePicker/DatePicker';
import ModalContentsFriends from './ModalContentsFriends/ModalContentsFriends';
import StatusDefaultHome from './StatusDefaultHome/StatusDefaultHome';

dayjs.extend(utc);
dayjs.extend(timezone);

//TODO: 반응형 구조를 크게 변경해야해서 추후 pr에서 반영
const HomePage = () => {
	const todayDate = dayjs().tz('Asia/Seoul');
	const formattedTodayDate = todayDate.format('YYYY-MM-DD');

	const boxAddCategoryRef = useRef<HTMLDivElement>(null);
	const friendsModalRef = useRef<ModalWrapperRef>(null);

	const [selectedDate, setSelectedDate] = useState(todayDate);
	const { startDate, endDate } = getThisWeekRange(selectedDate);

	const { data: categoriesData, isError: isCategoriesDataError } = useGetCategoryTask({ startDate, endDate });

	const categories = categoriesData?.data || [];

	const dailyCategoryTask = getDailyCategoryTask(selectedDate, categories);

	const [isAddingCategory, setIsAddingCategory] = useState(false);

	const [addingTodayTodoStatus, setAddingTodayTodoStatus] = useState(false);
	const [addingComplete, setAddingComplete] = useState(false);
	const addTodayTodosOverlayStyle = addingTodayTodoStatus && !addingComplete ? 'opacity-30 pointer-events-none' : '';

	const [todayTodos, setTodayTodos] = useState<Omit<TaskType, 'isComplete'>[]>([]);
	const [categoryInput, setCategoryInput] = useState('');

	const { mutate: addTodayTodos } = usePostAddTodayTodos();
	const { mutate: deleteCategory } = useDeleteCategory();
	const { mutate: addCategory } = useAddCategory();

	const navigate = useNavigate();

	const updateTodayTodos = (todo: Omit<TaskType, 'isComplete'>) => {
		const canAddTask = !todayTodos.some((prevTodo) => prevTodo.id === todo.id);
		if (canAddTask) setTodayTodos((prev) => [...prev, todo]);
		else setTodayTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== todo.id));
	};

	const { data: workTimeData } = useGetWorkTime({ targetDate: formattedTodayDate });

	const handleAddCategory = () => {
		setIsAddingCategory(true);
	};

	const handleCategoryInputChange = (name: string) => {
		setCategoryInput(name);
	};

	const handleOutsideClickWhileAddingCategory = () => {
		if (categoryInput.length === 0) {
			setIsAddingCategory(false);
		} else {
			addCategory(
				{ name: categoryInput },
				{
					onSuccess: () => {
						setCategoryInput('');
						setIsAddingCategory(false);
					},
				},
			);
		}
	};

	const handleCategoryInputKeydown = () => {
		addCategory(
			{ name: categoryInput },
			{
				onSuccess: () => {
					setCategoryInput('');
					setIsAddingCategory(false);
				},
			},
		);
	};

	const handleOpenFriendsModal = () => {
		friendsModalRef.current?.open();
	};

	useClickOutside(boxAddCategoryRef, handleOutsideClickWhileAddingCategory);

	const deleteTodayTodos = (todo: Omit<TaskType, 'isComplete'>) => {
		setTodayTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== todo.id));
	};

	const disableAddingTodayTodo = () => {
		setTodayTodos([]);
		setAddingTodayTodoStatus(false);
	};

	const enableAddingTodayTodo = () => {
		setAddingTodayTodoStatus(true);
	};

	const handleSelectedDateChange = (date: Dayjs) => {
		setSelectedDate(date);
	};

	const getSelectedNumber = (id: number) => {
		const index = todayTodos.findIndex((task) => task.id === id);
		const todoNumber = index === -1 ? 0 : index + 1;
		return todoNumber;
	};

	const enableComplete = () => {
		setAddingComplete(true);
	};

	const cancelComplete = () => {
		setAddingComplete(false);
	};

	const handleCreateTodayTodos = () => {
		const todayTodoData = todayTodos.map((todo) => todo.id);
		const dataToPost = {
			targetDate: formattedTodayDate,
			taskIdList: todayTodoData,
		};

		addTodayTodos(dataToPost, {
			onSuccess: () => {
				navigate(ROUTES_CONFIG.timer.path);
			},
		});
	};

	const handleDeleteCategory = (categoryId: number) => {
		deleteCategory({ categoryId });
	};

	return (
		<AutoFixedGrid type="home" className="gap-[9.2rem] overflow-auto bg-gray-bg-01 p-[3.2rem] pt-[15.2rem]">
			<div className="absolute left-[3.2rem] top-[5.4rem] flex items-center gap-[1.8rem]">
				<ul className="flex gap-[1.8rem]">
					<li>
						<ButtonUserProfile isMyProfile />
					</li>
					<li>
						<ButtonUserProfile isConnecting />
					</li>
					<li>
						<ButtonUserProfile isConnecting />
					</li>
					<li>
						<ButtonUserProfile isConnecting />
					</li>
				</ul>
				<ButtonMoreFriends friendsCount={13} />
			</div>

			<div className={`absolute right-[4.2rem] top-[5.4rem] flex gap-[0.8rem] ${addTodayTodosOverlayStyle}`}>
				<button onClick={handleOpenFriendsModal}>
					<FriendSettingIcon className="rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05" />
				</button>
				<button>
					<BellIcon className="rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05" />
				</button>
			</div>

			{/* NOTE: 1440 이하일 때는 UI가 더이상 줄어들지 않게 조정 */}
			<AutoFixedGrid.Slot className="h-full min-h-0 min-w-[894px] max-w-[1374px]">
				{isCategoriesDataError && <FallbackApiError resetError={() => {}} />}
				<Spacer.Height as="main" className="flex flex-col gap-[1.6rem]">
					<DatePicker
						todayDate={todayDate}
						selectedDate={selectedDate}
						onSelectedDateChange={handleSelectedDateChange}
					/>

					<Spacer.Height className="flex w-full">
						<Spacer className="flex gap-[1.4rem] overflow-x-auto">
							{dailyCategoryTask.length !== 0 ? (
								<>
									{dailyCategoryTask.map(({ category, tasks }) => {
										const { completedTasks, ongoingTasks } = splitTasksByCompletion(tasks);
										return (
											<BoxCategory
												id={category.id}
												key={category.id}
												title={category.name}
												ongoingTodos={ongoingTasks}
												completedTodos={completedTasks}
												updateTodayTodos={updateTodayTodos}
												addingTodayTodoStatus={addingTodayTodoStatus}
												getSelectedNumber={getSelectedNumber}
												addingComplete={addingComplete}
												onDeleteCategory={handleDeleteCategory}
											/>
										);
									})}

									{isAddingCategory && (
										<BoxAddCategory
											categoryInput={categoryInput}
											onCategoryInputChange={handleCategoryInputChange}
											onCategoryInputKeydown={handleCategoryInputKeydown}
											ref={boxAddCategoryRef}
										/>
									)}

									{dailyCategoryTask.length <= 2 && (
										<div className="flex flex-col">
											<button className="flex-shrink-0" onClick={handleAddCategory}>
												<LargePlusIcon className="rounded-full bg-gray-bg-03 hover:bg-gray-bg-05" />
											</button>
										</div>
									)}
								</>
							) : isAddingCategory ? (
								<BoxAddCategory
									categoryInput={categoryInput}
									onCategoryInputChange={handleCategoryInputChange}
									onCategoryInputKeydown={handleCategoryInputKeydown}
									ref={boxAddCategoryRef}
								/>
							) : (
								<StatusDefaultHome onClick={handleAddCategory} />
							)}
						</Spacer>

						{dailyCategoryTask.length > 2 && (
							<div className="ml-[1.4rem] flex flex-col">
								<button className="flex-shrink-0" onClick={handleAddCategory}>
									<LargePlusIcon className="rounded-full bg-gray-bg-03 hover:bg-gray-bg-05" />
								</button>
							</div>
						)}
					</Spacer.Height>
				</Spacer.Height>
			</AutoFixedGrid.Slot>

			<AutoFixedGrid.Slot>
				<BoxTodayTodo
					time={workTimeData?.data?.sumTodayElapsedTime || 0}
					addingTodayTodoStatus={addingTodayTodoStatus}
					selectedTodayTodos={todayTodos}
					hasTodos={isTaskExist(dailyCategoryTask)}
					enableAddingTodayTodo={enableAddingTodayTodo}
					disableAddingTodayTodo={disableAddingTodayTodo}
					deleteTodayTodos={deleteTodayTodos}
					getSelectedNumber={getSelectedNumber}
					enableComplete={enableComplete}
					cancelComplete={cancelComplete}
					addingComplete={addingComplete}
					onCreateTodayTodos={handleCreateTodayTodos}
				/>
			</AutoFixedGrid.Slot>

			<ModalWrapper ref={friendsModalRef} backdrop={true}>
				<ModalContentsFriends />
			</ModalWrapper>
		</AutoFixedGrid>
	);
};

export default HomePage;
