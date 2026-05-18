import type { INodeProperties } from 'n8n-workflow';
import { executionIdField } from '../shared/descriptions';

const r = { resource: ['log'] };

export const logDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Add Entry',
				value: 'addEntry',
				action: 'Add a log entry',
				description: 'Append a log entry to an execution',
				routing: {
					request: { method: 'POST', url: '=/workflows/executions/{{$parameter.executionId}}/logs' },
				},
			},
		],
		default: 'addEntry',
	},
	{ ...executionIdField, displayOptions: { show: r } },
	{
		displayName: 'Log Text',
		name: 'logText',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: r },
		routing: { send: { type: 'body', property: 'log_text' } },
	},
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		default: '',
		displayOptions: { show: r },
		description: 'UUID of the step to associate with this log entry — leave empty if not applicable',
		routing: { send: { type: 'body', property: 'step_id', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Log Type',
		name: 'logType',
		type: 'string',
		default: '',
		displayOptions: { show: r },
		description: 'Optional type/category label for the log entry',
		routing: { send: { type: 'body', property: 'log_type', value: '={{ $value || undefined }}' } },
	},
];
