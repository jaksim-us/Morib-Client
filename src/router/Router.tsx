import type { Router } from '@remix-run/router';

import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import AllowedServicePage from '@/pages/AllowedServicePage/AllowedServicePage';
import HomePage from '@/pages/HomePage/HomePage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import OnboardingPage from '@/pages/OnboardingPage/OnboardingPage';
import RedirectPage from '@/pages/RedirectPage/RedirectPage';
import TimerPage from '@/pages/TimerPage/TimerPage';
import Layout from '@/shared/layout/Layout';

import ProtectedRoute from './ProtectedRoute';
import { ROUTES_CONFIG } from './routesConfig';

const router: Router = createBrowserRouter([
	{
		//public 라우트들
		path: '/',
		element: <Outlet />,
		children: [
			{
				path: ROUTES_CONFIG.login.path,
				element: (
					<Suspense fallback={<div>Loading...</div>}>
						<LoginPage />
					</Suspense>
				),
			},
			{
				path: ROUTES_CONFIG.redirect.path,
				element: <RedirectPage />,
			},
		],
	},

	{
		//권한이 있어야 접근 가능한 라우트들
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{
				path: ROUTES_CONFIG.home.path,
				element: (
					<Suspense fallback={<div>Loading...</div>}>
						<Layout>
							<HomePage />
						</Layout>
					</Suspense>
				),
			},
			{
				path: ROUTES_CONFIG.onboarding.path,
				element: (
					<Layout>
						<OnboardingPage />
					</Layout>
				),
			},
			{
				path: ROUTES_CONFIG.timer.path,
				element: (
					<Suspense fallback={<div>Loading...</div>}>
						<TimerPage />
					</Suspense>
				),
			},
			{
				path: ROUTES_CONFIG.allowedService.path,
				element: (
					<Suspense fallback={<div>Loading...</div>}>
						<Layout>
							<AllowedServicePage />
						</Layout>
					</Suspense>
				),
			},
		],
	},

	{
		//404 페이지
		path: '*',
		element: (
			<Layout>
				<NotFoundPage />
			</Layout>
		),
	},
]);

export default router;
