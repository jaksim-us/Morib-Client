import { useState } from 'react';

import { getTabName } from '@/shared/apis/modal/axios';
import { useCategoryLists, useGetMsets } from '@/shared/apis/modal/queries';

import { CATEGORY_MODALTABS } from '@/shared/constants/tabSelections';

import AddBtn from '@/shared/assets/svgs/add_btn.svg?react';
import MinusBtn from '@/shared/assets/svgs/minus_btn.svg?react';

import ButtonCategoryCommon from '../ButtonCategoryCommon/ButtonCategoryCommon';
import CategoryCommonMoribSet from '../CategoryCommonMoribSet/CategoryCommonMoribSet';
import CategoryMsetUrlInfo from '../CategoryMsetUrlInfo/CategoryMsetUrlInfo';
import InputCategoryUrl from '../InputCategoryUrl/InputCategoryUrl';
import DropdownCategory from '../ModalAddCategoryList/DropdownCategory/DropdownCategory';
import TitleMoribSet from '../ModalAddCategoryList/TitleMoribSet/TitleMoribSet';
import CategoryTabSelect from '../TabCategorySelect/TabCategorySelect';

interface UrlInfo {
	url: string;
	domain?: string;
	favicon: string;
}

type CategoryListModalProp = {
	handleSubmitModal: () => void;
	rightModalUrlInfos: UrlInfo[];
	handleRightModalUrlInfos: (url: UrlInfo) => void;
	isUrlValidated: boolean | null;
	handleUrlValidation: (state: boolean | null) => void;
	handleDeleteUrlInfo: (url: UrlInfo) => void;
	moribSetName: string;
	handleSecondModalClose: () => void;
	inputUrl: string;
	handleInputUrl: (url: string) => void;
};

const AddCategoryListModal = ({
	handleSubmitModal,
	handleSecondModalClose,
	rightModalUrlInfos,
	handleRightModalUrlInfos,
	handleDeleteUrlInfo,
	moribSetName,
	isUrlValidated,
	handleUrlValidation,
	inputUrl,
	handleInputUrl,
}: CategoryListModalProp) => {
	const [isClicked, setIsClicked] = useState(false);
	const [selectedOption, setSelectedOption] = useState('카테고리 추가');
	const [selectedTabId, setSelectedTabId] = useState(CATEGORY_MODALTABS[0].id);
	const { data: categoryData } = useCategoryLists();
	const categories = categoryData?.data || [];
	const [categoryId, setCategoryId] = useState<number>(0);
	const { data: msetsList } = useGetMsets(categoryId);
	const msetUrlInfos = msetsList || [];
	const handleOptionId = (id: number) => {
		setCategoryId(id);
	};

	const handleTabChange = (tab: number) => {
		setSelectedTabId(tab);
	};

	const disabled = selectedTabId === 2;

	const handleUrlInputChange = async (url: string) => {
		try {
			const tabNameData = await getTabName(url);
			const newUrlInfo: UrlInfo = {
				url: url,
				domain: tabNameData.data.tabName,
				favicon: `https://www.google.com/s2/favicons?domain=${url}`,
			};
			handleRightModalUrlInfos(newUrlInfo);
		} catch (isQueryError) {
			console.error(isQueryError);
		}
	};

	const handleClickButton = (isClicked: boolean) => {
		setIsClicked(isClicked);
	};

	const handleSelectOption = (name: string) => {
		setSelectedOption(name);
	};

	const handleClearModalData = () => {
		setCategoryId(0);
		handleUrlValidation(null);
		handleInputUrl('');
		setIsClicked(false);
		setSelectedOption('카테고리 추가');
	};
	return (
		<div className="rounded-[10px]">
			<div className="flex">
				<div className="h-[80rem] w-[68.8rem] rounded-l-[10px] bg-gray-bg-04 py-[2.8rem] pl-[4.4rem] pr-[4.3rem]">
					<div className="mb-[3.3rem]">
						<h1 className="text-gray-04 head-bold-24">카테고리 추가</h1>
					</div>
					<aside className="mb-[8px]">
						<div className="my-[8px]">
							<CategoryTabSelect
								tabs={CATEGORY_MODALTABS}
								handleTabChange={handleTabChange}
								selectedTabId={selectedTabId}
							/>
						</div>

						<div className="relative mt-[0px]">
							<DropdownCategory
								optionData={categories}
								disabled={disabled}
								handleOptionId={handleOptionId}
								handleClickButton={handleClickButton}
								handleSelectOption={handleSelectOption}
								isClicked={isClicked}
								selectedOption={selectedOption}
							/>
						</div>
					</aside>

					<CategoryCommonMoribSet variant="smallLeft" urlInfos={msetUrlInfos}>
						{selectedTabId !== 2 &&
							msetUrlInfos.map((urlInfo: UrlInfo) => (
								<div
									key={urlInfo.url}
									className="group flex h-[4.6rem] w-[100%] gap-[1.2rem] border-b border-gray-bg-04 px-[0.8rem] hover:bg-gray-bg-04"
									onClick={() => handleRightModalUrlInfos(urlInfo)}
								>
									<CategoryMsetUrlInfo urlInfo={urlInfo} variant="smallLeft">
										<div className="p-[1.25rem]">
											<button type="button">
												<AddBtn className="fill-gray-bg-07 group-hover:fill-mint-02-hover group-active:fill-mint-02-press" />
											</button>
										</div>
									</CategoryMsetUrlInfo>
								</div>
							))}
					</CategoryCommonMoribSet>
				</div>
				<div className="flex h-[80rem] w-[61.2rem] flex-col items-end justify-between rounded-r-[1rem] bg-gray-bg-03 pb-[3rem] pl-[3rem] pr-[4.3rem] pt-[9.7rem]">
					<TitleMoribSet moribSetName={moribSetName} />

					<InputCategoryUrl
						inputUrl={inputUrl}
						handleInputUrl={handleInputUrl}
						isUrlValidated={isUrlValidated}
						handleUrlValidation={handleUrlValidation}
						currentUrlInfos={rightModalUrlInfos}
						variant="small"
						onUrlInputChange={(url: string) => handleUrlInputChange(url)}
					/>
					<CategoryCommonMoribSet urlInfos={rightModalUrlInfos} variant="smallRight">
						{rightModalUrlInfos.map((urlInfo, url) => (
							<div key={url} className="flex h-[4.6rem] gap-[2rem] border-b border-gray-bg-04 px-[0.8rem]">
								<CategoryMsetUrlInfo urlInfo={urlInfo} variant="smallRight">
									<div className="p-[1.25rem]">
										<button type="button" onClick={() => handleDeleteUrlInfo(urlInfo)}>
											<MinusBtn className="fill-gray-bg-07 hover:fill-error-01 active:fill-error-03" />
										</button>
									</div>
								</CategoryMsetUrlInfo>
							</div>
						))}
					</CategoryCommonMoribSet>

					<div className="mt-[3rem] flex gap-[16px]">
						<ButtonCategoryCommon
							variant="취소"
							onClick={() => {
								handleClearModalData();
								handleSecondModalClose();
							}}
						>
							취소
						</ButtonCategoryCommon>
						<ButtonCategoryCommon
							variant="완료"
							onClick={() => {
								handleClearModalData();
								handleSubmitModal();
							}}
						>
							완료
						</ButtonCategoryCommon>
					</div>
				</div>
			</div>
		</div>
	);
};
export default AddCategoryListModal;
