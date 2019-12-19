package lambda.posts;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.Post;
import lambda.structures.Result;
import lambda.structures.ServerlessOutput;

public class PostResult implements RequestHandler<Result, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(Result input, Context context) {
		return new Post().output(input, "Results", "HR", "guest");
	}
}
