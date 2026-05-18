import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField, optionalQuery } from '../shared/descriptions';

const r = { resource: ['companyFile'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const C = '/companies/{{$parameter.companyId}}';

export const companyFileDescription: INodeProperties[] = [
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
				action: 'List company files',
				description: 'List files in a folder or by IDs',
				routing: { request: { method: 'GET', url: `=${C}/files` } },
			},
			{
				name: 'Create Record',
				value: 'create',
				action: 'Create a file record',
				description: 'Create a file record',
				routing: { request: { method: 'POST', url: `=${C}/files`, body: bodyRoute } },
			},
			{
				name: 'Get IDs by Metadata',
				value: 'byMetadata',
				action: 'Search files by metadata',
				description: 'Return file IDs matching a metadata key/value',
				routing: { request: { method: 'GET', url: `=${C}/files/by-metadata` } },
			},
			{
				name: 'Update Metadata',
				value: 'updateMetadata',
				action: 'Update file metadata',
				description: 'Update metadata entries for a file',
				routing: {
					request: {
						method: 'PUT',
						url: `=${C}/files/{{$parameter.fileId}}/metadata`,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a company file',
				description: 'Delete a company file',
				routing: {
					request: { method: 'DELETE', url: `=${C}/files/{{$parameter.fileId}}` },
				},
			},
			{
				name: 'Extract Metadata From OCR',
				value: 'extractMetadata',
				action: 'Extract metadata from OCR',
				description: 'Fill metadata keys from OCR text using Gemini',
				routing: {
					request: { method: 'POST', url: `=${C}/documents/extract-metadata-from-ocr` },
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('updateMetadata', 'delete'),
		description: 'UUID of the file',
	},
	optionalQuery('Folder ID', 'folder_id', 'companyFile', ['list'], 'List files in this folder'),
	optionalQuery(
		'File IDs',
		'ids',
		'companyFile',
		['list'],
		'Comma-separated file IDs (e.g. from Get IDs by Metadata)',
	),
	optionalQuery(
		'Include Archived',
		'includeArchived',
		'companyFile',
		['list'],
		'Company admin/super-admin only. Include archived files.',
		'boolean',
	),
	{
		displayName: 'Metadata ID',
		name: 'metadata_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('byMetadata'),
		description: 'UUID of the metadata key to match',
		routing: { send: { type: 'query', property: 'metadata_id' } },
	},
	optionalQuery('Value', 'value', 'companyFile', ['byMetadata'], 'Optional metadata value to match'),
	{
		displayName: 'Entries (JSON)',
		name: 'metadataEntries',
		type: 'json',
		required: true,
		default: '[\n  { "key": "", "value": "" }\n]',
		displayOptions: show('updateMetadata'),
		description: 'Array of { key, value } metadata entries',
		routing: { send: { type: 'body', property: 'entries', value: '={{ JSON.parse($value) }}' } },
	},
	{
		displayName: 'File ID',
		name: 'extractFileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('extractMetadata'),
		description: 'UUID of the file (OCR must be completed)',
		routing: { send: { type: 'body', property: 'fileId' } },
	},
	{
		displayName: 'Metadata Key IDs',
		name: 'metadataKeyIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('extractMetadata'),
		description: 'Comma-separated metadata key UUIDs to fill',
		routing: {
			send: {
				type: 'body',
				property: 'metadataKeyIds',
				value: '={{ $value.split(",").map((s) => s.trim()).filter(Boolean) }}',
			},
		},
	},
	{
		displayName: 'Current Date',
		name: 'currentDate',
		type: 'string',
		default: '',
		placeholder: 'yyyy-mm-dd',
		displayOptions: show('extractMetadata'),
		description: 'Optional reference date for the model',
		routing: { send: { type: 'body', property: 'currentDate', value: '={{ $value || undefined }}' } },
	},
	jsonBodyField(['create'], 'companyFile'),
];
