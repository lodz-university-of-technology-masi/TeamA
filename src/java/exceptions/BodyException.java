package exceptions;

public class BodyException extends RequestException {

	private static final long serialVersionUID = 6504859409329849811L;
	private static final String title = "BodyException: "; 
	
	public BodyException(String message) {
		super(title + message);
	}

	public BodyException(Integer statusCode, String message) {
		super(statusCode, title + message);
	}

}
