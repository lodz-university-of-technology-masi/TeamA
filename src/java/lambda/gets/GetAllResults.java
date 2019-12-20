package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.others.GetAll;
import lambda.structures.Result;
import lambda.structures.ServerlessOutput;

public class GetAllResults implements RequestHandler<Result, ServerlessOutput>{
	
	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new GetAll().output(input, "FilledForms", "HR", "guest");
	}
}
