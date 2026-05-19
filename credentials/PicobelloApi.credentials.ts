import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class PicobelloApi implements ICredentialType {
	name = 'picobelloApi';

	displayName = 'Picobello API';

	icon: Icon = 'file:../nodes/Picobello/picobello.svg';

	documentationUrl = 'https://go.picobello.app/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Sent as the x-api-key header. Found in the Picobello admin page.',
		},
		{
			displayName: 'Access Token (JWT)',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Optional Bearer JWT. Required by endpoints documented with BearerAuth (most company/folder/agent/notification operations). Leave empty to use only the API key.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://go.picobello.app',
			description: 'Change only for self-hosted instances',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials?.apiKey}}',
				Authorization:
					'={{$credentials?.accessToken ? "Bearer " + $credentials.accessToken : undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/api/workflows/executions/00000000-0000-0000-0000-000000000000',
			method: 'GET',
			skipSslCertificateValidation: false,
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 401,
					message: 'Invalid API key',
				},
			},
		],
	};
}
