import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, optionalQuery } from '../shared/descriptions';

const r = { resource: ['company'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a company',
				description: 'Get company details',
				routing: { request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}' } },
			},
			{
				name: 'Invite User',
				value: 'invite',
				action: 'Invite a user',
				description: 'Invite a user to a company',
				routing: {
					request: { method: 'POST', url: '=/companies/{{$parameter.companyId}}/invitations' },
				},
			},
			{
				name: 'List',
				value: 'list',
				action: 'List companies',
				description: 'List companies the caller can access',
				routing: { request: { method: 'GET', url: '/companies' } },
			},
			{
				name: 'List Invitations',
				value: 'listInvitations',
				action: 'List company invitations',
				description: 'List pending invitations for a company',
				routing: {
					request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/invitations' },
				},
			},
			{
				name: 'List Users',
				value: 'listUsers',
				action: 'List company users',
				description: 'List users of a company',
				routing: { request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/users' } },
			},
			{
				name: 'Remove User',
				value: 'removeUser',
				action: 'Remove a company user',
				description: 'Remove a user from a company',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/companies/{{$parameter.companyId}}/users/{{$parameter.userId}}',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a company',
				description: 'Update company details',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/companies/{{$parameter.companyId}}',
						body: '={{ JSON.parse($parameter.body || "{}") }}',
					},
				},
			},
		],
		default: 'list',
	},

	{
		...companyIdField,
		displayOptions: {
			show: {
				...r,
				operation: ['get', 'update', 'listUsers', 'removeUser', 'listInvitations', 'invite'],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('removeUser'),
		description: 'UUID of the user to remove',
	},
	{
		displayName: 'Body (JSON)',
		name: 'body',
		type: 'json',
		default: '{\n  "name": ""\n}',
		displayOptions: show('update'),
		description: 'Fields to update (e.g. { "name": "..." })',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'name@example.com',
		displayOptions: show('invite'),
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		default: '',
		displayOptions: show('invite'),
		description: 'Role to assign (e.g. company_admin, user)',
		routing: { send: { type: 'body', property: 'role', value: '={{ $value || undefined }}' } },
	},
	optionalQuery(
		'Include Archived',
		'includeArchived',
		'company',
		['get'],
		'Company admin/super-admin only. Include archived executions.',
		'boolean',
	),
];
