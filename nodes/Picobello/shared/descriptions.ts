import type { INodeProperties } from 'n8n-workflow';

/** Reusable required path-parameter UUID string field. */
export function idField(
	displayName: string,
	name: string,
	description = `UUID of the ${displayName.replace(/ ID$/, '').toLowerCase()}`,
	required = true,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'string',
		required,
		default: '',
		description,
	};
}

export const executionIdField = idField('Execution ID', 'executionId');
export const stepIdField = idField('Step ID', 'stepId', 'UUID of the execution step');
export const companyIdField = idField('Company ID', 'companyId');
export const workflowIdField = idField('Workflow ID', 'workflowId');

/**
 * Optional free-form JSON request body. The operation's routing should set
 * `request.body: '={{ JSON.parse($parameter.body || "{}") }}'` to forward it.
 */
export function jsonBodyField(
	operations: string[],
	resource: string,
	description = 'Request body as JSON. See the Picobello API documentation for the accepted fields.',
	required = false,
): INodeProperties {
	return {
		displayName: 'Body (JSON)',
		name: 'body',
		type: 'json',
		required,
		default: '{}',
		displayOptions: { show: { resource: [resource], operation: operations } },
		description,
	};
}

/** Optional query-string parameter sent only when non-empty. */
export function optionalQuery(
	displayName: string,
	name: string,
	resource: string,
	operations: string[],
	description: string,
	type: 'string' | 'boolean' = 'string',
): INodeProperties {
	return {
		displayName,
		name,
		type,
		default: type === 'boolean' ? false : '',
		displayOptions: { show: { resource: [resource], operation: operations } },
		description,
		routing: {
			send: {
				type: 'query',
				property: name,
				value: '={{ $value === "" || $value === false ? undefined : $value }}',
			},
		},
	};
}
