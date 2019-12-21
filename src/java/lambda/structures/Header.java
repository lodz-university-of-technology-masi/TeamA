package lambda.structures;

import interfaces.Authorizable;

public class Header implements Authorizable {
	
	private String authorization;

	public Header(String authorization) {
		this.authorization = authorization;
	}

	public Header() {

	}

	public String getAuthorization() {
		return authorization;
	}

	public void setAuthorization(String authorization) {
		this.authorization = authorization;
	}

	@Override
	public String toString() {
		return "Header [authorization=" + authorization + "]";
	}

}
