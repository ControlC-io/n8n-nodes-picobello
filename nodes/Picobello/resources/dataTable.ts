import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField } from '../shared/descriptions';

const r = { resource: ['dataTable'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const T = '/companies/{{$parameter.companyId}}/data-tables';

export const dataTableDescription: INodeProperties[] = [
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
				action: 'List data tables',
				description: 'List data tables for a company',
				routing: { request: { method: 'GET', url: `=${T}` } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a data table',
				description: 'Create a data table',
				routing: { request: { method: 'POST', url: `=${T}`, body: bodyRoute } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a data table',
				description: 'Update a data table',
				routing: {
					request: { method: 'PATCH', url: `=${T}/{{$parameter.tableId}}`, body: bodyRoute },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a data table',
				description: 'Delete a data table',
				routing: { request: { method: 'DELETE', url: `=${T}/{{$parameter.tableId}}` } },
			},
			{
				name: 'Copy',
				value: 'copy',
				action: 'Copy a data table',
				description: 'Copy a data table',
				routing: { request: { method: 'POST', url: `=${T}/{{$parameter.tableId}}/copy` } },
			},
			{
				name: 'List Fields',
				value: 'listFields',
				action: 'List data table fields',
				description: 'List fields of a data table',
				routing: { request: { method: 'GET', url: `=${T}/{{$parameter.tableId}}/fields` } },
			},
			{
				name: 'Create Field',
				value: 'createField',
				action: 'Create a data table field',
				description: 'Create a data table field',
				routing: {
					request: {
						method: 'POST',
						url: `=${T}/{{$parameter.tableId}}/fields`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Update Field',
				value: 'updateField',
				action: 'Update a data table field',
				description: 'Update a data table field',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${T}/{{$parameter.tableId}}/fields/{{$parameter.fieldId}}`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete Field',
				value: 'deleteField',
				action: 'Delete a data table field',
				description: 'Delete a data table field',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${T}/{{$parameter.tableId}}/fields/{{$parameter.fieldId}}`,
					},
				},
			},
			{
				name: 'List Records',
				value: 'listRecords',
				action: 'List data table records',
				description: 'List records of a data table',
				routing: { request: { method: 'GET', url: `=${T}/{{$parameter.tableId}}/records` } },
			},
			{
				name: 'Create Record',
				value: 'createRecord',
				action: 'Create a data table record',
				description: 'Create a data table record',
				routing: {
					request: {
						method: 'POST',
						url: `=${T}/{{$parameter.tableId}}/records`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Update Record',
				value: 'updateRecord',
				action: 'Update a data table record',
				description: 'Update a data table record',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${T}/{{$parameter.tableId}}/records/{{$parameter.recordId}}`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Delete Record',
				value: 'deleteRecord',
				action: 'Delete a data table record',
				description: 'Delete a data table record',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${T}/{{$parameter.tableId}}/records/{{$parameter.recordId}}`,
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(
			'update',
			'delete',
			'copy',
			'listFields',
			'createField',
			'updateField',
			'deleteField',
			'listRecords',
			'createRecord',
			'updateRecord',
			'deleteRecord',
		),
		description: 'UUID of the data table',
	},
	{
		displayName: 'Field ID',
		name: 'fieldId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('updateField', 'deleteField'),
		description: 'UUID of the data table field',
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('updateRecord', 'deleteRecord'),
		description: 'UUID of the data table record',
	},
	jsonBodyField(
		['create', 'update', 'createField', 'updateField', 'createRecord', 'updateRecord'],
		'dataTable',
	),
];
