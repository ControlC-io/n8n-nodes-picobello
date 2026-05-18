import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField, optionalQuery } from '../shared/descriptions';

const r = { resource: ['workflow'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const arrRoute = '={{ JSON.parse($parameter.arrayBody || "[]") }}';
const W = '/companies/{{$parameter.companyId}}/workflows';

export const workflowDescription: INodeProperties[] = [
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
				action: 'List workflows',
				description: 'List workflows for a company',
				routing: { request: { method: 'GET', url: `=${W}` } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a workflow',
				description: 'Create a workflow',
				routing: { request: { method: 'POST', url: `=${W}`, body: bodyRoute } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a workflow',
				description: 'Get workflow details',
				routing: { request: { method: 'GET', url: `=${W}/{{$parameter.workflowId}}` } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a workflow',
				description: 'Update a workflow',
				routing: {
					request: { method: 'PATCH', url: `=${W}/{{$parameter.workflowId}}`, body: bodyRoute },
				},
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a workflow',
				description: 'Soft-delete a workflow',
				routing: { request: { method: 'DELETE', url: `=${W}/{{$parameter.workflowId}}` } },
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a workflow execution',
				description: 'Start a new execution from the UI policy',
				routing: { request: { method: 'POST', url: `=${W}/{{$parameter.workflowId}}/start` } },
			},
			{
				name: 'Put Steps',
				value: 'putSteps',
				action: 'Replace workflow steps',
				description: 'Replace the workflow steps',
				routing: {
					request: { method: 'PUT', url: `=${W}/{{$parameter.workflowId}}/steps`, body: arrRoute },
				},
			},
			{
				name: 'Put Connections',
				value: 'putConnections',
				action: 'Replace workflow connections',
				description: 'Replace the workflow connections',
				routing: {
					request: {
						method: 'PUT',
						url: `=${W}/{{$parameter.workflowId}}/connections`,
						body: arrRoute,
					},
				},
			},
			{
				name: 'List Statuses',
				value: 'listStatuses',
				action: 'List workflow statuses',
				description: 'List statuses of a workflow',
				routing: { request: { method: 'GET', url: `=${W}/{{$parameter.workflowId}}/statuses` } },
			},
			{
				name: 'Create Status',
				value: 'createStatus',
				action: 'Create a workflow status',
				description: 'Create a workflow status',
				routing: {
					request: {
						method: 'POST',
						url: `=${W}/{{$parameter.workflowId}}/statuses`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update a workflow status',
				description: 'Update a workflow status',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${W}/{{$parameter.workflowId}}/statuses/{{$parameter.statusId}}`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete Status',
				value: 'deleteStatus',
				action: 'Delete a workflow status',
				description: 'Delete a workflow status',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${W}/{{$parameter.workflowId}}/statuses/{{$parameter.statusId}}`,
					},
				},
			},
			{
				name: 'List Permissions',
				value: 'listPermissions',
				action: 'List workflow permissions',
				description: 'List permissions of a workflow',
				routing: {
					request: { method: 'GET', url: `=${W}/{{$parameter.workflowId}}/permissions` },
				},
			},
			{
				name: 'Add Permission',
				value: 'addPermission',
				action: 'Add a workflow permission',
				description: 'Add a workflow permission',
				routing: {
					request: {
						method: 'POST',
						url: `=${W}/{{$parameter.workflowId}}/permissions`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete Permission',
				value: 'deletePermission',
				action: 'Delete a workflow permission',
				description: 'Delete a workflow permission',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${W}/{{$parameter.workflowId}}/permissions/{{$parameter.permissionId}}`,
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(
			'get',
			'update',
			'archive',
			'start',
			'putSteps',
			'putConnections',
			'listStatuses',
			'createStatus',
			'updateStatus',
			'deleteStatus',
			'listPermissions',
			'addPermission',
			'deletePermission',
		),
		description: 'UUID of the workflow',
	},
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('updateStatus', 'deleteStatus'),
		description: 'UUID of the workflow status',
	},
	{
		displayName: 'Permission ID',
		name: 'permissionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('deletePermission'),
		description: 'UUID of the workflow permission',
	},
	optionalQuery('Category ID', 'categoryId', 'workflow', ['list'], 'Filter by workflow category ID'),
	optionalQuery(
		'Include Archived',
		'includeArchived',
		'workflow',
		['list', 'get'],
		'Company admin/super-admin only. Include archived workflows.',
		'boolean',
	),
	{
		...jsonBodyField(
			['create', 'update', 'createStatus', 'updateStatus', 'addPermission'],
			'workflow',
		),
	},
	{
		displayName: 'Body (JSON Array)',
		name: 'arrayBody',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: show('putSteps', 'putConnections'),
		description: 'JSON array payload (steps or connections)',
	},
];
