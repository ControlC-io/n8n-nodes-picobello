import type { INodeProperties } from 'n8n-workflow';
import { executionIdField } from '../shared/descriptions';

const r = { resource: ['file'] };
const show = (op: string) => ({ show: { ...r, operation: [op] } });

export const fileDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: r },
		options: [
			{
				name: 'Get Document URL',
				value: 'getDocumentUrl',
				action: 'Get a document URL',
				description: 'Return a short-lived URL to stream a company document',
				routing: { request: { method: 'POST', url: '/files/document-url' } },
			},
			{
				name: 'Get OCR Status',
				value: 'getOcr',
				action: 'Get OCR status',
				description: 'Get OCR and AI metadata extraction status for a file',
				routing: { request: { method: 'GET', url: '=/files/{{$parameter.fileId}}/ocr' } },
			},
			{
				name: 'Get Signed URL',
				value: 'getSignedUrl',
				action: 'Get a signed or proxy URL',
				description: 'Return a URL to access a file in a bucket',
				routing: { request: { method: 'POST', url: '/files/signed-url' } },
			},
			{
				name: 'Stream Document',
				value: 'streamDocument',
				action: 'Stream a document by token',
				description: 'Stream a document using a short-lived token',
				routing: { request: { method: 'GET', url: '/files/document' } },
			},
			{
				name: 'Upload Execution File',
				value: 'uploadExecutionFile',
				action: 'Upload a file for an execution',
				description: 'Attach a file (by URL or base64) to an execution data field',
				routing: {
					request: {
						method: 'POST',
						url: '=/files/workflows/executions/{{$parameter.executionId}}/files',
					},
				},
			},
		],
		default: 'uploadExecutionFile',
	},

	// uploadExecutionFile
	{ ...executionIdField, displayOptions: show('uploadExecutionFile') },
	{
		displayName: 'Field Name',
		name: 'fieldName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('uploadExecutionFile'),
		description: 'Execution data field the file is stored under',
		routing: { send: { type: 'body', property: 'field_name' } },
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		displayOptions: show('uploadExecutionFile'),
		description: 'Public URL to fetch the file from (use this or File Base64)',
		routing: { send: { type: 'body', property: 'file_url', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'File Base64',
		name: 'fileBase64',
		type: 'string',
		default: '',
		displayOptions: show('uploadExecutionFile'),
		description: 'Base64-encoded file content (use this or File URL)',
		routing: { send: { type: 'body', property: 'file_base64', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: show('uploadExecutionFile'),
		routing: { send: { type: 'body', property: 'file_name', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'MIME Type',
		name: 'mimeType',
		type: 'string',
		default: '',
		displayOptions: show('uploadExecutionFile'),
		routing: { send: { type: 'body', property: 'mime_type', value: '={{ $value || undefined }}' } },
	},

	// getSignedUrl
	{
		displayName: 'Bucket',
		name: 'bucket',
		type: 'string',
		required: true,
		default: 'documents',
		displayOptions: show('getSignedUrl'),
		description: 'Bucket name (e.g. documents for execution/company documents)',
		routing: { send: { type: 'body', property: 'bucket' } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('getSignedUrl'),
		description: 'Path within the bucket',
		routing: { send: { type: 'body', property: 'path' } },
	},
	{
		displayName: 'Expires In (Seconds)',
		name: 'expiresIn',
		type: 'number',
		default: 0,
		displayOptions: show('getSignedUrl'),
		description: 'Expiration in seconds (non-documents buckets only). 0 = server default.',
		routing: { send: { type: 'body', property: 'expiresIn', value: '={{ $value || undefined }}' } },
	},

	// getDocumentUrl
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('getDocumentUrl'),
		description: 'Company file ID (from folder/files)',
		routing: { send: { type: 'body', property: 'fileId' } },
	},
	{
		displayName: 'Download',
		name: 'download',
		type: 'boolean',
		default: false,
		displayOptions: show('getDocumentUrl'),
		description: 'Whether the response should suggest an attachment download',
		routing: { send: { type: 'body', property: 'download' } },
	},

	// getOcr
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('getOcr'),
		description: 'UUID of the file',
	},

	// streamDocument
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: show('streamDocument'),
		description: 'Short-lived JWT returned by Get Document URL / Get Signed URL',
		routing: { send: { type: 'query', property: 'token' } },
	},
];
