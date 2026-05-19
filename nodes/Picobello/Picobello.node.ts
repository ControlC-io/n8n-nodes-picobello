import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { executionDescription } from './resources/execution';
import { stepDescription } from './resources/step';
import { logDescription } from './resources/log';
import { fileDescription } from './resources/file';
import { companyDescription } from './resources/company';
import { invitationDescription } from './resources/invitation';
import { userDescription } from './resources/user';
import { workflowCategoryDescription } from './resources/workflowCategory';
import { apiConfigurationDescription } from './resources/apiConfiguration';
import { globalVariableDescription } from './resources/globalVariable';
import { groupDescription } from './resources/group';
import { folderDescription } from './resources/folder';
import { companyFileDescription } from './resources/companyFile';
import { fileMetadataKeyDescription } from './resources/fileMetadataKey';
import { agentPermissionDescription } from './resources/agentPermission';
import { dataTableDescription } from './resources/dataTable';
import { workflowDescription } from './resources/workflow';
import { agentDescription } from './resources/agent';
import { notificationDescription } from './resources/notification';
import { getExecutionDataKeys } from './shared/transport';

export class Picobello implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Picobello',
		name: 'picobello',
		icon: 'file:picobello.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Picobello (Floowly) API',
		defaults: {
			name: 'Picobello',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'picobelloApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials?.baseUrl}}/api',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Agent Permission', value: 'agentPermission' },
					{ name: 'API Configuration', value: 'apiConfiguration' },
					{ name: 'Company', value: 'company' },
					{ name: 'Company File', value: 'companyFile' },
					{ name: 'Data Table', value: 'dataTable' },
					{ name: 'Execution', value: 'execution' },
					{ name: 'File', value: 'file' },
					{ name: 'File Metadata Key', value: 'fileMetadataKey' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Global Variable', value: 'globalVariable' },
					{ name: 'Group', value: 'group' },
					{ name: 'Invitation', value: 'invitation' },
					{ name: 'Log', value: 'log' },
					{ name: 'Notification', value: 'notification' },
					{ name: 'Step', value: 'step' },
					{ name: 'User', value: 'user' },
					{ name: 'Workflow', value: 'workflow' },
					{ name: 'Workflow Category', value: 'workflowCategory' },
				],
				default: 'execution',
			},
			...executionDescription,
			...stepDescription,
			...logDescription,
			...fileDescription,
			...companyDescription,
			...invitationDescription,
			...userDescription,
			...workflowCategoryDescription,
			...apiConfigurationDescription,
			...globalVariableDescription,
			...groupDescription,
			...folderDescription,
			...companyFileDescription,
			...fileMetadataKeyDescription,
			...agentPermissionDescription,
			...dataTableDescription,
			...workflowDescription,
			...agentDescription,
			...notificationDescription,
		],
	};

	methods = {
		loadOptions: {
			getExecutionDataKeys,
		},
	};
}
