import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField, optionalQuery } from '../shared/descriptions';

const r = { resource: ['folder'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const F = '/companies/{{$parameter.companyId}}/folders';

export const folderDescription: INodeProperties[] = [
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
				action: 'List folders',
				description: 'List folders for a parent (or root)',
				routing: { request: { method: 'GET', url: `=${F}` } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a folder',
				description: 'Create a folder',
				routing: { request: { method: 'POST', url: `=${F}`, body: bodyRoute } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a folder',
				description: 'Get folder details',
				routing: { request: { method: 'GET', url: `=${F}/{{$parameter.folderId}}` } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a folder',
				description: 'Update a folder',
				routing: {
					request: { method: 'PATCH', url: `=${F}/{{$parameter.folderId}}`, body: bodyRoute },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a folder',
				description: 'Delete a folder',
				routing: { request: { method: 'DELETE', url: `=${F}/{{$parameter.folderId}}` } },
			},
			{
				name: 'List Permissions',
				value: 'listPermissions',
				action: 'List folder permissions',
				description: 'List permissions for a root folder',
				routing: {
					request: { method: 'GET', url: `=${F}/{{$parameter.folderId}}/permissions` },
				},
			},
			{
				name: 'Add Permission',
				value: 'addPermission',
				action: 'Add a folder permission',
				description: 'Add a user or group permission on a root folder',
				routing: {
					request: { method: 'POST', url: `=${F}/{{$parameter.folderId}}/permissions` },
				},
			},
			{
				name: 'Delete Permission',
				value: 'deletePermission',
				action: 'Delete a folder permission',
				description: 'Remove a permission from a root folder',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${F}/{{$parameter.folderId}}/permissions/{{$parameter.permissionId}}`,
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(
			'get',
			'update',
			'delete',
			'listPermissions',
			'addPermission',
			'deletePermission',
		),
		description: 'UUID of the folder',
	},
	{
		displayName: 'Permission ID',
		name: 'permissionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('deletePermission'),
		description: 'UUID of the permission to delete',
	},
	optionalQuery(
		'Parent Folder ID',
		'parent_folder_id',
		'folder',
		['list'],
		'Omit or empty for root folders; set to a folder ID to list its children',
	),
	{
		displayName: 'User ID',
		name: 'permUserId',
		type: 'string',
		default: '',
		displayOptions: show('addPermission'),
		description: 'User to grant access (use exactly one of User ID or Group ID)',
		routing: { send: { type: 'body', property: 'user_id', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Group ID',
		name: 'permGroupId',
		type: 'string',
		default: '',
		displayOptions: show('addPermission'),
		description: 'Group to grant access (use exactly one of User ID or Group ID)',
		routing: { send: { type: 'body', property: 'group_id', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Permission Type',
		name: 'permissionType',
		type: 'options',
		default: 'read',
		displayOptions: show('addPermission'),
		options: [
			{ name: 'Read', value: 'read' },
			{ name: 'Write', value: 'write' },
		],
		routing: { send: { type: 'body', property: 'permission_type' } },
	},
	jsonBodyField(['create', 'update'], 'folder'),
];
