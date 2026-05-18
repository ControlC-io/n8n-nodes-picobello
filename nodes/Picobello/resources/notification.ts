import type { INodeProperties } from 'n8n-workflow';

const r = { resource: ['notification'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });

export const notificationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List notifications',
				description: 'List notifications for the current user',
				routing: { request: { method: 'GET', url: '/notifications' } },
			},
			{
				name: 'Mark All Read',
				value: 'markAllRead',
				action: 'Mark all notifications as read',
				description: 'Mark all notifications as read',
				routing: { request: { method: 'POST', url: '/notifications/mark-all-read' } },
			},
			{
				name: 'Mark Read',
				value: 'markRead',
				action: 'Mark one notification as read',
				description: 'Mark a single notification as read',
				routing: {
					request: { method: 'PATCH', url: '=/notifications/{{$parameter.id}}/read' },
				},
			},
			{
				name: 'Send Assignment',
				value: 'sendAssignment',
				action: 'Send an assignment notification',
				description: 'Send an assignment notification for an execution step',
				routing: { request: { method: 'POST', url: '/notifications/assignment' } },
			},
		],
		default: 'list',
	},
	{
		displayName: 'Notification ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('markRead'),
		description: 'UUID of the notification',
	},
	{
		displayName: 'Execution Step ID',
		name: 'executionStepId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('sendAssignment'),
		description: 'UUID of the execution step',
		routing: { send: { type: 'body', property: 'execution_step_id' } },
	},
];
