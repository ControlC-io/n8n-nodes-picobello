import type { INodeProperties } from 'n8n-workflow';

const r = { resource: ['user'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Get Me',
				value: 'getMe',
				action: 'Get current user profile',
				description: 'Get the current user, companies, and super_admin flag',
				routing: { request: { method: 'GET', url: '/me' } },
			},
			{
				name: 'Update Me',
				value: 'updateMe',
				action: 'Update current user profile',
				description: 'Update full_name and notifications_enabled',
				routing: { request: { method: 'PATCH', url: '/me' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get user information',
				description: 'Get user information by ID',
				routing: { request: { method: 'GET', url: '=/users/{{$parameter.userId}}' } },
			},
		],
		default: 'getMe',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('get'),
		description: 'UUID of the user',
	},
	{
		displayName: 'Full Name',
		name: 'fullName',
		type: 'string',
		default: '',
		displayOptions: show('updateMe'),
		routing: { send: { type: 'body', property: 'full_name', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Notifications Enabled',
		name: 'notificationsEnabled',
		type: 'boolean',
		default: true,
		displayOptions: show('updateMe'),
		routing: { send: { type: 'body', property: 'notifications_enabled' } },
	},
];
