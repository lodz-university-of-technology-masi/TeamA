package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.Form;
import lambda.structures.ServerlessOutput;
import lambda.templates.GetAll;

public class GetAllForms implements RequestHandler<Form, ServerlessOutput>{
	
	@Override
	public ServerlessOutput handleRequest(Form input, Context context) {
	    return new GetAll().output(input, "Forms", "HR", "guest");
	}
}
