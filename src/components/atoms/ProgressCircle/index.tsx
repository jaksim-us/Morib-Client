import { useEffect, useState } from 'react';

interface ProgressCircleState {
	progress: number;
}

const ProgressCircle = () => {
	const [state, setState] = useState<ProgressCircleState>({
		progress: 0,
	});
	const radius = 224; // 반지름 224
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		const progressIntervalId = setInterval(() => {
			setState((prevState) => ({
				progress: (prevState.progress + 0.01) % 100, // progress 값이 0에서 100 사이의 값만 가지도록
			}));
		}, 360); // 60분마다 업데이트

		return () => {
			clearInterval(progressIntervalId);
		};
	}, []);

	const offset = circumference - (state.progress / 100) * circumference;

	// 끝 부분 원의 좌표 계산
	const angle = (state.progress / 100) * 2 * Math.PI - Math.PI / 2; // 시작점이 위로 향하도록 조정
	const endX = 240 + radius * Math.cos(angle);
	const endY = 240 + radius * Math.sin(angle);

	return (
		<svg width="480" height="480">
			<circle cx="240" cy="240" r={radius} stroke="#292D34" strokeWidth="32" fill="none" />
			<circle
				cx="240"
				cy="240"
				r={radius}
				stroke="url(#paint0_linear_1570_35)"
				strokeWidth="32"
				fill="none"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				style={{
					transition: 'stroke-dashoffset 360ms linear',
					transform: 'rotate(-90deg)',
					transformOrigin: '50% 50%',
				}}
			/>
			<circle cx={endX} cy={endY} r="13.5" fill="#FFFFFF" />
			<defs>
				<linearGradient
					id="paint0_linear_1570_35"
					x1="45.6469"
					x2="464"
					y1="77.276"
					y2="-11.5337"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#00F2C6" />
					<stop offset="1" stopColor="#A5FFFD" />
				</linearGradient>
			</defs>
		</svg>
	);
};

export default ProgressCircle;
