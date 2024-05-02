import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.service';
import { finalize } from 'rxjs';

export const SpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerSvc = inject(SpinnerService);
  console.log(req.url)
  spinnerSvc.show();
  return next(req).pipe(finalize(() => spinnerSvc.hide()));
};
