const MoribSetContainer = () => {
	return (
		<div className="ml-[4.899rem] flex h-[45rem] w-[53.2rem]">
			{/* Left Section: 모립 세트 */}
			<div className="flex w-[23rem] flex-col rounded-l-[8px] bg-gray-bg-02 p-[1rem]">
				<h3 className="detail-reg-14 h-[3.4rem] w-[21rem] px-[1.7rem] py-[1rem] text-gray-04">모립 세트</h3>
				<ul className="mt-[0.8rem] h-[34rem] w-[20.4rem] space-y-3">
					{Array(7)
						.fill('Capstone Design')
						.map((item, index) => (
							<li
								key={index}
								className="flex h-[3.4rem] w-[21rem] items-center rounded-[6px] py-[0.3rem] pl-[1rem] pr-[0.3rem] hover:bg-gray-bg-04"
							>
								<div className="h-[2.8rem] w-[2.8rem] p-[0.7rem]">
									<input
										type="checkbox"
										id={`item-${index}`}
										className="h-[1.4rem] w-[1.4rem] rounded border-gray-600 focus:ring"
									/>
								</div>
								<label htmlFor={`item-${index}`} className="detail-semibold-14 w-[14.9rem] cursor-pointer text-white">
									{item}
								</label>
								<span className="h-[1rem] w-[1rem] rounded-full bg-yellow-500" />
							</li>
						))}
				</ul>
				{/* Bottom Buttons */}
				<div className="flex h-[5.4rem] justify-end gap-[0.5rem] p-[1rem]">
					<button className="detail-semibold-14 flex h-[3.4rem] w-[5.8rem] items-center justify-center rounded-[3.297px] bg-gray-bg-06 text-white">
						취소
					</button>
					<button className="detail-semibold-14 flex h-[3.4rem] w-[5.8rem] items-center justify-center rounded-[3.297px] bg-mint-02 text-black">
						등록
					</button>
				</div>
			</div>

			{/* Right Section: 허용할 사이트 */}
			<div className="flex w-[30.2rem] flex-col gap-[1rem] rounded-r-[8px] bg-gray-bg-03 py-[1rem] pl-[0.9rem] pr-[1.7rem]">
				<h3 className="detail-reg-14 h-[3.4rem] w-[28.6rem] p-[1rem] text-gray-04">허용할 사이트</h3>
				<ul className="space-y-3">
					{Array(8)
						.fill('(150) 침착맨 - Youtube')
						.map((item, index) => (
							<li
								key={index}
								className="flex h-[3.2rem] w-[27.6rem] items-center gap-[1rem] rounded-md bg-gray-700 px-[0.7rem]"
							>
								<img src="https://img.icons8.com/color/48/youtube-play.png" alt="YouTube Icon" className="h-6 w-6" />
								<span className="detail-reg-12 text-white">{item}</span>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default MoribSetContainer;
