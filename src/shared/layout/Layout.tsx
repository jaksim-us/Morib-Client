import { ReactNode } from 'react';

import Sidebar from './components/Sidebar/Sidebar';

interface LayoutProps {
	children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="fixed grid grid-cols-[7.4rem,1fr]">
			<Sidebar />
			<div>{children}</div>
		</div>
	);
};

export default Layout;
