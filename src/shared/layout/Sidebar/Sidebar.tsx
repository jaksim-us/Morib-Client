import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ModalWrapper, { ModalWrapperRef } from '@/shared/components/ModalWrapper/ModalWrapper';

import { getActivePath } from '@/shared/utils/path';

import LogoIcon from '@/shared/assets/svgs/common/ic_logo.svg?react';
import FolderIcon from '@/shared/assets/svgs/ic_folder.svg?react';
import GearIcon from '@/shared/assets/svgs/ic_gear.svg?react';

import { ROUTES_CONFIG } from '@/router/routesConfig';

import ModalContentsSetting from './ModalContentsSetting/ModalContentsSetting';

const Sidebar = () => {
	const modalRef = useRef<ModalWrapperRef & HTMLDialogElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const pathName = getActivePath(location.pathname);

	const openSettings = () => {
		modalRef.current?.open();
	};

	const navigateHome = () => {
		navigate(ROUTES_CONFIG.home.path);
	};

	const navigateAllowedService = () => {
		navigate(ROUTES_CONFIG.allowedService.path);
	};

	return (
		<>
			<aside className="sticky top-0 flex min-h-screen w-[7.4rem] flex-shrink-0 flex-col items-center justify-between bg-gray-bg-02 pb-[2.1rem] pt-[5.4rem]">
				<button type="button" onClick={navigateHome} className="relative flex w-full items-center gap-[0.8rem]">
					<hr
						className={`h-[54px] w-[2px] rounded-r-[8px] ${pathName === ROUTES_CONFIG.home.path ? 'bg-white' : 'border-transparent bg-transparent'}`}
					/>
					<LogoIcon
						className={`rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05 ${pathName === ROUTES_CONFIG.home.path && 'bg-gray-bg-05'}`}
					/>
				</button>

				<section className="flex w-full flex-col items-center justify-center">
					<button onClick={navigateAllowedService} className="relative flex w-full gap-[0.8rem]">
						<hr
							className={`h-[54px] w-[2px] rounded-r-[8px] ${pathName === ROUTES_CONFIG.allowedService.path ? 'bg-white' : 'border-transparent bg-transparent'}`}
						/>
						<FolderIcon
							className={`rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05 ${pathName === ROUTES_CONFIG.allowedService.path && 'bg-gray-bg-05'}`}
						/>
					</button>

					<button onClick={openSettings}>
						<GearIcon className="rounded-[1.6rem] hover:bg-gray-bg-04 active:bg-gray-bg-05" />
					</button>
				</section>
			</aside>
			<ModalWrapper ref={modalRef} backdrop={true}>
				{({ isModalOpen }) => <ModalContentsSetting />}
			</ModalWrapper>
		</>
	);
};

export default Sidebar;
