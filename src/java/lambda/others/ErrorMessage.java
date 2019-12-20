package lambda.others;


public class ErrorMessage {
	
	private final Integer statusCode;
	private final String message;
	
	public ErrorMessage(int statusCode, String message) {
		this.statusCode = statusCode;
		this.message = message;
	}
	
	public int getStatusCode() {
		return statusCode;
	}
	public String getMessage() {
		return message;
	}
}
