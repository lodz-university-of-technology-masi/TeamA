package lambda.deletes;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.Result;
import lambda.structures.ServerlessOutput;
import lambda.templates.DeleteById;

public class DeleteResult implements RequestHandler<Result, ServerlessOutput>{
	
	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new DeleteById().output(input, "Results", "ResultId", "HR", "guest");
	}
}
