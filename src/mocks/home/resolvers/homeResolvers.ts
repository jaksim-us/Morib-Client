import { HttpResponse, http } from 'msw';

import { HOME_RES } from '../responses/homeResponses';

export const HOME_MOCK_URL = {
	GET_CATEGORY: 'api/v2/home',
	GET_WORK_TIME: 'api/v2/timer',
	POST_TIMER_START: 'api/v2/timer/start',
	POST_CREATE_TASK: '/api/v2/tasks/:categoryId',
	POST_TOGGLE_TASK_STATUS: 'api/v2/tasks/:taskId/status',
};

// LINK: https://mswjs.io/docs/best-practices/typescript/#request-handlers
// NOTE: http.method<Params의 타입, RequestBody의 타입, ResponseBody의 타입, path의 타입(api 경로)>

export const homeResolvers = [
	http.get(HOME_MOCK_URL.GET_CATEGORY, async ({ request }) => {
		const url = new URL(request.url);
		const startDate = url.searchParams.get('startDate');
		const endDate = url.searchParams.get('endDate');

		if (!startDate || !endDate) {
			throw new HttpResponse(null, { status: 400 });
		}

		return HttpResponse.json(HOME_RES.GET_CATEGORY);
	}),

	http.get(HOME_MOCK_URL.GET_WORK_TIME, async ({ params }) => {
		const { targetDate } = params;

		if (!targetDate) {
			throw new HttpResponse(null, { status: 400 });
		}

		return HttpResponse.json(HOME_RES.GET_WORK_TIME);
	}),

	http.post<never, { taskList: number[] }>(HOME_MOCK_URL.POST_TIMER_START, async ({ request }) => {
		const url = new URL(request.url);
		const targetDate = url.searchParams.get('targetDate');

		const { taskList } = await request.json();

		if (!targetDate || !taskList) {
			throw new HttpResponse(null, { status: 400 });
		}

		return HttpResponse.json(HOME_RES.POST_TIMER_START);
	}),

	http.post<never, { name: string; startDate: string; endDate: string }>(
		HOME_MOCK_URL.POST_CREATE_TASK,
		async ({ request }) => {
			const { name, startDate, endDate } = await request.json();

			if (!name || !startDate || !endDate) {
				throw new HttpResponse(null, { status: 400 });
			}

			return HttpResponse.json(HOME_RES.POST_CREATE_TASK);
		},
	),

	http.post(HOME_MOCK_URL.POST_TOGGLE_TASK_STATUS, async () => {
		return HttpResponse.json(HOME_RES.POST_TOGGLE_TASK_STATUS);
	}),
];
