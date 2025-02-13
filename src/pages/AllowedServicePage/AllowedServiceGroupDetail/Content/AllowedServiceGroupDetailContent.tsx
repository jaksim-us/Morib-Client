import { ReactNode } from 'react';

import Spacer from '@/shared/components/Spacer/Spacer';

import { getMainDomain } from '@/shared/utils/url';

import { AllowedServiceGroupDetailSiteType } from '@/shared/types/allowedService';

import MinusBtn from '@/shared/assets/svgs/minus_btn.svg?react';

import { getServiceFavicon } from '@/pages/OnboardingPage/utils/serviceUrl';

export interface AllowedServiceGroupDetailContentProps {
	children: ReactNode;
}

export const AllowedServiceGroupDetailContentRoot = ({ children }: AllowedServiceGroupDetailContentProps) => {
	return <Spacer className="flex flex-col gap-[5rem]">{children}</Spacer>;
};

export interface AllowedServiceGroupDetailContentTableProps {
	totalLength: number;
	children: ReactNode;
}

export const AllowedServiceGroupDetailContentTable = ({
	totalLength,
	children,
}: AllowedServiceGroupDetailContentTableProps) => {
	const tableNum = 9;

	const renderEmptyRows = (count: number) => {
		return Array.from({ length: count }).map((_, index) => (
			<div key={`empty-row-${index}`} className="h-[5rem] w-full border-b-[0.1rem] border-gray-bg-04" />
		));
	};
	const emptyRowCount = Math.max(tableNum - totalLength, 0);

	return (
		<Spacer className="mt-[1rem] rounded-[8px]">
			<Spacer className="flex flex-col">
				<div className="flex h-[4.6rem] items-center border-b-[0.1rem] border-gray-bg-04 px-[1rem] text-gray-04 detail-semibold-14">
					<div className="w-[24rem] flex-shrink-0">사이트 이름</div>
					<div className="w-[31rem] flex-shrink-0 text-left">페이지</div>
					<div className="w-full text-left">주소</div>
				</div>

				<Spacer className="overflow-y-auto">
					{children}
					{renderEmptyRows(emptyRowCount)}
				</Spacer>
			</Spacer>
		</Spacer>
	);
};

export interface AllowedServiceGroupDetailContentRootTableRowProps extends AllowedServiceGroupDetailSiteType {
	onDeleteAllowedSite: () => void;
}

export const AllowedServiceGroupDetailContentTableRow = ({
	onDeleteAllowedSite,
	...allowedSiteData
}: AllowedServiceGroupDetailContentRootTableRowProps) => {
	return (
		<div className="flex h-[5rem] items-center border-b-[0.1rem] border-gray-bg-04 px-[1rem]">
			<div className="flex w-[24rem] flex-shrink-0 items-center gap-x-[0.5rem] truncate pr-[1rem] text-left text-white body-med-16">
				<img src={getServiceFavicon(allowedSiteData.siteUrl)} alt="favicon" className="mr-[0.6rem] h-[2rem] w-[2rem]" />
				<p className="truncate">{getMainDomain(allowedSiteData.siteUrl)}</p>
			</div>
			<div className="w-[31rem] flex-shrink-0 truncate pr-[1rem] text-left text-gray-04 body-reg-16">
				<p className="truncate">{allowedSiteData.siteName}</p>
			</div>
			<div className="w-full truncate pr-[1rem] text-left text-gray-04 body-reg-16">
				<p className="truncate">{allowedSiteData.siteUrl}</p>
			</div>
			<div>
				<div className="pr-[2.05rem]">
					<button type="button" onClick={onDeleteAllowedSite}>
						<MinusBtn className="fill-gray-bg-07 hover:fill-error-01 active:fill-error-03" />
					</button>
				</div>
			</div>
		</div>
	);
};

const AllowedServiceGroupDetailContent = Object.assign(AllowedServiceGroupDetailContentRoot, {
	Table: AllowedServiceGroupDetailContentTable,
	TableRow: AllowedServiceGroupDetailContentTableRow,
});

export default AllowedServiceGroupDetailContent;
