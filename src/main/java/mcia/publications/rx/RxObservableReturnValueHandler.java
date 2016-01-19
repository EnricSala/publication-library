package mcia.publications.rx;

import org.springframework.core.MethodParameter;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.context.request.async.WebAsyncUtils;
import org.springframework.web.method.support.AsyncHandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;

import rx.Observable;

public class RxObservableReturnValueHandler implements AsyncHandlerMethodReturnValueHandler {

	@Override
	public boolean supportsReturnType(MethodParameter returnType) {
		return Observable.class.isAssignableFrom(returnType.getParameterType());
	}

	@Override
	public boolean isAsyncReturnValue(Object returnValue, MethodParameter returnType) {
		return returnValue != null && returnValue instanceof Observable;
	}

	@Override
	public void handleReturnValue(Object returnValue, MethodParameter returnType,
			ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
			throws Exception {

		if (returnValue == null) {
			mavContainer.setRequestHandled(true);
			return;
		}

		Observable<?> observable = Observable.class.cast(returnValue);

		final DeferredResult<Object> deferredResult = new DeferredResult<>();

		observable.subscribe(
				r -> deferredResult.setResult(r),
				err -> deferredResult.setErrorResult(err));

		WebAsyncUtils
				.getAsyncManager(webRequest)
				.startDeferredResultProcessing(deferredResult, mavContainer);
	}

}
