import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, executionIdField, optionalQuery } from '../shared/descriptions';

const r = { resource: ['execution'] };
const show = (op: string) => ({ show: { ...r, operation: [op] } });

export const executionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive an execution',
				description: 'Soft-delete an execution',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/companies/{{$parameter.companyId}}/executions/{{$parameter.executionId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an execution',
				description: 'Retrieve all data and steps for an execution',
				routing: {
					request: { method: 'GET', url: '=/workflows/executions/{{$parameter.executionId}}' },
				},
			},
			{
				name: 'List by Company',
				value: 'list',
				action: 'List executions',
				description: 'List executions for a company',
				routing: {
					request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/executions' },
				},
			},
			{
				name: 'List Steps by Company',
				value: 'listSteps',
				action: 'List execution steps',
				description: 'List execution steps for a company',
				routing: {
					request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/execution-steps' },
				},
			},
			{
				name: 'Rename',
				value: 'rename',
				action: 'Rename an execution',
				description: 'Set a new display name for an execution',
				routing: {
					request: { method: 'PATCH', url: '=/workflows/executions/{{$parameter.executionId}}/name' },
				},
			},
			{
				name: 'Trigger',
				value: 'trigger',
				action: 'Trigger a workflow',
				description: 'Start a new execution for a workflow via API',
				routing: {
					request: { method: 'POST', url: '=/workflows/{{$parameter.workflowId}}/trigger' },
				},
			},
			{
				name: 'Update Data',
				value: 'updateData',
				action: 'Update execution data',
				description: 'Update one or more data fields in an execution',
				routing: {
					request: { method: 'PUT', url: '=/workflows/executions/{{$parameter.executionId}}/data' },
				},
			},
		],
		default: 'get',
	},

	// executionId-based operations
	{
		...executionIdField,
		displayOptions: { show: { ...r, operation: ['get', 'rename', 'updateData', 'archive'] } },
	},
	// companyId-based operations
	{
		...companyIdField,
		displayOptions: { show: { ...r, operation: ['list', 'listSteps', 'archive'] } },
	},

	// trigger
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('trigger'),
		description: 'UUID of the workflow to trigger',
	},
	{
		displayName: 'Data',
		name: 'triggerData',
		type: 'json',
		default: '{}',
		displayOptions: show('trigger'),
		description: 'Initial data passed to the workflow execution',
		routing: { send: { type: 'body', property: 'data', value: '={{ JSON.parse($value) }}' } },
	},

	// rename
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('rename'),
		description: 'New display name for the execution',
		routing: { send: { type: 'body', property: 'name' } },
	},

	// updateData (dynamic keys)
	{
		displayName: 'Data Fields',
		name: 'dataFields',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Field' },
		displayOptions: show('updateData'),
		default: {},
		description: 'Key–value pairs to update in the execution data',
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Key Name or ID',
						name: 'key',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getExecutionDataKeys' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'New value for this field',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'data',
				value: '={{ Object.fromEntries(($value.field ?? []).map((f) => [f.key, f.value])) }}',
			},
		},
	},

	optionalQuery(
		'Include Archived',
		'includeArchived',
		'execution',
		['get'],
		'Super-admin/API-key only. Include archived executions.',
		'boolean',
	),
];
