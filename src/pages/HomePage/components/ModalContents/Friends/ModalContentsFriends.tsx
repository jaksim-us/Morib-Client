import { useState } from 'react';

import { FRIENDSLIST_TABS } from '@/shared/constants/tabSelections';

import { userFriendData } from '@/shared/mocks/userFriendData';

import ButtonAddFriend from './components/ButtonAddFriend';
import ButtonRequestAction from './components/ButtonRequestAction';
import FriendInfo from './components/FriendInfo';
import FriendsListRequested from './components/FriendsListRequested';
import InputSendRequest from './components/InputSendRequest';
import TabSelect from './components/TabSelect';

const ModalContentsFriends = () => {
	const [selectedTabId, setSelectedTabId] = useState(FRIENDSLIST_TABS[0].id);
	const handleTabChange = (tab: number) => {
		setSelectedTabId(tab);
	};
	return (
		<div className="h-[800px] w-[1300px] rounded-[14px] bg-gray-bg-03 p-[4rem] shadow-[0_3px_30px_0px_rgba(0,0,0,0.4)]">
			<h1 className="title-bold-32 mb-[1rem] text-white">친구</h1>
			<TabSelect tabs={FRIENDSLIST_TABS} handleTabChange={handleTabChange} selectedTabId={selectedTabId} />

			{selectedTabId === FRIENDSLIST_TABS[0].id ? (
				userFriendData.length > 0 ? (
					<>
						<div className="mt-[3rem] flex w-full flex-col px-[2rem]">
							<div className="body-reg-16 flex p-[1rem] text-gray-05">
								<div className="w-[40rem]">사용자</div>
								<div className="w-[30rem]">현재 상태</div>
								<div className="w-[46rem]">오늘 몰입 시간</div>
							</div>
							<ul className="h-[57.5rem] overflow-scroll">
								<FriendInfo friendsData={userFriendData} />
							</ul>
						</div>
					</>
				) : (
					<div className="flex h-[57rem] flex-col items-center justify-center">
						<p className="title-med-32 mb-[2rem] text-gray-05">함께 몰입할 친구를 추가해보세요!</p>
						<ButtonAddFriend>친구 추가하기</ButtonAddFriend>
					</div>
				)
			) : (
				<div>
					<div className="relative mb-[4rem] mt-[2rem]">
						<InputSendRequest />
					</div>
					<div className="h-[52.5rem] overflow-scroll">
						<h2 className="subhead-bold-22 px-[1rem] py-[2rem] text-white">받은 요청</h2>
						<FriendsListRequested friendsData={userFriendData}>
							<div className="flex w-full justify-end gap-[1rem]">
								<ButtonRequestAction variant="positive">수락</ButtonRequestAction>
								<ButtonRequestAction variant="negative">거절</ButtonRequestAction>
							</div>
						</FriendsListRequested>

						<h2 className="subhead-bold-22 mt-[4rem] px-[1rem] py-[2rem] text-white">보낸 요청</h2>
						<FriendsListRequested friendsData={userFriendData}>
							<div className="flex w-full justify-end">
								<ButtonRequestAction variant="negative">요청 취소</ButtonRequestAction>
							</div>
						</FriendsListRequested>
					</div>
				</div>
			)}
		</div>
	);
};

export default ModalContentsFriends;
