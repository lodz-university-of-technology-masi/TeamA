package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.GetById;
import lambda.structures.Result;
import lambda.structures.ServerlessOutput;

public class GetResult implements RequestHandler<Result, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new GetById().output(input.getId(), "Results", "ResultId");
	}	
}
