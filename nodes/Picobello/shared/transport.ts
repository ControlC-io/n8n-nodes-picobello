import type {
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

export async function getExecutionDataKeys(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const executionId = this.getCurrentNodeParameter('executionId') as string;
	if (!executionId) return [];

	const credentials = await this.getCredentials('picobelloApi');
	const baseUrl = (credentials.baseUrl as string) ?? 'https://go.picobello.app';

	const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'picobelloApi', {
		method: 'GET',
		url: `${baseUrl}/api/workflows/executions/${executionId}`,
		json: true,
	})) as { execution_data_mapped?: Record<string, unknown> };

	const dataMapped = response?.execution_data_mapped ?? {};
	return Object.keys(dataMapped).map((key) => ({ name: key, value: key }));
}
