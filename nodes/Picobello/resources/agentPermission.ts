import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField } from '../shared/descriptions';

const r = { resource: ['agentPermission'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const P = '/companies/{{$parameter.companyId}}/agent-permissions';

export const agentPermissionDescription: INodeProperties[] = [
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
				action: 'List agent permissions',
				description: 'List agent permissions for a company',
				routing: { request: { method: 'GET', url: `=${P}` } },
			},
			{
				name: 'Add',
				value: 'add',
				action: 'Add an agent permission',
				description: 'Add an agent permission',
				routing: { request: { method: 'POST', url: `=${P}`, body: bodyRoute } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an agent permission',
				description: 'Update an agent permission',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${P}/{{$parameter.permissionId}}`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an agent permission',
				description: 'Delete an agent permission',
				routing: { request: { method: 'DELETE', url: `=${P}/{{$parameter.permissionId}}` } },
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Permission ID',
		name: 'permissionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('update', 'delete'),
		description: 'UUID of the agent permission',
	},
	jsonBodyField(['add', 'update'], 'agentPermission'),
];
