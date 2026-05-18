import type { INodeProperties } from 'n8n-workflow';
import { companyIdField } from '../shared/descriptions';

const r = { resource: ['fileMetadataKey'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const K = '/companies/{{$parameter.companyId}}/files-metadata-keys';

export const fileMetadataKeyDescription: INodeProperties[] = [
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
				action: 'List files metadata keys',
				description: 'List files metadata keys for a company',
				routing: { request: { method: 'GET', url: `=${K}` } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a files metadata key',
				description: 'Create a files metadata key',
				routing: { request: { method: 'POST', url: `=${K}` } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a files metadata key',
				description: 'Update a files metadata key',
				routing: { request: { method: 'PATCH', url: `=${K}/{{$parameter.keyId}}` } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a files metadata key',
				description: 'Delete a files metadata key',
				routing: { request: { method: 'DELETE', url: `=${K}/{{$parameter.keyId}}` } },
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Key ID',
		name: 'keyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('update', 'delete'),
		description: 'UUID of the metadata key',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: show('create', 'update'),
		routing: { send: { type: 'body', property: 'name', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Value Kind',
		name: 'valueKind',
		type: 'options',
		default: 'free_text',
		displayOptions: show('create', 'update'),
		options: [
			{ name: 'Free Text', value: 'free_text' },
			{ name: 'Predefined List', value: 'predefined_list' },
		],
		routing: { send: { type: 'body', property: 'value_kind' } },
	},
	{
		displayName: 'Allowed Values',
		name: 'allowedValues',
		type: 'string',
		default: '',
		displayOptions: show('create', 'update'),
		description: 'Comma-separated allowed values (for Predefined List)',
		routing: {
			send: {
				type: 'body',
				property: 'allowed_values',
				value:
					'={{ $value ? $value.split(",").map((s) => s.trim()).filter(Boolean) : undefined }}',
			},
		},
	},
];
