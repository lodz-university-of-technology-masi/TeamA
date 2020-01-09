package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.Result;
import lambda.structures.ServerlessOutput;
import lambda.templates.GetAll;

public class GetAllResults implements RequestHandler<Result, ServerlessOutput>{
	
	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new GetAll().output(input, "FilledForms", "HR", "guest");
	}
}
