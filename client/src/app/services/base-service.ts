import { environment } from './../../environments/environment';

export class BaseService {
	protected BASE_URL: string = environment.serverIp;

	protected buildFullEndPoint(baseServiceUrl: string, endPoint: string) {
		return this.BASE_URL.concat(baseServiceUrl, endPoint);
	}
}
