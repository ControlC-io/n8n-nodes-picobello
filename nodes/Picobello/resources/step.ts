import type { INodeProperties } from 'n8n-workflow';
import { executionIdField, stepIdField } from '../shared/descriptions';

const r = { resource: ['step'] };
const show = (op: string) => ({ show: { ...r, operation: [op] } });

export const stepDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Complete',
				value: 'complete',
				action: 'Complete a step',
				description: 'Mark a step as completed and advance the workflow',
				routing: {
					request: {
						method: 'POST',
						url: '=/workflows/executions/{{$parameter.executionId}}/steps/{{$parameter.stepId}}/complete',
					},
				},
			},
			{
				name: 'Make Decision',
				value: 'decision',
				action: 'Make a decision',
				description: 'Record a decision for a decision node and advance the workflow',
				routing: {
					request: {
						method: 'POST',
						url: '=/workflows/executions/{{$parameter.executionId}}/steps/{{$parameter.stepId}}/decision',
					},
				},
			},
			{
				name: 'Process',
				value: 'process',
				action: 'Process an automatic step',
				description: 'Manually trigger processing of an automatic or agent step',
				routing: {
					request: {
						method: 'POST',
						url: '=/workflows/executions/{{$parameter.executionId}}/steps/{{$parameter.stepId}}/process',
					},
				},
			},
			{
				name: 'Process File',
				value: 'processFile',
				action: 'Process a file step',
				description: 'Process a file step',
				routing: {
					request: {
						method: 'POST',
						url: '=/files/workflows/executions/{{$parameter.executionId}}/steps/{{$parameter.stepId}}/process-file',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an execution step',
				description: 'Update an execution step (e.g. reassign)',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/workflows/executions/{{$parameter.executionId}}/steps/{{$parameter.stepId}}',
					},
				},
			},
		],
		default: 'complete',
	},

	{ ...executionIdField, displayOptions: { show: r } },
	{ ...stepIdField, displayOptions: { show: r } },

	// update
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		default: '',
		displayOptions: show('update'),
		description: 'UUID of the user to reassign this step to',
		routing: { send: { type: 'body', property: 'assignee_id', value: '={{ $value || undefined }}' } },
	},

	// processFile
	{
		displayName: 'Workflow Step ID',
		name: 'workflowStepId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('processFile'),
		description: 'UUID of the workflow step to process',
		routing: { send: { type: 'body', property: 'workflow_step_id' } },
	},

	// complete
	{
		displayName: 'Step Data',
		name: 'stepData',
		type: 'json',
		default: '{}',
		displayOptions: show('complete'),
		description: 'Optional data to submit when completing the step',
		routing: { send: { type: 'body', property: 'step_data', value: '={{ JSON.parse($value) }}' } },
	},

	// decision
	{
		displayName: 'Decision Choice',
		name: 'decisionChoice',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('decision'),
		description: 'The chosen decision value for this decision node',
		routing: { send: { type: 'body', property: 'decision_choice' } },
	},
	{
		displayName: 'Reason',
		name: 'decisionReason',
		type: 'string',
		default: '',
		displayOptions: show('decision'),
		routing: { send: { type: 'body', property: 'decision_reason', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Comment',
		name: 'decisionComment',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: show('decision'),
		routing: { send: { type: 'body', property: 'decision_comment', value: '={{ $value || undefined }}' } },
	},
];
