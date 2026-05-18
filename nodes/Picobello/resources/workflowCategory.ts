import type { INodeProperties } from 'n8n-workflow';
import { companyIdField } from '../shared/descriptions';

const r = { resource: ['workflowCategory'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });

export const workflowCategoryDescription: INodeProperties[] = [
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
				action: 'List workflow categories',
				description: 'List workflow categories for a company',
				routing: {
					request: {
						method: 'GET',
						url: '=/companies/{{$parameter.companyId}}/workflow-categories',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a workflow category',
				description: 'Create a workflow category',
				routing: {
					request: {
						method: 'POST',
						url: '=/companies/{{$parameter.companyId}}/workflow-categories',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a workflow category',
				description: 'Update a workflow category',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/companies/{{$parameter.companyId}}/workflow-categories/{{$parameter.categoryId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a workflow category',
				description: 'Delete a workflow category',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/companies/{{$parameter.companyId}}/workflow-categories/{{$parameter.categoryId}}',
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('update', 'delete'),
		description: 'UUID of the workflow category',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('create', 'update'),
		routing: { send: { type: 'body', property: 'name' } },
	},
];
