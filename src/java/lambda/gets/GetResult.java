package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.Result;
import lambda.structures.ServerlessOutput;
import lambda.templates.GetById;

public class GetResult implements RequestHandler<Result, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new GetById().output(input, "Results", "ResultId", "HR", "guest");
	}	
}
