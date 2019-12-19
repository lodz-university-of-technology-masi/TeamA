package exceptions;

public final class AuthorizationException extends RequestException {

	private static final long serialVersionUID = 6504859409329849811L;
	private static final String title = "AuthorizationException: "; 
	
	public AuthorizationException(String message) {
		super(title + message);
	}

	public AuthorizationException(Integer statusCode, String message) {
		super(statusCode, title + message);
	}
}
