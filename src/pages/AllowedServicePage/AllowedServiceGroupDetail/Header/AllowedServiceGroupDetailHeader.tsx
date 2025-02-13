import {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
	KeyboardEvent,
	ReactNode,
	createContext,
	useContext,
	useRef,
	useState,
} from 'react';

import ButtonArrowSVG from '@/shared/components/ButtonArrowSVG/ButtonArrowSVG';
import ColorPalette from '@/shared/components/ColorPallete/ColorPallete';

import useClickOutside from '@/shared/hooks/useClickOutside';

import type { ColorPaletteType } from '@/shared/types/allowedService';
import { Direction } from '@/shared/types/global';

import { COLOR_PALETTE_MAP } from '@/shared/constants/colorPalette';

interface AllowedServiceDetailHeaderContextProps {
	activeGroupId: number | null;
	onAddAllowedServiceGroup: () => void;
	onChangeAllowedServiceGroupName: () => void;
	isEditingTitle: boolean;
	onChangeEditingTitleStatus: (status: boolean) => void;
}

const AllowedServiceGroupDetailHeaderContext = createContext<AllowedServiceDetailHeaderContextProps | null>(null);

const useAllowedServiceGroupDetailHeaderContext = () => {
	const context = useContext(AllowedServiceGroupDetailHeaderContext);
	if (!context) {
		throw new Error(
			'AllowedServiceGroupDetailHeader.Input & AllowedServiceGroupDetailHeader.ColorButton 컴포넌트는 <AllowedServiceGroupDetailHeader> 내부에서 사용되어야 합니다.',
		);
	}
	return context;
};

export interface AllowedServiceDetailHeaderRootProps {
	isEditingTitle: boolean;
	onChangeEditingTitleStatus: (status: boolean) => void;
	activeGroupId: number | null;
	onAddAllowedServiceGroup: () => void;
	onChangeAllowedServiceGroupName: () => void;
	children: ReactNode;
}

const AllowedServiceGroupDetailHeaderRoot = ({
	isEditingTitle,
	onChangeEditingTitleStatus,
	activeGroupId,
	onAddAllowedServiceGroup,
	onChangeAllowedServiceGroupName,
	children,
}: AllowedServiceDetailHeaderRootProps) => {
	const headerRef = useRef<HTMLElement>(null);

	const handleClickOutside = () => {
		if (activeGroupId) {
			onChangeAllowedServiceGroupName();
		} else {
			onAddAllowedServiceGroup();
		}

		onChangeEditingTitleStatus(false);
	};

	useClickOutside(headerRef, handleClickOutside);

	const contextValue = {
		activeGroupId,
		onAddAllowedServiceGroup,
		onChangeAllowedServiceGroupName,
		isEditingTitle,
		onChangeEditingTitleStatus,
	};

	return (
		<AllowedServiceGroupDetailHeaderContext.Provider value={contextValue}>
			<header ref={headerRef} className="mt-[6.8rem] flex w-full min-w-0 items-center gap-[1.4rem]">
				{children}
			</header>
		</AllowedServiceGroupDetailHeaderContext.Provider>
	);
};

export type AllowedServiceGroupDetailHeaderInputProps = InputHTMLAttributes<HTMLInputElement>;

const AllowedServiceGroupDetailHeaderInput = ({ ...props }: AllowedServiceGroupDetailHeaderInputProps) => {
	const {
		activeGroupId,
		onAddAllowedServiceGroup,
		onChangeAllowedServiceGroupName,
		isEditingTitle,
		onChangeEditingTitleStatus,
	} = useAllowedServiceGroupDetailHeaderContext();

	const handleEnableEditing = () => {
		onChangeEditingTitleStatus(true);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (activeGroupId) {
				onChangeAllowedServiceGroupName();
			} else {
				onAddAllowedServiceGroup();
			}
			onChangeEditingTitleStatus(false);
		}
	};

	return (
		<>
			{isEditingTitle || !activeGroupId ? (
				<input
					className={`placeholder-text-gray-03 w-full bg-transparent text-white title-bold-32 focus:outline-none ${props.className}`}
					onKeyPress={handleKeydown}
					{...props}
				/>
			) : (
				<h1 onDoubleClick={handleEnableEditing} className="w-full bg-transparent text-white title-bold-32">
					{props.value}
				</h1>
			)}
		</>
	);
};

export interface AllowedServiceGroupDetailHeaderColorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	hashColor: ColorPaletteType;
	onSelectColor: (hashColor: ColorPaletteType) => void;
}

const AllowedServiceGroupDetailHeaderColorButton = ({
	hashColor,
	onSelectColor,
	...props
}: AllowedServiceGroupDetailHeaderColorButtonProps) => {
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const paletteRef = useRef<HTMLDivElement>(null);

	const handleTogglePalette = () => {
		setIsPaletteOpen((prev) => !prev);
	};

	const handleClosePalette = () => {
		setIsPaletteOpen(false);
	};

	const handleColorButtonClick = (hashColor: ColorPaletteType) => {
		onSelectColor(hashColor);
		handleClosePalette();
	};

	useClickOutside(paletteRef, handleClosePalette);

	return (
		<div ref={paletteRef} className="relative flex items-center gap-[0.4rem]">
			<div onClick={handleTogglePalette} className={`h-[3rem] w-[3rem] rounded-full ${COLOR_PALETTE_MAP[hashColor]}`} />
			<span>
				<ButtonArrowSVG
					onClick={handleTogglePalette}
					direction={isPaletteOpen ? Direction.UP : Direction.DOWN}
					bg={false}
					{...props}
				/>
				<ColorPalette isOpen={isPaletteOpen}>
					{Object.keys(COLOR_PALETTE_MAP).map((hashColor) => {
						return (
							<ColorPalette.ColorButton
								key={hashColor}
								onClick={() => {
									handleColorButtonClick(hashColor as keyof typeof COLOR_PALETTE_MAP);
								}}
								hashColor={hashColor as keyof typeof COLOR_PALETTE_MAP}
							/>
						);
					})}
				</ColorPalette>
			</span>
		</div>
	);
};

const AllowedServiceGroupDetailHeader = Object.assign(AllowedServiceGroupDetailHeaderRoot, {
	Input: AllowedServiceGroupDetailHeaderInput,
	ColorButton: AllowedServiceGroupDetailHeaderColorButton,
});

export default AllowedServiceGroupDetailHeader;
