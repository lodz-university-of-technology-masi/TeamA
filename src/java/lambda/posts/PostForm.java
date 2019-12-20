package lambda.posts;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.Post;
import lambda.structures.Form;
import lambda.structures.ServerlessOutput;

public class PostForm implements RequestHandler<Form, ServerlessOutput> {

	@Override
	public ServerlessOutput handleRequest(Form input, Context context) {
		return new Post().output(input, "Forms", "HR", "guest");
	}
}
