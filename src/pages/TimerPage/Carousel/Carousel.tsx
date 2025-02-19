import ButtonArrowSVG from '@/shared/components/ButtonArrowSVG/ButtonArrowSVG';

import { Direction } from '@/shared/types/global';

import ContainerCarousel from './ContainerCarousel/ContainerCarousel';
import useFriendInfoCarousel from './hooks/useFriendInfoCarousel';

const Carousel = () => {
	const { handlePrevClick, handleNextClick, visibleFriends } = useFriendInfoCarousel();

	return (
		<div className="mt-[4.8rem] flex h-[15rem] w-[86.2rem] items-center justify-center">
			<ButtonArrowSVG className="mr-[5.8rem]" direction={Direction.LEFT} onClick={handlePrevClick} />
			<div className="flex gap-[4.2rem] pl-[1rem] pr-[1rem]">
				{visibleFriends().map((friend) => (
					<ContainerCarousel
						key={friend.id}
						image={friend.image}
						time={friend.time}
						name={friend.name}
						categoryname={friend.categoryName}
						isPlaying={friend.isPlaying}
					/>
				))}
			</div>
			<ButtonArrowSVG className="ml-[5.8rem]" direction={Direction.RIGHT} onClick={handleNextClick} />
		</div>
	);
};

export default Carousel;
