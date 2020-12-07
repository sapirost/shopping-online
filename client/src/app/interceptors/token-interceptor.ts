import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {

	constructor(private userService: UserService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authorization = this.userService.getToken();

		if (authorization) {
			request = request.clone({
				setHeaders: {
					authorization,
				}
			});
		}

		return next.handle(request);
	}
}
