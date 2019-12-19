package exceptions;

import lambda.others.ErrorMessage;

public abstract class RequestException extends Exception{

	private static final long serialVersionUID = -5871689787622177943L;
	private final ErrorMessage err;
	
	public RequestException(String message) {
		this.err = new ErrorMessage(500, message);
	}
	
	public RequestException(Integer statusCode, String message) {
		this.err = new ErrorMessage(statusCode, message);
	}
	
	public ErrorMessage getErr() {
		return err;
	}

}
