import { useNavigate } from 'react-router-dom';

import HomeLargeBtn from '@/shared/components/ButtonHomeLarge/ButtonHomeLarge';

import { HomeLargeBtnVariant } from '@/shared/types/global';

import NotFoundIcon from '@/shared/assets/svgs/404.svg?react';
import BellIcon from '@/shared/assets/svgs/bell.svg?react';
import FriendSettingIcon from '@/shared/assets/svgs/friend_setting.svg?react';

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="relative flex h-screen bg-gray-bg-01">
			<div className="absolute right-[4.4rem] top-[5.4rem] flex gap-[0.8rem]">
				<button>
					<FriendSettingIcon className="rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05" />
				</button>
				<button>
					<BellIcon className="rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05" />
				</button>
			</div>

			<div className="flex w-full flex-col items-center justify-center">
				<NotFoundIcon />
				<h2 className="mt-[7.75rem] text-white title-bold-36">페이지를 찾을 수 없습니다.</h2>
				<p className="text-white title-med-32">올바른 URL을 입력하였는지 확인하세요.</p>

				<div className="mt-[4.4rem]">
					<HomeLargeBtn onClick={() => navigate('/home')} variant={HomeLargeBtnVariant.LARGE}>
						홈으로 돌아가기
					</HomeLargeBtn>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
