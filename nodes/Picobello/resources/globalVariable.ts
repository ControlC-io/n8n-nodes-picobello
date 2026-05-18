import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField } from '../shared/descriptions';

const r = { resource: ['globalVariable'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';

export const globalVariableDescription: INodeProperties[] = [
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
				action: 'List global variables',
				description: 'List global variables for a company',
				routing: {
					request: {
						method: 'GET',
						url: '=/companies/{{$parameter.companyId}}/global-variables',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a global variable',
				description: 'Create a global variable',
				routing: {
					request: {
						method: 'POST',
						url: '=/companies/{{$parameter.companyId}}/global-variables',
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a global variable',
				description: 'Update a global variable',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/companies/{{$parameter.companyId}}/global-variables/{{$parameter.variableId}}',
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a global variable',
				description: 'Delete a global variable',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/companies/{{$parameter.companyId}}/global-variables/{{$parameter.variableId}}',
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Variable ID',
		name: 'variableId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('update', 'delete'),
		description: 'UUID of the global variable',
	},
	jsonBodyField(['create', 'update'], 'globalVariable'),
];
