import type { INodeProperties } from 'n8n-workflow';

const r = { resource: ['invitation'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });

export const invitationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Check Email',
				value: 'checkEmail',
				action: 'Check if an email exists',
				description: 'Check if an email already has an account (sign up vs sign in)',
				routing: { request: { method: 'GET', url: '/invitations/check-email' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an invitation',
				description: 'Get invitation details by token',
				routing: { request: { method: 'GET', url: '=/invitations/{{$parameter.token}}' } },
			},
			{
				name: 'Accept',
				value: 'accept',
				action: 'Accept an invitation',
				description: 'Accept an invitation by token',
				routing: {
					request: { method: 'POST', url: '=/invitations/{{$parameter.token}}/accept' },
				},
			},
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel an invitation',
				description: 'Cancel a pending invitation',
				routing: { request: { method: 'DELETE', url: '=/invitations/{{$parameter.id}}' } },
			},
		],
		default: 'get',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'name@example.com',
		displayOptions: show('checkEmail'),
		routing: { send: { type: 'query', property: 'email' } },
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: show('get', 'accept'),
		description: 'Invitation token',
	},
	{
		displayName: 'Invitation ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('cancel'),
		description: 'UUID of the invitation to cancel',
	},
];
