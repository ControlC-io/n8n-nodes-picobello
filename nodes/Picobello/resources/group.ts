import type { INodeProperties } from 'n8n-workflow';
import { companyIdField, jsonBodyField } from '../shared/descriptions';

const r = { resource: ['group'] };
const show = (...ops: string[]) => ({ show: { ...r, operation: ops } });
const bodyRoute = '={{ JSON.parse($parameter.body || "{}") }}';
const G = '/companies/{{$parameter.companyId}}/groups';

export const groupDescription: INodeProperties[] = [
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
				action: 'List groups',
				description: 'List groups for a company',
				routing: { request: { method: 'GET', url: `=${G}` } },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a group',
				description: 'Create a group',
				routing: { request: { method: 'POST', url: `=${G}`, body: bodyRoute } },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a group',
				description: 'Update a group',
				routing: {
					request: { method: 'PATCH', url: `=${G}/{{$parameter.groupId}}`, body: bodyRoute },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a group',
				description: 'Delete a group',
				routing: { request: { method: 'DELETE', url: `=${G}/{{$parameter.groupId}}` } },
			},
			{
				name: 'Get My Group IDs',
				value: 'myGroupIds',
				action: 'Get current user groups',
				description: 'Get the current user group IDs for a company',
				routing: {
					request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/my-group-ids' },
				},
			},
			{
				name: 'List All Members',
				value: 'listAllMembers',
				action: 'List all group members',
				description: 'List all group members in the company',
				routing: {
					request: { method: 'GET', url: '=/companies/{{$parameter.companyId}}/group-members' },
				},
			},
			{
				name: 'List Members',
				value: 'listMembers',
				action: 'List group members',
				description: 'List members of a group',
				routing: { request: { method: 'GET', url: `=${G}/{{$parameter.groupId}}/members` } },
			},
			{
				name: 'Add Member',
				value: 'addMember',
				action: 'Add a group member',
				description: 'Add a member to a group',
				routing: {
					request: {
						method: 'POST',
						url: `=${G}/{{$parameter.groupId}}/members`,
						body: bodyRoute,
					},
				},
			},
			{
				name: 'Remove Member by Profile',
				value: 'removeMemberByProfile',
				action: 'Remove a group member by profile',
				description: 'Remove a group member by profile ID',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${G}/{{$parameter.groupId}}/members/by-profile/{{$parameter.profileId}}`,
					},
				},
			},
			{
				name: 'Remove Member',
				value: 'removeMember',
				action: 'Remove a group member',
				description: 'Remove a group member by member ID',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${G}/{{$parameter.groupId}}/members/{{$parameter.memberId}}`,
					},
				},
			},
		],
		default: 'list',
	},
	{ ...companyIdField, displayOptions: { show: r } },
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(
			'update',
			'delete',
			'listMembers',
			'addMember',
			'removeMemberByProfile',
			'removeMember',
		),
		description: 'UUID of the group',
	},
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('removeMemberByProfile'),
		description: 'UUID of the profile to remove',
	},
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show('removeMember'),
		description: 'UUID of the group member to remove',
	},
	jsonBodyField(['create', 'update', 'addMember'], 'group'),
];
