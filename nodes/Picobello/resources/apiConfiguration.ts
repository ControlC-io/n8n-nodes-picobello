import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField } from '../shared/descriptions';

const r = { resource: ['apiConfiguration'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';

export const apiConfigurationDescription: INodeProperties[] = [
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
				action: 'List API configurations',
				description: 'List API configurations for a company',
				routing: {
					request: {
						method: 'GET',
						url: '=/companies/{{$parameter.companyId}}/api-configurations',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an API configuration',
				description: 'Create an API configuration',
				routing: {
					request: {
						method: 'POST',
						url: '=/companies/{{$parameter.companyId}}/api-configurations',
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an API configuration',
				description: 'Update an API configuration',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/companies/{{$parameter.companyId}}/api-configurations/{{$parameter.configId}}',
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an API configuration',
				description: 'Delete an API configuration',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/companies/{{$parameter.companyId}}/api-configurations/{{$parameter.configId}}',
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('update', 'delete'),
		description: 'UUID of the API configuration',
	},
	jsonBodyField(['create', 'update'], 'apiConfiguration'),
];
