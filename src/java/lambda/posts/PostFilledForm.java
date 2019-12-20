package lambda.posts;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.Post;
import lambda.structures.FilledForm;
import lambda.structures.ServerlessOutput;

public class PostFilledForm implements RequestHandler<FilledForm, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(FilledForm input, Context context) {
		return new Post().output(input, "FilledForms", "HR", "guest");
	}
}